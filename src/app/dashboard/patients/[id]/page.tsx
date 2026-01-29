"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_CONFIG } from "@/lib/constants";
import { 
  ArrowLeft, FileText, CheckCircle2, Clock, 
  Plus, MoreVertical, Loader2
} from "lucide-react";

export default function PatientProfile() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const auth = JSON.parse(localStorage.getItem("dentflow_auth") || "{}");
        // We use patient_id as a query param as per your requirement
        const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PATIENTS}${id}`, {
          headers: { "Authorization": `Bearer ${auth.access_token}` }
        });
        const result = await res.json();
        
        // IMPORTANT: Handle if the API returns { data: { ... } } or just { ... }
        setData(result?.data || result);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  // 1. Loading State
  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-950">
      <Loader2 className="animate-spin text-orange-500" size={40} />
    </div>
  );
  
  // 2. Error/Empty Guard: This prevents the 'substring' error because the rest of the 
  // code won't run if data.id is missing.
  if (!data || !data.id) return (
    <div className="p-10 text-white text-center bg-slate-950 h-screen flex flex-col items-center justify-center">
      <p className="text-slate-500 mb-4">Patient record not found or invalid ID.</p>
      <button onClick={() => router.back()} className="bg-slate-800 px-6 py-2 rounded-xl text-white font-bold">
        Go Back
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()} 
            className="p-3 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-white transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-white">{data.name}</h1>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
              ID: {data.id?.substring(0, 8)} {/* Safe because of the Guard above */}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="bg-orange-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-500 transition-all shadow-lg shadow-orange-900/20">
            <Plus size={18} /> New Entry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Side: Summary & Files */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-10 flex flex-col items-center backdrop-blur-md">
            <div className="w-32 h-32 rounded-full bg-slate-950 border-4 border-slate-800 flex items-center justify-center text-4xl text-orange-500 font-black mb-6 shadow-2xl">
              {data.name?.[0]?.toUpperCase()}
            </div>
            <h2 className="text-2xl font-black text-white mb-1">{data.name}</h2>
            <p className="text-slate-500 font-bold text-sm mb-8 uppercase tracking-widest">
              {data.gender} • {data.birth_date}
            </p>
            
            <div className="w-full space-y-4 pt-8 border-t border-slate-800/50">
                <DetailItem label="Phone" value={data.phone_number} />
                <DetailItem label="Doctor" value={data.doctor} />
                <DetailItem label="Assistant" value={data.assistant} />
                <DetailItem label="Clinic" value={data.clinic} />
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8">
            <h3 className="font-black text-white text-lg mb-6 flex items-center gap-2">
               <FileText className="text-orange-500" size={20}/> Attachments
            </h3>
            <div className="space-y-3">
              {data.attachments?.map((file: any) => (
                <div key={file.id} className="flex items-center gap-4 p-4 bg-slate-950/50 rounded-2xl border border-slate-800 hover:border-orange-500/30 transition-all group">
                  <div className="p-2 bg-slate-800 text-orange-500 rounded-lg">
                    <FileText size={18} />
                  </div>
                  <div className="flex-1 min-w-0 text-sm">
                    <p className="text-slate-200 font-bold truncate">
                        {file.file.split('/').pop()}
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold">
                        {new Date(file.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button className="text-slate-600 hover:text-white"><MoreVertical size={16} /></button>
                </div>
              ))}
              {(!data.attachments || data.attachments.length === 0) && (
                <p className="text-center text-slate-600 text-sm py-4 italic">No files available</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Treatment Plans */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] overflow-hidden backdrop-blur-md">
            <div className="p-8 border-b border-slate-800 bg-slate-900/80">
              <h3 className="font-black text-white text-lg">Treatment History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800/50">
                    <th className="px-8 py-5">Procedure</th>
                    <th className="px-6 py-5">Dates</th>
                    <th className="px-8 py-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {data.treatment_plans?.map((plan: any) => (
                    <tr key={plan.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-8 py-6">
                        <p className="text-white font-bold">{plan.description}</p>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-tighter">
                            {plan.start_date} → {plan.end_date}
                        </p>
                      </td>
                      <td className="px-8 py-6">
                        {plan.completed ? (
                          <span className="flex items-center gap-1.5 text-green-500 text-[10px] font-black uppercase bg-green-500/10 px-3 py-1.5 rounded-full w-fit border border-green-500/20">
                            <CheckCircle2 size={12} /> Completed
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-orange-500 text-[10px] font-black uppercase bg-orange-500/10 px-3 py-1.5 rounded-full w-fit border border-orange-500/20">
                            <Clock size={12} /> In Progress
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {(!data.treatment_plans || data.treatment_plans.length === 0) && (
                    <tr>
                        <td colSpan={3} className="py-20 text-center text-slate-600 font-bold uppercase tracking-widest text-xs">
                            No treatment plans recorded
                        </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-slate-800/30 last:border-0 pb-3">
      <span className="text-slate-500 text-xs font-black uppercase tracking-widest">{label}</span>
      <span className="text-white text-sm font-bold">{value || "—"}</span>
    </div>
  );
}