"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Activity } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const navigate = (path: string) => {
    if (path === "/") {
      if (pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push("/");
      }
    } else if (path.startsWith("/#")) {
      const id = path.replace("/#", "");
      const element = document.getElementById(id);

      if (pathname === "/" && element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push(path);
      }
    } else {
      router.push(path);
    }

    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: "Features", path: "/#features" },
    { name: "Pricing", path: "/#pricing" },
    { name: "About Us", path: "/#logo-cloud" },
  ];

  // All mobile menu items (nav links + divider + auth) for staggered animation
  const mobileMenuItems = [
    ...navLinks.map((link) => ({ type: "link" as const, ...link })),
    { type: "divider" as const, name: "", path: "" },
    { type: "login" as const, name: "Login", path: "/login" },
    { type: "cta" as const, name: "Get Started", path: "/register" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled
          ? "bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 py-3"
          : "bg-transparent py-6"
      } ${
        isScrolled && !isMobileMenuOpen
          ? "max-md:-translate-y-full max-md:opacity-0"
          : ""
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 group cursor-pointer z-[110]"
        >
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(234,88,12,0.5)]">
            <Activity className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black transition-colors duration-300 group-hover:text-orange-500">
            My Clinic
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
          <button
            onClick={() => navigate("/login")}
            className="text-sm font-bold cursor-pointer hover:text-orange-500 transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-orange-600 px-6 py-3 rounded-xl font-black cursor-pointer hover:bg-orange-700 transition-all active:scale-95"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden z-[110] p-2 cursor-pointer text-white"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <div className="relative w-7 h-7">
            <X
              size={28}
              className={`absolute inset-0 transition-all duration-300 ${
                isMobileMenuOpen
                  ? "rotate-0 opacity-100"
                  : "rotate-90 opacity-0"
              }`}
            />
            <Menu
              size={28}
              className={`absolute inset-0 transition-all duration-300 ${
                isMobileMenuOpen
                  ? "-rotate-90 opacity-0"
                  : "rotate-0 opacity-100"
              }`}
            />
          </div>
        </button>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 bg-slate-950/95 backdrop-blur-md z-[105] flex flex-col items-center justify-center gap-6 transition-all duration-500 ease-in-out md:hidden ${
            isMobileMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          {mobileMenuItems.map((item, index) => {
            const delay = isMobileMenuOpen ? index * 80 : 0;

            if (item.type === "divider") {
              return (
                <div
                  key="divider"
                  className={`w-16 h-1 bg-slate-800 rounded-full transition-all duration-500`}
                  style={{
                    transitionDelay: `${delay}ms`,
                    opacity: isMobileMenuOpen ? 1 : 0,
                    transform: isMobileMenuOpen ? "scaleX(1)" : "scaleX(0)",
                  }}
                />
              );
            }

            if (item.type === "login") {
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="text-xl font-bold cursor-pointer text-slate-300 active:text-orange-500 transition-all duration-500 py-2 px-6"
                  style={{
                    transitionDelay: `${delay}ms`,
                    opacity: isMobileMenuOpen ? 1 : 0,
                    transform: isMobileMenuOpen
                      ? "translateY(0)"
                      : "translateY(20px)",
                  }}
                >
                  {item.name}
                </button>
              );
            }

            if (item.type === "cta") {
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="bg-orange-600 px-10 py-4 rounded-xl font-black cursor-pointer active:scale-95 transition-all duration-500 text-lg"
                  style={{
                    transitionDelay: `${delay}ms`,
                    opacity: isMobileMenuOpen ? 1 : 0,
                    transform: isMobileMenuOpen
                      ? "translateY(0)"
                      : "translateY(20px)",
                  }}
                >
                  {item.name}
                </button>
              );
            }

            // Nav link
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="text-2xl font-bold text-slate-300 active:text-orange-500 cursor-pointer transition-all duration-500 py-2 px-6"
                style={{
                  transitionDelay: `${delay}ms`,
                  opacity: isMobileMenuOpen ? 1 : 0,
                  transform: isMobileMenuOpen
                    ? "translateY(0)"
                    : "translateY(20px)",
                }}
              >
                {item.name}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
