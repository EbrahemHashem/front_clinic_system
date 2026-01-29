'use client';

import React from 'react';
import { Calendar, UserPlus, ClipboardList, CheckCircle2 } from 'lucide-react';

const ClinicalView = () => {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-white">Good Morning, Dr. Reed!</h1>
          <p className="text-slate-400 mt-1 text-sm">You have 12 appointments scheduled for today.</p>
        </div>
        <button className="w-full sm:w-auto bg-orange-600 text-white font-bold px-6 py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-orange-500 transition-all">
          <UserPlus size={20} /> <span className="whitespace-nowrap">New Appointment</span>
        </button>
      </div>

      {/* Daily Stats Grid: 1 col on mobile, 3 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* ... mapping items ... */}
      </div>

      {/* Table: Use overflow-x-auto to prevent breakages */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h3 className="font-bold text-white uppercase text-xs tracking-widest">Today's Schedule</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            {/* ... existing table head and body ... */}
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClinicalView;