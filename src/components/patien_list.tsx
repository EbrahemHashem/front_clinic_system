"use client";

import React from "react";
import { Users, Plus, Search, Edit3, X, Loader2, Eye } from "lucide-react";
import { Patient, StaffDropdown } from "@/app/dashboard/patients/page";

interface PatientListProps {
  patients: Patient[];
  doctors: StaffDropdown[];
  assistants: StaffDropdown[];
  loading: boolean;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  isSubmitting: boolean;
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const PatientList = ({
  patients,
  doctors,
  assistants,
  loading,
  isModalOpen,
  setIsModalOpen,
  isSubmitting,
  formData,
  setFormData,
  onSubmit,
}: PatientListProps) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <Users className="text-orange-500" /> Patients Records
          </h2>
          <p className="text-slate-500 text-sm">
            Manage and track patient history and treatments.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-500 transition-all shadow-lg"
        >
          <Plus size={20} /> Add New Patient
        </button>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            size={18}
          />
          <input
            placeholder="Search by name or phone..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:border-orange-500 outline-none"
          />
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/30 text-slate-500 text-[10px] font-black uppercase tracking-widest">
              <th className="px-8 py-5">Patient Name</th>
              <th className="px-6 py-5">Phone Number</th>
              <th className="px-6 py-5">Doctor / Assistant</th>
              <th className="px-6 py-5">Birth Date</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <Loader2 className="animate-spin mx-auto text-orange-500" />
                </td>
              </tr>
            ) : (
              patients.map((p) => (
                <tr
                  key={p.id}
                  className="group hover:bg-slate-800/20 transition-colors"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-orange-500 font-bold uppercase">
                        {p.name[0]}
                      </div>
                      <div>
                        <p className="text-white font-bold">{p.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-tighter">
                          ID: {p.id.split("-")[0]}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-slate-300 font-medium">
                    {p.phone_number}
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-white text-sm font-bold">
                      Dr. {p.doctor}
                    </p>
                    <p className="text-slate-500 text-xs">
                      {p.assistant || "No assistant"}
                    </p>
                  </td>
                  <td className="px-6 py-5 text-slate-400 text-sm">
                    {p.birth_date}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-slate-500 hover:text-white bg-slate-800/50 rounded-lg hover:bg-slate-700 transition-all">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-slate-500 hover:text-orange-500 bg-slate-800/50 rounded-lg hover:bg-slate-700 transition-all">
                        <Edit3 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-white">
                Register New Patient
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-white"
              >
                <X />
              </button>
            </div>

            <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">
                  Full Name
                </label>
                <input
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-orange-500 outline-none"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">
                  Gender
                </label>
                <select
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">
                  Birth Date
                </label>
                <input
                  required
                  type="date"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none"
                  value={formData.birth_date}
                  onChange={(e) =>
                    setFormData({ ...formData, birth_date: e.target.value })
                  }
                />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">
                  Phone Number
                </label>
                <input
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none"
                  placeholder="01..."
                  value={formData.phone_number}
                  onChange={(e) =>
                    setFormData({ ...formData, phone_number: e.target.value })
                  }
                />
              </div>

              {/* Doctor Dropdown */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">
                  Assigned Doctor
                </label>
                <select
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none"
                  value={formData.doctor_id}
                  onChange={(e) =>
                    setFormData({ ...formData, doctor_id: e.target.value })
                  }
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assistant Dropdown */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">
                  Assigned Assistant (Optional)
                </label>
                <select
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none"
                  value={formData.assistant_id}
                  onChange={(e) =>
                    setFormData({ ...formData, assistant_id: e.target.value })
                  }
                >
                  <option value="">None</option>
                  {assistants.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="col-span-2 bg-orange-600 hover:bg-orange-500 text-white font-black py-4 rounded-2xl transition-all mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Create Patient Record"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
