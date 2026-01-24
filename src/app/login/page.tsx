import LoginForm from "@/components/login_form";

export default function LoginPage() {
  return (
    <main className="min-h-screen pt-32 pb-20 flex items-center justify-center px-6 relative bg-slate-950 overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Login Form Component */}
      <LoginForm />
    </main>
  );
}