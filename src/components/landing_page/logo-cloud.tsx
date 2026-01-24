'use client';

import React from 'react';

const LogoCloud: React.FC = () => {
  const logos = [
    { name: 'SmileDental', label: 'SmileDental' },
    { name: 'CityClinic', label: 'CityClinic' },
    { name: 'HealthFirst', label: 'HealthFirst' },
    { name: 'BrightSide', label: 'BrightSide' },
    { name: 'ApexCare', label: 'ApexCare' },
  ];

  return (
    <section id ="logo-cloud" className="py-12 bg-slate-950 border-y border-slate-900/50">
      <div className="container mx-auto px-6">
        <p className="text-center text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-10">
          Trusted by 500+ clinics worldwide
        </p>

        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="flex items-center gap-2 group cursor-default"
            >
              <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center font-black text-slate-400 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                {logo.label[0]}
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-400 group-hover:text-white transition-colors">
                {logo.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoCloud;
