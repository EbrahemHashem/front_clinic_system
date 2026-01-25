'use client';

import React, { useState } from 'react';
import { CreditCard, Wallet, CheckCircle2, ArrowRight, Loader2, Banknote } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SubscriptionForm = () => {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'instapay'>('cash');
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    // Logic: Send payment method to backend
    setTimeout(() => {
      setIsLoading(false);
      router.push('/waiting-state');
    }, 1500);
  };

  return (
    <div className="w-full max-w-2xl space-y-8 relative z-10">
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
        <h2 className="text-xl font-black text-white mb-6">Order Summary</h2>
        
        {/* Plan Detail Row */}
        <div className="flex justify-between items-center py-4 border-b border-slate-800">
          <div>
            <p className="text-white font-bold">Advanced Plan</p>
            <p className="text-slate-500 text-xs">Monthly Billing Cycle</p>
          </div>
          <p className="text-white font-black">$99.00</p>
        </div>

        {/* Payment Methods */}
        <div className="mt-10">
          <label className="text-xs font-black uppercase tracking-widest text-slate-500 block mb-4">Select Payment Method</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setPaymentMethod('cash')}
              className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 cursor-pointer ${
                paymentMethod === 'cash' ? 'border-orange-600 bg-orange-600/5' : 'border-slate-800 bg-slate-950'
              }`}
            >
              <Banknote className={paymentMethod === 'cash' ? 'text-orange-500' : 'text-slate-500'} />
              <span className={`font-bold ${paymentMethod === 'cash' ? 'text-white' : 'text-slate-500'}`}>Cash</span>
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

        {/* Totals */}
        <div className="mt-10 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Subtotal</span>
            <span className="text-white">$99.00</span>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-slate-800">
            <span className="text-lg font-black text-white">Total Due Today</span>
            <span className="text-2xl font-black text-orange-500">$99.00</span>
          </div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={isLoading}
          className="w-full mt-8 bg-orange-600 text-white font-black py-5 rounded-2xl hover:bg-orange-500 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-orange-900/20"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <>Confirm Payment <ArrowRight size={18} /></>}
        </button>
      </div>
    </div>
  );
};

export default SubscriptionForm;