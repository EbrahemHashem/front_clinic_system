'use client';

import React from 'react';
import Navbar from './navbar';
import Footer from './footer';

type PageShellProps = {
  children: React.ReactNode;
  showCTA?: boolean;
  hideNav?: boolean;
  hideFooter?: boolean;
};

export default function PageShell({
  children,
  showCTA = true,
  hideNav = false,
  hideFooter = false,
}: PageShellProps) {

  const navigate = (path: string) => {
    window.location.href = `/${path}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50 antialiased">
      {!hideNav && <Navbar />}

      <main className="flex-grow">
        {children}

        {showCTA && (
          <section className="py-24 relative overflow-hidden bg-slate-900 border-y border-slate-800">
            <div className="container mx-auto px-6 text-center">
              <h2 className="text-4xl md:text-6xl font-black mb-8">
                Ready to run your clinic with less effort?
              </h2>
              <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto">
                Join clinics using My Clinic to simplify appointments, records, billing, and team workflows.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('register')}
                  className="bg-orange-600 px-10 py-5 rounded-2xl font-black text-lg"
                >
                  Start My Free Trial
                </button>
                <button className="bg-slate-800 px-10 py-5 rounded-2xl font-bold text-lg">
                  Book a Live Demo
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      {!hideFooter && <Footer />}
    </div>
  );
}
