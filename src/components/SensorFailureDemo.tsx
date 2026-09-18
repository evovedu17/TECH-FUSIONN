import React, { useState } from 'react';
import { ShieldCheck, CameraOff, RefreshCw, AlertCircle, CheckCircle, Radio, Volume2, Cpu } from 'lucide-react';
import { DemoBadge } from './DisclaimerBanner';

export const SensorFailureDemo: React.FC = () => {
  const [isCameraFailed, setIsCameraFailed] = useState(false);

  return (
    <section id="resilience" className="py-20 bg-zinc-50 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-500">
              FAIL-SAFE ARCHITECTURE
            </span>
            <DemoBadge size="sm" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 uppercase">
            SENSOR FAILURE &amp; DEGRADED RECOVERY
          </h2>
          <p className="mt-2 text-zinc-600 text-sm sm:text-base leading-relaxed">
            In harsh outdoor conditions, camera lenses can smudge, fail from power surges, or experience cable severance.
            AI Kumbh demonstrates how multi-modal sensor fusion gracefully degrades rather than catastrophically failing.
          </p>
        </div>

        {/* Resilience Interactive Demonstration Card */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-6 mb-6">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-zinc-400">
                EDGE NODE TELEMETRY • SECTOR 12
              </span>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xl font-bold font-mono text-zinc-950">
                  CAMERA 04 STATUS:
                </span>
                <span
                  className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${
                    isCameraFailed
                      ? 'bg-red-100 text-red-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {isCameraFailed ? 'OFFLINE (SIMULATED FAILURE)' : 'ONLINE & STREAMING'}
                </span>
              </div>
            </div>

            <div>
              <button
                onClick={() => setIsCameraFailed(!isCameraFailed)}
                id="toggle-sensor-failure-btn"
                className={`py-3 px-5 text-xs font-mono font-bold tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-2 ${
                  isCameraFailed
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {isCameraFailed ? (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    RESTORE SENSOR
                  </>
                ) : (
                  <>
                    <CameraOff className="w-4 h-4" />
                    SIMULATE CAMERA FAILURE
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Active Sensor Nodes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6 font-mono text-xs">
            <div
              className={`p-4 rounded-xl border transition-all ${
                isCameraFailed
                  ? 'bg-red-50/50 border-red-200 opacity-60'
                  : 'bg-zinc-50 border-zinc-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold">CAMERA 04</span>
                <span className={isCameraFailed ? 'text-red-600' : 'text-emerald-600'}>
                  {isCameraFailed ? 'OFFLINE' : 'ONLINE'}
                </span>
              </div>
              <span className="text-[11px] text-zinc-500">Weight: 40%</span>
            </div>

            <div className="p-4 rounded-xl border bg-orange-50/40 border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-orange-950">IR / ToF LASER</span>
                <span className="text-emerald-600 font-bold">ONLINE</span>
              </div>
              <span className="text-[11px] text-orange-800">
                {isCameraFailed ? 'Compensating (35% weight)' : 'Weight: 25%'}
              </span>
            </div>

            <div className="p-4 rounded-xl border bg-amber-50/40 border-amber-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-amber-950">ACOUSTIC SPL</span>
                <span className="text-emerald-600 font-bold">ONLINE</span>
              </div>
              <span className="text-[11px] text-amber-800">
                {isCameraFailed ? 'Activity Boost (25% weight)' : 'Weight: 15%'}
              </span>
            </div>

            <div className="p-4 rounded-xl border bg-purple-50/40 border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-purple-950">BLE PROXIMITY</span>
                <span className="text-emerald-600 font-bold">ONLINE</span>
              </div>
              <span className="text-[11px] text-purple-800">
                {isCameraFailed ? 'Zone Triangulation (25%)' : 'Weight: 20%'}
              </span>
            </div>
          </div>

          {/* Fallback Confidence Assessment */}
          <div className="p-5 bg-zinc-900 rounded-xl text-white font-mono text-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">FUSION INFERENCE ACCURACY:</span>
              <span
                className={`text-base font-bold ${
                  isCameraFailed ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {isCameraFailed
                  ? 'STATUS: SYSTEM MAINTAINING 82% CONFIDENCE'
                  : 'STATUS: FULL 98% MULTI-SPECTRAL ACCURACY'}
              </span>
            </div>

            {/* Prompt Mandated Resilience Message */}
            <div className="p-3 bg-zinc-800 rounded-lg text-zinc-300 text-xs leading-relaxed border border-zinc-700">
              "System degrades gracefully. Loss of visual data is partially compensated by spatial and acoustic sensor fusion."
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
              <span>ACTIVE FALLBACK: IR/ToF + ACOUSTIC + BLE MESH</span>
              <DemoBadge size="sm" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
