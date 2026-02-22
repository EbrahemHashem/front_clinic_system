'use client';

import React, { useState, Suspense } from 'react';
import { Wallet, CheckCircle2, ArrowRight, Loader2, ExternalLink, Phone } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

const egpFormatter = new Intl.NumberFormat("en-EG", {
  style: "currency",
  currency: "EGP",
  currencyDisplay: "narrowSymbol",
  maximumFractionDigits: 0,
});

// Using a wrapper component to handle useSearchParams safely with Next.js Suspense
const SubscriptionContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Get the plan details from the URL parameters
  const planName = searchParams.get('plan') || 'Selected Plan';
  const planPrice = searchParams.get('amount') || '0';
  const formattedPlanPrice = egpFormatter.format(Number(planPrice));

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'instapay'>('cash');
  const [isLoading, setIsLoading] = useState(false);

  const paymentLinks = {
    cash: "https://vfm.vodafone.com.eg/vfcash", 
    instapay: "https://www.instapay.eg/pay"     
  };

  const handleConfirm = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push('/waiting-state');
    }, 800);
  };

  return (
    <div className="w-full max-w-2xl space-y-8 relative z-10 mx-auto">
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
        <h2 className="text-xl font-black text-white mb-6">Order Summary</h2>
        
        {/* Updated Plan Detail Row */}
        <div className="flex justify-between items-center py-6 px-4 bg-white/5 rounded-3xl border border-slate-800/50 mb-4">
          <div>
            <p className="text-orange-500 text-[10px] font-black uppercase tracking-widest mb-1">Current Plan</p>
            <p className="text-white text-xl font-black">{planName}</p>
            <p className="text-slate-500 text-xs">Complete payment to activate workspace</p>
          </div>
          <div className="text-right">
            <p className="text-white text-2xl font-black">{formattedPlanPrice}</p>
            <CheckCircle2 className="text-orange-500 ml-auto mt-1" size={20} />
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-10">
          <label className="text-xs font-black uppercase tracking-widest text-slate-500 block mb-4 ml-1">Select Payment Method</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setPaymentMethod('cash')}
              className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 cursor-pointer ${
                paymentMethod === 'cash' ? 'border-orange-600 bg-orange-600/5' : 'border-slate-800 bg-slate-950'
              }`}
            >
              <Phone className={paymentMethod === 'cash' ? 'text-orange-500' : 'text-slate-500'} />
              <span className={`font-bold ${paymentMethod === 'cash' ? 'text-white' : 'text-slate-500'}`}>Vodafone Cash</span>
            </button>

            <button
              onClick={() => setPaymentMethod('instapay')}
              className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 cursor-pointer ${
                paymentMethod === 'instapay' ? 'border-orange-600 bg-orange-600/5' : 'border-slate-800 bg-slate-950'
              }`}
            >
              <Wallet className={paymentMethod === 'instapay' ? 'text-orange-500' : 'text-slate-500'} />
              <span className={`font-bold ${paymentMethod === 'instapay' ? 'text-white' : 'text-slate-500'}`}>InstaPay</span>
            </button>
          </div>
        </div>

        {/* Payment Instructions / External Links */}
        <div className="mt-8 p-5 bg-orange-600/10 border border-orange-600/20 rounded-3xl">
          <p className="text-orange-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Action Required</p>
          <p className="text-slate-300 text-sm mb-4 leading-relaxed">
            Please transfer <span className="text-white font-bold">{formattedPlanPrice}</span> using the link below. Once done, click confirm to notify our admin team.
          </p>
          <a 
            href={paymentLinks[paymentMethod]} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white text-sm font-bold hover:bg-slate-900 transition-all active:scale-[0.98]"
          >
            Open {paymentMethod === 'cash' ? 'Vodafone Cash' : 'InstaPay'} <ExternalLink size={16} />
          </a>
        </div>

        {/* Updated Totals Section */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex justify-between items-center">
          <span className="text-lg font-black text-white">Total Amount</span>
          <span className="text-3xl font-black text-orange-500 tracking-tight">{formattedPlanPrice}</span>
        </div>

        <button
          onClick={handleConfirm}
          disabled={isLoading}
          className="w-full mt-8 bg-orange-600 text-white font-black py-5 rounded-2xl hover:bg-orange-500 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-orange-900/30 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="animate-spin" size={22} /> : <>Confirm Payment <ArrowRight size={20} /></>}
        </button>
      </div>
    </div>
  );
};

// Default export with Suspense boundary for Next.js searchParams
export default function SubscriptionForm() {
  return (
    <Suspense fallback={<div className="text-white text-center p-10">Loading Order...</div>}>
      <SubscriptionContent />
    </Suspense>
  );
}
