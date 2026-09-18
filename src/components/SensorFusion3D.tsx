import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Sparkles, Brain, Cpu, ArrowDown, Activity, CheckCircle, ShieldCheck } from 'lucide-react';
import { DemoBadge } from './DisclaimerBanner';

interface StreamDefinition {
  id: string;
  name: string;
  sub: string;
  color: string;
  pos: [number, number, number];
}

const STREAMS: StreamDefinition[] = [
  { id: 'CAM', name: 'CAMERA DATA', sub: 'YOLO Headcount & Velocity Vectors', color: '#0284c7', pos: [-6, 3, 2] },
  { id: 'IR_TOF', name: 'IR / ToF', sub: 'Boundary Turnstile Flight Counts', color: '#ea580c', pos: [-5, -2, 3] },
  { id: 'BLE', name: 'BLE WRISTBANDS', sub: 'Chirp Signal Proximity Zones', color: '#8b5cf6', pos: [0, 4.5, -4] },
  { id: 'BME280', name: 'BME280', sub: 'Heat Index & Barometric Context', color: '#10b981', pos: [6, 2.5, 2] },
  { id: 'ACOUSTIC', name: 'ACOUSTIC', sub: 'Collective Sound Pressure SPL', color: '#f59e0b', pos: [5, -2.5, 3] },
  { id: 'ESP32', name: 'ESP32 MESH', sub: 'Aggregated LoRa Packet Bridge', color: '#64748b', pos: [0, -4.5, -2] }
];

export const SensorFusion3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredStream, setHoveredStream] = useState<string | null>(null);
  const [selectedPipelineStep, setSelectedPipelineStep] = useState<string>('CORE');

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfcfcfd);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 4, 18);
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

    // Studio Lighting
    const amb = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(amb);
    const dir = new THREE.DirectionalLight(0xffedd5, 2.0);
    dir.position.set(10, 20, 15);
    scene.add(dir);

    // AI Core Sphere (Dual Geodesic structure)
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Inner glowing sphere
    const innerGeo = new THREE.SphereGeometry(1.4, 32, 32);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0xea580c,
      emissiveIntensity: 0.4
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerCore);

    // Outer wireframe cage
    const outerGeo = new THREE.IcosahedronGeometry(2.0, 2);
    const outerMat = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      wireframe: true,
      roughness: 0.1
    });
    const outerCage = new THREE.Mesh(outerGeo, outerMat);
    coreGroup.add(outerCage);

    // Orbital Ring
    const orbitRingGeo = new THREE.TorusGeometry(2.8, 0.04, 16, 64);
    const orbitRingMat = new THREE.MeshBasicMaterial({ color: 0xea580c, transparent: true, opacity: 0.6 });
    const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMat);
    orbitRing.rotation.x = Math.PI / 3;
    coreGroup.add(orbitRing);

    // Stream spline lines and particle streams
    const streamObjects: {
      id: string;
      curve: THREE.QuadraticBezierCurve3;
      line: THREE.Line;
      color: string;
      nodeMesh: THREE.Mesh;
    }[] = [];

    const totalPackets = 120;
    const packetGeo = new THREE.BufferGeometry();
    const packetPositions = new Float32Array(totalPackets * 3);
    const packetProgress = new Float32Array(totalPackets);
    const packetStreamIndices = new Uint8Array(totalPackets);

    STREAMS.forEach((stream, idx) => {
      const startPos = new THREE.Vector3(...stream.pos);
      const endPos = new THREE.Vector3(0, 0, 0);

      // Mid arc
      const midPos = new THREE.Vector3(
        startPos.x * 0.5,
        startPos.y * 0.5 + 1.2,
        startPos.z * 0.5
      );

      const curve = new THREE.QuadraticBezierCurve3(startPos, midPos, endPos);
      const points = curve.getPoints(30);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(stream.color),
        linewidth: 2,
        transparent: true,
        opacity: 0.6
      });
      const line = new THREE.Line(lineGeo, lineMat);
      scene.add(line);

      // Feeder node indicator
      const nodeGeo = new THREE.SphereGeometry(0.35, 16, 16);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(stream.color),
        roughness: 0.3,
        emissive: new THREE.Color(stream.color),
        emissiveIntensity: 0.4
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.copy(startPos);
      scene.add(nodeMesh);

      streamObjects.push({ id: stream.id, curve, line, color: stream.color, nodeMesh });
    });

    for (let i = 0; i < totalPackets; i++) {
      packetProgress[i] = Math.random();
      packetStreamIndices[i] = i % STREAMS.length;
    }

    packetGeo.setAttribute('position', new THREE.BufferAttribute(packetPositions, 3));
    const packetMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.28,
      transparent: true,
      opacity: 0.95
    });
    const packetMesh = new THREE.Points(packetGeo, packetMat);
    scene.add(packetMesh);

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Pulse Core
      const pulse = 1 + Math.sin(elapsed * 3) * 0.08;
      innerCore.scale.setScalar(pulse);
      outerCage.rotation.y = elapsed * 0.3;
      outerCage.rotation.x = elapsed * 0.15;
      orbitRing.rotation.z = elapsed * 0.5;

      // Update lines based on hovered stream
      streamObjects.forEach((s) => {
        const isHovered = hoveredStream === s.id;
        const lineMat = s.line.material as THREE.LineBasicMaterial;
        lineMat.opacity = hoveredStream ? (isHovered ? 1.0 : 0.15) : 0.6;
        s.nodeMesh.scale.setScalar(isHovered ? 1.4 : 1.0);
      });

      // Flowing packets into core
      const positions = packetGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < totalPackets; i++) {
        packetProgress[i] += 0.015;
        if (packetProgress[i] > 1) packetProgress[i] = 0;

        const streamIdx = packetStreamIndices[i];
        const s = streamObjects[streamIdx];
        const pt = s.curve.getPoint(packetProgress[i]);

        positions.setXYZ(i, pt.x, pt.y, pt.z);
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
  }, [hoveredStream]);

  return (
    <section id="sensor-fusion" className="py-20 bg-zinc-50 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <DemoBadge size="sm" className="mb-3" />
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 uppercase">
            SENSOR FUSION CORE
          </h2>
          <p className="mt-3 text-base text-zinc-600 leading-relaxed">
            No single sensor tells the whole story. Camera vision provides spatial vectors, ToF curtains count discrete
            entrances, BLE isolates approximate zones, and micro-climate explains stress.
            All six pipelines converge physically into the AI Fusion Engine.
          </p>
        </div>

        {/* 3D Core Viewport and Interactive Feeder Streams */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-8 shadow-xs">
          {/* Stream Selector Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <span className="text-xs font-mono text-zinc-400 mr-2 uppercase font-semibold">
              ISOLATE DATA STREAM:
            </span>
            {STREAMS.map((s) => (
              <button
                key={s.id}
                onMouseEnter={() => setHoveredStream(s.id)}
                onMouseLeave={() => setHoveredStream(null)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all flex items-center gap-2 ${
                  hoveredStream === s.id
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                    : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }}></span>
                <span className="font-bold">{s.name}</span>
              </button>
            ))}
            {hoveredStream && (
              <button
                onClick={() => setHoveredStream(null)}
                className="text-[11px] font-mono text-zinc-400 hover:text-zinc-600 underline ml-2"
              >
                Clear Filter
              </button>
            )}
          </div>

          {/* 3D Canvas */}
          <div className="relative w-full h-[400px] sm:h-[480px] bg-zinc-900/5 rounded-xl border border-zinc-100 overflow-hidden">
            <div ref={mountRef} className="w-full h-full cursor-crosshair" />

            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-mono text-zinc-700 flex items-center gap-2 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
              3D AI SENSOR FUSION ENGINE • REAL-TIME CONVERGENCE
            </div>

            <div className="absolute bottom-4 right-4 text-[10px] font-mono text-zinc-400 bg-white/80 px-2 py-1 rounded">
              HOVER INPUTS ABOVE TO TRACE INDIVIDUAL STREAM
            </div>
          </div>

          {/* Exact Sequential Pipeline specified in prompt Section 15 */}
          <div className="mt-8 pt-6 border-t border-zinc-100">
            <div className="text-center font-mono text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">
              AI INFERENCE CASCADE:
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
              <span className="px-3 py-2 bg-zinc-100 rounded-lg text-zinc-800 font-bold border border-zinc-200">
                CAMERA DATA
              </span>
              <span className="text-zinc-400">+</span>
              <span className="px-3 py-2 bg-zinc-100 rounded-lg text-zinc-800 font-bold border border-zinc-200">
                IR / ToF
              </span>
              <span className="text-zinc-400">+</span>
              <span className="px-3 py-2 bg-zinc-100 rounded-lg text-zinc-800 font-bold border border-zinc-200">
                BLE
              </span>
              <span className="text-zinc-400">+</span>
              <span className="px-3 py-2 bg-zinc-100 rounded-lg text-zinc-800 font-bold border border-zinc-200">
                BME280
              </span>
              <span className="text-zinc-400">+</span>
              <span className="px-3 py-2 bg-zinc-100 rounded-lg text-zinc-800 font-bold border border-zinc-200">
                ACOUSTIC
              </span>
              <span className="text-zinc-400">+</span>
              <span className="px-3 py-2 bg-zinc-100 rounded-lg text-zinc-800 font-bold border border-zinc-200">
                ESP32
              </span>
              <span className="text-orange-500 font-bold text-sm">↓</span>
              <span className="px-3 py-2 bg-orange-100 text-orange-950 rounded-lg font-bold border border-orange-300">
                3D SENSOR FUSION CORE
              </span>
              <span className="text-orange-500 font-bold text-sm">↓</span>
              <span className="px-3 py-2 bg-zinc-900 text-white rounded-lg font-bold">
                AI ANALYSIS
              </span>
              <span className="text-orange-500 font-bold text-sm">↓</span>
              <span className="px-3 py-2 bg-zinc-100 rounded-lg text-zinc-800 font-bold border border-zinc-200">
                CROWD STATE
              </span>
              <span className="text-orange-500 font-bold text-sm">↓</span>
              <span className="px-3 py-2 bg-amber-100 text-amber-950 rounded-lg font-bold border border-amber-300">
                PREDICTION
              </span>
              <span className="text-orange-500 font-bold text-sm">↓</span>
              <span className="px-3 py-2 bg-emerald-600 text-white rounded-lg font-bold">
                ACTION
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
