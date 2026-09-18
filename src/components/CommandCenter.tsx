import React, { useState } from 'react';
import {
  LayoutDashboard,
  MapPin,
  Radio,
  TrendingUp,
  UserCheck,
  ShieldAlert,
  X,
  AlertTriangle,
  ArrowRight,
  Maximize2,
  Minimize2,
  RefreshCw,
  GitFork
} from 'lucide-react';
import { DemoBadge } from './DisclaimerBanner';
import { SmartMap3D } from './SmartMap3D';
import { KUMBHA_SECTORS, SENSOR_NODES, DEFAULT_LOST_PERSON } from '../data/kumbhData';
import { Sector } from '../types';

interface CommandCenterProps {
  onClose?: () => void;
}

type CommandTab = 'OVERVIEW' | 'MAP' | 'SENSORS' | 'PREDICTIONS' | 'LOST_PERSON' | 'EMERGENCY';

export const CommandCenter: React.FC<CommandCenterProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<CommandTab>('OVERVIEW');
  const [selectedSector, setSelectedSector] = useState<Sector>(KUMBHA_SECTORS[0]);
  const [alternateRouteActive, setAlternateRouteActive] = useState(false);
  const [emergencyTriggered, setEmergencyTriggered] = useState(false);

  return (
    <div className="bg-zinc-900 text-white min-h-screen flex flex-col font-sans">
      {/* Command Center Top Navigation Bar */}
      <header className="px-6 py-4 border-b border-zinc-800 bg-zinc-950 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <h1 className="text-lg font-black font-mono tracking-wider text-white">
              AI KUMBH COMMAND CENTER
            </h1>
          </div>
          <span className="text-[10px] font-mono bg-zinc-800 text-orange-400 px-2.5 py-0.5 rounded border border-zinc-700">
            INTEGRATED SITUATION ROOM
          </span>
          <DemoBadge size="sm" />
        </div>

        <div className="flex items-center gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5"
            >
              <X className="w-4 h-4" />
              EXIT COMMAND CENTER
            </button>
          )}
        </div>
      </header>

      {/* View Switcher Sub-Tabs */}
      <div className="px-6 py-2.5 bg-zinc-950/80 border-b border-zinc-800 flex items-center gap-2 overflow-x-auto text-xs font-mono">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-2 ${
            activeTab === 'OVERVIEW' ? 'bg-orange-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          SYSTEM OVERVIEW
        </button>
        <button
          onClick={() => setActiveTab('MAP')}
          className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-2 ${
            activeTab === 'MAP' ? 'bg-orange-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          3D LIVE MAP
        </button>
        <button
          onClick={() => setActiveTab('SENSORS')}
          className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-2 ${
            activeTab === 'SENSORS' ? 'bg-orange-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          SENSOR NETWORK
        </button>
        <button
          onClick={() => setActiveTab('PREDICTIONS')}
          className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-2 ${
            activeTab === 'PREDICTIONS' ? 'bg-orange-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          PREDICTIONS
        </button>
        <button
          onClick={() => setActiveTab('LOST_PERSON')}
          className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-2 ${
            activeTab === 'LOST_PERSON' ? 'bg-orange-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          LOST PERSON LOCATOR
        </button>
        <button
          onClick={() => setActiveTab('EMERGENCY')}
          className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-2 ${
            activeTab === 'EMERGENCY' ? 'bg-red-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          EMERGENCY PROTOCOLS
        </button>
      </div>

      {/* Main Command Center Body */}
      <main className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
            {/* Top Quick Status Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase block">AGGREGATE DENSITY</span>
                <span className="text-3xl font-extrabold text-white mt-1 block">18,420</span>
                <span className="text-[11px] text-orange-400 mt-1 block">+14% hourly delta</span>
              </div>
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase block">ACTIVE SENSOR NODES</span>
                <span className="text-3xl font-extrabold text-emerald-400 mt-1 block">8 / 8 ONLINE</span>
                <span className="text-[11px] text-zinc-400 mt-1 block">Mesh latency 18ms</span>
              </div>
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase block">CRITICAL BOTTLENECK</span>
                <span className="text-3xl font-extrabold text-red-400 mt-1 block">SECTOR 12</span>
                <span className="text-[11px] text-red-500 mt-1 block">Density 87% • High Risk</span>
              </div>
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase block">ACTIVE DIVERSION</span>
                <span className="text-3xl font-extrabold text-sky-400 mt-1 block">
                  {alternateRouteActive ? '30% DIVERTED' : 'STANDBY (0%)'}
                </span>
                <span className="text-[11px] text-zinc-400 mt-1 block">Route B Causeway</span>
              </div>
            </div>

            {/* Central Grid: Map + Side Interconnected Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-8 bg-zinc-950 rounded-2xl border border-zinc-800 p-2 overflow-hidden min-h-[480px]">
                <SmartMap3D
                  initialSectorId={selectedSector.id}
                  onActivateAlternateRoute={() => setAlternateRouteActive(true)}
                />
              </div>

              {/* Side Interconnected Action Dock */}
              <div className="lg:col-span-4 bg-zinc-950 rounded-2xl border border-zinc-800 p-6 flex flex-col justify-between space-y-6">
                <div>
                  <div className="border-b border-zinc-800 pb-3 mb-4">
                    <span className="text-[10px] font-mono uppercase text-orange-400 font-bold block">
                      SECTOR DETAIL INSPECTOR
                    </span>
                    <h3 className="text-xl font-bold font-mono text-white mt-1">
                      {selectedSector.name} ({selectedSector.id})
                    </h3>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between p-2.5 bg-zinc-900 rounded-lg border border-zinc-800">
                      <span className="text-zinc-400">Headcount:</span>
                      <span className="font-bold text-white">{selectedSector.currentCount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between p-2.5 bg-zinc-900 rounded-lg border border-zinc-800">
                      <span className="text-zinc-400">Capacity Strain:</span>
                      <span
                        className={`font-bold ${
                          selectedSector.currentDensity > 80
                            ? 'text-red-400'
                            : selectedSector.currentDensity > 50
                            ? 'text-orange-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {selectedSector.currentDensity}% ({selectedSector.status})
                      </span>
                    </div>
                    <div className="flex justify-between p-2.5 bg-zinc-900 rounded-lg border border-zinc-800">
                      <span className="text-zinc-400">Predicted +30m:</span>
                      <span className="font-bold text-orange-400">
                        {selectedSector.predictedDensity}%
                      </span>
                    </div>
                  </div>

                  {/* Interconnected Fast Action Buttons */}
                  <div className="pt-6 space-y-2 font-mono text-xs">
                    <button
                      onClick={() => setAlternateRouteActive(!alternateRouteActive)}
                      className={`w-full py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                        alternateRouteActive
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                      }`}
                    >
                      <GitFork className="w-4 h-4" />
                      {alternateRouteActive ? 'DISABLE DIVERSION' : 'ACTIVATE 30% DIVERSION'}
                    </button>

                    <button
                      onClick={() => setEmergencyTriggered(!emergencyTriggered)}
                      className={`w-full py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                        emergencyTriggered
                          ? 'bg-red-600 text-white animate-pulse'
                          : 'bg-zinc-800 hover:bg-red-950/40 text-red-400 border border-red-900/40'
                      }`}
                    >
                      <ShieldAlert className="w-4 h-4" />
                      {emergencyTriggered ? 'EMERGENCY PROTOCOL ENGAGED' : 'TRIGGER EMERGENCY DRILL'}
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-[11px] font-mono text-zinc-400">
                  Click any sector on the 3D map to inspect sensor distribution and pedestrian density vectors.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'MAP' && (
          <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-4 h-[calc(100vh-200px)]">
            <SmartMap3D
              initialSectorId={selectedSector.id}
              onActivateAlternateRoute={() => setAlternateRouteActive(true)}
            />
          </div>
        )}

        {activeTab === 'SENSORS' && (
          <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 space-y-6 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-sm font-bold text-white uppercase">CONNECTED IOT HARDWARE NODES</span>
              <DemoBadge size="sm" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {SENSOR_NODES.map((node) => (
                <div key={node.id} className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{node.name}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <div className="text-zinc-400 text-[11px]">{node.location}</div>
                  <div className="text-zinc-500 text-[10px]">Type: {node.type}</div>
                  <div className="pt-2 border-t border-zinc-800 flex justify-between text-zinc-300">
                    <span>Battery: {node.battery || 100}%</span>
                    <span>Signal: {node.signal}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'PREDICTIONS' && (
          <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 space-y-6 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-sm font-bold text-white uppercase">AI PREDICTIVE FORECAST SUMMARY</span>
              <DemoBadge size="sm" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block">NOW</span>
                <span className="text-2xl font-bold text-white mt-1 block">18,420</span>
                <span className="text-emerald-400 text-[10px] mt-1 block">NORMAL</span>
              </div>
              <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block">+15 MIN</span>
                <span className="text-2xl font-bold text-white mt-1 block">21,100</span>
                <span className="text-amber-400 text-[10px] mt-1 block">ELEVATED</span>
              </div>
              <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block">+30 MIN</span>
                <span className="text-2xl font-bold text-white mt-1 block">24,900</span>
                <span className="text-orange-400 text-[10px] mt-1 block">WARNING</span>
              </div>
              <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block">+45 MIN</span>
                <span className="text-2xl font-bold text-red-400 mt-1 block">27,850</span>
                <span className="text-red-400 text-[10px] mt-1 block font-bold">CRITICAL PEAK</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'LOST_PERSON' && (
          <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 space-y-6 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-sm font-bold text-white uppercase">LOST PERSON PROXIMITY TELEMETRY</span>
              <DemoBadge size="sm" />
            </div>

            <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 space-y-3 max-w-xl">
              <div className="flex justify-between">
                <span className="text-zinc-500">Person Identifier:</span>
                <span className="font-bold text-white">{DEFAULT_LOST_PERSON.wristbandId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Estimated Zone:</span>
                <span className="font-bold text-purple-400">{DEFAULT_LOST_PERSON.lastKnownSector}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Gate Corridor:</span>
                <span className="font-bold text-white">{DEFAULT_LOST_PERSON.lastKnownGate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Timestamp:</span>
                <span className="font-bold text-white">{DEFAULT_LOST_PERSON.lastSeenTime}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'EMERGENCY' && (
          <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 space-y-6 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-sm font-bold text-red-400 uppercase">EMERGENCY DISPATCH PROTOCOLS</span>
              <span className="bg-red-950 text-red-300 px-2 py-0.5 rounded font-bold border border-red-800">
                STANDBY ADVISORY MODE
              </span>
            </div>

            <div className="p-4 bg-red-950/20 border border-red-900/50 rounded-xl space-y-2">
              <span className="font-bold text-red-400 block">AI CONTINGENCY ADVISORIES:</span>
              <p className="text-zinc-300">
                1. Stagger Ghat 4 entrance gates to reduce hydraulic shock wave.
              </p>
              <p className="text-zinc-300">
                2. Activate dynamic LED guidance signage to divert 30% flow to Route B.
              </p>
              <p className="text-zinc-300">
                3. Dispatch rapid medical triage team to Sector 12 staging area.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
