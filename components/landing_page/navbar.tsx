'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, Activity } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigate = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Features', path: '/#features' },
    { name: 'Pricing', path: '/#pricing' },
    { name: 'About Us', path: '/#about' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all ${
      isScrolled ? 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 py-3' : 'bg-transparent py-6'
    }`}>
      <div className="container mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <button onClick={() => navigate('/')} className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
            <Activity className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black">DentFlow</span>
        </button>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className="px-5 py-2 text-sm font-bold text-slate-300 hover:text-white"
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-4">
          <button onClick={() => navigate('/login')} className="text-sm font-bold">
            Login
          </button>
          <button onClick={() => navigate('/register')} className="bg-orange-600 px-6 py-3 rounded-xl font-black">
            Get Started
          </button>
        </div>

        {/* Mobile */}
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
