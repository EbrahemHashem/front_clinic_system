'use client';

import React from 'react';

const LogoCloud: React.FC = () => {
  return (
    <section id ="logo-cloud" className="py-12 bg-slate-950 border-y border-slate-900/50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "200+", label: "Clinics Managed" },
            { value: "1M+", label: "Appointments Tracked" },
            { value: "99.9%", label: "Platform Uptime" },
            { value: "24/7", label: "Support Availability" },
          ].map((item) => (
            <div key={item.label} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
              <p className="text-2xl md:text-3xl font-black text-white">{item.value}</p>
              <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mt-2">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoCloud;
