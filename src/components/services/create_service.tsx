"use client";
import React, { useState } from "react";
import { X, Loader2, DollarSign, FileText, Tag, Type } from "lucide-react";
import { API_CONFIG } from "@/lib/constants";

interface CreateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateServiceModal({ isOpen, onClose, onSuccess }: CreateServiceModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const auth = JSON.parse(localStorage.getItem("dentflow_auth") || "{}");
      
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category
      };

      const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SERVICES}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${auth.access_token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setFormData({ name: "", description: "", price: "", category: "" });
        onSuccess();
        onClose();
      } else {
        alert("Failed to create service");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[2rem] p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-white">Add New Service</h3>
          <button onClick={onClose} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1 flex items-center gap-1">
              <Type size={12}/> Service Name
            </label>
            <input 
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-orange-500 outline-none transition-colors"
              placeholder="e.g. Root Canal"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1 flex items-center gap-1">
                <DollarSign size={12}/> Price
              </label>
              <input 
                required
                type="number"
                step="0.01"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-orange-500 outline-none transition-colors"
                placeholder="0.00"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1 flex items-center gap-1">
                <Tag size={12}/> Category
              </label>
              <input 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-orange-500 outline-none transition-colors"
                placeholder="e.g. Surgery"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1 flex items-center gap-1">
              <FileText size={12}/> Description
            </label>
            <textarea 
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white h-24 resize-none focus:border-orange-500 outline-none transition-colors"
              placeholder="Describe the service..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-orange-600 py-3.5 rounded-xl font-bold text-white hover:bg-orange-500 transition-all flex justify-center items-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Create Service"}
          </button>
        </form>
      </div>
    </div>
  );
}