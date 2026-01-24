'use client';

import React, { useState } from 'react';
import { Mail, Loader2, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { API_CONFIG } from '@/lib/constants';

const ForgotPasswordForm: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Constructing the URL with query parameters as per your API photo
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FORGET_PASSWORD}?email=${encodeURIComponent(email)}`;

      const response = await fetch(url, {
        method: 'POST', // Using POST as shown in your screenshot
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to send reset link.');
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-10 rounded-[2.5rem] text-center">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-black text-white mb-4">Check your email</h2>
        <p className="text-slate-400 mb-8">
          We've sent a password reset link to <span className="text-white font-bold">{email}</span>.
        </p>
        <button 
          onClick={() => router.push('/login')}
          className="text-orange-500 font-bold hover:underline cursor-pointer"
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md relative z-10">
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Forgot Password?</h1>
          <p className="text-slate-400 font-medium">No worries! Enter your email and we'll send you a reset link.</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-orange-500 transition-colors" />
              <input
                type="email"
                required
                placeholder="doctor@clinic.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all cursor-text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-600 text-white font-black py-5 rounded-2xl hover:bg-orange-500 transition-all shadow-xl shadow-orange-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group cursor-pointer"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                Send Reset Link
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => router.push('/login')}
            className="text-slate-500 text-sm font-medium hover:text-white transition-colors cursor-pointer"
          >
            Remembered your password? <span className="text-orange-500 font-bold">Sign In</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;