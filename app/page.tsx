import FAQ from "@/components/landing_page/faq";
import Features from "@/components/landing_page/features";
import Header from "@/components/landing_page/header";
import LogoCloud from "@/components/landing_page/logo-cloud";
import PageShell from "@/components/landing_page/page-shell";
import Pricing from "@/components/landing_page/pricing";

export default function Home() {
  return (
    <PageShell>
      <Header />
      <LogoCloud />
      <div className="relative">
        {/* Subtle background element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>
        <Features />
      </div>
      <FAQ />
      <Pricing />
    </PageShell>

  );
}
