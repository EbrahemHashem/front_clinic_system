
'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';

const egpFormatter = new Intl.NumberFormat("en-EG", {
  style: "currency",
  currency: "EGP",
  currencyDisplay: "narrowSymbol",
  maximumFractionDigits: 0,
});

const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: "Basic",
      price: billingCycle === 'monthly' ? "149" : "119",
      period: "/ month",
      desc: "For small clinics getting started with digital operations.",
      cta: "Get Started",
      features: ["Up to 1,000 Patients", "Smart Scheduling", "Digital Charts (EMR)", "Billing & Invoicing", "Email Support"],
      highlight: false
    },
    {
      name: "Professional",
      price: billingCycle === 'monthly' ? "299" : "239",
      period: "/ month",
      desc: "For growing clinics with higher patient volume and bigger teams.",
      cta: "Try for Free",
      badge: "Popular Choice",
      features: ["Unlimited Patients", "SMS Reminders", "Growth Analytics", "Insurance Claims Tool", "Priority Support", "E-Signatures"],
      highlight: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      desc: "For multi-branch clinic groups with advanced operational needs.",
      cta: "Contact Sales",
      features: ["Multi-location Management", "API Access", "Custom Integration", "Dedicated Account Manager", "Advanced Security Controls"],
      highlight: false
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-slate-950">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight">Simple Pricing For Clinic Teams</h2>
          <p className="text-slate-400 text-lg mb-10">Choose a plan based on your clinic size and upgrade as your operations grow.</p>
          
          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 bg-slate-900 p-1.5 rounded-full border border-slate-800 w-fit mx-auto shadow-inner">
            <button 
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-orange-500'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${billingCycle === 'yearly' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-orange-500'}`}
            >
              Yearly <span className={`${billingCycle === 'yearly' ? 'text-orange-200' : 'text-orange-500'} ml-1 font-black`}>(-20%)</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((plan, i) => (
            <div key={i} className={`relative flex flex-col p-10 rounded-[2.5rem] border transition-all duration-500 ${plan.highlight ? 'bg-slate-900 border-orange-600/50 shadow-[0_0_50px_-12px_rgba(234,88,12,0.3)] scale-105 z-10' : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900 hover:border-slate-700'}`}>
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full shadow-lg">
                  {plan.badge}
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">{plan.desc}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-white tracking-tighter">
                    {plan.price !== 'Custom' ? egpFormatter.format(Number(plan.price)) : plan.price}
                  </span>
                  <span className="text-slate-500 font-bold ml-1">{plan.period}</span>
                </div>
              </div>

              <button className={`w-full py-4 rounded-2xl font-bold mb-10 transition-all ${plan.highlight ? 'bg-orange-600 text-white hover:bg-orange-500 shadow-xl shadow-orange-900/30' : 'bg-white text-slate-950 hover:bg-orange-500 hover:text-white'}`}>
                {plan.cta}
              </button>

              <div className="space-y-4 flex-grow">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">What is included:</p>
                {plan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm font-medium">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
