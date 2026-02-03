"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Users, Plus, Search, Edit3, Trash2, X, 
  Loader2, Eye 
} from "lucide-react";
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
    <div className="space-y-6 animate-in fade-in duration-500 max-w-full">
      {/* Header Section - Responsive Flex */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
            <Users className="text-orange-500" size={32} /> Patients 
            <span className="text-[10px] md:text-xs bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full font-bold border border-orange-500/20">
              {total} Total
            </span>
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage clinic patient records and medical history.</p>
        </div>
        <button 
          onClick={onOpenCreate}
          className="w-full sm:w-auto bg-orange-600 px-6 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:bg-orange-500 transition-all shadow-lg shadow-orange-900/20 active:scale-95"
        >
          <Plus size={20} /> Add New Patient
        </button>
      </div>

      {/* Search Bar Section */}
      <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl backdrop-blur-md">
        <div className="relative w-full group">
          {/* Functional Search Button */}
          <button 
            onClick={() => onSearch(localSearch)}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-orange-500 transition-colors p-1 z-10"
            title="Execute Search"
          >
            <Search size={18} />
          </button>
          
          <input 
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch(localSearch)}
            placeholder="Search name or phone..." 
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
          />
          
          {/* Optional: Clear button for mobile convenience */}
          {localSearch && (localSearch !== "") && (
            <button 
              onClick={() => {
                setLocalSearch("");
                onSearch("");
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Patients Table Section - Added overflow-x-auto */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-800/40 text-slate-500 text-[11px] font-black uppercase tracking-widest border-b border-slate-800">
                <th className="px-4 md:px-8 py-5">Patient Details</th>
                <th className="px-4 md:px-6 py-5">Phone Number</th>
                <th className="px-4 md:px-6 py-5">Medical Staff</th>
                <th className="px-4 md:px-6 py-5">Birth Date</th>
                <th className="px-4 md:px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="animate-spin text-orange-500" size={32} />
                      <span className="text-slate-500 font-bold text-sm">Fetching records...</span>
                    </div>
                  </td>
                </tr>
              ) : patients.length > 0 ? patients.map((p) => (
                <tr key={p.id} className="group hover:bg-slate-800/30 transition-all">
                  <td className="px-4 md:px-8 py-5">
                    <Link href={`/dashboard/patients/${p.id}`} className="flex items-center gap-4 group/item">
                      <div className="w-10 h-10 md:w-11 md:h-11 shrink-0 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-orange-500 font-black uppercase group-hover/item:border-orange-500/50 transition-all shadow-inner">
                        {p.name?.[0] || "?"}
                      </div>
                      <div className="min-w-0">
                          <p className="text-white font-bold group-hover/item:text-orange-500 transition-colors truncate">{p.name}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Ref: {p.id.substring(0,8)}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 md:px-6 py-5 text-slate-300 font-semibold">{p.phone_number}</td>
                  <td className="px-4 md:px-6 py-5">
                    <p className="text-slate-200 text-sm font-bold truncate">{p.doctor}</p>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-tight truncate">{p.assistant || "No assistant"}</p>
                  </td>
                  <td className="px-4 md:px-6 py-5 text-slate-400 text-sm font-medium">{p.birth_date}</td>
                  <td className="px-4 md:px-8 py-5 text-right">
                    <div className="flex justify-end items-center gap-1">
                      <Link 
                        href={`/dashboard/patients/${p.id}`}
                        className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                        title="View Profile"
                      >
                        <Eye size={18} />
                      </Link>
                      <button 
                        onClick={() => onEdit(p)} 
                        className="p-2 text-slate-500 hover:text-orange-500 hover:bg-orange-500/10 rounded-lg transition-all"
                        title="Edit Record"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => onDelete(p.id)} 
                        className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Delete Record"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="flex flex-col items-center opacity-40">
                      <Users size={48} className="text-slate-600 mb-2" />
                      <p className="text-slate-500 font-black uppercase tracking-widest text-xs">No records found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - Responsive Grid and Sizing */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl animate-in zoom-in duration-200 max-h-[95vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6 md:mb-8">
                    <h3 className="text-xl md:text-2xl font-black text-white">
                      {editingId ? 'Update Patient' : 'Register Patient'}
                    </h3>
                    <button 
                      onClick={() => setIsModalOpen(false)} 
                      className="p-2 bg-slate-800 text-slate-500 rounded-full hover:text-white transition-colors"
                    >
                      <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-[10px] text-slate-500 font-black uppercase ml-1 tracking-widest">Full Name</label>
                        <input 
                          required 
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl md:rounded-2xl p-3.5 text-white outline-none focus:border-orange-500 transition-all" 
                          value={formData.name} 
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          placeholder="Enter patient name"
                        />
                    </div>
                    
                    <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 font-black uppercase ml-1 tracking-widest">Gender</label>
                        <select 
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl md:rounded-2xl p-3.5 text-white outline-none focus:border-orange-500 appearance-none transition-all" 
                          value={formData.gender} 
                          onChange={e => setFormData({...formData, gender: e.target.value})}
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 font-black uppercase ml-1 tracking-widest">Birth Date</label>
                        <input 
                            required 
                            type="date" 
                            max={today}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl md:rounded-2xl p-3.5 text-white outline-none focus:border-orange-500 transition-all" 
                            value={formData.birth_date} 
                            onChange={e => setFormData({...formData, birth_date: e.target.value})}
                        />
                    </div>

                    <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-[10px] text-slate-500 font-black uppercase ml-1 tracking-widest">Phone Number</label>
                        <input 
                            required 
                            type="text"
                            inputMode="numeric"
                            placeholder="e.g., 01xxxxxxxxx"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl md:rounded-2xl p-3.5 text-white outline-none focus:border-orange-500 transition-all" 
                            value={formData.phone_number} 
                            onChange={e => {
                                const val = e.target.value.replace(/\D/g, '');
                                setFormData({...formData, phone_number: val});
                            }}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 font-black uppercase ml-1 tracking-widest">Doctor</label>
                        <select 
                          required 
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl md:rounded-2xl p-3.5 text-white outline-none focus:border-orange-500 transition-all" 
                          value={formData.doctor_id} 
                          onChange={e => setFormData({...formData, doctor_id: e.target.value})}
                        >
                            <option value="">Select Doctor</option>
                            {doctors.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 font-black uppercase ml-1 tracking-widest">Assistant</label>
                        <select 
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl md:rounded-2xl p-3.5 text-white outline-none focus:border-orange-500 transition-all" 
                          value={formData.assistant_id} 
                          onChange={e => setFormData({...formData, assistant_id: e.target.value})}
                        >
                            <option value="">No Assistant</option>
                            {assistants.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
                        </select>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting} 
                      className="sm:col-span-2 bg-orange-600 py-4 rounded-xl md:rounded-2xl font-black text-white hover:bg-orange-500 transition-all mt-4 disabled:opacity-50 shadow-xl shadow-orange-900/30 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : (editingId ? "Update Patient" : "Create Patient")}
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};