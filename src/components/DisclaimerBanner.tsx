import React from 'react';
import { AlertTriangle, Info, ShieldCheck } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <aside
      aria-label="Simulation Notice"
      className="w-full bg-orange-600 text-white px-4 py-2 text-xs font-mono tracking-wider flex items-center justify-between shadow-xs sticky top-0 z-50 border-b border-orange-700/50"
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
        <div className="flex items-center gap-2 font-bold uppercase">
          <AlertTriangle className="w-4 h-4 text-orange-200 shrink-0" />
          <span>PROTOTYPE NOTICE: SIMULATION / DEMO DATA ONLY</span>
        </div>
        <div className="text-[11px] text-orange-100 font-normal">
          Conceptual crowd safety architecture. Not a real-time event feed.
        </div>
      </div>
    </aside>
  );
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
              <span className="font-semibold text-zinc-900 text-sm">PROTOTYPE TRANSPARENCY NOTICE</span>
              <DemoBadge size="sm" />
            </div>
            <p className="text-xs text-zinc-500 mt-1 max-w-3xl leading-relaxed">
              This website demonstrates a conceptual AI + IoT architecture. Sensor readings, crowd counts, predictions,
              locations and emergency events shown here are simulated for demonstration purposes. Do not present simulated
              information as real-time Kumbh Mela data.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 shrink-0">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
            V1.4 PROTOTYPE CORE
          </span>
          <span>•</span>
          <span>SENSE • PREDICT • REDIRECT • PROTECT</span>
        </div>
      </div>
    </footer>
  );
};
