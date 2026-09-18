import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Search, Radio, ShieldAlert, AlertTriangle, CheckCircle2, Lock, UserCheck, HeartHandshake, RefreshCcw } from 'lucide-react';
import { DemoBadge } from './DisclaimerBanner';
import { DEFAULT_LOST_PERSON } from '../data/kumbhData';
import { LostPersonRecord } from '../types';

export const LostPersonSystem: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [person, setPerson] = useState<LostPersonRecord>(DEFAULT_LOST_PERSON);
  const [isSearching, setIsSearching] = useState(false);
  const [searchComplete, setSearchComplete] = useState(false);
  const [signalLost, setSignalLost] = useState(false);
  const [verificationState, setVerificationState] = useState<'UNVERIFIED' | 'POSSIBLE_DISTRESS' | 'EMERGENCY_RESPONSE'>('UNVERIFIED');

  // 3D Wristband Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfcfcfd);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 4, 10);
    camera.lookAt(0, 0, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    const amb = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(amb);
    const dir = new THREE.DirectionalLight(0xffedd5, 1.5);
    dir.position.set(5, 10, 8);
    scene.add(dir);

    // 3D Wristband Model
    const bandGroup = new THREE.Group();
    scene.add(bandGroup);

    // Silicone Strap
    const strapGeo = new THREE.TorusGeometry(1.8, 0.35, 16, 64);
    const strapMat = new THREE.MeshStandardMaterial({
      color: person.sosTriggered ? 0xdc2626 : person.tamperDetected ? 0xd97706 : 0x18181b,
      roughness: 0.6,
      metalness: 0.1
    });
    const strap = new THREE.Mesh(strapGeo, strapMat);
    strap.rotation.x = Math.PI / 2.5;
    bandGroup.add(strap);

    // Central Pill Pod / BLE Tag
    const podGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.4, 32);
    const podMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.3
    });
    const pod = new THREE.Mesh(podGeo, podMat);
    pod.position.set(0, 1.2, 1.3);
    pod.rotation.x = Math.PI / 3;
    bandGroup.add(pod);

    // Status LED on Wristband
    const ledGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const ledMat = new THREE.MeshBasicMaterial({
      color: person.sosTriggered ? 0xef4444 : person.tamperDetected ? 0xf59e0b : isSearching ? 0x3b82f6 : 0x10b981
    });
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(0, 1.45, 1.45);
    bandGroup.add(led);

    // BLE Waves (concentric expanding rings)
    const waveGroup = new THREE.Group();
    scene.add(waveGroup);

    const waveRings: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.RingGeometry(2.0 + i * 1.2, 2.1 + i * 1.2, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: person.sosTriggered ? 0xef4444 : 0x8b5cf6,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2.5;
      waveGroup.add(ring);
      waveRings.push(ring);
    }

    // Nearby Receiver Node indicators
    const receiverNodes = [
      new THREE.Vector3(-4.5, 2, -1),
      new THREE.Vector3(4.5, 1.5, -2),
      new THREE.Vector3(0, -3, -2)
    ];

    receiverNodes.forEach((rPos) => {
      const rGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
      const rMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });
      const rMesh = new THREE.Mesh(rGeo, rMat);
      rMesh.position.copy(rPos);
      scene.add(rMesh);
    });

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Band gentle tilt
      bandGroup.rotation.y = Math.sin(elapsed * 0.8) * 0.35;
      bandGroup.rotation.z = Math.cos(elapsed * 0.6) * 0.15;

      // Pulse LED
      const ledPulse = isSearching ? 8 : person.sosTriggered ? 12 : 2;
      led.scale.setScalar(1 + Math.sin(elapsed * ledPulse) * 0.3);

      // Animate Waves
      waveRings.forEach((ring, idx) => {
        const speed = (elapsed * 1.5 + idx * 0.4) % 1;
        const scale = 1 + speed * 1.5;
        ring.scale.set(scale, scale, 1);
        (ring.material as THREE.MeshBasicMaterial).opacity = (1 - speed) * 0.6;
      });

      renderer.render(scene, camera);
    };

    animate();

    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [person, isSearching]);

  // Actions
  const handleStartSearch = () => {
    setIsSearching(true);
    setSearchComplete(false);
    setSignalLost(false);
    setPerson((prev) => ({ ...prev, status: 'SEARCHING' }));

    setTimeout(() => {
      setIsSearching(false);
      setSearchComplete(true);
      setPerson((prev) => ({
        ...prev,
        status: 'ZONE_LOCATED',
        lastKnownSector: 'SECTOR 07',
        lastKnownGate: 'GATE B',
        lastSeenTime: '14:42'
      }));
    }, 1200);
  };

  const handleSimulateLostSignal = () => {
    setSignalLost(true);
    setSearchComplete(false);
    setVerificationState('POSSIBLE_DISTRESS');
    setPerson((prev) => ({ ...prev, status: 'AWAITING_VERIFICATION' }));
  };

  const handleSimulateSOS = () => {
    setPerson((prev) => ({ ...prev, sosTriggered: true, status: 'SOS_ACTIVE' }));
    setVerificationState('EMERGENCY_RESPONSE');
  };

  const handleSimulateTamper = () => {
    setPerson((prev) => ({ ...prev, tamperDetected: true, status: 'AWAITING_VERIFICATION' }));
    setVerificationState('POSSIBLE_DISTRESS');
  };

  const handleReset = () => {
    setPerson(DEFAULT_LOST_PERSON);
    setIsSearching(false);
    setSearchComplete(false);
    setSignalLost(false);
    setVerificationState('UNVERIFIED');
  };

  return (
    <section id="lost-person" className="py-20 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <DemoBadge size="sm" className="mb-3" />
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 uppercase">
            FIND. CONNECT. REUNITE.
          </h2>
          <p className="mt-3 text-base text-zinc-600 font-medium">
            "An opt-in safety-band concept designed to help locate registered pilgrims by their last detected zone."
          </p>
        </div>

        {/* 3D Wristband & Active Search Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          {/* 3D Interactive Wristband Viewport */}
          <div className="lg:col-span-6 bg-zinc-50 rounded-2xl border border-zinc-200 p-4 relative flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between border-b border-zinc-200/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping"></span>
                <span className="text-xs font-mono font-bold text-zinc-800 uppercase">
                  3D BLE SAFETY WRISTBAND • MODEL WB-200
                </span>
              </div>
              <DemoBadge size="sm" />
            </div>

            <div ref={mountRef} className="w-full h-72 sm:h-80 cursor-grab active:cursor-grabbing" />

            {/* In-band Quick Controls */}
            <div className="pt-3 border-t border-zinc-200 flex flex-wrap gap-2">
              <button
                onClick={handleSimulateSOS}
                className="flex-1 py-2 px-3 text-xs font-bold font-mono bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                id="simulate-sos-btn"
              >
                <ShieldAlert className="w-4 h-4" />
                SIMULATE SOS
              </button>
              <button
                onClick={handleSimulateTamper}
                className="flex-1 py-2 px-3 text-xs font-bold font-mono bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                id="simulate-tamper-btn"
              >
                <AlertTriangle className="w-4 h-4" />
                TAMPER DETECTED
              </button>
              <button
                onClick={handleSimulateLostSignal}
                className="flex-1 py-2 px-3 text-xs font-bold font-mono bg-zinc-800 hover:bg-zinc-900 text-white rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                id="simulate-lost-signal-btn"
              >
                SIGNAL LOST
              </button>
            </div>
          </div>

          {/* Right Person Tracking Telemetry Card */}
          <div className="lg:col-span-6 bg-zinc-50 border border-zinc-200 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-xs">
            <div>
              <div className="flex items-start justify-between border-b border-zinc-200 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold uppercase text-purple-600 tracking-wider">
                    PROXIMITY ZONE LOCATOR
                  </span>
                  <div className="flex items-center gap-3 mt-1">
                    <h3 className="text-2xl font-black font-mono text-zinc-950">
                      ID: {person.wristbandId}
                    </h3>
                    <span className="text-xs bg-purple-100 text-purple-800 font-mono px-2 py-0.5 rounded font-semibold">
                      OPT-IN PILGRIM
                    </span>
                  </div>
                </div>

                <div className="text-right font-mono text-xs">
                  <span className="text-zinc-400 block text-[10px]">BATTERY</span>
                  <span className="font-bold text-zinc-800">{person.batteryLevel}%</span>
                </div>
              </div>

              {/* Exact Metrics specified in prompt */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs my-5">
                <div className="p-3 bg-white rounded-xl border border-zinc-200">
                  <span className="text-[10px] text-zinc-400 uppercase block">PERSON ID</span>
                  <span className="font-bold text-zinc-900 block mt-1">{person.wristbandId}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-zinc-200">
                  <span className="text-[10px] text-zinc-400 uppercase block">LAST DETECTED</span>
                  <span className="font-bold text-purple-700 block mt-1">{person.lastKnownSector}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-zinc-200">
                  <span className="text-[10px] text-zinc-400 uppercase block">GATE / TIME</span>
                  <span className="font-bold text-zinc-900 block mt-1">{person.lastKnownGate} • {person.lastSeenTime}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-zinc-200">
                  <span className="text-[10px] text-zinc-400 uppercase block">STATUS</span>
                  <span
                    className={`font-bold block mt-1 text-[11px] ${
                      person.sosTriggered
                        ? 'text-red-600 animate-pulse'
                        : person.status === 'ZONE_LOCATED'
                        ? 'text-emerald-600'
                        : 'text-zinc-800'
                    }`}
                  >
                    {person.status}
                  </span>
                </div>
              </div>

              {/* Flow specified in prompt */}
              <div className="p-4 bg-white rounded-xl border border-zinc-200 space-y-2 text-xs font-mono text-zinc-700">
                <span className="text-[10px] uppercase text-zinc-400 block font-bold">
                  LOCALIZATION PIPELINE:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-1.5 py-0.5 bg-zinc-100 rounded">BLE WRISTBAND</span>
                  <span>→</span>
                  <span className="px-1.5 py-0.5 bg-zinc-100 rounded">BLE SIGNAL</span>
                  <span>→</span>
                  <span className="px-1.5 py-0.5 bg-zinc-100 rounded">ESP32 RECEIVERS</span>
                  <span>→</span>
                  <span className="px-1.5 py-0.5 bg-zinc-100 rounded">SIGNAL STRENGTH</span>
                  <span>→</span>
                  <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded font-semibold">ZONE ESTIMATION</span>
                  <span>→</span>
                  <span className="px-1.5 py-0.5 bg-zinc-900 text-white rounded">COMMAND CENTER</span>
                </div>
              </div>
            </div>

            {/* Search Trigger Button */}
            <div className="pt-2 flex gap-2">
              <button
                onClick={handleStartSearch}
                disabled={isSearching}
                id="start-search-btn"
                className="flex-1 py-3.5 px-4 text-xs font-bold tracking-wider bg-zinc-950 hover:bg-purple-700 text-white rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <Search className={`w-4 h-4 ${isSearching ? 'animate-spin' : ''}`} />
                {isSearching ? 'SWEEPING ESP32 RECEIVER MESH...' : 'START SEARCH'}
              </button>
              {(person.sosTriggered || person.tamperDetected || signalLost || searchComplete) && (
                <button
                  onClick={handleReset}
                  className="p-3.5 text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200 rounded-xl"
                  title="Reset Simulation"
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 17: BLE TECHNICAL LIMITATION NOTICE (Critical Requirement) */}
        <div className="p-4 sm:p-5 bg-zinc-50 border border-zinc-300 rounded-xl mb-8 flex items-start gap-4">
          <div className="p-2 bg-white rounded-lg border border-zinc-200 text-zinc-700 shrink-0">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 block">
              BLE TECHNICAL LIMITATION NOTICE
            </span>
            <p className="text-sm text-zinc-700 mt-1 leading-relaxed">
              "BLE provides approximate proximity / zone-level detection. It does not provide exact GPS-level positioning by itself."
            </p>
            <span className="text-xs text-zinc-500 mt-1 block">
              System calculates signal triangulation across multiple ESP32 receiver masts to narrow locations to a specific gate corridor or sector pavilion.
            </span>
          </div>
        </div>

        {/* SECTION 18 & 19: LOST SIGNAL & TAMPER / SOS HANDLING */}
        {(signalLost || person.tamperDetected || person.sosTriggered) && (
          <div className="bg-red-50/50 border border-red-200 rounded-2xl p-6 mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-red-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                <h4 className="text-base font-bold text-red-950 font-mono">
                  {person.sosTriggered
                    ? 'SOS ACTIVATED — EMERGENCY RESPONSE'
                    : 'UNUSUAL EVENT DETECTED'}
                </h4>
              </div>
              <span className="text-xs font-mono font-bold text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full">
                STATUS: AWAITING VERIFICATION
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div>
                <span className="text-zinc-500 block">DEVICE</span>
                <span className="font-bold text-zinc-900">{person.wristbandId}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">LAST KNOWN LOCATION</span>
                <span className="font-bold text-zinc-900">SECTOR 7 — GATE B</span>
              </div>
              <div>
                <span className="text-zinc-500 block">SIGNAL</span>
                <span className="font-bold text-red-700">{signalLost ? 'LOST' : 'DEGRADED'}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">DIAGNOSIS</span>
                <span className="font-bold text-zinc-900">
                  {person.tamperDetected ? 'POSSIBLE DISTRESS' : 'DISCONNECT EVENT'}
                </span>
              </div>
            </div>

            {/* Non-alarmist causes list explicitly specified in prompt Section 18 */}
            <div className="bg-white p-4 rounded-xl border border-red-200/60 text-xs">
              <span className="font-bold font-mono text-zinc-900 block mb-2">
                ASSESSED NON-CRITICAL CONTRIBUTING FACTORS (HUMAN VERIFICATION REQUIRED):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-zinc-600 font-mono text-[11px]">
                <span className="flex items-center gap-1.5">• Battery depleted</span>
                <span className="flex items-center gap-1.5">• Bluetooth RF interference</span>
                <span className="flex items-center gap-1.5">• Device physically damaged</span>
                <span className="flex items-center gap-1.5">• Wristband removed</span>
                <span className="flex items-center gap-1.5">• Mesh network congestion</span>
                <span className="flex items-center gap-1.5">• Outside receiver coverage</span>
              </div>
              <p className="mt-3 text-[11px] text-zinc-500 italic">
                * Note: Tamper detection or lost signal does NOT prove abduction. It triggers protocol field verification by volunteer teams.
              </p>
            </div>
          </div>
        )}

        {/* SECTION 20: MULTI-SENSOR VERIFICATION CONVERGENCE */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 sm:p-8 mb-8">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider block">
              VERIFICATION DISCIPLINE
            </span>
            <h4 className="text-xl sm:text-2xl font-black text-zinc-950 mt-1">
              A LOST SIGNAL IS NOT A CONCLUSION. IT IS A SIGNAL TO VERIFY.
            </h4>
          </div>

          <div className="p-4 bg-white rounded-xl border border-zinc-200 mb-6 font-mono text-xs text-center">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="px-2.5 py-1 bg-zinc-100 rounded text-zinc-800">BLE SIGNAL</span>
              <span>+</span>
              <span className="px-2.5 py-1 bg-zinc-100 rounded text-zinc-800">RECEIVER NETWORK</span>
              <span>+</span>
              <span className="px-2.5 py-1 bg-zinc-100 rounded text-zinc-800">TAMPER SENSOR</span>
              <span>+</span>
              <span className="px-2.5 py-1 bg-zinc-100 rounded text-zinc-800">SOS</span>
              <span>+</span>
              <span className="px-2.5 py-1 bg-zinc-100 rounded text-zinc-800">ZONE ACTIVITY</span>
              <span>+</span>
              <span className="px-2.5 py-1 bg-zinc-100 rounded text-zinc-800">FIELD VERIFICATION</span>
              <span className="text-orange-500 font-bold">↓</span>
              <span className="px-2.5 py-1 bg-orange-100 text-orange-950 font-bold rounded">EVENT ANALYSIS</span>
              <span className="text-orange-500 font-bold">↓</span>
              <span className="px-2.5 py-1 bg-zinc-900 text-white font-bold rounded">
                RISK STATUS: {verificationState}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono font-bold text-zinc-700">
            <div className="p-3 bg-white rounded-lg border border-zinc-200">1. DETECT</div>
            <div className="p-3 bg-white rounded-lg border border-zinc-200">2. VERIFY</div>
            <div className="p-3 bg-white rounded-lg border border-zinc-200">3. RESPOND</div>
            <div className="p-3 bg-white rounded-lg border border-zinc-200 text-emerald-700">4. REUNITE</div>
          </div>
        </div>

        {/* SECTION 21: PRIVACY ARCHITECTURE */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-zinc-900" />
            <h4 className="text-xl font-extrabold text-zinc-950">
              SAFETY SYSTEM — NOT SURVEILLANCE
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200/80 space-y-1">
              <span className="font-bold text-zinc-900 block">Opt-in Wearable Only</span>
              <p className="text-zinc-600">
                Safety bands are issued only upon request at registration desks. Voluntary participation with full pilgrim consent.
              </p>
            </div>
            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200/80 space-y-1">
              <span className="font-bold text-zinc-900 block">Pseudonymous IDs</span>
              <p className="text-zinc-600">
                Broadcasts contain random cryptographic hashes (e.g. KM-48291). Personal identities are stored in siloed offline vaults.
              </p>
            </div>
            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200/80 space-y-1">
              <span className="font-bold text-zinc-900 block">No Unrestricted Facial Recognition</span>
              <p className="text-zinc-600">
                Overhead computer vision performs pedestrian volume estimation, not biometric tracking of unregistered citizens.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
