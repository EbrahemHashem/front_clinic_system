"use client";

import React from "react";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Stethoscope,
  UserPlus,
  ScrollText,
  Receipt,
  LogOut,
  Building,
  Settings,
  CreditCard,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

const OwnerSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Appointments", icon: Calendar, path: "/dashboard/appointments" },
    { name: "Patients", icon: Users, path: "/dashboard/patients" },
    { name: "Doctors", icon: Stethoscope, path: "/dashboard/doctors" }, // Navigates to Doctor Section
    { name: "Assistants", icon: UserPlus, path: "/dashboard/assistants" }, // Navigates to Assistant Section
    { name: "Services", icon: ScrollText, path: "/dashboard/services" },
    { name: "Billing", icon: Receipt, path: "/dashboard/billing" },
  ];

  return (
    <div className="flex flex-col h-full p-6 bg-slate-900/30 border-r border-slate-800">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/20">
          <Building className="text-white" size={24} />
        </div>
        <div>
          <span className="text-lg font-black tracking-tighter text-white block leading-none">
            DENTFLOW
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => router.push(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all cursor-pointer group ${
              pathname === item.path
                ? "bg-orange-600 text-white"
                : "text-slate-500 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <item.icon size={20} />
            {item.name}
          </button>
        ))}
      </nav>

      <div className="pt-6 border-t border-slate-800 space-y-2">
        <button
          onClick={() => router.push("/dashboard/subscription")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all cursor-pointer ${pathname === "/dashboard/subscription" ? "bg-orange-600 text-white" : "text-slate-500 hover:bg-slate-800 hover:text-white"}`}
        >
          <CreditCard size={20} /> Subscription
        </button>
        <button
          onClick={() => router.push("/dashboard/settings")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all cursor-pointer ${pathname === "/dashboard/settings" ? "bg-orange-600 text-white" : "text-slate-500 hover:bg-slate-800 hover:text-white"}`}
        >
          <Settings size={20} /> Settings
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("dentflow_auth");
            window.location.href = "/login";
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
};

export default OwnerSidebar;
