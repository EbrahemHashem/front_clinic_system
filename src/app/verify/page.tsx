import VerifyForm from "@/components/verify_form";

export default function VerifyPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      <VerifyForm />
    </main>
  );
}