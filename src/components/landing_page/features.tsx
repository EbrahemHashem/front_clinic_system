
import React from 'react';
import Image from 'next/image';
import { Calendar, FileText, Wallet, Shield, Users, Stethoscope, ScrollText, Building2 } from 'lucide-react';

const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-slate-950 relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto mb-24">
          <span className="text-orange-500 font-bold tracking-widest uppercase text-xs mb-4 block">Platform Excellence</span>
          <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-6 text-white leading-tight">
            Everything you need to run <br className="hidden lg:block"/> your clinic in one place.
          </h2>
          <p className="text-slate-400 text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto">
            My Clinic is built for front-desk teams, doctors, and clinic managers who need fast, reliable, and organized operations.
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
              <h3 className="text-3xl font-black mb-6 text-white tracking-tight">Smart Appointment Management</h3>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                Create, edit, and track appointments quickly with a clean workflow that helps your team manage daily clinic operations without confusion.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {["Create & edit appointments", "Daily appointment list", "Clear visit details", "Fast status updates"].map((item, i) => (
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
                  <Image 
                    src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800&h=500&auto=format&fit=crop" 
                    alt="Scheduling Dashboard"
                    width={800}
                    height={500}
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
              <h3 className="text-3xl font-black mb-6 text-white tracking-tight">Unified Patient Records</h3>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                Store patient data in one profile with attachments and treatment details so doctors and assistants can access the right information instantly.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {["Patient profiles", "Attachment uploads", "Treatment plan tracking", "History and notes"].map((item, i) => (
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
                  <Image 
                    src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=800&h=500&auto=format&fit=crop" 
                    alt="Digital Records"
                    width={800}
                    height={500}
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
            { icon: <Stethoscope className="w-6 h-6" />, title: "Doctor Management", desc: "Add and manage doctors, salaries, specialties, and clinic assignments.", color: "bg-orange-500/10 text-orange-500" },
            { icon: <Users className="w-6 h-6" />, title: "Assistant Management", desc: "Manage assistant accounts and keep staff structure organized by role.", color: "bg-orange-500/10 text-orange-400" },
            { icon: <ScrollText className="w-6 h-6" />, title: "Services Catalog", desc: "Create and update clinic services with pricing for accurate operations.", color: "bg-orange-500/10 text-orange-500" },
            { icon: <Wallet className="w-6 h-6" />, title: "Subscription Plans", desc: "Choose, upgrade, and monitor clinic subscription plans and status.", color: "bg-orange-500/10 text-orange-400" },
            { icon: <Building2 className="w-6 h-6" />, title: "Clinic Control", desc: "Super admin can view clinics and enable or disable access when needed.", color: "bg-orange-500/10 text-orange-500" },
            { icon: <Shield className="w-6 h-6" />, title: "Role-Based Access", desc: "Separate views and permissions for super admin, owner, doctor, and assistant.", color: "bg-orange-500/10 text-orange-400" }
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
