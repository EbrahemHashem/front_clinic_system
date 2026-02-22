"use client";

import React, { useState, useEffect } from "react";
import { Loader2, X, Stethoscope, User, Calendar, Clock, FileText } from "lucide-react";
import { API_CONFIG } from "@/lib/constants";

interface EditAppointmentModalProps {
  appointmentId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Interface matching your specific JSON structure
interface StaffMember {
  id: string; // This is the ID we need (e.g. "3bd8431a...")
  user: {
    first_name: string;
    last_name: string;
  };
}

export function EditAppointmentModal({ appointmentId, isOpen, onClose, onSuccess }: EditAppointmentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  
  // Dropdown Data
  const [doctors, setDoctors] = useState<StaffMember[]>([]);
  const [assistants, setAssistants] = useState<StaffMember[]>([]);
  
  const [formData, setFormData] = useState({
    doctor_id: "",
    assistant_id: "",
    date: "",
    time: "",
    status: "",
    description: ""
  });

  useEffect(() => {
    if (isOpen && appointmentId) {
      fetchInitialData();
    }
  }, [isOpen, appointmentId]);

  const fetchInitialData = async () => {
    setIsLoadingDetails(true);
    const auth = JSON.parse(localStorage.getItem("dentflow_auth") || "{}");
    const headers = { "Authorization": `Bearer ${auth.access_token}` };

    try {
      // 1. Fetch everything in parallel
      const [detailsRes, doctorsRes, assistantsRes] = await Promise.all([
        fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.APPOINTMENTS}${appointmentId}`, { headers }),
        fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ALL_STAFF}?staff=doctor`, { headers }),
        fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ALL_STAFF}?staff=assistant`, { headers })
      ]);

      // 2. We must parse the staff lists FIRST to use them for matching
      let drList: StaffMember[] = [];
      let asstList: StaffMember[] = [];

      if (doctorsRes.ok) {
        const data = await doctorsRes.json();
        drList = Array.isArray(data) ? data : data.data || [];
        setDoctors(drList);
      }

      if (assistantsRes.ok) {
        const data = await assistantsRes.json();
        asstList = Array.isArray(data) ? data : data.data || [];
        setAssistants(asstList);
      }

      // 3. Now handle the appointment details
      if (detailsRes.ok) {
        const detail = await detailsRes.json();
        const dt = new Date(detail.appointment_time);

        // LOOKUP LOGIC:
        // Search the staff lists for a user whose full name matches the string from 'detail.doctor'
        const matchedDoctor = drList.find(
          d => `${d.user.first_name} ${d.user.last_name}` === detail.doctor
        );

        const matchedAssistant = asstList.find(
          a => `${a.user.first_name} ${a.user.last_name}` === detail.assistant
        );

        setFormData({
          // Set the ID if found, otherwise keep it empty
          doctor_id: matchedDoctor ? matchedDoctor.id : "",
          assistant_id: matchedAssistant ? matchedAssistant.id : "",
          date: dt.toISOString().split('T')[0],
          time: dt.toTimeString().slice(0, 5),
          status: detail.status,
          description: detail.description
        });
      }

    } catch (err) {
      console.error("Error matching names to IDs:", err);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formattedTime = `${formData.date} ${formData.time}:00`;

    const payload: Record<string, string | null> = {
        appointment_id: appointmentId,
        time: formattedTime,
        status: formData.status,
        description: formData.description
    };

    // Only send doctor/assistant IDs if they are selected
    if (formData.doctor_id) payload.doctor_id = formData.doctor_id;
    if (formData.assistant_id) payload.assistant_id = formData.assistant_id;

    try {
      const auth = JSON.parse(localStorage.getItem("dentflow_auth") || "{}");
      const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.APPOINTMENTS}`, {
        method: "PUT",
        headers: { 
            "Authorization": `Bearer ${auth.access_token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        const err = await res.json();
        alert("Update failed: " + JSON.stringify(err));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-[2.5rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-white">Edit Appointment</h3>
            <button onClick={onClose} className="p-2 bg-slate-800 text-slate-500 rounded-full hover:text-white transition-colors">
              <X size={20} />
            </button>
        </div>

        {isLoadingDetails ? (
            <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="animate-spin text-orange-500 mb-4" size={32} />
                <p className="text-slate-500 font-bold">Loading details...</p>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Status Selection */}
                <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Status</label>
                    <div className="grid grid-cols-3 gap-2">
                        {["scheduled", "cancelled", "completed"].map((s) => (
                            <button key={s} type="button" onClick={() => setFormData({...formData, status: s})}
                                className={`py-2 text-[10px] font-black uppercase rounded-xl border transition-all ${
                                    formData.status === s ? "bg-orange-600 border-orange-500 text-white" : "bg-slate-950 border-slate-800 text-slate-500"
                                }`}>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Doctor Dropdown */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1 flex items-center gap-1"><Stethoscope size={12}/> Doctor</label>
                        <select 
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-orange-500 appearance-none"
                            value={formData.doctor_id} 
                            onChange={e => setFormData({...formData, doctor_id: e.target.value})}
                        >
                            <option value="">Select Doctor</option>
                            {doctors.map(d => (
                                <option key={d.id} value={d.id}>
                                    {/* Display User Name, use Outer ID */}
                                    {d.user.first_name} {d.user.last_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Assistant Dropdown */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1 flex items-center gap-1"><User size={12}/> Assistant</label>
                        <select 
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-orange-500 appearance-none"
                            value={formData.assistant_id} 
                            onChange={e => setFormData({...formData, assistant_id: e.target.value})}
                        >
                            <option value="">No Assistant</option>
                            {assistants.map(a => (
                                <option key={a.id} value={a.id}>
                                    {/* Display User Name, use Outer ID */}
                                    {a.user.first_name} {a.user.last_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1 flex items-center gap-1"><Calendar size={12}/> Date</label>
                        <input type="date" required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-orange-500"
                            value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1 flex items-center gap-1"><Clock size={12}/> Time</label>
                        <input type="time" required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-orange-500"
                            value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1 flex items-center gap-1"><FileText size={12}/> Description</label>
                    <textarea className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white h-24 resize-none outline-none focus:border-orange-500"
                        value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full bg-orange-600 py-4 rounded-xl font-black text-white hover:bg-orange-500 transition-all flex justify-center items-center gap-2 shadow-lg shadow-orange-900/20 active:scale-95">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Save Changes"}
                </button>
            </form>
        )}
      </div>
    </div>
  );
}
