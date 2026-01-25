'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { API_CONFIG } from '@/lib/constants';

const VerifyForm = () => {
  const router = useRouter();
  const [authCode, setAuthCode] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('dentflow_user');
    if (data) {
      try {
        const user = JSON.parse(data);
        
        // CHECK: If user is already verified, push them to setup immediately
        if (user.isVerified) {
          router.replace('/setup-clinic');
          return;
        }
        
        setEmail(user.email || '');
      } catch (e) {
        console.error("Error parsing user for verification");
      }
    } else {
      router.push('/register');
    }
  }, [router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const params = new URLSearchParams({
        email: email,
        auth_code: authCode
      });

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.VERIFY_CODE}?${params.toString()}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Invalid verification code');
      }

      // SUCCESS: Update localStorage to "lock" this stage
      const currentUserData = JSON.parse(localStorage.getItem('dentflow_user') || '{}');
      localStorage.setItem('dentflow_user', JSON.stringify({
        ...currentUserData,
        isVerified: true // This flag prevents coming back to this page
      }));

      setMessage("Account activated successfully!");
      
      // Use replace instead of push so they can't click "back" to the form
      setTimeout(() => router.replace('/setup-clinic'), 1500);
    } catch (err: any) {
      setError(err.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError(null);
    setMessage(null);
    try {
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RESEND_CODE}?email=${encodeURIComponent(email)}`;
      const response = await fetch(url, { 
        method: 'POST',
        headers: { 'Accept': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to resend code');
      setMessage("New code sent successfully!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl relative z-10 text-center">
      <div className="w-16 h-16 bg-orange-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <ShieldCheck className="w-8 h-8 text-orange-600" />
      </div>
      <h1 className="text-3xl font-black text-white mb-2">Verify Identity</h1>
      <p className="text-slate-400 mb-8">Enter the code sent to <span className="text-orange-500 font-bold">{email}</span></p>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-xs font-bold animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}
      
      {message && (
        <div className="mb-6 bg-green-500/10 border border-green-500/20 text-green-500 p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={14} /> {message}
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-6">
        <input
          type="text"
          maxLength={6}
          placeholder="000000"
          className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 text-center text-2xl tracking-[0.5em] font-bold text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all placeholder:tracking-normal placeholder:text-slate-700"
          value={authCode}
          onChange={(e) => setAuthCode(e.target.value.replace(/\D/g, ''))}
        />
        <button 
          type="submit" 
          disabled={isLoading || authCode.length < 4} 
          className="w-full bg-orange-600 text-white font-black py-4 rounded-2xl hover:bg-orange-500 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : "Verify Account"}
        </button>
      </form>

      <button 
        onClick={handleResend} 
        disabled={resending} 
        className="mt-6 text-slate-500 text-sm font-bold hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
      >
        {resending ? <Loader2 size={14} className="animate-spin" /> : "Resend Code"}
      </button>

      <button 
        onClick={() => router.push('/login')} 
        className="flex items-center justify-center gap-2 mt-8 w-full text-slate-400 hover:text-orange-500 transition-colors text-sm font-bold cursor-pointer"
      >
        <ArrowLeft size={16} /> Back to Login
      </button>
    </div>
  );
};

export default VerifyForm;