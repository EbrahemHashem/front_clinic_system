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
    // 1. Handle Top of Page / Logo click
    if (path === '/') {
      if (pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        router.push('/');
      }
    } 
    // 2. Handle Section Anchors (e.g., /#features)
    else if (path.startsWith('/#')) {
      const id = path.replace('/#', '');
      const element = document.getElementById(id);

      if (pathname === '/' && element) {
        // Smooth scroll if already on the home page
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Navigate home if on a different page (Next.js will handle the anchor)
        router.push(path);
      }
    } 
    // 3. Handle separate pages (Login/Register)
    else {
      router.push(path);
    }
    
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Features', path: '/#features' },
    { name: 'Pricing', path: '/#pricing' },
    { name: 'About Us', path: '/#logo-cloud' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
      isScrolled ? 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 py-3' : 'bg-transparent py-6'
    }`}>
      <div className="container mx-auto px-6 flex items-center justify-between">

        {/* Logo - Smooth Scroll to top */}
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-3 group cursor-pointer z-[110]"
        >
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(234,88,12,0.5)]">
            <Activity className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black transition-colors duration-300 group-hover:text-orange-500">
            DentFlow
          </span>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className="px-5 py-2 text-sm font-bold text-slate-300 hover:text-orange-500 transition-colors cursor-pointer"
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-4">
          <button onClick={() => navigate('/login')} className="text-sm font-bold cursor-pointer hover:text-orange-500 transition-colors">
            Login
          </button>
          <button 
            onClick={() => navigate('/register')} 
            className="bg-orange-600 px-6 py-3 rounded-xl font-black cursor-pointer hover:bg-orange-700 transition-all active:scale-95"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="md:hidden z-[110] p-2 cursor-pointer text-white"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 bg-slate-950 z-[105] flex flex-col items-center justify-center gap-8 transition-transform duration-500 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}>
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className="text-2xl font-bold text-slate-300 hover:text-orange-500 cursor-pointer"
            >
              {link.name}
            </button>
          ))}
          <div className="w-12 h-1 bg-slate-800 rounded-full" />
          <button onClick={() => navigate('/login')} className="text-xl font-bold cursor-pointer hover:text-orange-500">
            Login
          </button>
          <button onClick={() => navigate('/register')} className="bg-orange-600 px-10 py-4 rounded-xl font-black cursor-pointer active:scale-95">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;