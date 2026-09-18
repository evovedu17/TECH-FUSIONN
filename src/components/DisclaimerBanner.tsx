import React from 'react';
import { Info, ShieldCheck } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return null;
};

export const DemoBadge: React.FC<{ className?: string; size?: 'sm' | 'md' }> = ({
  className = '',
  size = 'md'
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider rounded-full border border-orange-200 bg-orange-50/80 text-orange-700 font-semibold shadow-xs ${
        size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
      } ${className}`}
      id="simulation-demo-badge"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse"></span>
      SIMULATION / DEMO DATA
    </span>
  );
};

export const BottomDisclaimer: React.FC = () => {
  return (
    <footer className="w-full border-t border-zinc-200 bg-zinc-50/95 py-6 px-4 sm:px-8 text-zinc-600 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 p-1.5 bg-orange-100 rounded-md text-orange-600 shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="font-semibold text-zinc-900 text-sm">SYSTEM ARCHITECTURE SUMMARY</span>
              <DemoBadge size="sm" />
            </div>
            <p className="text-xs text-zinc-500 mt-1 max-w-3xl leading-relaxed">
              This system demonstrates an AI + IoT architecture. Sensor readings, crowd counts, predictions,
              locations and emergency events shown here are simulated for demonstration purposes.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 shrink-0">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
            CORE ARCHITECTURE
          </span>
          <span>•</span>
          <span>SENSE • PREDICT • REDIRECT • PROTECT</span>
        </div>
      </div>
    </footer>
  );
};
