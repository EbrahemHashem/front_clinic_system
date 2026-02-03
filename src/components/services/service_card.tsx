"use client";

import { Edit, Trash2, Tag, Stethoscope, Sparkles, Activity, ShieldCheck } from "lucide-react";

export interface Service {
  id?: string; // Ensure backend sends this in the list view!
  name: string;
  description: string;
  price: string;
  category: string | null;
  clinic?: string;
}

const getIcon = (category: string | null) => {
  const cat = (category || "").toLowerCase();
  if (cat.includes("surgery")) return Activity;
  if (cat.includes("whitening") || cat.includes("cosmetic")) return Sparkles;
  if (cat.includes("implant")) return ShieldCheck;
  return Stethoscope; 
};

interface ServiceCardProps {
  service: Service;
  onEdit: () => void;
  onDelete: () => void;
}

export function ServiceCard({ service, onEdit, onDelete }: ServiceCardProps) {
  const Icon = getIcon(service.category);

  return (
    <div className="group bg-slate-900/40 border border-slate-800 p-6 rounded-[2rem] hover:border-orange-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-900/10 flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 rounded-2xl bg-slate-800 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
            <Icon size={24} />
          </div>
          <span className="text-white font-black text-lg">${service.price}</span>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{service.name}</h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3">
          {service.description}
        </p>

        {service.category && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
            <Tag size={12} /> {service.category}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4 border-t border-slate-800/50 mt-auto">
        <button 
          onClick={onEdit}
          className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
        >
          <Edit size={16} /> Edit
        </button>
        <button 
          onClick={onDelete}
          className="flex-1 bg-slate-800 hover:bg-red-500/20 hover:text-red-500 text-slate-400 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  );
}