import PlanSelection from "@/components/plan_selection";

export default function PlanPage() {
  return (
    <main className="min-h-screen bg-slate-950 py-20 px-6">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black text-white mb-4">Choose Your Plan</h1>
        <p className="text-slate-400">Select the perfect power level for your practice.</p>
      </div>
      <PlanSelection />
    </main>
  );
}