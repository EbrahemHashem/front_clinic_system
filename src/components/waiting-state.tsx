'use client';

import React, { useEffect, useState } from 'react';
import { Clock, RefreshCw, LogOut, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { API_CONFIG } from '../lib/constants';

const WaitingState = () => {
  const router = useRouter();
  const [lastChecked, setLastChecked] = useState(new Date().toLocaleTimeString());

  const SUPPORT_NUMBER = "201097025711"; 
  const WHATSAPP_MESSAGE = encodeURIComponent("Hello DentFlow Support, I'm checking on my clinic's subscription approval status.");
  const WHATSAPP_URL = `https://wa.me/${SUPPORT_NUMBER}?text=${WHATSAPP_MESSAGE}`;

  const checkStatus = async () => {
    setLastChecked(new Date().toLocaleTimeString());
    try {
      const authData = JSON.parse(localStorage.getItem('dentflow_auth') || '{}');
      if (!authData.access_token) return;

      const response = await fetch(`${API_CONFIG.BASE_URL}/users/me/`, {
        headers: { 'Authorization': `Bearer ${authData.access_token}` }
      });
      const data = await response.json();

      // Adjust 'is_active' or 'subscription_status' based on your real API key
      if (data.subscription?.is_active || data.is_approved) {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error("Polling error", err);
    }
  };

  useEffect(() => {
    const interval = setInterval(checkStatus, 20000); // Auto-check every 20s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-10 rounded-[2.5rem] text-center shadow-2xl relative z-10 mx-auto">
      <div className="w-20 h-20 bg-orange-600/10 rounded-full flex items-center justify-center mx-auto mb-8 relative">
        <Clock className="w-10 h-10 text-orange-500" />
        <div className="absolute inset-0 border-2 border-orange-500/20 rounded-full animate-ping"></div>
      </div>

      <h1 className="text-3xl font-black text-white mb-4 leading-tight">Review in Progress</h1>
      <p className="text-slate-400 leading-relaxed mb-8 text-sm">
        Your request has been received. Our team is verifying your payment. This usually takes <span className="text-white font-bold">1-2 hours</span>.
      </p>

      <div className="space-y-4">
        <button 
          onClick={checkStatus}
          className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-slate-200 transition-all flex flex-col items-center justify-center cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <RefreshCw size={18} className="group-active:rotate-180 transition-transform duration-500" /> 
            <span>Check Status Now</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Last updated: {lastChecked}</span>
        </button>

        <a 
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 font-bold py-4 rounded-2xl hover:bg-[#25D366]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <MessageCircle size={18} /> Contact Support
        </a>
        
        <div className="pt-4 border-t border-slate-800/50">
          <button 
            onClick={() => {
              localStorage.removeItem('dentflow_auth');
              router.push('/login');
            }}
            className="flex items-center justify-center gap-2 w-full text-slate-500 hover:text-orange-500 transition-colors text-sm font-bold cursor-pointer"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaitingState;