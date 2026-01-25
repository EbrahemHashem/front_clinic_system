'use client';

import { Users, Building2, DollarSign, Activity, CheckCircle, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const data = [
  { name: 'Jan', revenue: 4000 }, { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 }, { name: 'Apr', revenue: 4500 },
];

const SuperAdminView = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Clinics', val: '152', icon: Building2, color: 'text-blue-500' },
          { label: 'Active Doctors', val: '480', icon: Users, color: 'text-green-500' },
          { label: 'Total Patients', val: '12,540', icon: Activity, color: 'text-orange-500' },
          { label: 'Monthly Revenue', val: '$85,230', icon: DollarSign, color: 'text-emerald-500' },
        ].map((item, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
            <item.icon className={`${item.color} mb-4`} size={24} />
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{item.label}</p>
            <h3 className="text-2xl font-black text-white mt-1">{item.val}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Analytics */}
        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem]">
          <h3 className="text-xl font-bold text-white mb-6">Platform Revenue</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="revenue" stroke="#ea580c" strokeWidth={4} dot={{ r: 6, fill: '#ea580c' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Tickets/Approvals */}
        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem]">
          <h3 className="text-xl font-bold text-white mb-6">Pending Clinic Approvals</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-600/10 rounded-xl flex items-center justify-center text-orange-500 font-bold">C</div>
                  <div>
                    <p className="text-white font-bold text-sm">Bright Smiles Dental</p>
                    <p className="text-slate-500 text-xs">Waiting for Cash Verification</p>
                  </div>
                </div>
                <button className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer">Verify</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminView;