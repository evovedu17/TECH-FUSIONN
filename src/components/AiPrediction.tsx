import React, { useState } from 'react';
import { TrendingUp, Play, CheckCircle, AlertTriangle, ArrowRight, ShieldCheck, Sparkles, RefreshCcw } from 'lucide-react';
import { DemoBadge } from './DisclaimerBanner';
import { PREDICTION_POINTS } from '../data/kumbhData';

interface AiPredictionProps {
  onActivateDiversion?: () => void;
}

export const AiPrediction: React.FC<AiPredictionProps> = ({ onActivateDiversion }) => {
  const [isRunningPrediction, setIsRunningPrediction] = useState(false);
  const [predictionExecuted, setPredictionExecuted] = useState(false);
  const [activePointIndex, setActivePointIndex] = useState<number>(3); // +45 min peak

  const handleRunPrediction = () => {
    setIsRunningPrediction(true);
    setTimeout(() => {
      setIsRunningPrediction(false);
      setPredictionExecuted(true);
    }, 900);
  };

  const handleReset = () => {
    setPredictionExecuted(false);
    setActivePointIndex(0);
  };

  return (
    <section id="ai-prediction" className="py-20 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-orange-600" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-500">
                TEMPORAL FORECASTING ENGINE
              </span>
              <DemoBadge size="sm" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 uppercase">
              AI CROWD PREDICTION
            </h2>
            <p className="mt-1 text-sm text-zinc-500 max-w-2xl">
              Forecasting density curves up to 45 minutes ahead allows proactive gate balancing before bottleneck shockwaves form.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleRunPrediction}
              disabled={isRunningPrediction}
              id="run-prediction-btn"
              className="px-5 py-2.5 text-xs font-bold font-mono tracking-wider bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white rounded-xl transition-all shadow-xs flex items-center gap-2"
            >
              <Play className={`w-3.5 h-3.5 fill-white ${isRunningPrediction ? 'animate-spin' : ''}`} />
              {isRunningPrediction ? 'COMPUTING TENSOR PROJECTIONS...' : 'RUN PREDICTION'}
            </button>
            {predictionExecuted && (
              <button
                onClick={handleReset}
                className="p-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl"
                title="Reset Forecast"
              >
                <RefreshCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Prediction Curve & Timeline Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          {/* Animated SVG Curve & Hybrid Visualization */}
          <div className="lg:col-span-8 bg-zinc-50 rounded-2xl border border-zinc-200 p-6 relative flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between border-b border-zinc-200/80 pb-3 mb-4">
              <span className="text-xs font-mono font-bold text-zinc-800 uppercase">
                45-MINUTE CROWD ACCUMULATION TRAJECTORY
              </span>
              <span className="text-[10px] font-mono text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded">
                SIMULATION / DEMO DATA
              </span>
            </div>

            {/* Interactive Timeline Selector Pills */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {PREDICTION_POINTS.map((pt, idx) => {
                const isSelected = activePointIndex === idx;
                return (
                  <button
                    key={pt.time}
                    onClick={() => setActivePointIndex(idx)}
                    className={`p-3 rounded-xl border text-left font-mono transition-all ${
                      isSelected
                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                        : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <span className="text-[10px] text-zinc-400 block uppercase font-bold">{pt.time}</span>
                    <span className="text-lg sm:text-xl font-extrabold block mt-0.5">
                      {pt.count.toLocaleString()}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider block mt-1 ${
                        pt.risk === 'CRITICAL'
                          ? 'text-red-400'
                          : pt.risk === 'WARNING'
                          ? 'text-orange-400'
                          : pt.risk === 'ELEVATED'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {pt.risk}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* SVG Forecast Graph with Animated Path */}
            <div className="w-full h-52 relative bg-white rounded-xl border border-zinc-200 p-4 flex items-end">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120" preserveAspectRatio="none">
                {/* Horizontal Grid lines */}
                <line x1="0" y1="20" x2="400" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="60" x2="400" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="100" x2="400" y2="100" stroke="#f1f5f9" strokeWidth="1" />

                {/* Shaded Area under curve */}
                <path
                  d="M 20 100 Q 120 75 200 45 T 380 15 L 380 120 L 20 120 Z"
                  fill="url(#curveGradient)"
                  opacity="0.25"
                />

                <defs>
                  <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ea580c" />
                    <stop offset="100%" stopColor="#ffffff" />
                  </linearGradient>
                </defs>

                {/* Animated Primary Forecast Line */}
                <path
                  d="M 20 100 Q 120 75 200 45 T 380 15"
                  fill="none"
                  stroke="#ea580c"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className={isRunningPrediction ? 'animate-pulse' : ''}
                />

                {/* Timeline key points */}
                <circle cx="20" cy="100" r="5" fill="#0f172a" />
                <circle cx="140" cy="70" r="5" fill="#d97706" />
                <circle cx="260" cy="40" r="5" fill="#ea580c" />
                <circle cx="380" cy="15" r="7" fill="#dc2626" className="animate-ping" opacity="0.4" />
                <circle cx="380" cy="15" r="5" fill="#dc2626" />

                {/* Labels */}
                <text x="20" y="115" fontSize="8" fontFamily="monospace" fill="#64748b" textAnchor="middle">NOW</text>
                <text x="140" y="115" fontSize="8" fontFamily="monospace" fill="#64748b" textAnchor="middle">+15m</text>
                <text x="260" y="115" fontSize="8" fontFamily="monospace" fill="#64748b" textAnchor="middle">+30m</text>
                <text x="380" y="115" fontSize="8" fontFamily="monospace" fill="#dc2626" textAnchor="middle" fontWeight="bold">+45m PEAK</text>
              </svg>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs font-mono text-zinc-500">
              <span>* 27,850 projected peak indicates severe Sangam Ghat congestion</span>
              <span className="font-semibold text-orange-600">THRESHOLD: CRITICAL (&gt;25,000)</span>
            </div>
          </div>

          {/* Right Actionable Output Card */}
          <div className="lg:col-span-4 bg-zinc-50 border border-zinc-200 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-xs">
            <div>
              <div className="border-b border-zinc-200 pb-3 mb-4">
                <span className="text-[10px] font-mono uppercase text-orange-600 font-bold block">
                  ACTIVE PREDICTION WINDOW
                </span>
                <h3 className="text-xl font-extrabold text-zinc-950 font-mono mt-0.5">
                  {PREDICTION_POINTS[activePointIndex].time} FORECAST
                </h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-2xs font-mono">
                  <span className="text-xs text-zinc-400 block uppercase">PROJECTED POPULATION</span>
                  <span className="text-3xl font-extrabold text-zinc-950 block mt-1">
                    {PREDICTION_POINTS[activePointIndex].count.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-zinc-500 block mt-1">
                    +{PREDICTION_POINTS[activePointIndex].count - 18420} from current baseline
                  </span>
                </div>

                <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-xl space-y-2">
                  <span className="text-xs font-mono font-bold uppercase text-orange-800 block">
                    RECOMMENDED MITIGATION:
                  </span>
                  <p className="text-xs text-orange-950 font-semibold leading-relaxed">
                    DIVERT INCOMING FLOW — Divert 30% of approaching Sangam pilgrims at Sector 12 gantry to Route B.
                  </p>
                  <p className="text-[11px] text-orange-700 leading-normal">
                    Early diversion flattens the arrival peak, ensuring crowd density never crosses 88% capacity.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onActivateDiversion}
                className="w-full py-3.5 px-4 text-xs font-bold tracking-wider bg-zinc-900 hover:bg-orange-600 text-white rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
              >
                ACTIVATE PROACTIVE DIVERSION
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 25: PREDICTION PIPELINE DIAGRAM */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider block">
              MODEL TOPOLOGY
            </span>
            <h4 className="text-xl sm:text-2xl font-black text-zinc-950 mt-1">
              PROTOTYPE PREDICTION MODEL
            </h4>
            <p className="text-xs text-zinc-500 mt-1">
              Conceptual multi-variate time-series inference combining kinematic flow with microclimate strain.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-zinc-200 font-mono text-xs text-center leading-relaxed">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="px-2.5 py-1 bg-zinc-100 rounded text-zinc-800">CURRENT CROWD</span>
              <span>+</span>
              <span className="px-2.5 py-1 bg-zinc-100 rounded text-zinc-800">ENTRY / EXIT</span>
              <span>+</span>
              <span className="px-2.5 py-1 bg-zinc-100 rounded text-zinc-800">CAMERA</span>
              <span>+</span>
              <span className="px-2.5 py-1 bg-zinc-100 rounded text-zinc-800">BLE ZONE DATA</span>
              <span>+</span>
              <span className="px-2.5 py-1 bg-zinc-100 rounded text-zinc-800">ENVIRONMENT</span>
              <span>+</span>
              <span className="px-2.5 py-1 bg-zinc-100 rounded text-zinc-800">HISTORICAL PATTERNS</span>
              <span className="text-orange-500 font-bold">↓</span>
              <span className="px-3 py-1 bg-orange-100 text-orange-950 font-bold rounded border border-orange-300">
                PREDICTION MODEL
              </span>
              <span className="text-orange-500 font-bold">↓</span>
              <span className="px-2.5 py-1 bg-zinc-900 text-white font-bold rounded">
                FUTURE CROWD (27,850)
              </span>
              <span className="text-orange-500 font-bold">↓</span>
              <span className="px-2.5 py-1 bg-red-100 text-red-800 font-bold rounded">
                RISK: CRITICAL
              </span>
              <span className="text-orange-500 font-bold">↓</span>
              <span className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded">
                RECOMMENDATION: DIVERT 30%
              </span>
            </div>
          </div>

          <div className="text-center mt-4 text-[11px] font-mono text-zinc-400">
            * PROTOTYPE DISCLAIMER: Model runs simulated synthetic regression curves for conceptual evaluation. Does not claim real-world statistical calibration.
          </div>
        </div>
      </div>
    </section>
  );
};
