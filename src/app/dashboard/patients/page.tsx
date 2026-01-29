"use client";

import React, { useEffect, useState } from "react";
import { API_CONFIG } from "@/lib/constants";
import { PatientList } from "@/components/patien_list";

// Interfaces
export interface Patient {
  id: string;
  name: string;
  gender: string;
  phone_number: string;
  birth_date: string;
  doctor: string;
  assistant: string;
}

export interface StaffDropdown {
  id: string; // The Staff ID (used for value)
  label: string; // The display text (Name + Details)
}

const PatientsPage = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  
  // State for Dropdowns
  const [doctors, setDoctors] = useState<StaffDropdown[]>([]);
  const [assistants, setAssistants] = useState<StaffDropdown[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    gender: "male",
    phone_number: "",
    birth_date: "",
    doctor_id: "",
    assistant_id: "",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const auth = JSON.parse(localStorage.getItem("dentflow_auth") || "{}");
      const headers = { "Authorization": `Bearer ${auth.access_token}` };

      // 1. Fire all 3 requests in parallel
      const [patRes, docRes, assRes] = await Promise.all([
        fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PATIENTS}`, { headers }), // Get Patients
        fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ALL_STAFF}?staff=doctor`, { headers }), // Get Doctors
        fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ALL_STAFF}?staff=assistant`, { headers }) // Get Assistants
      ]);

      const [patData, docData, assData] = await Promise.all([
        patRes.json(), docRes.json(), assRes.json()
      ]);

      // 2. Set Patients
      if (Array.isArray(patData)) setPatients(patData);
      
      // 3. Map Doctors (Include Name + Specialty)
      if (Array.isArray(docData)) {
        setDoctors(docData.map((d: any) => ({ 
          id: d.id, 
          // Shows: "Dr. John Doe (Orthodontist)" or just "Dr. John Doe"
          label: `Dr. ${d.user.first_name} ${d.user.last_name} ${d.specialty ? `(${d.specialty})` : ''}` 
        })));
      }
      
      // 4. Map Assistants (Include Name + Phone for context)
      if (Array.isArray(assData)) {
        setAssistants(assData.map((a: any) => ({ 
          id: a.id, 
          // Shows: "Jane Doe - 010xxxx"
          label: `${a.user.first_name} ${a.user.last_name} - ${a.user.phone_number}` 
        })));
      }

    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const auth = JSON.parse(localStorage.getItem("dentflow_auth") || "{}");
      const payload: any = { ...formData };
      
      if (!payload.assistant_id) delete payload.assistant_id;

      const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PATIENTS}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth.access_token}` 
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        loadData(); // Reload table to see new patient
        setFormData({ name: "", gender: "male", phone_number: "", birth_date: "", doctor_id: "", assistant_id: "" });
      } else {
        alert("Failed to create patient. Check console.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => { loadData(); }, []);

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
      onSubmit={handleCreatePatient}
    />
  );
};

export default PatientsPage;