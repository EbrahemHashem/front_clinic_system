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
    const user = localStorage.getItem('dentflow_user');
    if (user) {
      setEmail(JSON.parse(user).email);
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
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.VERIFY_CODE}`, {
        method: 'GET', // As per API screenshot
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, auth_code: authCode }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Invalid code');

      setMessage("Account activated successfully!");
      setTimeout(() => router.push('/choose-plan'), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError(null);
    try {
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RESEND_CODE}?email=${encodeURIComponent(email)}`;
      const response = await fetch(url, { method: 'POST' }); // As per API screenshot
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || 'Failed to resend');
      setMessage("Auth Code Sent successfully!");
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

      {error && <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-xs font-bold">{error}</div>}
      {message && <div className="mb-6 bg-green-500/10 border border-green-500/20 text-green-500 p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2"><CheckCircle2 size={14} /> {message}</div>}

      <form onSubmit={handleVerify} className="space-y-6">
        <input
          type="text"
          maxLength={6}
          placeholder="000000"
          className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 text-center text-2xl tracking-[0.5em] font-bold text-white focus:border-orange-500 outline-none transition-all"
          value={authCode}
          onChange={(e) => setAuthCode(e.target.value.replace(/\D/g, ''))}
        />
        <button type="submit" disabled={isLoading || authCode.length < 4} className="w-full bg-orange-600 text-white font-black py-4 rounded-2xl hover:bg-orange-500 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
          {isLoading ? <Loader2 className="animate-spin" /> : "Verify Account"}
        </button>
      </form>

      <button onClick={handleResend} disabled={resending} className="mt-6 text-slate-500 text-sm font-bold hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-2 mx-auto disabled:opacity-50">
        {resending ? <Loader2 size={14} className="animate-spin" /> : "Resend Code"}
      </button>

      <button onClick={() => router.push('/login')} className="flex items-center justify-center gap-2 mt-8 w-full text-slate-400 hover:text-orange-500 transition-colors text-sm font-bold cursor-pointer">
        <ArrowLeft size={16} /> Back to Login
      </button>
    </div>
  );
};

export default VerifyForm;