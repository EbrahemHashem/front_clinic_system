"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { API_CONFIG } from "@/lib/constants";
import { Building2, Loader2, Search, X } from "lucide-react";

interface ClinicOwner {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone_number?: string;
}

interface StaffUser {
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
}

interface StaffMember {
  id?: string;
  created_at?: string;
  updated_at?: string;
  salary?: string;
  disabled?: boolean;
  role?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  specialty?: string;
  percentage?: string;
  clinic?: string;
  user?: StaffUser | string;
}

interface Clinic {
  id: string;
  name: string;
  address: string;
  phone_number: string;
  disabled: boolean;
  owner: ClinicOwner | null;
  doctors?: StaffMember[];
  assistants?: StaffMember[];
}

type DetailsSection = "owner" | "doctors" | "assistants";

const ClinicsPage = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsSection, setDetailsSection] = useState<DetailsSection>("owner");
  const [selectedClinicDetails, setSelectedClinicDetails] = useState<Clinic | null>(
    null,
  );

  const auth = useMemo(
    () => JSON.parse(localStorage.getItem("dentflow_auth") || "{}"),
    [],
  );

  const fetchClinics = useCallback(async (name?: string) => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (name?.trim()) {
        query.set("name", name.trim());
      }

      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CLINICS_ALL}${query.toString() ? `?${query.toString()}` : ""}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${auth.access_token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch clinics");
      }

      const data = await response.json();
      setClinics(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setClinics([]);
    } finally {
      setLoading(false);
    }
  }, [auth.access_token]);

  useEffect(() => {
    fetchClinics();
  }, [fetchClinics]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    fetchClinics(search);
  };

  const fetchClinicDetails = async (clinicId: string) => {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CLINIC}${clinicId}`,
      {
        headers: { Authorization: `Bearer ${auth.access_token}` },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch clinic details");
    }

    const data = await response.json();
    return (Array.isArray(data) ? data[0] : data) as Clinic;
  };

  const openClinicDetails = async (clinic: Clinic, section: DetailsSection) => {
    setDetailsSection(section);
    setSelectedClinicDetails(clinic);
    setIsDetailsOpen(true);
    setDetailsLoading(true);

    try {
      const details = await fetchClinicDetails(clinic.id);
      setSelectedClinicDetails(details);
    } catch (error) {
      console.error(error);
      // Keep basic clinic info fallback if details endpoint fails.
    } finally {
      setDetailsLoading(false);
    }
  };

  const toggleClinicStatus = async (clinic: Clinic) => {
    setUpdatingId(clinic.id);
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CLINIC}${clinic.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${auth.access_token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update clinic status");
      }

      setClinics((prev) =>
        prev.map((item) =>
          item.id === clinic.id ? { ...item, disabled: !item.disabled } : item,
        ),
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update clinic status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStaffName = (staff: StaffMember) => {
    if (typeof staff.user === "string") {
      return `User ${staff.user.slice(0, 8)}`;
    }
    const firstName = staff.first_name || staff.user?.first_name || "";
    const lastName = staff.last_name || staff.user?.last_name || "";
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || "Unknown";
  };

  const getStaffEmail = (staff: StaffMember) => {
    if (typeof staff.user === "string") return "-";
    return staff.email || staff.user?.email || "-";
  };

  const getStaffPhone = (staff: StaffMember) => {
    if (typeof staff.user === "string") return "-";
    return staff.phone_number || staff.user?.phone_number || "-";
  };

  const getStaffUserId = (staff: StaffMember) => {
    if (typeof staff.user === "string") return staff.user;
    return staff.user?.id || "-";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl lg:text-3xl font-black text-white flex items-center gap-3">
          <Building2 className="text-orange-500" size={30} />
          Clinics
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage all clinics and enable/disable access.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            size={18}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clinics by name"
            className="w-full h-12 bg-slate-900/60 border border-slate-800 rounded-xl pl-11 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
        <button
          type="submit"
          className="h-12 px-5 bg-orange-600 rounded-xl text-white font-bold hover:bg-orange-500 transition-colors"
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => {
            setSearch("");
            fetchClinics();
          }}
          className="h-12 px-5 bg-slate-800 rounded-xl text-slate-200 font-bold hover:bg-slate-700 transition-colors"
        >
          Reset
        </button>
      </form>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin text-orange-500" size={40} />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40">
          <table className="w-full min-w-[980px]">
            <thead className="bg-slate-900/80">
              <tr className="text-left text-slate-400 text-xs uppercase tracking-widest">
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Owner</th>
                <th className="px-5 py-4">Address</th>
                <th className="px-5 py-4">Phone</th>
                <th className="px-5 py-4">Details</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {clinics.length === 0 ? (
                <tr>
                  <td className="px-5 py-8 text-center text-slate-500" colSpan={7}>
                    No clinics found.
                  </td>
                </tr>
              ) : (
                clinics.map((clinic) => (
                  <tr key={clinic.id} className="border-t border-slate-800">
                    <td className="px-5 py-4 text-white font-bold">{clinic.name}</td>
                    <td className="px-5 py-4 text-slate-300">
                      {clinic.owner
                        ? `${clinic.owner.first_name} ${clinic.owner.last_name}`
                        : "-"}
                    </td>
                    <td className="px-5 py-4 text-slate-400">{clinic.address || "-"}</td>
                    <td className="px-5 py-4 text-slate-400">
                      {clinic.phone_number || "-"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => openClinicDetails(clinic, "owner")}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
                        >
                          Owner
                        </button>
                        <button
                          onClick={() => openClinicDetails(clinic, "doctors")}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
                        >
                          Doctors ({clinic.doctors?.length ?? 0})
                        </button>
                        <button
                          onClick={() => openClinicDetails(clinic, "assistants")}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
                        >
                          Assistants ({clinic.assistants?.length ?? 0})
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                          clinic.disabled
                            ? "bg-red-500/15 text-red-400"
                            : "bg-emerald-500/15 text-emerald-400"
                        }`}
                      >
                        {clinic.disabled ? "Disabled" : "Enabled"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleClinicStatus(clinic)}
                        disabled={updatingId === clinic.id}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                          clinic.disabled
                            ? "bg-emerald-600 text-white hover:bg-emerald-500"
                            : "bg-red-600 text-white hover:bg-red-500"
                        } disabled:opacity-60`}
                      >
                        {updatingId === clinic.id
                          ? "Updating..."
                          : clinic.disabled
                            ? "Enable"
                            : "Disable"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {isDetailsOpen && (
        <div className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-3xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white">
                  {selectedClinicDetails?.name || "Clinic"} Details
                </h2>
                <p className="text-slate-500 text-sm mt-1 capitalize">
                  Viewing {detailsSection}
                </p>
              </div>
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              {detailsLoading ? (
                <div className="h-40 flex items-center justify-center">
                  <Loader2 className="animate-spin text-orange-500" size={32} />
                </div>
              ) : (
                <>
                  {detailsSection === "owner" && (
                    <div className="space-y-3">
                      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                        <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">
                          Name
                        </p>
                        <p className="text-white font-bold">
                          {selectedClinicDetails?.owner
                            ? `${selectedClinicDetails.owner.first_name} ${selectedClinicDetails.owner.last_name}`
                            : "No owner data"}
                        </p>
                      </div>
                      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                        <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">
                          Email
                        </p>
                        <p className="text-slate-300">
                          {selectedClinicDetails?.owner?.email || "-"}
                        </p>
                      </div>
                      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                        <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">
                          Phone
                        </p>
                        <p className="text-slate-300">
                          {selectedClinicDetails?.owner?.phone_number || "-"}
                        </p>
                      </div>
                    </div>
                  )}

                  {detailsSection === "doctors" && (
                    <div className="space-y-3">
                      {(selectedClinicDetails?.doctors?.length ?? 0) === 0 ? (
                        <p className="text-slate-500">No doctors found for this clinic.</p>
                      ) : (
                        selectedClinicDetails?.doctors?.map((doctor, index) => (
                          <div
                            key={doctor.id || doctor.user?.id || `doctor-${index}`}
                            className="bg-slate-950 border border-slate-800 rounded-2xl p-4"
                          >
                            <p className="text-white font-bold">{getStaffName(doctor)}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-sm">
                              <p className="text-slate-400">
                                <span className="text-slate-500">Doctor ID: </span>
                                {doctor.id || "-"}
                              </p>
                              <p className="text-slate-400">
                                <span className="text-slate-500">User ID: </span>
                                {getStaffUserId(doctor)}
                              </p>
                              <p className="text-slate-400">
                                <span className="text-slate-500">Salary: </span>
                                {doctor.salary || "-"}
                              </p>
                              <p className="text-slate-400">
                                <span className="text-slate-500">Commission: </span>
                                {doctor.percentage || "-"}
                              </p>
                              <p className="text-slate-400">
                                <span className="text-slate-500">Status: </span>
                                {doctor.disabled ? "Disabled" : "Active"}
                              </p>
                              <p className="text-slate-400">
                                <span className="text-slate-500">Specialty: </span>
                                {doctor.specialty || "-"}
                              </p>
                              <p className="text-slate-400">
                                <span className="text-slate-500">Email: </span>
                                {getStaffEmail(doctor)}
                              </p>
                              <p className="text-slate-400">
                                <span className="text-slate-500">Phone: </span>
                                {getStaffPhone(doctor)}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {detailsSection === "assistants" && (
                    <div className="space-y-3">
                      {(selectedClinicDetails?.assistants?.length ?? 0) === 0 ? (
                        <p className="text-slate-500">
                          No assistants found for this clinic.
                        </p>
                      ) : (
                        selectedClinicDetails?.assistants?.map((assistant, index) => (
                          <div
                            key={assistant.id || assistant.user?.id || `assistant-${index}`}
                            className="bg-slate-950 border border-slate-800 rounded-2xl p-4"
                          >
                            <p className="text-white font-bold">
                              {getStaffName(assistant)}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-sm">
                              <p className="text-slate-400">
                                <span className="text-slate-500">Assistant ID: </span>
                                {assistant.id || "-"}
                              </p>
                              <p className="text-slate-400">
                                <span className="text-slate-500">User ID: </span>
                                {getStaffUserId(assistant)}
                              </p>
                              <p className="text-slate-400">
                                <span className="text-slate-500">Salary: </span>
                                {assistant.salary || "-"}
                              </p>
                              <p className="text-slate-400">
                                <span className="text-slate-500">Status: </span>
                                {assistant.disabled ? "Disabled" : "Active"}
                              </p>
                              <p className="text-slate-400">
                                <span className="text-slate-500">Email: </span>
                                {getStaffEmail(assistant)}
                              </p>
                              <p className="text-slate-400">
                                <span className="text-slate-500">Phone: </span>
                                {getStaffPhone(assistant)}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicsPage;
