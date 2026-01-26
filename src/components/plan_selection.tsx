'use client';

import React, { useState, useEffect } from 'react';
import { Check, Loader2, AlertCircle, Users, UserRound, Contact2, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { API_CONFIG } from '../lib/constants';

const PlanSelection = () => {
  const router = useRouter();
  const [isYearly, setIsYearly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [availablePlans, setAvailablePlans] = useState<any[]>([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const authData = localStorage.getItem('dentflow_auth');
        if (!authData) {
          router.push('/login');
          return;
        }
        const { access_token } = JSON.parse(authData);

        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SUBSCRIPTION}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Failed to load subscription plans');
        const data = await response.json();
        
        const sortedPlans = data.sort((a: any, b: any) => parseFloat(a.price_monthly) - parseFloat(b.price_monthly));
        setAvailablePlans(sortedPlans);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, [router]);

  const handleSelectPlan = async (planId: string, amount: string) => {
    setIsSubmitting(planId);
    setError(null);

    try {
      const authString = localStorage.getItem('dentflow_auth');
      if (!authString) throw new Error("Authentication data not found. Please login again.");
      
      const authData = JSON.parse(authString);
      const access_token = authData.access_token;
      
      const clinicId = authData.user?.clinic?.id || authData.clinic?.id;

      if (!clinicId) throw new Error("Clinic ID not found. Please complete clinic setup first.");

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SUBSCRIPTION}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
        body: JSON.stringify({
          clinic_id: clinicId,
          subscription_plan_id: planId,
          amount: parseFloat(amount)
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || responseData.message || 'Failed to activate plan');
      }

      // --- LOGIC UPDATED HERE ---
      // Find the plan object to get its name
      const selectedPlanObj = availablePlans.find(p => p.id === planId);
      const planName = encodeURIComponent(selectedPlanObj?.name || 'Plan');
      
      // Redirect to subscription page with Name and Price
      router.push(`/subscription?plan=${planName}&amount=${amount}`);
      // --------------------------

    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-4" />
        <p className="text-slate-400 font-bold">Fetching latest plans...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      {error && (
        <div className="mb-8 max-w-2xl mx-auto bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl flex items-center gap-3">
          <AlertCircle className="shrink-0" />
          <p className="font-bold text-sm">{error}</p>
        </div>
      )}

      <div className="flex flex-col items-center mb-16">
        <h2 className="text-4xl font-black text-white mb-6 text-center tracking-tight">Select Your Plan</h2>
        <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-2xl flex items-center gap-2">
          <button
            onClick={() => setIsYearly(false)}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${!isYearly ? 'bg-white text-black' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${isYearly ? 'bg-white text-black' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Yearly
            <span className="text-[10px] bg-green-500/20 text-green-500 px-2 py-0.5 rounded-md uppercase">Save 20%</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {availablePlans.map((plan) => {
          const isAdvanced = plan.name.toLowerCase().includes('advanced');
          const price = isYearly ? plan.price_yearly : plan.price_monthly;
          const isFree = parseFloat(price) === 0;

          return (
            <div 
              key={plan.id} 
              className={`relative p-8 rounded-[2.5rem] border transition-all duration-500 ${
                isAdvanced 
                  ? 'border-orange-500 bg-orange-500/[0.03] shadow-[0_0_50px_rgba(234,88,12,0.1)] scale-105 z-10' 
                  : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
              }`}
            >
              {isAdvanced && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-[10px] font-black uppercase px-6 py-1.5 rounded-full tracking-widest shadow-lg">
                  Recommended
                </div>
              )}
              
              <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed line-clamp-2">{plan.description}</p>
              
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-white">${parseInt(price)}</span>
                  <span className="text-slate-500 font-bold">
                    {isFree ? '/14 days' : (isYearly ? '/yr' : '/mo')}
                  </span>
                </div>
                {isFree ? (
                  <p className="text-blue-400 text-xs font-bold mt-2 flex items-center gap-1">
                    <Clock size={12} /> Limited time full access
                  </p>
                ) : isYearly && (
                  <p className="text-orange-500 text-xs font-bold mt-2">Billed annually (${plan.price_monthly}/mo)</p>
                )}
              </div>

              <div className="space-y-4 mb-10 p-5 bg-slate-950/50 rounded-3xl border border-slate-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-400 text-sm font-bold">
                    <UserRound size={18} className="text-orange-500" /> Doctors
                  </div>
                  <span className="text-white font-black">{plan.max_doctors}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-400 text-sm font-bold">
                    <Users size={18} className="text-orange-500" /> Assistants
                  </div>
                  <span className="text-white font-black">{plan.max_assistants}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-400 text-sm font-bold">
                    <Contact2 size={18} className="text-orange-500" /> Patients
                  </div>
                  <span className="text-white font-black">{plan.max_patients}</span>
                </div>
              </div>

              <button 
                onClick={() => handleSelectPlan(plan.id, price)}
                disabled={isSubmitting !== null}
                className={`w-full py-5 rounded-2xl font-black transition-all cursor-pointer flex items-center justify-center gap-3 ${
                  isAdvanced 
                    ? 'bg-orange-600 text-white hover:bg-orange-500 hover:scale-[1.02]' 
                    : 'bg-white text-black hover:bg-slate-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSubmitting === plan.id ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  isFree ? "Start 14-Day Free Trial" : "Activate Plan"
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlanSelection;