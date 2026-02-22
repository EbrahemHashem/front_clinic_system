"use client";

import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  ShieldCheck,
  LogOut,
  BarChart3,
  Headphones,
  Settings,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import React from "react";

const SuperAdminSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Clinics", icon: Building2, path: "/dashboard/clinics" },
    { name: "Users", icon: Users, path: "/dashboard/users" },
    {
      name: "Payments & Subscriptions",
      icon: CreditCard,
      path: "/dashboard/payments",
    },
    {
      name: "System Analytics",
      icon: BarChart3,
      path: "/dashboard/analytics",
    },
    {
      name: "Support Tickets",
      icon: Headphones,
      path: "/dashboard/support",
    },
    { name: "Settings", icon: Settings, path: "/dashboard/settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("dentflow_auth");
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col h-full p-6 bg-slate-900/30">
      {/* Brand */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/30">
          <ShieldCheck className="text-white" size={22} />
        </div>
        <div>
          <span className="text-lg font-black tracking-tighter text-white block leading-none">
            DENTFLOW
          </span>
          <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">
            Admin Panel
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
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
                className={
                  isActive
                    ? "text-white"
                    : "text-slate-500 group-hover:text-orange-500"
                }
              />
              <span className="text-sm">{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* User Info + Logout */}
      <div className="mt-auto pt-6 border-t border-slate-800 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white font-bold text-sm shadow-lg">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">Super Admin</p>
            <p className="text-[11px] text-slate-500 truncate">
              admin@dentflow.com
            </p>
          </div>
        </div>
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

export default SuperAdminSidebar;
