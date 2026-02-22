"use client";

import React, { useEffect, useState, useCallback } from "react";
import { API_CONFIG } from "@/lib/constants";
import { PatientList } from "@/components/patients/patient_list";

export interface Patient {
  id: string;
  name: string;
  gender: string;
  phone_number: string;
  birth_date: string;
  doctor: string;
  assistant: string;
  doctor_id?: string;
  assistant_id?: string;
}

export interface StaffDropdown {
  id: string;
  label: string;
  name: string;
}

export interface PatientFormData {
  name: string;
  gender: string;
  phone_number: string;
  birth_date: string;
  doctor_id: string;
  assistant_id: string;
}

interface StaffApiItem {
  id: string;
  specialty?: string;
  user?: {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
  };
}

const PatientsPage = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<StaffDropdown[]>([]);
  const [assistants, setAssistants] = useState<StaffDropdown[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [totalPatients, setTotalPatients] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState<PatientFormData>({
    name: "",
    gender: "male",
    phone_number: "",
    birth_date: "",
    doctor_id: "",
    assistant_id: "",
  });

  const loadData = useCallback(async (search: string = "", page: number = 1) => {
    setLoading(true);
    try {
      const auth = JSON.parse(localStorage.getItem("dentflow_auth") || "{}");
      const headers = { "Authorization": `Bearer ${auth.access_token}` };

      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("per_page", "10");

      if (search) {
        if (/^\d+$/.test(search)) params.append("phone_number", search);
        else params.append("name", search);
      }

      const [patRes, docRes, assRes] = await Promise.all([
        fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PATIENTS}?${params.toString()}`, { headers }),
        fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ALL_STAFF}?staff=doctor`, { headers }),
        fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ALL_STAFF}?staff=assistant`, { headers })
      ]);

      const [patResponse, docData, assData] = await Promise.all([
        patRes.json(), docRes.json(), assRes.json()
      ]);

      if (patResponse?.data) {
        setPatients(patResponse.data);
        setTotalPatients(patResponse.total || 0);
        setCurrentPage(patResponse.page || 1);
      }
      
      if (Array.isArray(docData)) {
        setDoctors(docData.map((d: StaffApiItem) => ({ 
          id: d.id, 
          name: `${d.user?.first_name || ""} ${d.user?.last_name || ""}`.trim(),
          label: `Dr. ${`${d.user?.first_name || ""} ${d.user?.last_name || ""}`.trim()} ${d.specialty ? `(${d.specialty})` : ''}` 
        })));
      }
      
      if (Array.isArray(assData)) {
        setAssistants(assData.map((a: StaffApiItem) => ({ 
          id: a.id, 
          name: `${a.user?.first_name || ""} ${a.user?.last_name || ""}`.trim(),
          label: `${`${a.user?.first_name || ""} ${a.user?.last_name || ""}`.trim()} - ${a.user?.phone_number || ""}` 
        })));
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const today = new Date().toISOString().split("T")[0];
    if (formData.birth_date > today) return alert("Birth date cannot be in the future.");
    if (!/^\d+$/.test(formData.phone_number)) return alert("Phone must be digits only.");

    setIsSubmitting(true);
    try {
      const auth = JSON.parse(localStorage.getItem("dentflow_auth") || "{}");
      const payload: {
        name: string;
        gender: string;
        phone_number: string;
        birth_date: string;
        doctor_id: string;
        assistant_id?: string;
        patient_id?: string;
      } = { ...formData };
      if (!payload.assistant_id) delete payload.assistant_id;

      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PATIENTS}`;
      const method = editingId ? "PUT" : "POST";
      if (editingId) payload.patient_id = editingId;

      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth.access_token}` 
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        loadData(searchTerm, currentPage);
        resetForm();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Permanently delete this record?")) return;
    try {
      const auth = JSON.parse(localStorage.getItem("dentflow_auth") || "{}");
      const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PATIENTS}?patient_id=${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${auth.access_token}` }
      });
      if (res.ok) loadData(searchTerm, currentPage);
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (patient: Patient) => {
    setEditingId(patient.id);
    const foundDoc = doctors.find(d => d.name === patient.doctor);
    const foundAss = assistants.find(a => a.name === patient.assistant);
    
    setFormData({
      name: patient.name,
      gender: patient.gender,
      phone_number: patient.phone_number,
      birth_date: patient.birth_date,
      doctor_id: foundDoc?.id || "",
      assistant_id: foundAss?.id || "",
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: "", gender: "male", phone_number: "", birth_date: "", doctor_id: "", assistant_id: "" });
  };

  useEffect(() => { loadData(); }, [loadData]);

  return (
    <PatientList 
      patients={patients}
      doctors={doctors}
      assistants={assistants}
      loading={loading}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      isSubmitting={isSubmitting}
      formData={formData}
      setFormData={setFormData}
      onSubmit={handleSubmit}
      onSearch={(val: string) => { setSearchTerm(val); loadData(val, 1); }} // [!code highlight]
      onDelete={handleDelete}
      onEdit={openEditModal}
      onOpenCreate={() => { resetForm(); setIsModalOpen(true); }}
      editingId={editingId}
      total={totalPatients}
    />
  );
};

export default PatientsPage;
