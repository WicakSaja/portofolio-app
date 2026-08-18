"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { LightBeamButton } from "@/components/ui/light-beam-button";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const navLinks = [
    { name: "Home", href: "#" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Background layer for scroll and blur - kept separate so header doesn't create a containing block for fixed modal */}
      <div
        className={`absolute inset-0 -z-10 transition-colors duration-300 pointer-events-none ${
          isScrolled || isMobileMenuOpen
            ? "bg-[var(--color-background)]/95 backdrop-blur-md shadow-sm border-b border-[var(--color-border)]"
            : "bg-transparent"
        }`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="#"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-heading font-bold text-xl text-[var(--color-text-primary)]"
            >
              Portfolio
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors text-sm font-medium"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center">
            <LightBeamButton href="#contact" className="px-5 py-2 text-xs font-semibold">
              Hire Me
            </LightBeamButton>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="text-[var(--color-text-primary)] hover:text-[var(--color-primary)] p-2 rounded-lg transition-colors focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-[var(--color-background)] z-40 overflow-y-auto border-t border-[var(--color-border)] flex flex-col justify-between">
          <div className="px-4 pt-4 pb-6 space-y-2 sm:px-3 flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-4 py-3 text-base font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-primary)] rounded-xl transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-6 px-1">
              <LightBeamButton
                href="#contact"
                className="w-full text-center py-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Hire Me
              </LightBeamButton>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
