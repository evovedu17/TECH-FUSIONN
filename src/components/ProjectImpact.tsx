import React from 'react';
import { Shield, Clock, Compass, BarChart3, ArrowUpRight } from 'lucide-react';
import { DemoBadge } from './DisclaimerBanner';

export const ProjectImpact: React.FC = () => {
  return (
    <section id="impact" className="py-20 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <DemoBadge size="sm" className="mb-3" />
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 uppercase">
            PROJECTED IMPACT &amp; OUTCOMES
          </h2>
          <p className="mt-3 text-base text-zinc-600">
            Translating predictive edge intelligence into quantifiable safety improvements for massive spiritual gatherings.
          </p>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Card 1 */}
          <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-200 flex flex-col justify-between hover:border-zinc-300 transition-colors shadow-2xs">
            <div>
              <div className="w-12 h-12 bg-white rounded-xl border border-zinc-200 flex items-center justify-center text-orange-600 mb-6 shadow-2xs">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-mono font-bold uppercase text-zinc-950 tracking-wider">
                PREVENT STAMPEDES
              </h3>
              <p className="text-2xl font-black text-orange-600 mt-2 font-mono">
                UP TO 40%
              </p>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                Reduction in localized bottleneck density through 30-minute advance alternate routing advisories.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-200/60 flex items-center justify-between text-[10px] font-mono text-zinc-400">
              <span>CRITICAL BOTTLENECKS</span>
              <span>SIMULATED IMPACT</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-200 flex flex-col justify-between hover:border-zinc-300 transition-colors shadow-2xs">
            <div>
              <div className="w-12 h-12 bg-white rounded-xl border border-zinc-200 flex items-center justify-center text-purple-600 mb-6 shadow-2xs">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-mono font-bold uppercase text-zinc-950 tracking-wider">
                REDUCE SEARCH TIME
              </h3>
              <p className="text-2xl font-black text-purple-600 mt-2 font-mono">
                FASTER
              </p>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                Zone-level proximity isolation narrows search radius from hundreds of acres down to a specific gate sector.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-200/60 flex items-center justify-between text-[10px] font-mono text-zinc-400">
              <span>LOST PILGRIMS</span>
              <span>SIMULATED IMPACT</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-200 flex flex-col justify-between hover:border-zinc-300 transition-colors shadow-2xs">
            <div>
              <div className="w-12 h-12 bg-white rounded-xl border border-zinc-200 flex items-center justify-center text-sky-600 mb-6 shadow-2xs">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-mono font-bold uppercase text-zinc-950 tracking-wider">
                OPTIMIZE PILGRIM FLOW
              </h3>
              <p className="text-2xl font-black text-sky-600 mt-2 font-mono">
                DYNAMIC
              </p>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                Live flow diversion balances Ghat queues without sudden barricade closures or counter-flow chaos.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-200/60 flex items-center justify-between text-[10px] font-mono text-zinc-400">
              <span>GHAT INFLOW</span>
              <span>SIMULATED IMPACT</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-200 flex flex-col justify-between hover:border-zinc-300 transition-colors shadow-2xs">
            <div>
              <div className="w-12 h-12 bg-white rounded-xl border border-zinc-200 flex items-center justify-center text-emerald-600 mb-6 shadow-2xs">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-mono font-bold uppercase text-zinc-950 tracking-wider">
                RESOURCE ALLOCATION
              </h3>
              <p className="text-2xl font-black text-emerald-600 mt-2 font-mono">
                DATA-DRIVEN
              </p>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                Emergency ambulances, water misting trucks, and volunteer stations positioned precisely where heat stress spikes.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-200/60 flex items-center justify-between text-[10px] font-mono text-zinc-400">
              <span>FIELD UNITS</span>
              <span>SIMULATED IMPACT</span>
            </div>
          </div>
        </div>

        {/* Clean Summary Metric Banner */}
        <div className="p-6 bg-zinc-900 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
            <span>SIMULATED / PROJECTED IMPACT FOR MASS GATHERINGS</span>
          </div>
          <span className="text-zinc-400 text-[11px]">
            * Values represent simulated targets of the conceptual prototype framework.
          </span>
        </div>
      </div>
    </section>
  );
};
