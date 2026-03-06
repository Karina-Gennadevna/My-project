'use client';

import { useState, useEffect } from 'react';

const links = [
  { label: 'Методология', href: '#methodology' },
  { label: 'Что получите', href: '#deliverables' },
  { label: 'Демо', href: '#demo' },
  { label: 'Процесс', href: '#process' },
  { label: 'FAQ', href: '#faq' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0B0F14]/90 backdrop-blur-xl border-b border-white/[0.07]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <a href="#" className="flex items-center gap-0 font-bold text-base shrink-0">
          <span className="text-blue-500">K</span>
          <span className="text-gray-100">-AQS</span>
          <span className="text-blue-500">™</span>
        </a>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-5">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-gray-400 hover:text-gray-100 transition-colors duration-150"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <a href="#start" className="btn-primary hidden md:inline-flex text-sm py-2 px-5">
          Пройти диагностику
        </a>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2 text-gray-400 hover:text-gray-100 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={open}
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#111827] border-t border-white/[0.07] px-4 py-5 space-y-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-sm text-gray-400 hover:text-gray-100 border-b border-white/[0.05] transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#start"
            onClick={() => setOpen(false)}
            className="btn-primary mt-4 w-full justify-center text-sm"
          >
            Пройти диагностику
          </a>
        </div>
      )}
    </header>
  );
}
