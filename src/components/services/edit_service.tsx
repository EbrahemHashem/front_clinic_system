"use client";
import React, { useState, useEffect } from "react";
import { X, Loader2, DollarSign, FileText, Tag, Type } from "lucide-react";
import { API_CONFIG } from "@/lib/constants";

interface EditServiceModalProps {
  serviceId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditServiceModal({ serviceId, isOpen, onClose, onSuccess }: EditServiceModalProps) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: ""
  });

  // Fetch data when modal opens
  useEffect(() => {
    if (isOpen && serviceId) {
      fetchServiceDetails();
    }
  }, [isOpen, serviceId]);

  const fetchServiceDetails = async () => {
    setFetching(true);
    try {
      const auth = JSON.parse(localStorage.getItem("dentflow_auth") || "{}");
      const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SERVICES}${serviceId}`, {
        headers: { "Authorization": `Bearer ${auth.access_token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setFormData({
          name: data.name || "",
          description: data.description || "",
          price: data.price || "",
          category: data.category || ""
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const auth = JSON.parse(localStorage.getItem("dentflow_auth") || "{}");
      
      const payload: any = { id: serviceId };
      if (formData.name) payload.name = formData.name;
      if (formData.description) payload.description = formData.description;
      if (formData.price) payload.price = parseFloat(formData.price);
      if (formData.category) payload.category = formData.category;

      const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SERVICES}`, {
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
        alert("Update failed");
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
          <h3 className="text-xl font-black text-white">Edit Service</h3>
          <button onClick={onClose} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {fetching ? (
           <div className="py-12 flex justify-center"><Loader2 className="animate-spin text-orange-500" /></div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1 flex items-center gap-1">
                <Type size={12}/> Service Name
              </label>
              <input 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-orange-500 outline-none transition-colors"
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
                  type="number"
                  step="0.01"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-orange-500 outline-none transition-colors"
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
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white h-24 resize-none focus:border-orange-500 outline-none transition-colors"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-orange-600 py-3.5 rounded-xl font-bold text-white hover:bg-orange-500 transition-all flex justify-center items-center gap-2 mt-4"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Save Changes"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}