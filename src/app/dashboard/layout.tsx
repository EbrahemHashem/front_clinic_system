"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SuperAdminSidebar from "@/components/dashboard/super_admin_sidebar";
import ClinicalSidebar from "@/components/dashboard/clinical_sidebar";
import OwnerSidebar from "@/components/dashboard/owner_sidebar"; // Import the new sidebar

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const authData = localStorage.getItem("dentflow_auth");
    
    if (!authData) {
      router.push("/login");
      return;
    }

    try {
      const parsed = JSON.parse(authData);
      if (parsed?.user) {
        setUser(parsed.user);
      } else {
        router.push("/login");
      }
    } catch (e) {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <aside className="w-64 border-r border-slate-800 bg-slate-900/30 sticky top-0 h-screen overflow-y-auto">
        {/* Role-Based Sidebar Selection */}
        {user.role === "superadmin" && <SuperAdminSidebar />}
        {user.role === "owner" && <OwnerSidebar />}
        {(user.role === "doctor" || user.role === "assistant") && <ClinicalSidebar />}
      </aside>
      
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/10 backdrop-blur-md sticky top-0 z-50">
          <h2 className="font-bold text-slate-400 capitalize">
            {user.role} <span className="text-slate-700 mx-2">/</span> <span className="text-white">Overview</span>
          </h2>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-white leading-none mb-1">{user.first_name} {user.last_name}</p>
              <p className="text-[10px] text-orange-500 uppercase font-black tracking-widest">{user.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center font-bold text-white shadow-lg shadow-orange-900/40">
              {user.first_name?.[0]}
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-8 bg-slate-950">
          {children}
        </section>
      </main>
    </div>
  );
}