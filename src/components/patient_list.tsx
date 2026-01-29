"use client";

import React, { useState } from "react";
import { Users, Plus, Search, Edit3, Trash2, X, Loader2 } from "lucide-react";
import { Patient, StaffDropdown } from "@/app/dashboard/patients/page";

interface PatientListProps {
  patients: Patient[];
  doctors: StaffDropdown[];
  assistants: StaffDropdown[];
  loading: boolean;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  isSubmitting: boolean;
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSearch: (term: string) => void;
  onDelete: (id: string) => void;
  onEdit: (patient: Patient) => void;
  onOpenCreate: () => void;
  editingId: string | null;
  total: number;
}

export const PatientList = ({
  patients = [],
  doctors,
  assistants,
  loading,
  isModalOpen,
  setIsModalOpen,
  isSubmitting,
  formData,
  setFormData,
  onSubmit,
  onSearch,
  onDelete,
  onEdit,
  onOpenCreate,
  editingId,
  total
}: PatientListProps) => {
  const [localSearch, setLocalSearch] = useState("");
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <Users className="text-orange-500" /> Patients 
            <span className="text-xs bg-orange-500/10 text-orange-500 px-2 py-1 rounded-md ml-2 font-bold">{total} Total</span>
          </h2>
          <p className="text-slate-500 text-sm">Manage clinic patient records and history.</p>
        </div>
        <button 
          onClick={onOpenCreate}
          className="bg-orange-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-500 transition-all shadow-lg"
        >
          <Plus size={20} /> Add New Patient
        </button>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch(localSearch)}
            placeholder="Search by name or phone (Press Enter)..." 
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 text-white focus:border-orange-500 outline-none"
          />
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-800/30 text-slate-500 text-[10px] font-black uppercase tracking-widest">
              <th className="px-8 py-5">Patient Name</th>
              <th className="px-6 py-5">Phone</th>
              <th className="px-6 py-5">Doctor / Assistant</th>
              <th className="px-6 py-5">Birth Date</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {loading ? (
              <tr><td colSpan={5} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-orange-500" /></td></tr>
            ) : patients.length > 0 ? patients.map((p) => (
              <tr key={p.id} className="group hover:bg-slate-800/20 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-orange-500 font-bold uppercase">{p.name?.[0] || "?"}</div>
                    <div>
                        <p className="text-white font-bold">{p.name}</p>
                        <p className="text-[10px] text-slate-500">ID: {p.id.substring(0,8)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-slate-300 font-medium">{p.phone_number}</td>
                <td className="px-6 py-5">
                  <p className="text-white text-sm font-bold">{p.doctor}</p>
                  <p className="text-slate-500 text-xs">{p.assistant || "No assistant"}</p>
                </td>
                <td className="px-6 py-5 text-slate-400 text-sm">{p.birth_date}</td>
                <td className="px-8 py-5 text-right">
                  <button onClick={() => onEdit(p)} className="p-2 text-slate-500 hover:text-orange-500 transition-all"><Edit3 size={18} /></button>
                  <button onClick={() => onDelete(p.id)} className="p-2 text-slate-500 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={5} className="py-20 text-center text-slate-500 font-bold">No records found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-white">{editingId ? 'Update Patient' : 'Register Patient'}</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white"><X /></button>
                </div>
                <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-1">
                        <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">Full Name</label>
                        <input required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-orange-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}/>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">Gender</label>
                        <select className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">Birth Date</label>
                        <input 
                            required 
                            type="date" 
                            max={today} // Prevents future date selection
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-orange-500" 
                            value={formData.birth_date} 
                            onChange={e => setFormData({...formData, birth_date: e.target.value})}
                        />
                    </div>
                    <div className="col-span-2 space-y-1">
                        <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">Phone Number</label>
                        <input 
                            required 
                            type="text"
                            inputMode="numeric"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-orange-500" 
                            value={formData.phone_number} 
                            onChange={e => {
                                const val = e.target.value.replace(/\D/g, ''); // Strips non-digits instantly
                                setFormData({...formData, phone_number: val});
                            }}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">Doctor</label>
                        <select required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none" value={formData.doctor_id} onChange={e => setFormData({...formData, doctor_id: e.target.value})}>
                            <option value="">Select Doctor</option>
                            {doctors.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">Assistant (Opt)</label>
                        <select className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none" value={formData.assistant_id} onChange={e => setFormData({...formData, assistant_id: e.target.value})}>
                            <option value="">None</option>
                            {assistants.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
                        </select>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="col-span-2 bg-orange-600 py-4 rounded-2xl font-black text-white hover:bg-orange-500 transition-all mt-4 disabled:opacity-50">
                        {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : (editingId ? "Update Record" : "Create Record")}
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};