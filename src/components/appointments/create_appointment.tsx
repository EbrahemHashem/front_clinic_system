"use client";

import React, { useState, useEffect } from "react";
import { Loader2, X, Calendar, Clock, User, Stethoscope, FileText, Activity } from "lucide-react";
import { API_CONFIG } from "@/lib/constants";

interface CreateAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Updated Interface to match your JSON structure
interface StaffMember {
  id: string; // <--- The ID needed for the API (Staff Profile ID)
  user: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
}

export function CreateAppointmentModal({ isOpen, onClose, onSuccess }: CreateAppointmentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<StaffMember[]>([]);
  const [assistants, setAssistants] = useState<StaffMember[]>([]);

  const [formData, setFormData] = useState({
    patient_id: "",
    doctor_id: "",
    assistant_id: "",
    date: "",
    time: "",
    status: "scheduled",
    description: ""
  });

  useEffect(() => {
    if (isOpen) {
      fetchDropdowns();
    }
  }, [isOpen]);

  const fetchDropdowns = async () => {
    try {
      setLoadingData(true);
      const auth = JSON.parse(localStorage.getItem("dentflow_auth") || "{}");
      const headers = { "Authorization": `Bearer ${auth.access_token}` };

      const [patientsRes, doctorsRes, assistantsRes] = await Promise.all([
        fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PATIENTS}`, { headers }),
        fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ALL_STAFF}?staff=doctor`, { headers }),
        fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ALL_STAFF}?staff=assistant`, { headers })
      ]);

      if (patientsRes.ok) {
        const data = await patientsRes.json();
        setPatients(Array.isArray(data) ? data : data.data || []);
      }
      if (doctorsRes.ok) {
        const data = await doctorsRes.json();
        setDoctors(Array.isArray(data) ? data : data.data || []);
      }
      if (assistantsRes.ok) {
        const data = await assistantsRes.json();
        setAssistants(Array.isArray(data) ? data : data.data || []);
      }
    } catch (err) {
      console.error("Failed to load dropdown data", err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formattedTime = `${formData.date} ${formData.time}:00`;

    const payload = {
        patient_id: formData.patient_id,
        doctor_id: formData.doctor_id,
        assistant_id: formData.assistant_id,
        time: formattedTime,
        status: formData.status,
        description: formData.description
    };

    try {
      const auth = JSON.parse(localStorage.getItem("dentflow_auth") || "{}");
      const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.APPOINTMENTS}`, {
        method: "POST",
        headers: { 
            "Authorization": `Bearer ${auth.access_token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        onSuccess();
        onClose();
        setFormData({
            patient_id: "", doctor_id: "", assistant_id: "", 
            date: "", time: "", status: "scheduled", description: ""
        });
      } else {
        const err = await res.json();
        alert("Error: " + JSON.stringify(err));
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
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black text-white">New Appointment</h3>
            <button onClick={onClose} className="p-2 bg-slate-800 text-slate-500 rounded-full hover:text-white transition-colors">
              <X size={20} />
            </button>
        </div>

        {loadingData ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-orange-500" /></div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-black uppercase ml-1 tracking-widest">Date</label>
                  <input required type="date" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-orange-500 outline-none"
                      value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-black uppercase ml-1 tracking-widest">Time</label>
                  <input required type="time" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-orange-500 outline-none"
                      value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[10px] text-slate-500 font-black uppercase ml-1 tracking-widest">Status</label>
                <div className="grid grid-cols-3 gap-3">
                    {["scheduled", "cancelled", "completed"].map((status) => (
                        <button key={status} type="button" onClick={() => setFormData({...formData, status})}
                            className={`py-2 px-3 rounded-lg text-xs font-bold uppercase border transition-all ${
                                formData.status === status ? "bg-orange-600 border-orange-500 text-white" : "bg-slate-950 border-slate-800 text-slate-500"
                            }`}>
                            {status}
                        </button>
                    ))}
                </div>
              </div>

              <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-black uppercase ml-1 tracking-widest">Patient</label>
                  <select required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-orange-500 outline-none appearance-none"
                      value={formData.patient_id} onChange={e => setFormData({...formData, patient_id: e.target.value})}>
                      <option value="">Select Patient...</option>
                      {patients.map(p => <option key={p.id} value={p.id}>{p.first_name || "Patient"} {p.last_name || ""}</option>)}
                  </select>
              </div>

              <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-black uppercase ml-1 tracking-widest">Doctor</label>
                  <select required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-orange-500 outline-none appearance-none"
                      value={formData.doctor_id} onChange={e => setFormData({...formData, doctor_id: e.target.value})}>
                      <option value="">Select Doctor...</option>
                      {doctors.map(d => (
                          // FIX: Use d.id (outer ID), display user name
                          <option key={d.id} value={d.id}>
                              {d.user.first_name} {d.user.last_name}
                          </option>
                      ))}
                  </select>
              </div>

              <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-black uppercase ml-1 tracking-widest">Assistant</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-orange-500 outline-none appearance-none"
                      value={formData.assistant_id} onChange={e => setFormData({...formData, assistant_id: e.target.value})}>
                      <option value="">No Assistant</option>
                      {assistants.map(a => (
                          // FIX: Use a.id (outer ID), display user name
                          <option key={a.id} value={a.id}>
                              {a.user.first_name} {a.user.last_name}
                          </option>
                      ))}
                  </select>
              </div>

              <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-black uppercase ml-1 tracking-widest">Description</label>
                  <textarea required placeholder="Details..." className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-orange-500 outline-none h-24 resize-none"
                      value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>

              <button type="submit" disabled={isSubmitting} className="md:col-span-2 bg-orange-600 py-4 rounded-xl font-black text-white hover:bg-orange-500 transition-all mt-4 flex justify-center items-center gap-2">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Schedule Appointment"}
              </button>
          </form>
        )}
      </div>
    </div>
  );
}