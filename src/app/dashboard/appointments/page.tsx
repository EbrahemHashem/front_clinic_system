"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon, List, Plus, Clock, 
  ChevronLeft, ChevronRight, Loader2, Trash2, Edit, Filter
} from "lucide-react";
import { API_CONFIG } from "@/lib/constants";
import { EditAppointmentModal } from "@/components/appointments/edit_appointment";
import { CreateAppointmentModal } from "@/components/appointments/create_appointment";


interface Appointment {
  id: string;
  appointment_time: string;
  status: "scheduled" | "completed" | "cancelled";
  description: string;
  clinic: string;
  patient: string; 
  doctor: string; 
  assistant: string;
}

export default function AppointmentsPage() {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [view, setView] = useState<"calendar" | "list">("list");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  // Filters
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]); // Default today
  const [filterStatus, setFilterStatus] = useState<string>("scheduled");

  // Fetch logic with Query Params
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const auth = JSON.parse(localStorage.getItem("dentflow_auth") || "{}");
      
      // Construct Query: ?status=...&date=...
      const queryParams = new URLSearchParams({
        status: filterStatus,
        date: filterDate
      });

      const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.APPOINTMENTS}?${queryParams.toString()}`, {
        headers: { "Authorization": `Bearer ${auth.access_token}` }
      });

      if (res.ok) {
        const data = await res.json();
        // Assuming data.data holds the array based on your postman image
        setAppointments(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch appointments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [filterDate, filterStatus]); // Re-fetch when filters change

  // Delete Handler (Query Param Method)
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return;
    try {
      const auth = JSON.parse(localStorage.getItem("dentflow_auth") || "{}");
      
      // Query param for delete as requested
      const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.APPOINTMENTS}?appointment_id=${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${auth.access_token}` }
      });

      if (res.ok) {
        fetchAppointments(); // Refresh list
      } else {
        alert("Failed to delete");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-full pb-20">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <Clock className="text-orange-500" size={32} /> Appointments
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage schedules and patient visits.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
             {/* Filter Status */}
            <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-300 text-sm rounded-xl px-3 py-2.5 outline-none focus:border-orange-500 font-bold"
            >
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
            </select>
            
            {/* Filter Date */}
            <input 
                type="date" 
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-300 text-sm rounded-xl px-3 py-2.5 outline-none focus:border-orange-500 font-bold" 
            />

          <button 
            onClick={() => setIsCreateOpen(true)}
            className="bg-orange-600 px-5 py-2.5 rounded-xl font-bold text-white flex items-center gap-2 hover:bg-orange-500 transition-all shadow-lg shadow-orange-900/20 active:scale-95"
          >
            <Plus size={20} /> New
          </button>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
            <Loader2 className="animate-spin text-orange-500" size={40} />
        </div>
      ) : (
        <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] overflow-hidden backdrop-blur-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                    <tr className="bg-slate-800/40 text-slate-500 text-[11px] font-black uppercase tracking-widest border-b border-slate-800">
                    <th className="px-6 py-5">Time</th>
                    <th className="px-6 py-5">Patient</th>
                    <th className="px-6 py-5">Doctor / Assistant</th>
                    <th className="px-6 py-5">Status</th>
                    <th className="px-6 py-5 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                    {appointments.length === 0 ? (
                         <tr><td colSpan={5} className="text-center py-8 text-slate-500">No appointments found.</td></tr>
                    ) : appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-800/30 transition-all">
                        <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-800 text-orange-500 rounded-lg"><Clock size={16} /></div>
                                <div>
                                    <p className="text-white font-bold text-sm">
                                        {new Date(apt.appointment_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase">
                                        {new Date(apt.appointment_time).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-5">
                             <span className="text-slate-200 font-bold">{apt.patient}</span>
                             <p className="text-xs text-slate-500 truncate">{apt.description}</p>
                        </td>
                        <td className="px-6 py-5">
                             <div className="text-sm text-slate-300 font-medium">Dr. {apt.doctor}</div>
                             <div className="text-xs text-slate-500">Asst. {apt.assistant}</div>
                        </td>
                        <td className="px-6 py-5">
                            <span className={`text-[10px] uppercase px-2.5 py-1 rounded-full font-bold border ${
                                apt.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                                apt.status === 'cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                                'bg-orange-500/10 text-orange-500 border-orange-500/20'
                            }`}>
                                {apt.status}
                            </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                             <div className="flex items-center justify-end gap-2">
                                <button onClick={() => setSelectedAppointmentId(apt.id)} className="p-2 text-slate-400 hover:text-white bg-slate-800/50 rounded-lg transition-colors">
                                    <Edit size={16} />
                                </button>
                                <button onClick={() => handleDelete(apt.id)} className="p-2 text-slate-400 hover:text-red-500 bg-slate-800/50 rounded-lg transition-colors">
                                    <Trash2 size={16} />
                                </button>
                             </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>
      )}

      {/* Modals */}
      <CreateAppointmentModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onSuccess={fetchAppointments} 
      />
      
      <EditAppointmentModal 
        isOpen={!!selectedAppointmentId}
        appointmentId={selectedAppointmentId}
        onClose={() => setSelectedAppointmentId(null)}
        onSuccess={fetchAppointments}
      />
    </div>
  );
}