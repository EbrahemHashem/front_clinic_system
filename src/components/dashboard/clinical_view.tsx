'use client';

import React from 'react';
import { Calendar, UserPlus, ClipboardList, CheckCircle2 } from 'lucide-react';

const ClinicalView = () => {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Good Morning, Dr. Reed!</h1>
          <p className="text-slate-400 mt-1">You have 12 appointments scheduled for today.</p>
        </div>
        <button className="bg-orange-600 text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-orange-500 transition-all cursor-pointer">
          <UserPlus size={20} /> New Appointment
        </button>
      </div>

      {/* Daily Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Patients Today', val: '24', icon: Calendar, bg: 'bg-blue-500/10', text: 'text-blue-500' },
          { label: 'Completed', val: '8', icon: CheckCircle2, bg: 'bg-green-500/10', text: 'text-green-500' },
          { label: 'Pending Docs', val: '3', icon: ClipboardList, bg: 'bg-orange-500/10', text: 'text-orange-500' },
        ].map((s, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl flex items-center gap-5">
            <div className={`w-14 h-14 ${s.bg} ${s.text} rounded-2xl flex items-center justify-center`}>
              <s.icon size={28} />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase">{s.label}</p>
              <h4 className="text-2xl font-black text-white">{s.val}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] overflow-hidden">
        <div className="p-8 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Today's Schedule</h3>
          <span className="text-xs font-bold text-slate-500">JAN 25, 2026</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50">
                <th className="p-6 text-slate-500 text-xs font-black uppercase">Time</th>
                <th className="p-6 text-slate-500 text-xs font-black uppercase">Patient</th>
                <th className="p-6 text-slate-500 text-xs font-black uppercase">Doctor</th>
                <th className="p-6 text-slate-500 text-xs font-black uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {[
                { time: '09:00 AM', patient: 'Liam Johnson', doc: 'Dr. Miller', status: 'Confirmed' },
                { time: '10:30 AM', patient: 'Emma Brown', doc: 'Dr. Miller', status: 'Checked-in' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-6 font-bold text-white">{row.time}</td>
                  <td className="p-6 text-slate-300">{row.patient}</td>
                  <td className="p-6 text-slate-300">{row.doc}</td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      row.status === 'Confirmed' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClinicalView;