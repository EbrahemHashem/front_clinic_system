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
    <div className="w-full space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-2xl lg:text-3xl font-black text-white text-center md:text-left">Dashboard</h1>
      </div>

      {/* Top Stats: Wrap into multiple rows on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* ... existing metric cards ... */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Schedule: Main focus on mobile */}
        <div className="col-span-12 lg:col-span-8 bg-slate-900/50 border border-slate-800 rounded-[2.5rem] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">...</table>
          </div>
        </div>

        {/* Right Column: Cards stack on top of each other below the table on mobile */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Subscription & Performance Cards */}
        </div>
      </div>
    </div>
  );
};

export default OwnerView;