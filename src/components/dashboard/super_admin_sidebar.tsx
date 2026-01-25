"use client";

import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  CreditCard, 
  ShieldCheck, 
  LogOut 
} from "lucide-react";
import { useRouter } from "next/navigation";

const SuperAdminSidebar = () => {
  const router = useRouter();

  const menuItems = [
    { name: "Overview", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Clinics", icon: Building2, path: "/dashboard/clinics" },
    { name: "User Management", icon: Users, path: "/dashboard/users" },
    { name: "Payments", icon: CreditCard, path: "/dashboard/payments" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("dentflow_auth");
    router.push("/login");
  };

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center gap-3 mb-10 px-2">
        <ShieldCheck className="text-orange-600" size={32} />
        <span className="text-xl font-black tracking-tighter">ADMIN PANEL</span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
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

export default SuperAdminSidebar;