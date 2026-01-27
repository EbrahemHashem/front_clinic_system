"use client";

import React, { useEffect, useState } from "react";
import { Stethoscope, UserPlus, Trash2, Edit3, Plus, X, Loader2 } from "lucide-react";
import { API_CONFIG } from "@/lib/constants";

interface StaffMember {
  id: string;          // Staff ID
  user_id: string;     // User ID
  first_name: string;
  last_name: string;
  email: string;
  salary: number;
  percentage?: number;
  phone_number: string;
  specialty?: string;
}

const StaffSection = ({ type }: { type: "doctor" | "assistant" }) => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Track which user is being edited (null = Create Mode)
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    salary: type === "doctor" ? 1000 : 1500,
    percentage: 0.4,
    specialty: "",
  });

  // 1. GET Staff
  const loadStaff = async () => {
    setLoading(true);
    try {
      const auth = JSON.parse(localStorage.getItem("dentflow_auth") || "{}");
      const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ALL_STAFF}?staff=${type}`, {
        headers: { "Authorization": `Bearer ${auth.access_token}` }
      });
      const data = await res.json();

      if (Array.isArray(data)) {
        const flattenedStaff = data.map((item: any) => ({
          id: item.id,
          user_id: item.user?.id,
          first_name: item.user?.first_name || "Unknown",
          last_name: item.user?.last_name || "",
          email: item.user?.email,
          phone_number: item.user?.phone_number,
          salary: Number(item.salary),
          percentage: Number(item.percentage),
          specialty: item.specialty 
        }));
        setStaff(flattenedStaff);
      } else {
        setStaff([]);
      }
    } catch (err) {
      console.error("Failed to fetch staff", err);
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Submit (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const auth = JSON.parse(localStorage.getItem("dentflow_auth") || "{}");
      const isEditMode = !!editingId;

      // Base Payload
      const payload: any = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: formData.phone_number,
        salary: formData.salary,
      };

      // --- Mode Specific Logic ---
      if (isEditMode) {
        // UPDATE MODE (PUT)
        payload.staff_id = editingId; // Mandatory for PUT
        
        // Add Doctor specific fields
        if (type === "doctor") {
          payload.percentage = formData.percentage;
          payload.specialty = formData.specialty;
        }
        // Note: Password is NOT sent during edit
      } else {
        // CREATE MODE (POST)
        payload.password = formData.password; // Mandatory for POST
        payload.role = type;
        
        if (type === "doctor") {
          payload.percentage = formData.percentage;
          if (formData.specialty) payload.specialty = formData.specialty;
        }
      }

      const url = isEditMode 
        ? `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STAFF}` // PUT endpoint
        : `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADD_USER}`; // POST endpoint

      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth.access_token}` 
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        loadStaff();
        resetForm();
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.detail || "Operation failed"}`);
      }
    } catch (err) {
      console.error("Operation failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Open Modal for Edit
  const openEditModal = (member: StaffMember) => {
    setEditingId(member.id); // Set the ID to trigger Edit Mode
    setFormData({
      first_name: member.first_name,
      last_name: member.last_name,
      email: member.email,
      phone_number: member.phone_number,
      password: "", // Password remains blank for security
      salary: member.salary,
      percentage: member.percentage || 0.4,
      specialty: member.specialty || "",
    });
    setIsModalOpen(true);
  };

  // 4. Open Modal for Create
  const openCreateModal = () => {
    resetForm();
    setEditingId(null); // Ensure we are in Create Mode
    setIsModalOpen(true);
  };

  // 5. Delete Staff
  const deleteStaff = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const auth = JSON.parse(localStorage.getItem("dentflow_auth") || "{}");
      const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STAFF}?staff_id=${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${auth.access_token}` }
      });
      if (res.ok) setStaff(prev => prev.filter(s => s.id !== id));
    } catch (err) { console.error(err); }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      first_name: "", last_name: "", email: "", phone_number: "", password: "",
      salary: type === "doctor" ? 1000 : 1500,
      percentage: 0.4, specialty: "",
    });
  };

  useEffect(() => { loadStaff(); resetForm(); }, [type]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white capitalize flex items-center gap-3">
            {type === "doctor" ? <Stethoscope className="text-orange-500" /> : <UserPlus className="text-orange-500" />}
            {type}s Management
          </h2>
          <p className="text-slate-500 text-sm">View and manage your clinic's {type}s.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="bg-orange-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-500 transition-all shadow-lg shadow-orange-900/20"
        >
          <Plus size={20} /> Add {type}
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <Loader2 className="animate-spin mb-2" size={32} />
          <p>Loading {type}s...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.length > 0 ? staff.map((member) => (
            <div key={member.id} className="bg-slate-900/50 border border-slate-800 p-6 rounded-[2rem] group hover:border-slate-700 transition-all relative">
              <div className="flex justify-between items-start mb-4">
                <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center font-black text-orange-500 text-xl uppercase">
                  {member.first_name?.[0] || '?'}{member.last_name?.[0] || ''}
                </div>
                <button onClick={() => deleteStaff(member.id)} className="text-slate-500 hover:text-red-500 transition-colors p-2">
                  <Trash2 size={18} />
                </button>
              </div>
              
              <h3 className="text-lg font-bold text-white capitalize">{member.first_name} {member.last_name}</h3>
              <p className="text-slate-500 text-xs font-bold uppercase mb-4 tracking-widest">{member.specialty || type}</p>
              
              <div className="space-y-2 py-3 border-t border-slate-800/50">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Salary:</span>
                  <span className="text-white font-black">${member.salary}</span>
                </div>
                {type === "doctor" && (
                   <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Commission:</span>
                    <span className="text-white font-black">{((member.percentage || 0) * 100).toFixed(0)}%</span>
                  </div>
                )}
              </div>

              {/* Edit Button Triggers openEditModal */}
              <button 
                onClick={() => openEditModal(member)}
                className="w-full mt-4 py-3 bg-slate-800 rounded-xl font-bold text-white hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <Edit3 size={16} /> Edit Profile
              </button>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-800 rounded-[2rem]">
              <p className="text-slate-500">No {type}s found. Click "Add {type}" to get started.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal for Create AND Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              {/* Dynamic Title */}
              <h3 className="text-xl font-black text-white">{editingId ? `Edit ${type} Profile` : `Register New ${type}`}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white"><X /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">First Name</label>
                  <input required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-orange-500 outline-none" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})}/>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">Last Name</label>
                  <input required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-orange-500 outline-none" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})}/>
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">Email Address</label>
                <input required type="email" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-orange-500 outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}/>
              </div>

              {type === "doctor" && (
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">Specialty</label>
                  <input placeholder="e.g. Orthodontist" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-orange-500 outline-none" value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})}/>
                </div>
              )}
              
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">Phone Number</label>
                <input required placeholder="+20..." className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-orange-500 outline-none" value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})}/>
              </div>
              
              {/* Hide Password Field in Edit Mode */}
              {!editingId && (
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">System Password</label>
                  <input required type="password" placeholder="••••••••" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-orange-500 outline-none" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}/>
                </div>
              )}
              
              <div className={`grid ${type === "doctor" ? "grid-cols-2" : "grid-cols-1"} gap-4`}>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">Monthly Salary ($)</label>
                  <input type="number" value={formData.salary} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-orange-500 outline-none" onChange={e => setFormData({...formData, salary: Number(e.target.value)})}/>
                </div>
                
                {type === "doctor" && (
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">Commission Rate</label>
                    <input type="number" step="0.01" max="1" min="0" value={formData.percentage} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-orange-500 outline-none" onChange={e => setFormData({...formData, percentage: Number(e.target.value)})}/>
                  </div>
                )}
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-4 rounded-2xl transition-all mt-4 flex items-center justify-center gap-2 disabled:opacity-50">
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (editingId ? "Save Changes" : `Create ${type}`)}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffSection;