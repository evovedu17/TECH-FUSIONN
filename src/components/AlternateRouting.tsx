import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GitFork, ArrowRight, CheckCircle2, AlertCircle, Play, RotateCcw, ShieldAlert } from 'lucide-react';
import { DemoBadge } from './DisclaimerBanner';

export const AlternateRouting: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isDiverted, setIsDiverted] = useState(false);
  const [divertRatio, setDivertRatio] = useState(30); // 30% diversion

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfcfcfd);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 14, 20);
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

    // Lights
    const amb = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(amb);
    const dir = new THREE.DirectionalLight(0xffedd5, 1.8);
    dir.position.set(10, 20, 10);
    scene.add(dir);

    // Grid Floor
    const grid = new THREE.GridHelper(26, 26, 0xe2e8f0, 0xf1f5f9);
    grid.position.y = -0.05;
    scene.add(grid);

    // 1. Origin: Sector 12 Platform (left/back)
    const sec12Geo = new THREE.BoxGeometry(4.5, 1.2, 4.5);
    const sec12Mat = new THREE.MeshStandardMaterial({ color: 0xfee2e2, roughness: 0.5 });
    const sec12 = new THREE.Mesh(sec12Geo, sec12Mat);
    sec12.position.set(-7, 0.6, -4);
    scene.add(sec12);
    sec12.add(new THREE.LineSegments(new THREE.EdgesGeometry(sec12Geo), new THREE.LineBasicMaterial({ color: 0xea580c })));

    // 2. Destination A: Main Sangam Gate (right/front)
    const mainGateGeo = new THREE.BoxGeometry(4, 1, 4);
    const mainGateMat = new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.5 });
    const mainGate = new THREE.Mesh(mainGateGeo, mainGateMat);
    mainGate.position.set(7, 0.5, -4);
    scene.add(mainGate);
    mainGate.add(new THREE.LineSegments(new THREE.EdgesGeometry(mainGateGeo), new THREE.LineBasicMaterial({ color: 0xf97316 })));

    // 3. Destination B: Gate C (East Elevated Causeway - right/front)
    const gateCGeo = new THREE.BoxGeometry(4, 1.4, 4);
    const gateCMat = new THREE.MeshStandardMaterial({ color: 0xecfdf5, roughness: 0.5 });
    const gateC = new THREE.Mesh(gateCGeo, gateCMat);
    gateC.position.set(6, 0.7, 5);
    scene.add(gateC);
    gateC.add(new THREE.LineSegments(new THREE.EdgesGeometry(gateCGeo), new THREE.LineBasicMaterial({ color: 0x10b981 })));

    // 4. Diverter Node (Intersection junction at center)
    const junctionGeo = new THREE.CylinderGeometry(0.8, 0.9, 0.6, 16);
    const junctionMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });
    const junction = new THREE.Mesh(junctionGeo, junctionMat);
    junction.position.set(0, 0.3, -1);
    scene.add(junction);

    // Route Curves
    // Inflow: Sector 12 -> Junction
    const inflowCurve = new THREE.LineCurve3(
      new THREE.Vector3(-7, 0.8, -4),
      new THREE.Vector3(0, 0.8, -1)
    );

    // Main Route: Junction -> Main Gate
    const mainRouteCurve = new THREE.LineCurve3(
      new THREE.Vector3(0, 0.8, -1),
      new THREE.Vector3(7, 0.8, -4)
    );

    // Alternate Route: Junction -> Gate C
    const altRouteCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.8, -1),
      new THREE.Vector3(2.5, 0.9, 2),
      new THREE.Vector3(6, 0.9, 5)
    ]);

    // Draw Route Lines
    const drawCurve = (curve: THREE.Curve<THREE.Vector3>, color: number, dashed = false) => {
      const pts = curve.getPoints(30);
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      let mat: THREE.Material;
      if (dashed) {
        mat = new THREE.LineDashedMaterial({ color, dashSize: 0.4, gapSize: 0.2, linewidth: 2 });
      } else {
        mat = new THREE.LineBasicMaterial({ color, linewidth: 2 });
      }
      const line = new THREE.Line(geo, mat);
      if (dashed) (line as any).computeLineDistances();
      scene.add(line);
    };

    drawCurve(inflowCurve, 0x64748b);
    drawCurve(mainRouteCurve, 0xea580c);
    drawCurve(altRouteCurve, 0x10b981, true);

    // Particle Flow System
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleProgress = new Float32Array(particleCount);
    const particleBranch = new Uint8Array(particleCount); // 0 = main, 1 = alt
    const particleSpeed = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particleProgress[i] = Math.random();
      particleSpeed[i] = 0.003 + Math.random() * 0.002;

      // Assign branch based on state: if diverted, 30% go to alt, else 98% go main
      const threshold = isDiverted ? 0.3 : 0.05;
      particleBranch[i] = Math.random() < threshold ? 1 : 0;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x0f172a,
      size: 0.26,
      transparent: true,
      opacity: 0.85
    });
    const particleMesh = new THREE.Points(particleGeo, particleMat);
    scene.add(particleMesh);

    // Animation loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      const positions = particleGeo.attributes.position as THREE.BufferAttribute;

      for (let i = 0; i < particleCount; i++) {
        particleProgress[i] += particleSpeed[i];
        if (particleProgress[i] > 1) {
          particleProgress[i] = 0;
          // Re-evaluate branching dynamically
          const threshold = isDiverted ? 0.3 : 0.05;
          particleBranch[i] = Math.random() < threshold ? 1 : 0;
        }

        const p = particleProgress[i];
        let pos: THREE.Vector3;

        if (p < 0.45) {
          // Walking from Sector 12 to Junction
          const subP = p / 0.45;
          pos = inflowCurve.getPoint(subP);
        } else {
          // Branching at junction
          const subP = (p - 0.45) / 0.55;
          if (particleBranch[i] === 1) {
            pos = altRouteCurve.getPoint(subP);
          } else {
            pos = mainRouteCurve.getPoint(subP);
          }
        }

        // Slight lateral scatter for crowd width
        positions.setXYZ(i, pos.x + (Math.random() - 0.5) * 0.25, pos.y + 0.1, pos.z + (Math.random() - 0.5) * 0.25);
      }

      positions.needsUpdate = true;
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
  }, [isDiverted]);

  return (
    <section id="alternate-routing" className="py-20 bg-zinc-50 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 mb-2">
            <GitFork className="w-4 h-4 text-orange-600" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-500">
              ADAPTIVE FLOW REDIRECTION
            </span>
            <DemoBadge size="sm" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 uppercase">
            SMART ALTERNATE ROUTING
          </h2>
          <p className="mt-2 text-zinc-600 text-sm sm:text-base leading-relaxed">
            When predictive density in Sector 12 breaches critical thresholds, AI recommends diverting 30% of incoming
            pedestrian flow to Route B (Elevated Causeway toward Gate C) to relieve lethal crush potential.
          </p>
        </div>

        {/* 3D Flow Visualizer & Flow Splitting Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* 3D Route Canvas */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-zinc-200 p-2 relative h-[440px] sm:h-[500px] shadow-xs overflow-hidden">
            <div ref={mountRef} className="w-full h-full rounded-xl overflow-hidden cursor-crosshair" />

            {/* In-canvas Status Badge */}
            <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-lg border border-zinc-200 text-xs font-mono shadow-2xs">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isDiverted ? 'bg-emerald-500 animate-pulse' : 'bg-orange-500 animate-ping'
                  }`}
                />
                <span className="font-bold text-zinc-900">
                  {isDiverted ? 'DIVERSION ACTIVE: 30% DIVERTED' : 'STANDARD FLOW: 95% DIRECT TO MAIN GATE'}
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 block mt-0.5">SIMULATED 3D PARTICLES</span>
            </div>

            {/* Route Legend Box */}
            <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
              <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-md border border-zinc-200 text-[11px] font-mono flex items-center gap-4">
                <span className="text-orange-700 font-semibold">
                  MAIN ROUTE: {isDiverted ? '70%' : '95%'} FLOW
                </span>
                <span className="text-emerald-700 font-semibold">
                  ALTERNATE ROUTE B: {isDiverted ? '30%' : '5%'} FLOW
                </span>
              </div>
            </div>
          </div>

          {/* Flow Controller Card */}
          <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="border-b border-zinc-100 pb-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-orange-600 font-bold block">
                ROUTING PROTOCOL CONTROL
              </span>
              <h3 className="text-xl font-extrabold text-zinc-950 mt-1">
                Sector 12 Relief Valve
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Toggle simulated diversion of pedestrian traffic at the Sangam junction.
              </p>
            </div>

            {/* Current Route Comparison */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-orange-50/60 rounded-xl border border-orange-200">
                <div className="flex items-center justify-between text-orange-700 font-bold mb-1">
                  <span>CURRENT ROUTE</span>
                  <span>{isDiverted ? '70% LOAD' : '95% (CONGESTED)'}</span>
                </div>
                <div className="text-zinc-700 flex items-center gap-1.5 text-[11px]">
                  <span>SECTOR 12</span>
                  <ArrowRight className="w-3 h-3 text-zinc-400" />
                  <span className="font-semibold text-zinc-900">MAIN GATE</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
                <div className="flex items-center justify-between text-emerald-700 font-bold mb-1">
                  <span>ALTERNATIVE (BYPASS)</span>
                  <span>{isDiverted ? '30% ACTIVE' : 'STANDBY'}</span>
                </div>
                <div className="text-zinc-700 flex items-center gap-1.5 text-[11px]">
                  <span>SECTOR 12</span>
                  <ArrowRight className="w-3 h-3 text-zinc-400" />
                  <span>ROUTE B</span>
                  <ArrowRight className="w-3 h-3 text-zinc-400" />
                  <span className="font-semibold text-zinc-900">GATE C</span>
                </div>
              </div>
            </div>

            {/* Divert Action Button */}
            <div className="pt-2">
              <button
                onClick={() => setIsDiverted(!isDiverted)}
                id="toggle-alternate-route-btn"
                className={`w-full py-3.5 px-4 text-xs font-bold tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 ${
                  isDiverted
                    ? 'bg-zinc-900 hover:bg-zinc-800 text-white'
                    : 'bg-orange-600 hover:bg-orange-700 text-white'
                }`}
              >
                {isDiverted ? (
                  <>
                    <RotateCcw className="w-4 h-4" />
                    RESET TO NORMAL INFLOW (100% MAIN)
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 text-orange-200 fill-orange-200" />
                    DIVERT 30% OF INFLOW
                  </>
                )}
              </button>

              <p className="text-[11px] text-zinc-400 text-center mt-2.5">
                {isDiverted
                  ? 'Active: Pedestrian particles are now splitting 70% to Main Gate and 30% to Route B.'
                  : 'Click above to simulate automated digital signage and volunteer guidance.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
