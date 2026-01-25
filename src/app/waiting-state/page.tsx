import WaitingState from "@/components/waiting-state";

export default function WaitingPage() {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[150px] pointer-events-none"></div>
      <WaitingState />
    </main>
  );
}