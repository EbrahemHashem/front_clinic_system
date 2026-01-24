import RegisterForm from "@/components/register_form";

export default function RegisterPage() {
  return (
    <main className="min-h-screen pt-32 pb-20 flex items-center justify-center px-6 relative bg-slate-950 overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-600/5 rounded-full blur-[150px] pointer-events-none"></div>
      
      {/* Register Form Component */}
      <RegisterForm />
    </main>
  );
}