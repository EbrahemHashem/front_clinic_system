'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

const PlanSelection = () => {
  const router = useRouter();
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: 'Free Trial',
      monthlyPrice: '$0',
      yearlyPrice: '$0',
      period: isYearly ? '/14 days' : '/14 days',
      features: ['Full access to all features', 'No credit card required', 'Instant setup', 'Standard support'],
      highlight: false,
      buttonText: 'Start Free Trial'
    },
    {
      name: 'Basic',
      monthlyPrice: '$49',
      yearlyPrice: '$470',
      period: isYearly ? '/ year' : '/ month',
      features: ['Up to 5 staff members', 'Patient records management', 'Appointment scheduling', 'Basic billing & invoicing'],
      highlight: false,
      buttonText: 'Choose Basic'
    },
    {
      name: 'Advanced',
      monthlyPrice: '$99',
      yearlyPrice: '$950',
      period: isYearly ? '/ year' : '/ month',
      features: ['Unlimited staff members', 'All features in Basic', 'Advanced reporting', 'Inventory management', 'Priority support'],
      highlight: true,
      buttonText: 'Choose Advanced'
    },
  ];

  return (
    <div className="w-full">
      {/* Pricing Toggle - Matches your photo */}
      <div className="flex justify-center items-center mb-16">
        <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-2xl flex items-center gap-2">
          <button
            onClick={() => setIsYearly(false)}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${!isYearly ? 'bg-white text-black shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${isYearly ? 'bg-white text-black shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Yearly
            <span className="text-[10px] bg-orange-600/20 text-orange-500 px-2 py-0.5 rounded-md">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <div 
            key={i} 
            className={`relative p-8 rounded-[2.5rem] border transition-all duration-300 ${
              plan.highlight 
                ? 'border-orange-600 bg-orange-600/5 shadow-[0_0_40px_rgba(234,88,12,0.1)] scale-105 z-10' 
                : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
            } flex flex-col`}
          >
            {plan.highlight && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-[10px] font-black uppercase px-4 py-1 rounded-full tracking-widest">
                Most Popular
              </span>
            )}
            
            <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
            <p className="text-slate-500 text-xs mb-6">For growing clinics that need more power.</p>
            
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-4xl font-black text-white">
                {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
              </span>
              <span className="text-slate-500 text-sm font-medium">{plan.period}</span>
            </div>

            {isYearly && plan.monthlyPrice !== '$0' && (
              <div className="text-orange-500 text-[10px] font-bold mb-6">
                or {plan.monthlyPrice} / month
              </div>
            )}
            {!isYearly && <div className="mb-6 h-[15px]"></div>}

            <ul className="space-y-4 mb-8 flex-grow">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-start gap-3 text-slate-300 text-sm leading-tight">
                  <Check size={18} className="text-orange-500 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={() => router.push('/setup-clinic')}
              className={`w-full py-4 rounded-2xl font-black transition-all cursor-pointer ${
                plan.highlight 
                  ? 'bg-orange-600 text-white hover:bg-orange-500 shadow-lg shadow-orange-900/20' 
                  : 'bg-white text-black hover:bg-slate-200'
              }`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanSelection;