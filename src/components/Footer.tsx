import React from 'react';
import { Shield, Sparkles, HeartHandshake, ExternalLink } from 'lucide-react';
import { DemoBadge } from './DisclaimerBanner';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 text-white border-t border-zinc-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center font-black text-white text-base">
                K
              </div>
              <span className="text-xl font-black font-mono tracking-wider text-white">
                AI KUMBH
              </span>
              <DemoBadge size="sm" />
            </div>

            <p className="font-mono text-xs font-bold text-orange-400 uppercase tracking-wider">
              SENSE. PREDICT. REDIRECT. PROTECT.
            </p>

            <p className="text-zinc-400 text-xs sm:text-sm max-w-md leading-relaxed">
              A conceptual 3D AI + IoT crowd-management and public-safety platform designed to demonstrate modern edge sensor fusion,
              temporal crowd forecasting, opt-in proximity safety bands, and adaptive pedestrian redirection for large-scale mass gatherings.
            </p>
          </div>

          {/* Quick Nav Links */}
          <div className="space-y-3 font-mono text-xs">
            <span className="text-zinc-500 uppercase font-bold block mb-2">ARCHITECTURAL SECTIONS</span>
            <ul className="space-y-2 text-zinc-400">
              <li><a href="#hero" className="hover:text-white transition-colors">3D Crowd Sim</a></li>
              <li><a href="#sensor-network" className="hover:text-white transition-colors">Hardware Ecosystem</a></li>
              <li><a href="#live-intelligence" className="hover:text-white transition-colors">Live Intelligence</a></li>
              <li><a href="#smart-map" className="hover:text-white transition-colors">Interactive 3D Map</a></li>
              <li><a href="#alternate-routing" className="hover:text-white transition-colors">Alternate Routing</a></li>
              <li><a href="#sensors" className="hover:text-white transition-colors">The Sensing Layer</a></li>
            </ul>
          </div>

          {/* Modules Col */}
          <div className="space-y-3 font-mono text-xs">
            <span className="text-zinc-500 uppercase font-bold block mb-2">SAFETY &amp; RESPONSE</span>
            <ul className="space-y-2 text-zinc-400">
              <li><a href="#sensor-fusion" className="hover:text-white transition-colors">Sensor Fusion Core</a></li>
              <li><a href="#lost-person" className="hover:text-white transition-colors">Lost Person System</a></li>
              <li><a href="#emergency" className="hover:text-white transition-colors">Emergency Response</a></li>
              <li><a href="#ai-prediction" className="hover:text-white transition-colors">AI Crowd Prediction</a></li>
              <li><a href="#resilience" className="hover:text-white transition-colors">Sensor Failure Demo</a></li>
              <li><a href="#impact" className="hover:text-white transition-colors">Projected Outcomes</a></li>
            </ul>
          </div>
        </div>

        {/* Mandated Disclaimers & Ethics */}
        <div className="pt-8 border-t border-zinc-800 text-[11px] font-mono text-zinc-500 space-y-3">
          <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-400 leading-relaxed">
            <strong className="text-zinc-300 block mb-1">SYSTEM ARCHITECTURE:</strong>
            AI Kumbh demonstrates an intelligent IoT sensor fusion and AI-driven crowd management architecture designed for large-scale congregations.
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
            <span>© {new Date().getFullYear()} AI KUMBH — 3D INTELLIGENT CROWD MANAGEMENT SYSTEM</span>
            <span className="text-orange-400">VERSION 1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
