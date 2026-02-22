"use client";

import React, { useState } from "react";
import {
  X,
  ArrowRight,
  Loader2,
  Zap,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { API_CONFIG } from "@/lib/constants";

interface Plan {
  id: string;
  name: string;
  description: string;
  price_monthly: string;
  price_yearly: string;
  max_doctors: number;
  max_assistants: number;
  max_patients: number;
}

interface UpgradePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: Plan | null;
  currentPlan: Plan | null;
  isYearly: boolean;
}

const egpFormatter = new Intl.NumberFormat("en-EG", {
  style: "currency",
  currency: "EGP",
  currencyDisplay: "narrowSymbol",
  maximumFractionDigits: 0,
});

export default function UpgradePlanModal({
  isOpen,
  onClose,
  selectedPlan,
  currentPlan,
  isYearly,
}: UpgradePlanModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !selectedPlan) return null;

  const selectedPrice = isYearly
    ? selectedPlan.price_yearly
    : selectedPlan.price_monthly;
  const currentPrice = currentPlan
    ? isYearly
      ? currentPlan.price_yearly
      : currentPlan.price_monthly
    : "0";
  const isUpgrade = parseFloat(selectedPrice) > parseFloat(currentPrice);
  const isFree = parseFloat(selectedPrice) === 0;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const authString = localStorage.getItem("dentflow_auth");
      if (!authString)
        throw new Error("Authentication data not found. Please login again.");

      const authData = JSON.parse(authString);
      const access_token = authData.access_token;
      const clinicId = authData.user?.clinic?.id || authData.clinic?.id;

      if (!clinicId)
        throw new Error(
          "Clinic ID not found. Please complete clinic setup first.",
        );

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SUBSCRIPTION}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify({
            clinic_id: clinicId,
            subscription_plan_id: selectedPlan.id,
            amount: parseFloat(selectedPrice),
          }),
        },
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.error || responseData.message || "Failed to change plan",
        );
      }

      router.push("/waiting-state");
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isUpgrade ? "bg-orange-600/20" : "bg-blue-600/20"}`}
          >
            {isUpgrade ? (
              <TrendingUp className="text-orange-500" size={24} />
            ) : (
              <TrendingDown className="text-blue-500" size={24} />
            )}
          </div>
          <div>
            <h3 className="text-xl font-black text-white">
              {isUpgrade ? "Upgrade Plan" : "Change Plan"}
            </h3>
            <p className="text-slate-500 text-sm font-medium">
              {isUpgrade
                ? "Unlock more features and capacity"
                : "Switch to a different plan"}
            </p>
          </div>
        </div>

        {/* Plan Comparison */}
        <div className="space-y-3 mb-6">
          {/* Current Plan */}
          {currentPlan && (
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
                  Current Plan
                </p>
                <p className="text-white font-bold">{currentPlan.name}</p>
              </div>
              <p className="text-slate-400 font-black text-lg">
                {egpFormatter.format(parseFloat(currentPrice))}
                <span className="text-xs text-slate-600 font-bold">
                  /{isYearly ? "yr" : "mo"}
                </span>
              </p>
            </div>
          )}

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
              <ArrowRight size={14} className="text-orange-500 rotate-90" />
            </div>
          </div>

          {/* New Plan */}
          <div className="flex items-center justify-between p-4 bg-orange-600/10 rounded-2xl border border-orange-600/30">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-1">
                New Plan
              </p>
              <p className="text-white font-bold">{selectedPlan.name}</p>
            </div>
            <p className="text-orange-500 font-black text-lg">
              {isFree ? "Free" : egpFormatter.format(parseFloat(selectedPrice))}
              {!isFree && (
                <span className="text-xs text-orange-700 font-bold">
                  /{isYearly ? "yr" : "mo"}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Features Summary */}
        <div className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800/50 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">
            What You Get
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-black text-white">
                {selectedPlan.max_doctors}
              </p>
              <p className="text-[10px] text-slate-500 font-bold uppercase">
                Doctors
              </p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">
                {selectedPlan.max_assistants}
              </p>
              <p className="text-[10px] text-slate-500 font-bold uppercase">
                Assistants
              </p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">
                {selectedPlan.max_patients}
              </p>
              <p className="text-[10px] text-slate-500 font-bold uppercase">
                Patients
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-bold">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl font-bold text-slate-400 bg-slate-800 hover:bg-slate-700 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex-1 py-4 rounded-2xl font-bold text-white bg-orange-600 hover:bg-orange-500 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-orange-900/30 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Zap size={18} />
                {isUpgrade ? "Upgrade Now" : "Switch Plan"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
