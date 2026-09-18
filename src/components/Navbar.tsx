import React, { useState, useEffect } from 'react';
import { Menu, X, Radio, Activity, Sparkles } from 'lucide-react';
import { DemoBadge } from './DisclaimerBanner';

interface NavbarProps {
  onOpenCommandCenter: () => void;
  onOpenPresentation: () => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCommandCenter,
  onOpenPresentation,
  activeSection,
  setActiveSection
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'HOME', href: '#home', id: 'home' },
    { label: 'LIVE INTELLIGENCE', href: '#live-intelligence', id: 'live-intelligence' },
    { label: 'SMART MAP', href: '#smart-map', id: 'smart-map' },
    { label: 'SENSORS', href: '#sensors', id: 'sensors' },
    { label: 'LOST PERSON', href: '#lost-person', id: 'lost-person' },
    { label: 'EMERGENCY', href: '#emergency', id: 'emergency' },
    { label: 'AI PREDICTION', href: '#ai-prediction', id: 'ai-prediction' },
    { label: 'PRESENTATION', href: '#presentation', id: 'presentation', isAction: true }
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.id === 'presentation') {
      onOpenPresentation();
    } else {
      setActiveSection(item.id);
      const element = document.getElementById(item.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="global-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-zinc-200/80 shadow-xs'
          : 'bg-white/70 backdrop-blur-xs border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand */}
        <a
          href="#home"
          onClick={() => setActiveSection('home')}
          className="flex items-center gap-3 group focus:outline-hidden"
          id="navbar-brand"
        >
          <div className="w-8 h-8 rounded-md bg-zinc-950 text-white flex items-center justify-center font-mono font-bold text-sm tracking-wider shadow-sm group-hover:bg-orange-600 transition-colors">
            AK
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-zinc-950 text-base leading-tight group-hover:text-orange-600 transition-colors">
              AI KUMBH
            </span>
            <span className="text-[10px] font-mono tracking-widest text-zinc-400">
              CROWD INTELLIGENCE
            </span>
          </div>
        </a>

        {/* Center Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-1.5" id="desktop-nav-menu">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`px-3 py-1.5 text-xs font-semibold tracking-wider transition-colors rounded-md ${
                activeSection === item.id
                  ? 'text-orange-600 bg-orange-50/60'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/70'
              }`}
              id={`nav-link-${item.id}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <DemoBadge size="sm" className="hidden lg:inline-flex" />
          <button
            onClick={onOpenCommandCenter}
            id="open-command-center-btn"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wider text-white bg-zinc-900 hover:bg-orange-600 active:bg-orange-700 rounded-md transition-all shadow-xs hover:shadow-sm"
          >
            <Radio className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
            OPEN COMMAND CENTER
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 xl:hidden">
          <button
            onClick={onOpenCommandCenter}
            className="sm:hidden px-3 py-1.5 text-xs font-semibold text-white bg-zinc-900 rounded-md"
          >
            CMD
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-600 hover:text-zinc-950 rounded-md hover:bg-zinc-100"
            aria-label="Toggle Menu"
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white/98 backdrop-blur-xl border-b border-zinc-200 px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="py-2 border-b border-zinc-100 mb-2">
            <DemoBadge size="sm" />
          </div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className="w-full text-left px-3 py-2.5 text-sm font-medium text-zinc-700 hover:text-orange-600 hover:bg-orange-50/50 rounded-md"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 border-t border-zinc-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCommandCenter();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-zinc-900 hover:bg-orange-600 rounded-md"
            >
              <Radio className="w-4 h-4 text-orange-400" />
              OPEN COMMAND CENTER
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
