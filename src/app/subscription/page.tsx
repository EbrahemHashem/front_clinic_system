import SubscriptionForm from "@/components/subscription-form";

export default function SubscriptionPage() {
  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="text-center mb-10 relative z-10">
        <h1 className="text-4xl font-black text-white mb-2">Finalize Your Subscription</h1>
        <p className="text-slate-400">Select your preferred payment method to get started.</p>
      </div>
      <SubscriptionForm />
    </main>
  );
}