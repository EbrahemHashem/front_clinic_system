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
        const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PATIENTS}${id}`, {
          headers: { "Authorization": `Bearer ${auth.access_token}` }
        });
        const result = await res.json();
        setData(result?.data || result);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-950">
      <Loader2 className="animate-spin text-orange-500" size={40} />
    </div>
  );
  
  if (!data || !data.id) return (
    <div className="p-6 md:p-10 text-white text-center bg-slate-950 h-screen flex flex-col items-center justify-center">
      <p className="text-slate-500 mb-4">Patient record not found or invalid ID.</p>
      <button onClick={() => router.back()} className="bg-slate-800 px-6 py-2 rounded-xl text-white font-bold">
        Go Back
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-500">
      {/* Header - Stack on mobile, row on desktop */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3 md:gap-4">
          <button 
            onClick={() => router.back()} 
            className="p-2.5 md:p-3 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-white transition-all"
          >
            <ArrowLeft className="w-4.5 h-4.5 md:w-5 md:h-5" />
          </button>
          <div>
            <h1 className="text-xl md:text-3xl font-black text-white truncate max-w-[200px] md:max-w-none">
                {data.name}
            </h1>
            <p className="text-slate-500 text-[10px] md:text-sm font-bold uppercase tracking-widest">
              ID: {data.id?.substring(0, 8)}
            </p>
          </div>
        </div>
        <button className="w-full sm:w-auto bg-orange-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-500 transition-all shadow-lg shadow-orange-900/20">
          <Plus size={18} /> New Entry
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        
        {/* Left Side: Summary & Files - Stacks first on mobile */}
        <div className="col-span-1 lg:col-span-4 space-y-6">
          {/* Profile Card */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 flex flex-col items-center backdrop-blur-md">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-slate-950 border-4 border-slate-800 flex items-center justify-center text-3xl md:text-4xl text-orange-500 font-black mb-4 md:mb-6 shadow-2xl">
              {data.name?.[0]?.toUpperCase()}
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white mb-1 text-center">{data.name}</h2>
            <p className="text-slate-500 font-bold text-[10px] md:text-sm mb-6 md:mb-8 uppercase tracking-widest text-center">
              {data.gender} • {data.birth_date}
            </p>
            
            <div className="w-full space-y-4 pt-6 md:pt-8 border-t border-slate-800/50">
                <DetailItem label="Phone" value={data.phone_number} />
                <DetailItem label="Doctor" value={data.doctor} />
                <DetailItem label="Assistant" value={data.assistant} />
                <DetailItem label="Clinic" value={data.clinic} />
            </div>
          </div>

          {/* Attachments Card */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8">
            <h3 className="font-black text-white text-base md:text-lg mb-4 md:mb-6 flex items-center gap-2">
               <FileText className="text-orange-500" size={20}/> Attachments
            </h3>
            <div className="space-y-3">
              {data.attachments?.map((file: any) => (
                <div key={file.id} className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-slate-950/50 rounded-2xl border border-slate-800 hover:border-orange-500/30 transition-all group">
                  <div className="p-2 bg-slate-800 text-orange-500 rounded-lg shrink-0">
                    <FileText className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                  </div>
                  <div className="flex-1 min-w-0 text-sm">
                    <p className="text-slate-200 font-bold truncate">
                        {file.file.split('/').pop()}
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">
                        {new Date(file.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button className="text-slate-600 hover:text-white shrink-0"><MoreVertical size={16} /></button>
                </div>
              ))}
              {(!data.attachments || data.attachments.length === 0) && (
                <p className="text-center text-slate-600 text-sm py-4 italic">No files available</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Treatment Plans - Horizontal Scroll on Mobile */}
        <div className="col-span-1 lg:col-span-8">
          <div className="bg-slate-900/50 border border-slate-800 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden backdrop-blur-md">
            <div className="p-6 md:p-8 border-b border-slate-800 bg-slate-900/80">
              <h3 className="font-black text-white text-base md:text-lg">Treatment History</h3>
            </div>
            <div className="overflow-x-auto">
              {/* min-w-0 on parent and min-w-table allows swiping on mobile */}
              <table className="w-full text-left min-w-[500px] md:min-w-0">
                <thead>
                  <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800/50">
                    <th className="px-6 md:px-8 py-5">Procedure</th>
                    <th className="px-4 md:px-6 py-5">Dates</th>
                    <th className="px-6 md:px-8 py-5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {data.treatment_plans?.map((plan: any) => (
                    <tr key={plan.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 md:px-8 py-6">
                        <p className="text-white font-bold text-sm md:text-base">{plan.description}</p>
                      </td>
                      <td className="px-4 md:px-6 py-6">
                        <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-tighter">
                            {plan.start_date} <br className="md:hidden" /> → {plan.end_date}
                        </p>
                      </td>
                      <td className="px-6 md:px-8 py-6">
                        <div className="flex justify-end">
                            {plan.completed ? (
                            <span className="flex items-center gap-1.5 text-green-500 text-[9px] md:text-[10px] font-black uppercase bg-green-500/10 px-2.5 md:px-3 py-1.5 rounded-full border border-green-500/20 whitespace-nowrap">
                                <CheckCircle2 size={12} /> Completed
                            </span>
                            ) : (
                            <span className="flex items-center gap-1.5 text-orange-500 text-[9px] md:text-[10px] font-black uppercase bg-orange-500/10 px-2.5 md:px-3 py-1.5 rounded-full border border-orange-500/20 whitespace-nowrap">
                                <Clock size={12} /> In Progress
                            </span>
                            )}
                        </div>
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
      <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{label}</span>
      <span className="text-white text-xs md:text-sm font-bold truncate ml-4 text-right">{value || "—"}</span>
    </div>
  );
}