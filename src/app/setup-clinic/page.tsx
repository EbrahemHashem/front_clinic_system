import ClinicForm from "@/components/clinic_form";

export default function SetupClinicPage() {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-600/5 rounded-full blur-[150px] pointer-events-none"></div>
      <ClinicForm />
    </main>
  );
}