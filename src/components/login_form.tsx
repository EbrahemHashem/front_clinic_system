"use client";

import React, { useState } from "react";
import {
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { API_CONFIG } from "../lib/constants";

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      // Inside LoginForm.tsx -> handleSubmit function
      const data = await response.json();

      if (!response.ok) {
        // Check for the specific "not active" error you mentioned
        if (
          data.error ===
          "Your account is not active. Please activate your account to continue."
        ) {
          localStorage.setItem(
            "dentflow_user",
            JSON.stringify({ email: formData.email }),
          );
          setError("Account not active. Redirecting to verification...");
          setTimeout(() => router.push("/verify"), 1500);
          return;
        }
        throw new Error(data.message || data.error || "Login failed");
      }

      // Save auth data
      localStorage.setItem("dentflow_auth", JSON.stringify(data));
      setSuccess(true);

      setTimeout(() => {
        const user = data.user || {};
        const role = user.role;

        // Superadmin bypasses all clinic/plan/subscription checks
        if (role === "superadmin") {
          window.location.href = "/dashboard";
          return;
        }

        if (role === "owner") {
          const clinic = user.clinic || data.clinic;

          if (!clinic) {
            // No clinic created yet → setup clinic
            window.location.href = "/setup-clinic";
          } else {
            // Let dashboard layout validate subscription from APIs.
            window.location.href = "/dashboard";
          }
        } else {
          window.location.href = "/dashboard";
        }
      }, 1000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md relative z-10">
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-400 font-medium">
            Enter credentials to access your dashboard
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="font-bold">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-xl text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <Loader2 className="w-5 h-5 animate-spin mt-0.5" />
            <span className="font-bold">Login successful! Redirecting...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-orange-500 transition-colors" />
              <input
                type="email"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all placeholder:text-slate-600"
                placeholder="doctor@clinic.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-orange-500 transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-12 text-white focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all placeholder:text-slate-600"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => router.push("/forget")}
              className="text-sm font-bold text-orange-500 hover:text-orange-400 hover:underline transition-colors cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading || success}
            className="w-full bg-orange-600 text-white font-black py-5 rounded-2xl hover:bg-orange-500 transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 shadow-xl shadow-orange-900/20"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                Sign In <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/register")}
            className="text-orange-500 font-bold hover:underline cursor-pointer"
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
