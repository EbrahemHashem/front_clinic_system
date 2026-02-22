"use client";

import ClinicalView from "@/components/dashboard/clinical_view";
import OwnerView from "@/components/dashboard/owner_view";
import SuperAdminView from "@/components/dashboard/super_admin_view";
import React, { useState } from "react";

export default function DashboardPage() {
  const [role] = useState<string | null>(() => {
    try {
      const data = localStorage.getItem("dentflow_auth");
      if (!data) return null;

      const parsed = JSON.parse(data);
      const isSuperUser = Boolean(
        parsed.user?.is_superuser ?? parsed.is_superuser,
      );
      return isSuperUser ? "superadmin" : parsed.user?.role ?? null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  });

  if (!role) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {role === "superadmin" && <SuperAdminView />}
      {role === "owner" && <OwnerView />}
      {(role === "doctor" || role === "assistant") && <ClinicalView />}
    </div>
  );
}
