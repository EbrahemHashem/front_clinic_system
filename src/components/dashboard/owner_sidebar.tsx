"use client";

import React from "react";
import { 
  LayoutDashboard, 
  Users2, 
  CreditCard, 
  Settings, 
  TrendingUp,
  LogOut,
  Building
} from "lucide-react";
import { useRouter } from "next/navigation";

const OwnerSidebar = () => {
  const router = useRouter();

  const menuItems = [
    { name: "Clinic Overview", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Staff Management", icon: Users2, path: "/dashboard/staff" },
    { name: "Revenue & Billing", icon: TrendingUp, path: "/dashboard/revenue" },
    { name: "Subscription", icon: CreditCard, path: "/dashboard/subscription" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("dentflow_auth");
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col h-full p-6 bg-slate-900/30">
      {/* Clinic Branding */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/20">
          <Building className="text-white" size={24} />
        </div>
        <div>
          <span className="text-lg font-black tracking-tighter text-white block leading-none">DENTFLOW</span>
          <span className="text-[10px] text-orange-500 font-bold uppercase tracking-widest">Management</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => router.push(item.path)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-800 hover:text-white transition-all cursor-pointer group"
          >
            <item.icon size={20} className="group-hover:text-orange-500 transition-colors" />
            {item.name}
          </button>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="pt-6 border-t border-slate-800 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-800 transition-all cursor-pointer">
          <Settings size={20} />
          Clinic Settings
        </button>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
};

export default OwnerSidebar;