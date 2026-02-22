"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { API_CONFIG } from "@/lib/constants";
import { CreditCard, Loader2, PencilLine, RefreshCcw, Save } from "lucide-react";

interface SubscriptionPlan {
  id: string;
  name: string;
  price_monthly: string;
  price_yearly: string;
  max_doctors: number;
  max_assistants: number;
  max_patients: number;
  description: string;
  is_active: boolean;
}

interface SubscriptionRequest {
  id: string;
  plan_name: string;
  clinic_name: string;
  created_at: string;
  amount: string;
  approved: boolean;
}

interface PlanFormState {
  name: string;
  price_monthly: string;
  price_yearly: string;
  max_doctors: string;
  max_assistants: string;
  max_patients: string;
  description: string;
  is_active: boolean;
}

const emptyPlanForm: PlanFormState = {
  name: "",
  price_monthly: "",
  price_yearly: "",
  max_doctors: "",
  max_assistants: "",
  max_patients: "",
  description: "",
  is_active: true,
};

export default function PaymentsPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [requests, setRequests] = useState<SubscriptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingPlan, setSubmittingPlan] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [planForm, setPlanForm] = useState<PlanFormState>(emptyPlanForm);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  const [activatingId, setActivatingId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0] ?? "",
  );
  const [renewType, setRenewType] = useState<"free_trial" | "monthly" | "yearly">("free_trial");

  const auth = useMemo(
    () => JSON.parse(localStorage.getItem("dentflow_auth") || "{}"),
    [],
  );

  const loadPlans = useCallback(async () => {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SUBSCRIPTION_PLANS}`,
      {
        headers: { Authorization: `Bearer ${auth.access_token}` },
      },
    );
    if (!response.ok) {
      throw new Error("Failed to load plans");
    }
    const data = await response.json();
    setPlans(Array.isArray(data) ? data : []);
  }, [auth.access_token]);

  const loadRequests = useCallback(async () => {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SUBSCRIPTION_REQUESTS}`,
      {
        headers: { Authorization: `Bearer ${auth.access_token}` },
      },
    );
    if (!response.ok) {
      throw new Error("Failed to load requests");
    }
    const data = await response.json();
    setRequests(Array.isArray(data) ? data : []);
  }, [auth.access_token]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([loadPlans(), loadRequests()]);
    } catch (error) {
      console.error(error);
      setPlans([]);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [loadPlans, loadRequests]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const loadPlanDetails = async (planId: string) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SUBSCRIPTION_PLANS}${planId}`,
        {
          headers: { Authorization: `Bearer ${auth.access_token}` },
        },
      );
      if (!response.ok) {
        throw new Error("Failed to retrieve plan details");
      }
      const data = (await response.json()) as SubscriptionPlan;
      setSelectedPlan(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load plan details");
    }
  };

  const submitPlan = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmittingPlan(true);
    try {
      const payload: Record<string, string | number> = {
        name: planForm.name,
        price_monthly: Number(planForm.price_monthly),
        price_yearly: Number(planForm.price_yearly),
        max_doctors: Number(planForm.max_doctors),
        max_assistants: Number(planForm.max_assistants),
        max_patients: Number(planForm.max_patients),
        description: planForm.description,
        is_active: planForm.is_active,
      };

      if (editingPlanId) {
        payload.subscription_plan_id = editingPlanId;
      }

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SUBSCRIPTION_PLANS}`,
        {
          method: editingPlanId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.access_token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to save plan");
      }

      setPlanForm(emptyPlanForm);
      setEditingPlanId(null);
      await loadPlans();
    } catch (error) {
      console.error(error);
      alert("Failed to save subscription plan.");
    } finally {
      setSubmittingPlan(false);
    }
  };

  const startEdit = (plan: SubscriptionPlan) => {
    setEditingPlanId(plan.id);
    setPlanForm({
      name: plan.name,
      price_monthly: String(plan.price_monthly),
      price_yearly: String(plan.price_yearly),
      max_doctors: String(plan.max_doctors),
      max_assistants: String(plan.max_assistants),
      max_patients: String(plan.max_patients),
      description: plan.description,
      is_active: plan.is_active,
    });
  };

  const activateRequest = async (subscriptionRequestId: string) => {
    setActivatingId(subscriptionRequestId);
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SUBSCRIPTION_REQUESTS}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.access_token}`,
          },
          body: JSON.stringify({
            subscription_request_id: subscriptionRequestId,
            start_date: startDate,
            renew_type: renewType,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to activate subscription request");
      }

      await loadRequests();
    } catch (error) {
      console.error(error);
      alert("Failed to activate request.");
    } finally {
      setActivatingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl lg:text-3xl font-black text-white flex items-center gap-3">
          <CreditCard className="text-orange-500" size={30} />
          Payments & Subscriptions
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage subscription plans and clinic subscription requests.
        </p>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin text-orange-500" size={40} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h2 className="text-lg font-black text-white">
                {editingPlanId ? "Edit Subscription Plan" : "Create Subscription Plan"}
              </h2>
              <form onSubmit={submitPlan} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  placeholder="Plan name"
                  value={planForm.name}
                  onChange={(e) =>
                    setPlanForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="md:col-span-2 h-11 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  required
                />
                <input
                  placeholder="Monthly price"
                  type="number"
                  value={planForm.price_monthly}
                  onChange={(e) =>
                    setPlanForm((prev) => ({ ...prev, price_monthly: e.target.value }))
                  }
                  className="h-11 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  required
                />
                <input
                  placeholder="Yearly price"
                  type="number"
                  value={planForm.price_yearly}
                  onChange={(e) =>
                    setPlanForm((prev) => ({ ...prev, price_yearly: e.target.value }))
                  }
                  className="h-11 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  required
                />
                <input
                  placeholder="Max doctors"
                  type="number"
                  value={planForm.max_doctors}
                  onChange={(e) =>
                    setPlanForm((prev) => ({ ...prev, max_doctors: e.target.value }))
                  }
                  className="h-11 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  required
                />
                <input
                  placeholder="Max assistants"
                  type="number"
                  value={planForm.max_assistants}
                  onChange={(e) =>
                    setPlanForm((prev) => ({ ...prev, max_assistants: e.target.value }))
                  }
                  className="h-11 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  required
                />
                <input
                  placeholder="Max patients"
                  type="number"
                  value={planForm.max_patients}
                  onChange={(e) =>
                    setPlanForm((prev) => ({ ...prev, max_patients: e.target.value }))
                  }
                  className="md:col-span-2 h-11 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={planForm.description}
                  onChange={(e) =>
                    setPlanForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="md:col-span-2 min-h-24 p-3 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  required
                />
                <label className="md:col-span-2 flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={planForm.is_active}
                    onChange={(e) =>
                      setPlanForm((prev) => ({ ...prev, is_active: e.target.checked }))
                    }
                    className="h-4 w-4 accent-orange-600"
                  />
                  Plan is active (visible to users)
                </label>
                <div className="md:col-span-2 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={submittingPlan}
                    className="h-11 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 transition-colors text-white font-bold inline-flex items-center gap-2 disabled:opacity-60"
                  >
                    {submittingPlan ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    {editingPlanId ? "Save Changes" : "Create Plan"}
                  </button>
                  {editingPlanId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPlanId(null);
                        setPlanForm(emptyPlanForm);
                      }}
                      className="h-11 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors text-slate-200 font-bold"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-white">Plan Details</h2>
                <button
                  onClick={loadData}
                  className="h-10 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors inline-flex items-center gap-2 font-bold"
                >
                  <RefreshCcw size={16} />
                  Refresh
                </button>
              </div>
              {selectedPlan ? (
                <div className="space-y-2 text-sm">
                  <p className="text-white font-bold">{selectedPlan.name}</p>
                  <p className="text-slate-400">Monthly: ${selectedPlan.price_monthly}</p>
                  <p className="text-slate-400">Yearly: ${selectedPlan.price_yearly}</p>
                  <p className="text-slate-400">Max doctors: {selectedPlan.max_doctors}</p>
                  <p className="text-slate-400">Max assistants: {selectedPlan.max_assistants}</p>
                  <p className="text-slate-400">Max patients: {selectedPlan.max_patients}</p>
                  <p className="text-slate-400">{selectedPlan.description}</p>
                </div>
              ) : (
                <p className="text-slate-500 text-sm">
                  Select a plan from the table below to load detailed data from API.
                </p>
              )}
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5">
            <h2 className="text-lg font-black text-white mb-4">Subscription Plans</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="text-left text-slate-400 text-xs uppercase tracking-widest">
                    <th className="py-3">Name</th>
                    <th className="py-3">Monthly</th>
                    <th className="py-3">Yearly</th>
                    <th className="py-3">Limits</th>
                    <th className="py-3">Status</th>
                    <th className="py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        No subscription plans found.
                      </td>
                    </tr>
                  ) : (
                    plans.map((plan) => (
                      <tr key={plan.id} className="border-t border-slate-800 text-sm">
                        <td className="py-3 text-white font-bold">{plan.name}</td>
                        <td className="py-3 text-slate-300">${plan.price_monthly}</td>
                        <td className="py-3 text-slate-300">${plan.price_yearly}</td>
                        <td className="py-3 text-slate-400">
                          D: {plan.max_doctors} | A: {plan.max_assistants} | P: {plan.max_patients}
                        </td>
                        <td className="py-3">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${
                              plan.is_active
                                ? "bg-emerald-500/15 text-emerald-400"
                                : "bg-red-500/15 text-red-400"
                            }`}
                          >
                            {plan.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => startEdit(plan)}
                              className="h-9 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold inline-flex items-center gap-2"
                            >
                              <PencilLine size={14} />
                              Edit
                            </button>
                            <button
                              onClick={() => loadPlanDetails(plan.id)}
                              className="h-9 px-3 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold"
                            >
                              Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-lg font-black text-white">Clinic Subscription Requests</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-11 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
              <select
                value={renewType}
                onChange={(e) =>
                  setRenewType(e.target.value as "free_trial" | "monthly" | "yearly")
                }
                className="h-11 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white"
              >
                <option value="free_trial">free_trial</option>
                <option value="monthly">monthly</option>
                <option value="yearly">yearly</option>
              </select>
              <button
                onClick={loadRequests}
                className="h-11 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold"
              >
                Reload Requests
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="text-left text-slate-400 text-xs uppercase tracking-widest">
                    <th className="py-3">Clinic</th>
                    <th className="py-3">Plan</th>
                    <th className="py-3">Amount</th>
                    <th className="py-3">Requested At</th>
                    <th className="py-3">Approved</th>
                    <th className="py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        No requests found.
                      </td>
                    </tr>
                  ) : (
                    requests.map((request) => (
                      <tr key={request.id} className="border-t border-slate-800 text-sm">
                        <td className="py-3 text-white font-bold">{request.clinic_name}</td>
                        <td className="py-3 text-slate-300">{request.plan_name}</td>
                        <td className="py-3 text-slate-300">${request.amount}</td>
                        <td className="py-3 text-slate-400">
                          {new Date(request.created_at).toLocaleString()}
                        </td>
                        <td className="py-3">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${
                              request.approved
                                ? "bg-emerald-500/15 text-emerald-400"
                                : "bg-yellow-500/15 text-yellow-300"
                            }`}
                          >
                            {request.approved ? "Approved" : "Pending"}
                          </span>
                        </td>
                        <td className="py-3">
                          <button
                            disabled={activatingId === request.id || request.approved}
                            onClick={() => activateRequest(request.id)}
                            className="h-9 px-3 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold disabled:opacity-60"
                          >
                            {activatingId === request.id ? "Activating..." : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
