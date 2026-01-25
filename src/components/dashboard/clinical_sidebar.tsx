"use client";

import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  ClipboardList, 
  LogOut,
  Stethoscope
} from "lucide-react";
import { useRouter } from "next/navigation";

const ClinicalSidebar = () => {
  const router = useRouter();

  const menuItems = [
    { name: "Overview", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Appointments", icon: Calendar, path: "/dashboard/appointments" },
    { name: "Patients", icon: Users, path: "/dashboard/patients" },
    { name: "Medical Records", icon: ClipboardList, path: "/dashboard/records" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("dentflow_auth");
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col h-full p-6 bg-slate-900/30">
      <div className="flex items-center gap-3 mb-10 px-2">
        <Stethoscope className="text-orange-600" size={32} />
        <span className="text-xl font-black tracking-tighter text-white">CLINIC POS</span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => router.push(item.path)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-800 hover:text-white transition-all cursor-pointer"
          >
            <item.icon size={20} />
            {item.name}
          </button>
        ))}
      </nav>

      <button 
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-red-500 hover:bg-red-500/10 transition-all cursor-pointer mt-auto"
      >
        <LogOut size={20} /> Logout
      </button>
    </div>
  );
};

export default ClinicalSidebar;