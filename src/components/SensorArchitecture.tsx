import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Camera, Radio, Cpu, Thermometer, Volume2, ArrowRight, ShieldAlert, Check, RefreshCw } from 'lucide-react';
import { DemoBadge } from './DisclaimerBanner';

export const SensorArchitecture: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CAMERA' | 'IR_TOF' | 'ESP32' | 'BME280' | 'ACOUSTIC'>('CAMERA');

  // Interactive state for IR gate beam-break simulation
  const [irCrossingCount, setIrCrossingCount] = useState(0);
  const [irEntries, setIrEntries] = useState(1240);
  const [irExits, setIrExits] = useState(860);
  const [beamBroken, setBeamBroken] = useState(false);

  // Sound wave simulation
  const [soundDb, setSoundDb] = useState(78);

  const handleSimulateCrossing = () => {
    setBeamBroken(true);
    setIrEntries((prev) => prev + 1);
    setIrCrossingCount((prev) => prev + 1);
    setTimeout(() => {
      setBeamBroken(false);
    }, 400);
  };

  return (
    <section id="sensors" className="py-20 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <DemoBadge size="sm" className="mb-3" />
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 uppercase">
            THE SENSING LAYER
          </h2>
          <p className="mt-3 text-base text-zinc-600 font-medium">
            "Turning the physical crowd into real-time data."
          </p>
          <p className="mt-2 text-xs sm:text-sm text-zinc-500 max-w-2xl mx-auto leading-relaxed">
            Every physical metric is captured through specialized hardware edge nodes. Explore each sensor model,
            its real-world capabilities, and its operational role in the AI Kumbh pipeline.
          </p>
        </div>

        {/* Sensor Navigation Tabs */}
        <div className="flex justify-center mb-10 overflow-x-auto pb-2">
          <div className="inline-flex p-1.5 bg-zinc-100 rounded-xl border border-zinc-200 gap-1 text-xs font-mono">
            <button
              onClick={() => setActiveTab('CAMERA')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'CAMERA'
                  ? 'bg-white text-zinc-950 font-bold shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-sky-600" />
              CAMERA (CV)
            </button>
            <button
              onClick={() => setActiveTab('IR_TOF')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'IR_TOF'
                  ? 'bg-white text-zinc-950 font-bold shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-orange-600" />
              IR / ToF GATE
            </button>
            <button
              onClick={() => setActiveTab('ESP32')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'ESP32'
                  ? 'bg-white text-zinc-950 font-bold shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-zinc-900" />
              ESP32 IoT NODE
            </button>
            <button
              onClick={() => setActiveTab('BME280')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'BME280'
                  ? 'bg-white text-zinc-950 font-bold shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              <Thermometer className="w-3.5 h-3.5 text-emerald-600" />
              BME280 CLIMATE
            </button>
            <button
              onClick={() => setActiveTab('ACOUSTIC')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'ACOUSTIC'
                  ? 'bg-white text-zinc-950 font-bold shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-600" />
              ACOUSTIC
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 sm:p-10 shadow-xs">
          {/* TAB 1: CAMERA (CV) */}
          {activeTab === 'CAMERA' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 bg-white rounded-xl border border-zinc-200 p-6 relative overflow-hidden shadow-2xs">
                {/* Simulated Computer Vision Feed Viewport */}
                <div className="relative w-full h-72 bg-zinc-900 rounded-lg overflow-hidden flex items-center justify-center p-4">
                  {/* Subtle Grid / Bounding Boxes */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:20px_20px]" />

                  {/* Simulated Pedestrian detection boxes */}
                  <div className="absolute top-12 left-14 w-12 h-20 border border-sky-400/80 bg-sky-500/10 rounded-xs flex flex-col justify-between p-1">
                    <span className="text-[8px] font-mono text-sky-300 font-bold">#1841 0.94</span>
                    <span className="text-[7px] font-mono text-sky-400">v: 0.8m/s</span>
                  </div>

                  <div className="absolute top-20 left-32 w-14 h-24 border border-sky-400/80 bg-sky-500/10 rounded-xs flex flex-col justify-between p-1">
                    <span className="text-[8px] font-mono text-sky-300 font-bold">#1842 0.98</span>
                    <span className="text-[7px] font-mono text-sky-400">v: 0.7m/s</span>
                  </div>

                  <div className="absolute top-14 right-20 w-11 h-20 border border-orange-400/80 bg-orange-500/15 rounded-xs flex flex-col justify-between p-1">
                    <span className="text-[8px] font-mono text-orange-300 font-bold">#1843 0.89</span>
                    <span className="text-[7px] font-mono text-orange-400">CLUSTER</span>
                  </div>

                  {/* Camera Reticle */}
                  <div className="absolute top-4 left-4 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    EDGE INFERENCE 30 FPS • YOLO-V11 TENSOR
                  </div>

                  <div className="absolute bottom-4 right-4 text-[10px] font-mono text-zinc-400">
                    4K OVERHEAD MOUNT • SECTOR 12
                  </div>
                </div>

                {/* Simulated Metrics Card specified in prompt */}
                <div className="grid grid-cols-2 gap-4 mt-6 font-mono">
                  <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                    <span className="text-[10px] text-zinc-400 uppercase block">PEOPLE DETECTED</span>
                    <span className="text-2xl font-extrabold text-zinc-950">1,842</span>
                    <span className="text-[10px] text-zinc-500 block">simulated active targets</span>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <span className="text-[10px] text-orange-600 uppercase font-semibold block">DENSITY CLUSTER</span>
                    <span className="text-2xl font-extrabold text-orange-700">HIGH</span>
                    <span className="text-[10px] text-orange-600 block">3.4 persons / m²</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-6">
                <div>
                  <span className="text-xs font-mono font-bold text-sky-600 uppercase tracking-wider block mb-1">
                    [SENSOR MODULE 01]
                  </span>
                  <h3 className="text-2xl font-extrabold text-zinc-950">
                    Computer Vision Array
                  </h3>
                  <p className="mt-2 text-zinc-600 text-sm leading-relaxed">
                    Overhead high-resolution cameras execute on-device tensor processing to estimate crowd headcounts,
                    movement velocity vectors, and cluster formation without recording persistent personal identities.
                  </p>
                </div>

                {/* Pipeline Flow specified in prompt */}
                <div className="p-4 bg-white rounded-xl border border-zinc-200 space-y-2">
                  <span className="text-xs font-mono font-bold text-zinc-700 block uppercase">
                    DETECTION DATA FLOW:
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-zinc-800">
                    <span className="px-2 py-1 bg-zinc-100 rounded">CAMERA</span>
                    <ArrowRight className="w-3.5 h-3.5 text-orange-500" />
                    <span className="px-2 py-1 bg-zinc-100 rounded">COMPUTER VISION</span>
                    <ArrowRight className="w-3.5 h-3.5 text-orange-500" />
                    <span className="px-2 py-1 bg-zinc-100 rounded">PERSON DETECTION</span>
                    <ArrowRight className="w-3.5 h-3.5 text-orange-500" />
                    <span className="px-2 py-1 bg-orange-50 text-orange-700 font-semibold rounded border border-orange-200">
                      DENSITY ESTIMATION
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-orange-500" />
                    <span className="px-2 py-1 bg-zinc-900 text-white rounded">MOVEMENT ANALYSIS</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <DemoBadge size="sm" />
                  <span>Calculated from simulated synthetic image streams.</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: IR / ToF SENSOR */}
          {activeTab === 'IR_TOF' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 bg-white rounded-xl border border-zinc-200 p-6 shadow-2xs space-y-5">
                {/* 3D Gate with IR Beam Visualization */}
                <div className="relative w-full h-64 bg-zinc-900 rounded-lg p-4 flex flex-col justify-between overflow-hidden">
                  <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
                    <span>SECTOR 12 — CHECKPOINT GATE 4</span>
                    <span className="text-orange-400">940nm ToF LASER CURTAIN</span>
                  </div>

                  {/* Visual Gate Posts and Laser Beam */}
                  <div className="relative flex items-center justify-between px-12 py-8">
                    {/* Left Post */}
                    <div className="w-5 h-32 bg-zinc-700 rounded-sm border border-zinc-500 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    </div>

                    {/* Beam */}
                    <div className="flex-1 mx-2 relative flex items-center justify-center">
                      <div
                        className={`w-full h-1 transition-all ${
                          beamBroken
                            ? 'bg-white shadow-[0_0_12px_#fff] scale-y-150'
                            : 'bg-red-500 shadow-[0_0_8px_#ef4444]'
                        }`}
                      />
                      {beamBroken && (
                        <span className="absolute -top-6 px-2 py-0.5 bg-red-600 text-white text-[10px] font-mono rounded animate-bounce">
                          BEAM INTERRUPTED • ENTRY RECORDED
                        </span>
                      )}
                    </div>

                    {/* Right Post */}
                    <div className="w-5 h-32 bg-zinc-700 rounded-sm border border-zinc-500 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                    <span>POLLED EVERY 20MS</span>
                    <button
                      onClick={handleSimulateCrossing}
                      className="px-3 py-1 bg-orange-600 hover:bg-orange-500 text-white rounded text-xs transition-colors"
                    >
                      SIMULATE PERSON CROSSING
                    </button>
                  </div>
                </div>

                {/* Metrics specified in prompt */}
                <div className="grid grid-cols-3 gap-3 font-mono text-center">
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <span className="text-[10px] text-emerald-600 uppercase font-semibold block">ENTRY</span>
                    <span className="text-xl font-extrabold text-emerald-800">+{irEntries.toLocaleString()}</span>
                  </div>
                  <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                    <span className="text-[10px] text-zinc-500 uppercase font-semibold block">EXIT</span>
                    <span className="text-xl font-extrabold text-zinc-700">-{irExits.toLocaleString()}</span>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <span className="text-[10px] text-orange-600 uppercase font-semibold block">NET FLOW</span>
                    <span className="text-xl font-extrabold text-orange-800">+{(irEntries - irExits).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-5">
                <div>
                  <span className="text-xs font-mono font-bold text-orange-600 uppercase tracking-wider block mb-1">
                    [SENSOR MODULE 02]
                  </span>
                  <h3 className="text-2xl font-extrabold text-zinc-950">
                    IR / ToF Laser Barrier Counting
                  </h3>
                  <p className="mt-2 text-zinc-600 text-sm leading-relaxed">
                    Optical Time-of-Flight laser curtains record physical barrier interruptions without requiring cameras.
                    Bidirectional photon flight timestamps pinpoint exact entry versus exit tallies at turnstiles and ghat gates.
                  </p>
                </div>

                {/* Explanation specified in prompt */}
                <div className="p-4 bg-white rounded-xl border border-zinc-200 space-y-2">
                  <span className="text-xs font-mono font-bold text-zinc-800 block">
                    ARCHITECTURAL CAPABILITY:
                  </span>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    IR beam-break or ToF sensors assist with controlled checkpoint entry/exit counting. They produce high-confidence
                    net volumetric differentials between sectors.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <DemoBadge size="sm" />
                  <span className="text-xs text-zinc-400 font-mono">
                    Interrupted pings: {irCrossingCount} test simulations
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ESP32 IoT NODE */}
          {activeTab === 'ESP32' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 bg-white rounded-xl border border-zinc-200 p-6 shadow-2xs space-y-4">
                {/* Circuit Schematic Visual */}
                <div className="bg-zinc-900 rounded-lg p-5 font-mono text-xs text-zinc-300 space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="text-orange-400 font-bold">ESP32-S3 MULTI-CHANNEL EDGE NODE</span>
                    <span className="text-[10px] text-emerald-400">NODE 07 • ONLINE</span>
                  </div>

                  {/* ASCII Diagram specified in prompt */}
                  <pre className="text-zinc-400 text-xs font-mono leading-relaxed bg-zinc-950 p-3 rounded border border-zinc-800">
{`ESP32 [NODE 07]
├── IR / ToF           [I2C - 0x29]
├── BME280             [I2C - 0x76]
├── BLE RECEIVER       [2.4GHz RF]
└── ACOUSTIC SENSOR    [ADC1_CH0]`}
                  </pre>

                  {/* Flow specified in prompt */}
                  <div className="pt-2 text-[11px] text-zinc-400 flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 bg-zinc-800 text-zinc-200 rounded">ESP32</span>
                    <span className="text-orange-400">→</span>
                    <span className="px-2 py-0.5 bg-zinc-800 text-zinc-200 rounded">Wi-Fi / LoRa</span>
                    <span className="text-orange-400">→</span>
                    <span className="px-2 py-0.5 bg-zinc-800 text-zinc-200 rounded">IoT Gateway</span>
                    <span className="text-orange-400">→</span>
                    <span className="px-2 py-0.5 bg-orange-950 text-orange-300 rounded font-bold">AI KUMBH</span>
                  </div>
                </div>

                {/* Node 07 status block specified in prompt */}
                <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                    <span className="text-[10px] text-zinc-400 uppercase block">NODE 07</span>
                    <span className="text-sm font-extrabold text-emerald-700">ONLINE</span>
                  </div>
                  <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                    <span className="text-[10px] text-zinc-400 uppercase block">SIGNAL</span>
                    <span className="text-sm font-extrabold text-zinc-900">GOOD (-68dBm)</span>
                  </div>
                  <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                    <span className="text-[10px] text-zinc-400 uppercase block">LAST UPDATE</span>
                    <span className="text-sm font-extrabold text-zinc-900">2 sec ago</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-5">
                <div>
                  <span className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider block mb-1">
                    [SENSOR MODULE 03]
                  </span>
                  <h3 className="text-2xl font-extrabold text-zinc-950">
                    ESP32 Sensor Fusion Micro-Hub
                  </h3>
                  <p className="mt-2 text-zinc-600 text-sm leading-relaxed">
                    The ESP32 acts as the frontline edge computer. Deployed on lampposts and gantries across the Kumbh grounds,
                    it interfaces directly with micro-climate, acoustic, laser, and wireless transceivers, transmitting packed
                    telemetry bursts over LoRa mesh networks even during cellular congestion.
                  </p>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-zinc-200">
                    <span className="text-zinc-500">Processing Unit:</span>
                    <span className="font-semibold text-zinc-900">Dual-core Xtensa 32-bit @ 240 MHz</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-zinc-200">
                    <span className="text-zinc-500">Mesh Protocol:</span>
                    <span className="font-semibold text-zinc-900">ESP-NOW + LoRaWAN 868MHz Fallback</span>
                  </div>
                </div>

                <DemoBadge size="sm" />
              </div>
            </div>
          )}

          {/* TAB 4: BME280 */}
          {activeTab === 'BME280' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 bg-white rounded-xl border border-zinc-200 p-6 shadow-2xs space-y-6">
                {/* Environmental Gauge Display specified in prompt */}
                <div className="grid grid-cols-3 gap-3 font-mono text-center">
                  <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200">
                    <span className="text-[10px] text-amber-700 uppercase font-semibold block">TEMPERATURE</span>
                    <span className="text-2xl font-extrabold text-amber-900 mt-1 block">32.4°C</span>
                    <span className="text-[10px] text-amber-600 block mt-1">High thermal load</span>
                  </div>
                  <div className="p-4 bg-sky-50/70 rounded-xl border border-sky-200">
                    <span className="text-[10px] text-sky-700 uppercase font-semibold block">HUMIDITY</span>
                    <span className="text-2xl font-extrabold text-sky-900 mt-1 block">61%</span>
                    <span className="text-[10px] text-sky-600 block mt-1">Ghat river evaporation</span>
                  </div>
                  <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                    <span className="text-[10px] text-zinc-500 uppercase font-semibold block">PRESSURE</span>
                    <span className="text-2xl font-extrabold text-zinc-900 mt-1 block">1004 hPa</span>
                    <span className="text-[10px] text-zinc-400 block mt-1">Stable barometer</span>
                  </div>
                </div>

                {/* CRITICAL Prompt Requirement Notice */}
                <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-300 text-amber-950 text-xs leading-relaxed space-y-1">
                  <div className="flex items-center gap-2 font-bold font-mono text-amber-900">
                    <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                    ENVIRONMENTAL CONTEXT TRANSPARENCY
                  </div>
                  <p>
                    "BME280 measures temperature, humidity and atmospheric pressure. These measurements provide environmental
                    context alongside crowd information."
                  </p>
                  <p className="font-semibold text-amber-900 pt-1">
                    * IMPORTANT: BME280 measures micro-climate and heat stress, NOT crowd population.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-5">
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                    [SENSOR MODULE 04]
                  </span>
                  <h3 className="text-2xl font-extrabold text-zinc-950">
                    BME280 Micro-Climate Probe
                  </h3>
                  <p className="mt-2 text-zinc-600 text-sm leading-relaxed">
                    Combines precision barometric and thermal sensors to identify heat exhaustion risks and humidity peaks.
                    Elevated heat indices amplify crowd irritability and dehydration, informing water-misting deployment schedules.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-lg border border-zinc-200 text-xs font-mono text-zinc-600">
                  <span className="font-bold text-zinc-900 block mb-1">Deployment Location:</span>
                  Sector 12 Riverbank Station — Elevated Post 3
                </div>

                <DemoBadge size="sm" />
              </div>
            </div>
          )}

          {/* TAB 5: ACOUSTIC SENSOR */}
          {activeTab === 'ACOUSTIC' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 bg-white rounded-xl border border-zinc-200 p-6 shadow-2xs space-y-5">
                {/* Sound wave visualizer */}
                <div className="w-full h-44 bg-zinc-900 rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex justify-between text-xs font-mono text-zinc-400">
                    <span>MICROPHONE ARRAY • FAST SPL RMS</span>
                    <span className="text-orange-400">78 dB AMBIENT</span>
                  </div>

                  {/* Animated Sound Wave Bars */}
                  <div className="flex items-end justify-between h-20 px-2 gap-1">
                    {[40, 65, 85, 95, 75, 60, 45, 70, 88, 92, 78, 65, 50, 80, 95, 70, 55, 75, 82, 60].map(
                      (h, i) => (
                        <div
                          key={i}
                          className="w-full bg-orange-500 rounded-t-xs transition-all duration-300"
                          style={{ height: `${h}%`, opacity: 0.4 + (h / 100) * 0.6 }}
                        />
                      )
                    )}
                  </div>

                  <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                    <span>FREQUENCY: 20Hz - 20kHz</span>
                    <span>ACTIVITY LEVEL: HIGH</span>
                  </div>
                </div>

                {/* Sound level specified in prompt */}
                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                    <span className="text-[10px] text-zinc-400 uppercase block">SOUND LEVEL</span>
                    <span className="text-2xl font-extrabold text-zinc-950">78 dB</span>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <span className="text-[10px] text-orange-600 uppercase font-semibold block">ACTIVITY STATUS</span>
                    <span className="text-2xl font-extrabold text-orange-700">HIGH</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-5">
                <div>
                  <span className="text-xs font-mono font-bold text-amber-600 uppercase tracking-wider block mb-1">
                    [SENSOR MODULE 05]
                  </span>
                  <h3 className="text-2xl font-extrabold text-zinc-950">
                    Acoustic Decibel Activity Monitor
                  </h3>
                  <p className="mt-2 text-zinc-600 text-sm leading-relaxed">
                    Listens to collective acoustic pressure levels to flag unexpected noise spikes, devotional chants, or
                    collective distress cries.
                  </p>
                </div>

                {/* Important explanation specified in prompt */}
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 text-xs leading-relaxed space-y-1">
                  <span className="font-bold font-mono text-amber-900 block">
                    IMPORTANT ARCHITECTURAL LIMITATION:
                  </span>
                  <p>
                    "Sound level is a supplementary activity signal and cannot reliably determine exact crowd population by itself."
                  </p>
                </div>

                <DemoBadge size="sm" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
