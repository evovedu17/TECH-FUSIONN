import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { AlertOctagon, ShieldAlert, ArrowUpRight, Users, Stethoscope, Megaphone, Check, RotateCcw, AlertTriangle } from 'lucide-react';
import { DemoBadge } from './DisclaimerBanner';

interface EmergencyResponseProps {
  onDivertRoute?: () => void;
}

export const EmergencyResponse: React.FC<EmergencyResponseProps> = ({ onDivertRoute }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isSurgeActive, setIsSurgeActive] = useState(false);
  const [medicalAlerted, setMedicalAlerted] = useState(false);
  const [personnelDeployed, setPersonnelDeployed] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfcfcfd);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 16, 20);
    camera.lookAt(0, 1, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    const amb = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(amb);
    const dir = new THREE.DirectionalLight(0xffedd5, 1.8);
    dir.position.set(10, 20, 10);
    scene.add(dir);

    // Floor Base
    const grid = new THREE.GridHelper(26, 26, 0xe2e8f0, 0xf1f5f9);
    scene.add(grid);

    // Sectors
    // Sector 12 Center
    const sec12Geo = new THREE.BoxGeometry(4.5, isSurgeActive ? 4.2 : 2.5, 4.5);
    const sec12Mat = new THREE.MeshStandardMaterial({
      color: isSurgeActive ? 0xfee2e2 : 0xffedd5,
      roughness: 0.4
    });
    const sec12 = new THREE.Mesh(sec12Geo, sec12Mat);
    sec12.position.set(0, (isSurgeActive ? 4.2 : 2.5) / 2, 0);
    scene.add(sec12);

    const sec12Wire = new THREE.LineSegments(
      new THREE.EdgesGeometry(sec12Geo),
      new THREE.LineBasicMaterial({ color: isSurgeActive ? 0xef4444 : 0xea580c, linewidth: 2 })
    );
    sec12.add(sec12Wire);

    // Surrounding sectors
    const surrounding = [
      { x: -6, z: -3, h: 1.5 },
      { x: 6, z: -3, h: 1.2 },
      { x: -5, z: 5, h: 1.6 },
      { x: 5, z: 5, h: 1.4 }
    ];
    surrounding.forEach((s) => {
      const geo = new THREE.BoxGeometry(3.5, s.h, 3.5);
      const mat = new THREE.MeshStandardMaterial({ color: 0xf4f4f5, roughness: 0.6 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(s.x, s.h / 2, s.z);
      scene.add(mesh);
    });

    // Surge Warning Beacon
    const beaconGeo = new THREE.OctahedronGeometry(0.6, 0);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xdc2626 });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.set(0, (isSurgeActive ? 4.2 : 2.5) + 1.2, 0);
    scene.add(beacon);

    // Emergency Personnel & Medical Marker in 3D
    const teamGeo = new THREE.CylinderGeometry(0.3, 0.4, 1.2, 8);
    const teamMat = new THREE.MeshStandardMaterial({ color: 0x0284c7 });
    const teamMesh = new THREE.Mesh(teamGeo, teamMat);
    teamMesh.position.set(3, 0.6, -1);
    teamMesh.visible = personnelDeployed;
    scene.add(teamMesh);

    // Crowd particles
    const pCount = isSurgeActive ? 320 : 120;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * (isSurgeActive ? 4.0 : 6.0);
      pPositions[i * 3 + 1] = (isSurgeActive ? 4.2 : 2.5) + 0.15;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * (isSurgeActive ? 4.0 : 6.0);
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: isSurgeActive ? 0x991b1b : 0x1e293b,
      size: 0.22
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Beacon rotation and flash
      beacon.rotation.y = elapsed * 3;
      beacon.scale.setScalar(1 + Math.sin(elapsed * 6) * 0.25);
      beacon.visible = isSurgeActive;

      // Jitter crowd particles
      const pos = pGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < pCount; i++) {
        pos.setXYZ(
          i,
          pos.getX(i) + (Math.random() - 0.5) * 0.05,
          (isSurgeActive ? 4.2 : 2.5) + 0.15,
          pos.getZ(i) + (Math.random() - 0.5) * 0.05
        );
      }
      pos.needsUpdate = true;

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
  }, [isSurgeActive, personnelDeployed]);

  const handleSimulateEmergency = () => {
    setIsSurgeActive(true);
    setPersonnelDeployed(true);
    setMedicalAlerted(true);
  };

  const handleReset = () => {
    setIsSurgeActive(false);
    setPersonnelDeployed(false);
    setMedicalAlerted(false);
  };

  return (
    <section id="emergency" className="py-20 bg-zinc-50 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-500">
              RAPID CONTINGENCY PROTOCOLS
            </span>
            <DemoBadge size="sm" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 uppercase">
            EMERGENCY RESPONSE
          </h2>
          <p className="mt-2 text-zinc-600 text-sm sm:text-base leading-relaxed">
            Autonomous early-warning triggers generate tactical contingency plans before human crush dynamics become
            irreversible. Test simulated crowd pressure surge containment below.
          </p>
        </div>

        {/* 3D Map Sudden Reaction & Emergency Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-10">
          {/* 3D Emergency Map Viewport */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-zinc-200 p-2 relative h-[420px] sm:h-[480px] shadow-xs overflow-hidden">
            <div ref={mountRef} className="w-full h-full rounded-xl overflow-hidden cursor-crosshair" />

            {/* In-canvas Alert Banner */}
            <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-lg border border-red-200 text-xs font-mono shadow-2xs">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isSurgeActive ? 'bg-red-600 animate-ping' : 'bg-orange-500'
                  }`}
                />
                <span className="font-bold text-zinc-900">
                  {isSurgeActive ? 'CROWD SURGE DETECTED • SECTOR 12' : 'STANDBY SURVEILLANCE • SECTOR 12'}
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 block mt-0.5">
                {isSurgeActive ? 'AFFECTED TERRAIN ELEVATED • BEACON ACTIVE' : 'NOMINAL BASELINE'}
              </span>
            </div>

            <div className="absolute bottom-5 right-5">
              <DemoBadge size="sm" />
            </div>
          </div>

          {/* Emergency Metrics & Recommendations Card */}
          <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-6">
            <div>
              {/* Surge Status Box */}
              <div className="border-b border-zinc-100 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-red-600">
                    CRITICAL SURGE TELEMETRY
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-red-100 text-red-700">
                    RISK: CRITICAL
                  </span>
                </div>
                <h3 className="text-2xl font-black font-mono text-zinc-950 mt-1">
                  SECTOR 12
                </h3>
              </div>

              {/* Exact Metrics specified in prompt */}
              <div className="grid grid-cols-2 gap-3 font-mono text-xs my-4">
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <span className="text-[10px] text-zinc-400 uppercase block">CURRENT DENSITY</span>
                  <span className="text-2xl font-extrabold text-zinc-950 block mt-0.5">87%</span>
                </div>
                <div className="p-3 bg-red-50 rounded-xl border border-red-200">
                  <span className="text-[10px] text-red-600 uppercase font-semibold block">PREDICTED DENSITY</span>
                  <span className="text-2xl font-extrabold text-red-700 block mt-0.5">94%</span>
                </div>
              </div>

              {/* Exact AI Emergency Recommendations specified in prompt */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-mono font-bold text-zinc-900 uppercase block mb-2">
                  AI RECOMMENDATIONS (TACTICAL SUPPORT):
                </span>

                <div className="p-2.5 bg-red-50/70 border border-red-200 rounded-lg flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-red-950">1. STOP INCOMING FLOW</span>
                  <span className="text-[10px] bg-red-200 text-red-900 px-1.5 py-0.5 rounded font-bold">
                    RECOMMENDED
                  </span>
                </div>

                <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-lg flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-emerald-950">2. OPEN ALTERNATE ROUTE (ROUTE B)</span>
                  <button
                    onClick={onDivertRoute}
                    className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-bold hover:bg-emerald-700 transition-colors"
                  >
                    DIVERT 30%
                  </button>
                </div>

                <div className="p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-zinc-800">3. DEPLOY EMERGENCY PERSONNEL</span>
                  <span className="text-[10px] text-zinc-500 font-semibold">
                    {personnelDeployed ? 'DISPATCHED' : 'STANDBY'}
                  </span>
                </div>

                <div className="p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-zinc-800">4. ALERT MEDICAL UNIT</span>
                  <span className="text-[10px] text-zinc-500 font-semibold">
                    {medicalAlerted ? 'STAGE 1 TRIAGE READY' : 'STANDBY'}
                  </span>
                </div>
              </div>
            </div>

            {/* Simulation Action Buttons */}
            <div className="pt-2 flex gap-2">
              <button
                onClick={handleSimulateEmergency}
                disabled={isSurgeActive}
                id="simulate-emergency-btn"
                className="flex-1 py-3.5 px-4 text-xs font-bold tracking-wider bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <AlertOctagon className="w-4 h-4" />
                {isSurgeActive ? 'EMERGENCY SURGE SIMULATING...' : 'SIMULATE EMERGENCY'}
              </button>
              {isSurgeActive && (
                <button
                  onClick={handleReset}
                  className="p-3.5 text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded-xl transition-colors"
                  title="Reset Emergency"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Section 23 Mandated Transparency Notice */}
        <div className="p-4 bg-zinc-100 rounded-xl border border-zinc-200 text-xs text-zinc-600 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0" />
          <span>
            <strong className="text-zinc-900 font-mono">HUMAN DECISION-SUPPORT NOTICE:</strong> AI outputs are advisory recommendations only. The system does not autonomously actuate physical barriers or deploy municipal forces without certified human command authorization.
          </span>
        </div>
      </div>
    </section>
  );
};
