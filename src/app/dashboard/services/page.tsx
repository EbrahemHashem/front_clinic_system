"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Plus, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { API_CONFIG } from "@/lib/constants";
import { Service, ServiceCard } from "@/components/services/service_card";
import { CreateServiceModal } from "@/components/services/create_service";
import { EditServiceModal } from "@/components/services/edit_service";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 6;

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const auth = JSON.parse(localStorage.getItem("dentflow_auth") || "{}");
      
      const query = new URLSearchParams({
        page: currentPage.toString(),
        per_page: perPage.toString()
      });

      const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SERVICES}?${query.toString()}`, {
        headers: { "Authorization": `Bearer ${auth.access_token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setServices(data.services || []);
        // Calculate total pages
        const count = data.total_count || 0;
        setTotalPages(Math.ceil(count / perPage));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [currentPage]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    
    try {
      const auth = JSON.parse(localStorage.getItem("dentflow_auth") || "{}");
      // Assuming DELETE uses ?service_id=ID format based on your style
      const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SERVICES}?service_id=${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${auth.access_token}` }
      });

      if (res.ok) {
        fetchServices();
      } else {
        alert("Failed to delete");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-full">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <Sparkles className="text-orange-500" size={32} /> Clinic Services
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Manage your treatments and pricing.
          </p>
        </div>

        <button 
          onClick={() => setIsCreateOpen(true)}
          className="bg-orange-600 px-6 py-3 rounded-2xl font-bold text-white flex items-center gap-2 hover:bg-orange-500 transition-all shadow-lg shadow-orange-900/20 active:scale-95"
        >
          <Plus size={20} /> Add Service
        </button>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
            <Loader2 className="animate-spin text-orange-500" size={40} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <ServiceCard 
                key={service.id || index}
                service={service}
                onEdit={() => service.id && setSelectedServiceId(service.id)}
                onDelete={() => service.id && handleDelete(service.id)}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-white disabled:opacity-50 hover:border-orange-500 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-slate-500 font-bold text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-white disabled:opacity-50 hover:border-orange-500 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <CreateServiceModal 
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={fetchServices}
      />

      <EditServiceModal 
        isOpen={!!selectedServiceId}
        serviceId={selectedServiceId}
        onClose={() => setSelectedServiceId(null)}
        onSuccess={fetchServices}
      />

    </div>
  );
}