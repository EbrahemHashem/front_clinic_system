'use client';

import React from 'react';
import { Clock, RefreshCw, LogOut, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const WaitingState = () => {
  const router = useRouter();

  // Replace with your actual support number and clinic name
  const SUPPORT_NUMBER = "201097025711"; 
  const WHATSAPP_MESSAGE = encodeURIComponent("Hello DentFlow Support, I'm checking on my clinic's subscription approval status.");
  const WHATSAPP_URL = `https://wa.me/${SUPPORT_NUMBER}?text=${WHATSAPP_MESSAGE}`;

  return (
    <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-10 rounded-[2.5rem] text-center shadow-2xl relative z-10">
      <div className="w-20 h-20 bg-orange-600/10 rounded-full flex items-center justify-center mx-auto mb-8 relative">
        <Clock className="w-10 h-10 text-orange-500" />
        <div className="absolute inset-0 border-2 border-orange-500/20 rounded-full animate-ping"></div>
      </div>

      <h1 className="text-3xl font-black text-white mb-4">Review in Progress</h1>
      <p className="text-slate-400 leading-relaxed mb-8">
        Your subscription request has been received. Our team is currently verifying your payment. This usually takes <span className="text-white font-bold">1-2 hours</span>.
      </p>

      <div className="space-y-4">
        {/* Check Status Button */}
        <button 
          onClick={() => window.location.reload()}
          className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RefreshCw size={18} /> Check Status
        </button>

        {/* WhatsApp Support Button */}
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
            onClick={() => router.push('/login')}
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