"use client";

import React from "react";
import { 
  LayoutDashboard, 
  Calendar,       // For Appointments
  Users,          // For Patients
  Stethoscope,    // For Doctors
  UserPlus,       // For Assistants (matches the icon with + sign)
  ScrollText,     // For Services (looks like a list)
  Receipt,        // For Billing
  LogOut,
  Building,
  Settings
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

const OwnerSidebar = () => {
  const router = useRouter();
  const pathname = usePathname(); // Used to highlight active link

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Appointments", icon: Calendar, path: "/dashboard/appointments" },
    { name: "Patients", icon: Users, path: "/dashboard/patients" },
    { name: "Doctors", icon: Stethoscope, path: "/dashboard/doctors" },
    { name: "Assistants", icon: UserPlus, path: "/dashboard/assistants" },
    { name: "Services", icon: ScrollText, path: "/dashboard/services" },
    { name: "Billing", icon: Receipt, path: "/dashboard/billing" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("dentflow_auth");
    router.push("/login");
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
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={item.name}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all cursor-pointer group ${
                isActive 
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-900/20" 
                  : "text-slate-500 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon 
                size={20} 
                className={`${isActive ? "text-white" : "group-hover:text-orange-500"} transition-colors`} 
              />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="pt-6 border-t border-slate-800 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-800 transition-all cursor-pointer">
          <Settings size={20} />
          <span className="text-sm">Settings</span>
        </button>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
        >
          <LogOut size={20} /> 
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default OwnerSidebar;