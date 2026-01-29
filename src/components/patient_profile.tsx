"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_CONFIG } from "@/lib/constants";
import { 
  ArrowLeft, FileText, CheckCircle2, Clock, 
  Plus, MoreVertical, Loader2, Upload, Trash2, X
} from "lucide-react";

export default function PatientProfile() {
  const { id } = useParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // 1. Unified Fetch Function
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

  useEffect(() => {
    fetchProfile();
  }, [id]);

  // 2. Handle File Upload (form-data)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("patient_id", id as string);
    formData.append("attachments", file);

    try {
      const auth = JSON.parse(localStorage.getItem("dentflow_auth") || "{}");
      const res = await fetch(`${API_CONFIG.BASE_URL}patients/attach/`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${auth.access_token}`
          // Note: Do NOT set Content-Type header when sending FormData
        },
        body: formData
      });

      if (res.ok) {
        await fetchProfile(); // Refresh data
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      console.error("Upload error", err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // 3. Handle Delete Attachment
  const handleDeleteAttachment = async (attachmentId: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      const auth = JSON.parse(localStorage.getItem("dentflow_auth") || "{}");
      const res = await fetch(`${API_CONFIG.BASE_URL}patients/attach/?attachment_id=${attachmentId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${auth.access_token}` }
      });

      if (res.ok) {
        await fetchProfile(); // Refresh UI
      }
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-950">
      <Loader2 className="animate-spin text-orange-500" size={40} />
    </div>
  );
  
  if (!data || !data.id) return (
    <div className="p-6 md:p-10 text-white text-center bg-slate-950 h-screen flex flex-col items-center justify-center">
      <p className="text-slate-500 mb-4">Patient record not found or invalid ID.</p>
      <button onClick={() => router.back()} className="bg-slate-800 px-6 py-2 rounded-xl text-white font-bold">Go Back</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3 md:gap-4">
          <button onClick={() => router.back()} className="p-2.5 md:p-3 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-white transition-all">
            <ArrowLeft className="w-4.5 h-4.5 md:w-5 md:h-5" />
          </button>
          <div>
            <h1 className="text-xl md:text-3xl font-black text-white truncate max-w-[200px] md:max-w-none">{data.name}</h1>
            <p className="text-slate-500 text-[10px] md:text-sm font-bold uppercase tracking-widest">ID: {data.id?.substring(0, 8)}</p>
          </div>
        </div>
        <button className="w-full sm:w-auto bg-orange-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-500 transition-all shadow-lg shadow-orange-900/20">
          <Plus size={18} /> New Entry
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        <div className="col-span-1 lg:col-span-4 space-y-6">
          {/* Profile Details Card */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 flex flex-col items-center backdrop-blur-md">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-slate-950 border-4 border-slate-800 flex items-center justify-center text-3xl md:text-4xl text-orange-500 font-black mb-4 md:mb-6 shadow-2xl">
              {data.name?.[0]?.toUpperCase()}
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white mb-1 text-center">{data.name}</h2>
            <p className="text-slate-500 font-bold text-[10px] md:text-sm mb-6 md:mb-8 uppercase tracking-widest text-center">{data.gender} • {data.birth_date}</p>
            <div className="w-full space-y-4 pt-6 md:pt-8 border-t border-slate-800/50">
                <DetailItem label="Phone" value={data.phone_number} />
                <DetailItem label="Doctor" value={data.doctor} />
                <DetailItem label="Assistant" value={data.assistant} />
                <DetailItem label="Clinic" value={data.clinic} />
            </div>
          </div>

          {/* Attachments Card with Upload Button */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-white text-base md:text-lg flex items-center gap-2">
                <FileText className="text-orange-500" size={20}/> Attachments
                </h3>
                {/* Hidden Input for File Upload */}
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="p-2 bg-orange-600/10 text-orange-500 rounded-lg hover:bg-orange-600 hover:text-white transition-all disabled:opacity-50"
                >
                  {isUploading ? <Loader2 className="animate-spin" size={18}/> : <Upload size={18} />}
                </button>
            </div>

            <div className="space-y-3">
              {data.attachments?.map((file: any) => (
                <div key={file.id} className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-slate-950/50 rounded-2xl border border-slate-800 hover:border-orange-500/30 transition-all group">
                  <div className="p-2 bg-slate-800 text-orange-500 rounded-lg shrink-0">
                    <FileText className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                  </div>
                  <div className="flex-1 min-w-0 text-sm">
                    <p className="text-slate-200 font-bold truncate">{file.file.split('/').pop()}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{new Date(file.created_at).toLocaleDateString()}</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteAttachment(file.id)}
                    className="text-slate-600 hover:text-red-500 shrink-0 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {(!data.attachments || data.attachments.length === 0) && (
                <p className="text-center text-slate-600 text-sm py-4 italic">No files available</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Treatment Plans */}
        <div className="col-span-1 lg:col-span-8">
          {/* ... (Treatment History Table Remains the same as previous) ... */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden backdrop-blur-md">
            <div className="p-6 md:p-8 border-b border-slate-800 bg-slate-900/80">
              <h3 className="font-black text-white text-base md:text-lg">Treatment History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[500px]">
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
                      <td className="px-4 md:px-6 py-6 text-slate-400 text-[10px] md:text-xs">
                        {plan.start_date} → {plan.end_date}
                      </td>
                      <td className="px-6 md:px-8 py-6 text-right">
                        {plan.completed ? (
                          <span className="text-green-500 text-[9px] uppercase bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">Completed</span>
                        ) : (
                          <span className="text-orange-500 text-[9px] uppercase bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">In Progress</span>
                        )}
                      </td>
                    </tr>
                  ))}
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