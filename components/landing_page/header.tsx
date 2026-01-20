'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Play, CheckCircle, ShieldCheck, Activity } from 'lucide-react';

const Header = () => {
  return (
    <section className="pt-32 pb-20 overflow-hidden relative bg-slate-950">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-600/10 rounded-full blur-[100px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-400 px-4 py-2 rounded-full text-xs font-bold mb-8 border border-orange-500/20">
              <ShieldCheck className="w-4 h-4" />
              HIPAA Compliant & Secure Data Management
            </div>

            <h1 className="text-5xl lg:text-7xl font-black leading-[1.05] mb-6 tracking-tight text-white">
              Precision Care,
              <br />
              <span className="text-orange-500">Simpler</span> Operations.
            </h1>

            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto lg:mx-0">
              DentFlow is the all-in-one clinical platform designed to optimize
              every touchpoint of your practice.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
              <Link
                href="/register"
                className="w-full sm:w-auto bg-orange-600 text-white px-8 py-5 rounded-2xl font-black text-lg hover:bg-orange-500 transition-all shadow-2xl shadow-orange-900/30"
              >
                Start Free Trial
              </Link>

              <button className="w-full sm:w-auto bg-slate-900 border border-slate-800 text-white px-8 py-5 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-orange-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-orange-500" />
                14-day full access
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="flex-1 relative">
            <div className="bg-slate-900 rounded-[3rem] p-4 border border-slate-800">
              <Image
                src="/images/main_image.jpeg"
                alt="Modern Dental Clinic Interface"
                width={1200}
                height={800}
                className="rounded-[2rem] border border-slate-800 object-cover"
                priority
              />

              <div className="absolute -bottom-6 right-6 bg-slate-950 p-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-slate-800">
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <Activity className="text-orange-500 w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase">
                    Growth this month
                  </div>
                  <div className="text-xl font-black text-white">
                    +24.5%
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Header;
