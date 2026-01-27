'use client';

import React from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  Users2, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  UserPlus 
} from 'lucide-react';

const OwnerView = () => {
  // Mock data for the schedule - in a real app, this comes from your API
  const todaySchedule = [
    { time: "09:00 AM", patient: "Liam Johnson", doctor: "Dr. Miller", status: "Confirmed", statusColor: "text-blue-400 bg-blue-400/10" },
    { time: "09:30 AM", patient: "Olivia Smith", doctor: "Dr. Davis", status: "Checked-in", statusColor: "text-emerald-400 bg-emerald-400/10" },
    { time: "10:00 AM", patient: "Noah Williams", doctor: "Dr. Wilson", status: "Completed", statusColor: "text-slate-400 bg-slate-400/10" },
  ];

  return (
    <div className="w-full block space-y-8 animate-in fade-in duration-700">
      {/* 1. Welcome Header */}
      <div>
        <h1 className="text-3xl font-black text-white">Good Morning, Dr. Reed!</h1>
        <p className="text-slate-400 mt-1">Here's a look at what's happening in your clinic today.</p>
      </div>

      {/* 2. Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Doctors", value: "5", icon: Users2, color: "text-orange-500" },
          { label: "Total Assistants", value: "8", icon: UserPlus, color: "text-blue-500" },
          { label: "Patients Today", value: "24", icon: CheckCircle2, color: "text-emerald-500" },
          { label: "Appointments Today", value: "32", icon: Calendar, color: "text-purple-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h2 className="text-4xl font-black text-white">{stat.value}</h2>
              <stat.icon className={stat.color} size={28} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 3. Today's Schedule Table */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-[2.5rem] overflow-hidden">
          <div className="p-8 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Today's Schedule</h3>
            <button className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all">
              + New Appointment
            </button>
          </div>
          <div className="p-4 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-xs uppercase font-bold">
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Doctor</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {todaySchedule.map((row, i) => (
                  <tr key={i} className="text-slate-300 hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-4 font-bold text-white">{row.time}</td>
                    <td className="px-4 py-4">{row.patient}</td>
                    <td className="px-4 py-4">{row.doctor}</td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${row.statusColor}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Upcoming & Subscription Side Column */}
        <div className="space-y-6">
          {/* Subscription Card */}
          <div className="bg-gradient-to-br from-orange-600 to-orange-400 p-6 rounded-[2rem] text-white shadow-xl shadow-orange-900/20">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck size={24} />
              <h4 className="font-black">Advanced Plan</h4>
            </div>
            <p className="text-orange-100 text-xs mb-4 leading-relaxed">Your subscription is active. Next billing: Feb 24, 2026.</p>
            <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md py-2 rounded-xl text-sm font-bold transition-all">
              Manage Billing
            </button>
          </div>

          {/* Quick Performance Card */}
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-[2rem]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-white">Performance</h3>
              <TrendingUp className="text-emerald-500" size={18} />
            </div>
            <div className="space-y-4">
               <div>
                 <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">Monthly Revenue</p>
                 <h2 className="text-2xl font-black text-white">$12,450</h2>
               </div>
               <div className="pt-4 border-t border-slate-800">
                 <button className="text-orange-500 text-xs font-bold hover:underline cursor-pointer">View full report →</button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerView;