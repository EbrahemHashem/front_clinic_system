"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { API_CONFIG } from "@/lib/constants";
import { Building2, Loader2, Search } from "lucide-react";

interface ClinicOwner {
  id: string;
  first_name: string;
  last_name: string;
}

interface Clinic {
  id: string;
  name: string;
  address: string;
  phone_number: string;
  disabled: boolean;
  owner: ClinicOwner | null;
}

const ClinicsPage = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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
          <table className="w-full min-w-[850px]">
            <thead className="bg-slate-900/80">
              <tr className="text-left text-slate-400 text-xs uppercase tracking-widest">
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Owner</th>
                <th className="px-5 py-4">Address</th>
                <th className="px-5 py-4">Phone</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {clinics.length === 0 ? (
                <tr>
                  <td className="px-5 py-8 text-center text-slate-500" colSpan={6}>
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
    </div>
  );
};

export default ClinicsPage;
