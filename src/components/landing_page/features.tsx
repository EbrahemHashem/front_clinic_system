
import React from 'react';
import { Calendar, FileText, Wallet, MessageSquare, Shield, RefreshCw, Package, Headphones } from 'lucide-react';

const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-slate-950 relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto mb-24">
          <span className="text-orange-500 font-bold tracking-widest uppercase text-xs mb-4 block">Platform Excellence</span>
          <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-6 text-white leading-tight">
            Every tool you need to run <br className="hidden lg:block"/> a world-class clinic.
          </h2>
          <p className="text-slate-400 text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto">
            We've built My Clinic from the ground up specifically for modern practitioners who value efficiency, security, and growth.
          </p>
        </div>

        {/* Alternating Feature Blocks */}
        <div className="space-y-40 mb-32">
          {/* Feature 1 */}
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="flex-1 order-2 lg:order-1">
              <div className="w-14 h-14 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center mb-6 border border-orange-500/20">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="text-3xl font-black mb-6 text-white tracking-tight">AI-Assisted Scheduling</h3>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                Eliminate gaps and double-bookings. Our smart calendar predicts peak times and automates patient reminders to reduce no-shows by up to 45%.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {["Smart Conflict Detection", "Two-way SMS Reminders", "Patient Self-Scheduling", "Multi-Chair Support"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-300 font-semibold text-sm">
                    <div className="w-5 h-5 bg-orange-500/20 text-orange-500 rounded-full flex items-center justify-center">
                      <Shield className="w-3 h-3" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 w-full order-1 lg:order-2">
              <div className="relative group">
                <div className="absolute -inset-4 bg-orange-600/20 rounded-[2.5rem] blur-3xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative bg-slate-900 p-3 rounded-[2rem] border border-slate-800 shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800&h=500&auto=format&fit=crop" 
                    alt="Scheduling Dashboard" 
                    className="rounded-2xl w-full object-cover opacity-80" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16 lg:gap-24">
            <div className="flex-1">
              <div className="w-14 h-14 bg-orange-500/10 text-orange-400 rounded-2xl flex items-center justify-center mb-6 border border-orange-500/20">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-3xl font-black mb-6 text-white tracking-tight">Interactive Patient Charts</h3>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                Go completely paperless with high-definition digital charts. Annotate directly on x-rays, track clinical notes, and manage treatment plans in seconds.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {["E-Forms & Consents", "Voice-to-Text Notes", "HD Image Integration", "Treatment Estimator"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-300 font-semibold text-sm">
                    <div className="w-5 h-5 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center">
                      <Shield className="w-3 h-3" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className="relative group">
                <div className="absolute -inset-4 bg-orange-600/20 rounded-[2.5rem] blur-3xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative bg-slate-900 p-3 rounded-[2rem] border border-slate-800 shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=800&h=500&auto=format&fit=crop" 
                    alt="Digital Records" 
                    className="rounded-2xl w-full object-cover opacity-80" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: <Wallet className="w-6 h-6" />, title: "Automated Billing", desc: "Process payments and insurance claims automatically with 98% accuracy.", color: "bg-orange-500/10 text-orange-500" },
            { icon: <MessageSquare className="w-6 h-6" />, title: "Patient Portals", desc: "Allow patients to view history, pay bills, and message you directly.", color: "bg-orange-500/10 text-orange-400" },
            { icon: <Shield className="w-6 h-6" />, title: "HIPAA Compliant", desc: "Bank-grade encryption and secure backups for absolute data safety.", color: "bg-orange-500/10 text-orange-500" },
            { icon: <RefreshCw className="w-6 h-6" />, title: "Seamless Migration", desc: "We transfer your data from any system at no extra cost.", color: "bg-orange-500/10 text-orange-400" },
            { icon: <Package className="w-6 h-6" />, title: "Inventory Tracker", desc: "Never run out of clinical supplies with smart low-stock alerts.", color: "bg-orange-500/10 text-orange-500" },
            { icon: <Headphones className="w-6 h-6" />, title: "Concierge Support", desc: "24/7 dedicated assistance to ensure your clinic never stops.", color: "bg-orange-500/10 text-orange-400" }
          ].map((item, i) => (
            <div key={i} className="p-10 bg-slate-900 rounded-3xl border border-slate-800 hover:border-orange-500/50 hover:bg-slate-800/50 transition-all duration-300 group shadow-lg">
              <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-orange-500/10`}>
                {item.icon}
              </div>
              <h4 className="text-xl font-bold mb-3 text-white">{item.title}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
