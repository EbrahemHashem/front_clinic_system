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
    // Safely retrieve user email from storage
    const user = localStorage.getItem('dentflow_user'); // Note: Make sure this key matches your login logic ('dentflow_auth' vs 'dentflow_user')
    if (user) {
      try {
        const parsed = JSON.parse(user);
        // Handle if stored as raw user object or auth object
        setEmail(parsed.email || parsed.user?.email || '');
      } catch (e) {
        console.error("Error parsing user for verification");
      }
    } else {
      // Optional: Redirect if no email is found, or allow manual entry
      // router.push('/register');
    }
  }, [router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      // FIX: Use URLSearchParams to create the query string
      const params = new URLSearchParams({
        email: email,
        auth_code: authCode
      });

      // FIX: Append params to URL and remove 'body'
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.VERIFY_CODE}?${params.toString()}`, {
        method: 'GET',
        headers: { 
          'Accept': 'application/json',
          // 'Content-Type': 'application/json' is not needed for GET without body
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Invalid verification code');
      }

      setMessage("Account activated successfully!");
      
      // Update local storage to reflect verified status if needed
      // const authData = localStorage.getItem('dentflow_auth');
      // if (authData) { ...update verified status... }

      setTimeout(() => router.push('/choose-plan'), 1500);
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
      // Resend usually keeps query param logic or switches to POST body depending on backend
      // Keeping it as query param per your previous pattern
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RESEND_CODE}?email=${encodeURIComponent(email)}`;
      
      const response = await fetch(url, { 
        method: 'POST',
        headers: { 'Accept': 'application/json' }
      });
      
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || 'Failed to resend code');
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
          className="w-full bg-orange-600 text-white font-black py-4 rounded-2xl hover:bg-orange-500 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-900/20"
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