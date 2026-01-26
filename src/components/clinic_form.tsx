'use client';

import React, { useState } from 'react';
import { Building2, MapPin, Phone, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { API_CONFIG } from '../lib/constants';

const ClinicForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: ''
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setFormData({ ...formData, phone: value });
    }
  };

  // Inside ClinicForm.tsx -> handleSubmit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Pull the token from storage
      const authData = localStorage.getItem('dentflow_auth');
      if (!authData) {
        router.push('/login');
        return;
      }
      const { access_token } = JSON.parse(authData);

      // 2. Send the request with the Token
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CLINIC}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}` // The backend requires this!
        },
        body: JSON.stringify({
          name: formData.name,
          address: formData.address,
          phone_number: formData.phone
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to create clinic');

      // 3. Update Local Storage so the app knows the owner now HAS a clinic
      const updatedAuth = JSON.parse(authData);
      updatedAuth.user.clinic = data; // Store the new clinic info
      localStorage.setItem('dentflow_auth', JSON.stringify(updatedAuth));

      // 4. Move to the next step
      router.push('/choose-plan');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full max-w-lg bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl relative z-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Setup Your Clinic</h1>
        <p className="text-slate-400 font-medium">Initialize your workspace to get started.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-xs font-bold animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Clinic Name</label>
          <div className="relative group">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-orange-500 transition-colors" />
            <input
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 text-white placeholder:text-slate-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
              placeholder="e.g. DentFlow Dental Center"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Address</label>
          <div className="relative group">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-orange-500 transition-colors" />
            <input
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 text-white placeholder:text-slate-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
              placeholder="Street, City, Building"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Clinic Phone Number</label>
          <div className="relative group">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-orange-500 transition-colors" />
            <input
              required
              type="tel"
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 text-white placeholder:text-slate-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
              placeholder="0123456789"
              value={formData.phone}
              onChange={handlePhoneChange}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-orange-600 text-white font-black py-5 rounded-2xl hover:bg-orange-500 transition-all shadow-xl shadow-orange-900/20 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
            <>
              Finalize Setup
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ClinicForm;