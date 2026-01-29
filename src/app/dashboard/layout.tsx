"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react"; // Import for mobile toggle
import SuperAdminSidebar from "@/components/dashboard/super_admin_sidebar";
import ClinicalSidebar from "@/components/dashboard/clinical_sidebar";
import OwnerSidebar from "@/components/dashboard/owner_sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state
  const router = useRouter();

  useEffect(() => {
    const authData = localStorage.getItem("dentflow_auth");
    if (!authData) { router.push("/login"); return; }
    try {
      const parsed = JSON.parse(authData);
      if (parsed?.user) { setUser(parsed.user); } 
      else { router.push("/login"); }
    } catch (e) { router.push("/login"); } 
    finally { setLoading(false); }
  }, [router]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-white relative">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Responsive Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-64 border-r border-slate-800 bg-slate-900 
        transition-transform duration-300 transform lg:static lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {user.role === "superadmin" && <SuperAdminSidebar />}
        {user.role === "owner" && <OwnerSidebar />}
        {(user.role === "doctor" || user.role === "assistant") && <ClinicalSidebar />}
      </aside>
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen w-full overflow-hidden">
        {/* Responsive Header */}
        <header className="h-20 border-b border-slate-800 flex items-center justify-between px-4 lg:px-8 bg-slate-900/10 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-4">
            {/* Hamburger Button */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white bg-slate-800/50 rounded-xl"
            >
              <Menu size={24} />
            </button>
            <h2 className="font-bold text-slate-400 capitalize hidden xs:block">
              {user.role} <span className="text-slate-700 mx-2">/</span> <span className="text-white">Overview</span>
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white leading-none mb-1">{user.first_name} {user.last_name}</p>
              <p className="text-[10px] text-orange-500 uppercase font-black tracking-widest">{user.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center font-bold text-white shadow-lg">
              {user.first_name?.[0]}
            </div>
          </div>
        </header>

        {/* Dynamic Children Content */}
        <section className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {children}
        </section>
      </main>
    </div>
  );
}