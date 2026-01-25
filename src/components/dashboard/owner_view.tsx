'use client';

import React from 'react';
import { ShieldCheck, TrendingUp, Users2, CreditCard } from 'lucide-react';

const OwnerView = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Subscription Alert */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-6 rounded-3xl flex items-center justify-between text-white shadow-xl shadow-orange-900/20">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-xl"><ShieldCheck /></div>
          <div>
            <h4 className="font-black">Advanced Plan Active</h4>
            <p className="text-orange-100 text-xs">Your next billing date is Feb 24, 2026.</p>
          </div>
        </div>
        <button className="bg-white text-orange-600 font-bold px-4 py-2 rounded-xl text-sm hover:bg-orange-50 transition-colors">Manage Plan</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Financial Summary */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem]">
           <div className="flex justify-between items-center mb-8">
             <h3 className="text-xl font-bold text-white">Clinic Performance</h3>
             <TrendingUp className="text-green-500" />
           </div>
           <div className="grid grid-cols-2 gap-4">
             <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                <p className="text-slate-500 text-xs font-bold mb-1">THIS MONTH</p>
                <h2 className="text-3xl font-black text-white">$12,450</h2>
             </div>
             <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                <p className="text-slate-500 text-xs font-bold mb-1">TOTAL STAFF</p>
                <h2 className="text-3xl font-black text-white">13</h2>
             </div>
           </div>
        </div>

        {/* Staff Quick View */}
        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem]">
          <h3 className="text-xl font-bold text-white mb-6">Staff Breakdown</h3>
          <div className="space-y-6">
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-slate-300"><Users2 size={18}/> Doctors</div>
                <span className="font-black text-white">5</span>
             </div>
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-slate-300"><CreditCard size={18}/> Assistants</div>
                <span className="font-black text-white">8</span>
             </div>
             <button className="w-full mt-4 py-3 border border-slate-800 rounded-xl text-slate-400 font-bold hover:text-white hover:border-slate-600 transition-all">Manage Staff</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerView;