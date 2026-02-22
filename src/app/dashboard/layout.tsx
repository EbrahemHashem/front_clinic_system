"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react"; // Import for mobile toggle
import SuperAdminSidebar from "@/components/dashboard/super_admin_sidebar";
import ClinicalSidebar from "@/components/dashboard/clinical_sidebar";
import OwnerSidebar from "@/components/dashboard/owner_sidebar";
import { API_CONFIG } from "@/lib/constants";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<{
    role: string;
    first_name?: string;
    last_name?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state
  const router = useRouter();

  useEffect(() => {
    const isRecord = (value: unknown): value is Record<string, unknown> =>
      typeof value === "object" && value !== null;

    const isSubscriptionActive = (subscription: unknown) => {
      if (!subscription) return false;
      if (!isRecord(subscription)) return false;

      if (typeof subscription.is_active === "boolean") {
        return subscription.is_active;
      }

      if (typeof subscription.approved === "boolean") {
        return subscription.approved;
      }

      if (typeof subscription.status === "string") {
        const status = subscription.status.toLowerCase();
        return status === "active" || status === "trial";
      }

      return false;
    };

    const extractCurrentSubscription = (payload: unknown) => {
      if (!payload) return null;

      if (isRecord(payload)) {
        if (payload.current_subscription) return payload.current_subscription;
        if (payload.subscription) return payload.subscription;
      }

      if (Array.isArray(payload)) {
        // Ignore pure plans list; find objects that look like subscriptions.
        return (
          payload.find((item) => {
            if (!isRecord(item)) return false;
            const looksLikePlan =
              "price_monthly" in item && "max_doctors" in item;
            if (looksLikePlan) return false;

            return (
              "is_active" in item ||
              "approved" in item ||
              "status" in item ||
              "start_date" in item ||
              "end_date" in item
            );
          }) ?? null
        );
      }

      return null;
    };

    const checkAuthAndSubscription = async () => {
      const authData = localStorage.getItem("dentflow_auth");
      if (!authData) {
        router.push("/login");
        return;
      }

      try {
        const parsed = JSON.parse(authData);
        if (!parsed?.user) {
          router.push("/login");
          return;
        }

        setUser(parsed.user);

        // Superadmins bypass subscription check
        if (parsed.user.role === "superadmin") {
          setLoading(false);
          return;
        }

        // First try clinic endpoint for subscription info
        const response = await fetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CLINIC}`,
          {
            headers: { Authorization: `Bearer ${parsed.access_token}` },
          },
        );

        let subscription: unknown = null;

        if (response.ok) {
          const data = await response.json();
          const clinicData = Array.isArray(data) ? data[0] : data;
          subscription = clinicData?.subscription ?? null;
        }

        // Fallback to owner subscription endpoint when clinic payload is minimal
        if (!subscription) {
          const subRes = await fetch(
            `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SUBSCRIPTION}`,
            {
              headers: { Authorization: `Bearer ${parsed.access_token}` },
            },
          );

          if (subRes.ok) {
            const subData = await subRes.json();
            subscription = extractCurrentSubscription(subData);
          }
        }

        if (!subscription) {
          // No subscription chosen yet
          router.push("/choose-plan");
          return;
        }

        if (!isSubscriptionActive(subscription)) {
          // Subscription exists but not active/approved yet
          router.push("/waiting-state");
          return;
        }
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndSubscription();
  }, [router]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-white relative">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Responsive Sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-[70] w-64 border-r border-slate-800 bg-slate-900 
        transition-transform duration-300 transform lg:static lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {user.role === "superadmin" && <SuperAdminSidebar />}
        {user.role === "owner" && <OwnerSidebar />}
        {(user.role === "doctor" || user.role === "assistant") && (
          <ClinicalSidebar />
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen w-full overflow-hidden">
        {/* Responsive Header */}
        <header className="h-20 border-b border-slate-800 flex items-center justify-between px-4 lg:px-8 bg-slate-900/10 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-4">
            {/* Hamburger Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white bg-slate-800/50 rounded-xl"
            >
              <Menu size={24} />
            </button>
            <h2 className="font-bold text-slate-400 capitalize hidden xs:block">
              {user.role} <span className="text-slate-700 mx-2">/</span>{" "}
              <span className="text-white">Overview</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white leading-none mb-1">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-[10px] text-orange-500 uppercase font-black tracking-widest">
                {user.role}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center font-bold text-white shadow-lg">
              {user.first_name?.[0]}
            </div>
          </div>
        </header>

        {/* Dynamic Children Content */}
        <section className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {children}
        </section>
      </main>
    </div>
  );
}
