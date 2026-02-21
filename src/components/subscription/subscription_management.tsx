"use client";

import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Loader2,
  AlertCircle,
  Users,
  UserRound,
  Contact2,
  Clock,
  Check,
  Crown,
  Zap,
  ArrowRight,
  RefreshCw,
  CalendarDays,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { API_CONFIG } from "@/lib/constants";
import UpgradePlanModal from "./upgrade_plan_modal";

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

interface SubscriptionInfo {
  id: string;
  plan: Plan;
  status: string;
  start_date: string;
  end_date: string;
}

export default function SubscriptionManagement() {
  const router = useRouter();
  const [isYearly, setIsYearly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);
  const [currentSubscription, setCurrentSubscription] =
    useState<SubscriptionInfo | null>(null);

  // Modal state
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const authData = localStorage.getItem("dentflow_auth");
      if (!authData) {
        router.push("/login");
        return;
      }
      const { access_token } = JSON.parse(authData);

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SUBSCRIPTION}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${access_token}`,
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) throw new Error("Failed to load subscription data");
      const data = await response.json();

      // The API returns plans. If there's subscription info embedded, extract it.
      if (Array.isArray(data)) {
        const sortedPlans = data.sort(
          (a: Plan, b: Plan) =>
            parseFloat(a.price_monthly) - parseFloat(b.price_monthly),
        );
        setAvailablePlans(sortedPlans);
      } else if (data.plans) {
        const sortedPlans = data.plans.sort(
          (a: Plan, b: Plan) =>
            parseFloat(a.price_monthly) - parseFloat(b.price_monthly),
        );
        setAvailablePlans(sortedPlans);
        if (data.current_subscription) {
          setCurrentSubscription(data.current_subscription);
        }
      }

      // Try to find current plan from auth data
      const parsed = JSON.parse(authData);
      if (parsed.user?.clinic?.subscription) {
        setCurrentSubscription(parsed.user.clinic.subscription);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPlan = (plan: Plan) => {
    // Don't allow selecting the current plan
    if (currentSubscription && currentSubscription.plan?.id === plan.id) return;
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const getCurrentPlanObj = (): Plan | null => {
    if (!currentSubscription?.plan) return null;
    return (
      availablePlans.find((p) => p.id === currentSubscription.plan.id) ||
      currentSubscription.plan
    );
  };

  const isCurrentPlan = (planId: string): boolean => {
    return currentSubscription?.plan?.id === planId;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "pending":
        return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      case "expired":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      case "trial":
        return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      default:
        return "text-slate-400 bg-slate-400/10 border-slate-400/20";
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-4" />
        <p className="text-slate-400 font-bold">Loading subscription data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <CreditCard className="text-orange-500" size={32} /> Subscription
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Manage your plan and billing preferences.
          </p>
        </div>

        <button
          onClick={fetchSubscriptionData}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-slate-400 bg-slate-900 border border-slate-800 hover:border-orange-500 hover:text-white transition-all cursor-pointer active:scale-95"
        >
          <RefreshCw size={18} /> Refresh
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl flex items-center gap-3">
          <AlertCircle className="shrink-0" />
          <p className="font-bold text-sm">{error}</p>
        </div>
      )}

      {/* Current Subscription Card */}
      {currentSubscription && (
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-orange-600/20 rounded-2xl flex items-center justify-center">
                  <Crown className="text-orange-500" size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
                    Current Plan
                  </p>
                  <h3 className="text-2xl font-black text-white">
                    {currentSubscription.plan?.name || "Unknown Plan"}
                  </h3>
                </div>
              </div>

              <span
                className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${getStatusColor(currentSubscription.status)}`}
              >
                {currentSubscription.status || "Unknown"}
              </span>
            </div>

            {/* Dates & Usage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-950/50 rounded-2xl p-5 border border-slate-800/50">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase mb-2">
                  <CalendarDays size={14} /> Start Date
                </div>
                <p className="text-white font-black text-lg">
                  {formatDate(currentSubscription.start_date)}
                </p>
              </div>
              <div className="bg-slate-950/50 rounded-2xl p-5 border border-slate-800/50">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase mb-2">
                  <Clock size={14} /> End Date
                </div>
                <p className="text-white font-black text-lg">
                  {formatDate(currentSubscription.end_date)}
                </p>
              </div>
              {currentSubscription.plan && (
                <>
                  <div className="bg-slate-950/50 rounded-2xl p-5 border border-slate-800/50">
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase mb-2">
                      <UserRound size={14} /> Doctors Limit
                    </div>
                    <p className="text-white font-black text-lg">
                      {currentSubscription.plan.max_doctors}
                    </p>
                  </div>
                  <div className="bg-slate-950/50 rounded-2xl p-5 border border-slate-800/50">
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase mb-2">
                      <Users size={14} /> Assistants Limit
                    </div>
                    <p className="text-white font-black text-lg">
                      {currentSubscription.plan.max_assistants}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Billing Toggle */}
      <div className="flex flex-col items-center gap-4">
        <h3 className="text-xl font-black text-white">
          {currentSubscription ? "Change Your Plan" : "Choose a Plan"}
        </h3>
        <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-2xl flex items-center gap-2">
          <button
            onClick={() => setIsYearly(false)}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${!isYearly ? "bg-white text-black" : "text-slate-500 hover:text-slate-300"}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${isYearly ? "bg-white text-black" : "text-slate-500 hover:text-slate-300"}`}
          >
            Yearly
            <span className="text-[10px] bg-green-500/20 text-green-500 px-2 py-0.5 rounded-md uppercase">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {availablePlans.map((plan) => {
          const isAdvanced = plan.name.toLowerCase().includes("advanced");
          const price = isYearly ? plan.price_yearly : plan.price_monthly;
          const isFree = parseFloat(price) === 0;
          const isCurrent = isCurrentPlan(plan.id);

          return (
            <div
              key={plan.id}
              className={`relative p-8 rounded-[2.5rem] border transition-all duration-500 ${
                isCurrent
                  ? "border-emerald-500/50 bg-emerald-500/[0.03] ring-1 ring-emerald-500/20"
                  : isAdvanced
                    ? "border-orange-500 bg-orange-500/[0.03] shadow-[0_0_50px_rgba(234,88,12,0.1)]"
                    : "border-slate-800 bg-slate-900/40 hover:border-slate-700"
              }`}
            >
              {/* Badges */}
              {isCurrent && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-black uppercase px-6 py-1.5 rounded-full tracking-widest shadow-lg flex items-center gap-1.5">
                  <Check size={12} /> Current Plan
                </div>
              )}
              {isAdvanced && !isCurrent && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-[10px] font-black uppercase px-6 py-1.5 rounded-full tracking-widest shadow-lg">
                  Recommended
                </div>
              )}

              <h3 className="text-2xl font-black text-white mb-2">
                {plan.name}
              </h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed line-clamp-2">
                {plan.description}
              </p>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-white">
                    ${parseInt(price)}
                  </span>
                  <span className="text-slate-500 font-bold">
                    {isFree ? "/14 days" : isYearly ? "/yr" : "/mo"}
                  </span>
                </div>
                {isFree ? (
                  <p className="text-blue-400 text-xs font-bold mt-2 flex items-center gap-1">
                    <Clock size={12} /> Limited time full access
                  </p>
                ) : (
                  isYearly && (
                    <p className="text-orange-500 text-xs font-bold mt-2">
                      Billed annually (${plan.price_monthly}/mo)
                    </p>
                  )
                )}
              </div>

              {/* Features */}
              <div className="space-y-4 mb-10 p-5 bg-slate-950/50 rounded-3xl border border-slate-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-400 text-sm font-bold">
                    <UserRound size={18} className="text-orange-500" /> Doctors
                  </div>
                  <span className="text-white font-black">
                    {plan.max_doctors}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-400 text-sm font-bold">
                    <Users size={18} className="text-orange-500" /> Assistants
                  </div>
                  <span className="text-white font-black">
                    {plan.max_assistants}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-400 text-sm font-bold">
                    <Contact2 size={18} className="text-orange-500" /> Patients
                  </div>
                  <span className="text-white font-black">
                    {plan.max_patients}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleSelectPlan(plan)}
                disabled={isCurrent}
                className={`w-full py-5 rounded-2xl font-black transition-all cursor-pointer flex items-center justify-center gap-3 ${
                  isCurrent
                    ? "bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 cursor-default"
                    : isAdvanced
                      ? "bg-orange-600 text-white hover:bg-orange-500 hover:scale-[1.02]"
                      : "bg-white text-black hover:bg-slate-200"
                } disabled:cursor-default`}
              >
                {isCurrent ? (
                  <>
                    <Check size={18} /> Active Plan
                  </>
                ) : isFree ? (
                  "Start 14-Day Free Trial"
                ) : (
                  <>
                    <Zap size={18} />{" "}
                    {parseFloat(price) >
                    parseFloat(
                      isYearly
                        ? getCurrentPlanObj()?.price_yearly || "0"
                        : getCurrentPlanObj()?.price_monthly || "0",
                    )
                      ? "Upgrade"
                      : "Switch"}{" "}
                    to {plan.name}
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Upgrade Modal */}
      <UpgradePlanModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPlan(null);
        }}
        selectedPlan={selectedPlan}
        currentPlan={getCurrentPlanObj()}
        isYearly={isYearly}
      />
    </div>
  );
}
