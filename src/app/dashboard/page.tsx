"use client";

import ClinicalView from "@/components/dashboard/clinical_view";
import OwnerView from "@/components/dashboard/owner_view";
import SuperAdminView from "@/components/dashboard/super_admin_view";
import React, { useEffect, useState } from "react";

export default function DashboardPage() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // UPDATED: Read from 'dentflow_auth' to match your Layout logic
    const data = localStorage.getItem("dentflow_auth");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        // Access the user object inside the auth data
        const userRole = parsed.user?.role;
        
        if (userRole) {
          setRole(userRole);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

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