import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ArrowRight, Shield, Zap, Compass, RotateCcw } from 'lucide-react';
import { DemoBadge } from './DisclaimerBanner';

interface Hero3DProps {
  onExplore: () => void;
  onOpenCommandCenter: () => void;
}

export const Hero3D: React.FC<Hero3DProps> = ({ onExplore, onOpenCommandCenter }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [cameraMode, setCameraMode] = useState<'cinematic' | 'birds_eye'>('cinematic');

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfcfcfd);
    scene.fog = new THREE.FogExp2(0xfcfcfd, 0.025);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 16, 26);
    camera.lookAt(0, 0, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('WebGL init failed, fallback active', e);
      return;
    }

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 1.8);
    keyLight.position.set(15, 30, 15);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 60;
    keyLight.shadow.camera.left = -15;
    keyLight.shadow.camera.right = 15;
    keyLight.shadow.camera.top = 15;
    keyLight.shadow.camera.bottom = -15;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 0.6);
    fillLight.position.set(-15, 10, -15);
    scene.add(fillLight);

    // Master Group for smooth rotation / parallax
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // 1. Terrain Base (Off-white technical grid)
    const groundGeo = new THREE.PlaneGeometry(36, 36, 36, 36);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.85,
      metalness: 0.05
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    worldGroup.add(ground);

    // Subtle grid lines
    const gridHelper = new THREE.GridHelper(36, 36, 0xe2e8f0, 0xf1f5f9);
    gridHelper.position.y = 0;
    worldGroup.add(gridHelper);

    // Sacred River / Ghat Ribbon (Sangam waterway)
    const riverGeo = new THREE.PlaneGeometry(36, 6);
    const riverMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.3,
      metalness: 0.4
    });
    const river = new THREE.Mesh(riverGeo, riverMat);
    river.rotation.x = -Math.PI / 2;
    river.rotation.z = Math.PI / 6;
    river.position.set(0, 0.02, 3);
    worldGroup.add(river);

    // 2. Sector Platforms (Clean geometric blocks)
    const sectorsData = [
      { id: '12', name: 'Sector 12', x: 0, z: 2, w: 5, d: 4, h: 1.2, color: 0xfee2e2, stroke: 0xea580c, warning: true },
      { id: '07', name: 'Sector 07', x: -6, z: -1, w: 4, d: 5, h: 0.8, color: 0xffedd5, stroke: 0xf97316 },
      { id: '03', name: 'Sector 03', x: 5.5, z: -2, w: 4.5, d: 4.5, h: 0.4, color: 0xf1f5f9, stroke: 0x94a3b8 },
      { id: '04', name: 'Sector 04', x: -4.5, z: 5.5, w: 4, d: 3.5, h: 0.7, color: 0xffedd5, stroke: 0xf97316 },
      { id: '05', name: 'Sector 05', x: 4.5, z: 6, w: 4.5, d: 3.5, h: 0.5, color: 0xf8fafc, stroke: 0xcfd4dc }
    ];

    const sectorMeshes: THREE.Mesh[] = [];

    sectorsData.forEach((sec) => {
      const geo = new THREE.BoxGeometry(sec.w, sec.h, sec.d);
      const mat = new THREE.MeshStandardMaterial({
        color: sec.color,
        roughness: 0.6,
        metalness: 0.1
      });
      const box = new THREE.Mesh(geo, mat);
      box.position.set(sec.x, sec.h / 2, sec.z);
      box.castShadow = true;
      box.receiveShadow = true;
      worldGroup.add(box);
      sectorMeshes.push(box);

      // Clean top outline edge
      const edges = new THREE.EdgesGeometry(geo);
      const lineMat = new THREE.LineBasicMaterial({
        color: sec.stroke,
        linewidth: 1.5
      });
      const wireframe = new THREE.LineSegments(edges, lineMat);
      box.add(wireframe);
    });

    // 3. Central Command Tower
    const towerGeo = new THREE.CylinderGeometry(0.6, 0.9, 3.8, 8);
    const towerMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.4,
      metalness: 0.8
    });
    const tower = new THREE.Mesh(towerGeo, towerMat);
    tower.position.set(0, 1.9, -6);
    tower.castShadow = true;
    worldGroup.add(tower);

    // Tower Beacon Light
    const beaconGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xea580c });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.set(0, 3.9, -6);
    worldGroup.add(beacon);

    // 4. Sensor Nodes (Floating glowing orbs with pulses)
    const sensorPositions = [
      new THREE.Vector3(0, 2.2, 2),     // Sec 12
      new THREE.Vector3(-6, 1.8, -1),   // Sec 07
      new THREE.Vector3(5.5, 1.4, -2),  // Sec 03
      new THREE.Vector3(-4.5, 1.7, 5.5),// Sec 04
      new THREE.Vector3(4.5, 1.5, 6),   // Sec 05
      new THREE.Vector3(0, 4.1, -6)     // Command Tower Node
    ];

    const sensorRings: THREE.Mesh[] = [];
    sensorPositions.forEach((pos, idx) => {
      // Node core
      const nodeGeo = new THREE.SphereGeometry(0.18, 12, 12);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: idx === 0 ? 0xea580c : 0x0f172a,
        emissive: idx === 0 ? 0xea580c : 0x475569,
        emissiveIntensity: 0.4,
        roughness: 0.2
      });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.copy(pos);
      worldGroup.add(node);

      // Node subtle pulse ring
      const ringGeo = new THREE.RingGeometry(0.3, 0.45, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xf97316,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(pos.x, pos.y - 0.05, pos.z);
      worldGroup.add(ring);
      sensorRings.push(ring);
    });

    // 5. Orange Data Flow Lines connecting sensor nodes to Command Center
    const lineMat = new THREE.LineDashedMaterial({
      color: 0xea580c,
      dashSize: 0.4,
      gapSize: 0.2,
      linewidth: 1
    });

    const commandCenterPos = new THREE.Vector3(0, 3.9, -6);
    sensorPositions.slice(0, 5).forEach((nodePos) => {
      const curve = new THREE.QuadraticBezierCurve3(
        nodePos,
        new THREE.Vector3((nodePos.x + commandCenterPos.x) / 2, Math.max(nodePos.y, commandCenterPos.y) + 1.8, (nodePos.z + commandCenterPos.z) / 2),
        commandCenterPos
      );
      const points = curve.getPoints(30);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeo, lineMat);
      line.computeLineDistances();
      worldGroup.add(line);
    });

    // 6. Crowd Flow Particles (Moving along predefined paths)
    const particleCount = 260;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);
    const particleProgress = new Float32Array(particleCount);
    const particlePathIds = new Uint8Array(particleCount);

    // 3 Main pedestrian routes
    const paths = [
      // Path 0: Entrance (Z: 14) -> Sec 05 -> Sec 12 -> Ghat
      [
        new THREE.Vector3(0, 0.3, 14),
        new THREE.Vector3(2, 0.4, 9),
        new THREE.Vector3(0, 1.4, 2),
        new THREE.Vector3(-1, 0.4, -2)
      ],
      // Path 1: Transit 03 -> Sec 12 -> Ghat
      [
        new THREE.Vector3(10, 0.3, -2),
        new THREE.Vector3(5.5, 0.6, -2),
        new THREE.Vector3(1, 1.4, 2),
        new THREE.Vector3(0, 0.4, -4)
      ],
      // Path 2: West Pontoon 04 -> Sec 07 -> Central Hub
      [
        new THREE.Vector3(-12, 0.3, 5.5),
        new THREE.Vector3(-4.5, 0.9, 5.5),
        new THREE.Vector3(-6, 1.0, -1),
        new THREE.Vector3(-1, 0.4, -5)
      ]
    ];

    const curves = paths.map((pts) => new THREE.CatmullRomCurve3(pts));

    for (let i = 0; i < particleCount; i++) {
      particlePathIds[i] = i % curves.length;
      particleProgress[i] = Math.random();
      particleSpeeds[i] = 0.0008 + Math.random() * 0.0012;

      const pt = curves[particlePathIds[i]].getPoint(particleProgress[i]);
      // Small lateral scatter
      particlePositions[i * 3] = pt.x + (Math.random() - 0.5) * 0.8;
      particlePositions[i * 3 + 1] = pt.y + 0.1;
      particlePositions[i * 3 + 2] = pt.z + (Math.random() - 0.5) * 0.8;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x0f172a,
      size: 0.18,
      transparent: true,
      opacity: 0.75
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    worldGroup.add(particles);

    // Mouse Parallax & Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;
      targetRotationY = x * 0.25;
      targetRotationX = -y * 0.12;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth world group rotation with parallax
      worldGroup.rotation.y += (targetRotationY - worldGroup.rotation.y) * 0.05;
      worldGroup.rotation.x += (targetRotationX - worldGroup.rotation.x) * 0.05;

      // Animate sensor pulse rings
      sensorRings.forEach((ring, idx) => {
        const scale = 1 + Math.sin(elapsedTime * 2.5 + idx) * 0.25;
        ring.scale.set(scale, scale, 1);
        (ring.material as THREE.MeshBasicMaterial).opacity = 0.35 + Math.sin(elapsedTime * 2.5 + idx) * 0.25;
      });

      // Animate Beacon Light
      beacon.scale.setScalar(1 + Math.sin(elapsedTime * 4) * 0.2);

      // Animate Crowd Particles along curves
      const posAttr = particleGeometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        particleProgress[i] += particleSpeeds[i];
        if (particleProgress[i] > 1) {
          particleProgress[i] = 0;
        }

        const curve = curves[particlePathIds[i]];
        const pt = curve.getPoint(particleProgress[i]);

        // Lateral jitter
        posAttr.setXYZ(i, pt.x, pt.y + 0.1, pt.z);
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [cameraMode]);

  return (
    <section id="home" className="relative min-h-[92vh] w-full pt-20 pb-12 flex flex-col justify-between overflow-hidden bg-radial from-white via-zinc-50/50 to-zinc-100/60 border-b border-zinc-200/80">
      {/* 3D Canvas Background & Interaction Canvas */}
      <div
        ref={mountRef}
        className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing pointer-events-auto"
        id="hero-3d-canvas-container"
      />

      {/* Subtle Technical Grid Overlay & Radial Gradient */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#00000008_1px,transparent_1px)] [background-size:24px_24px] opacity-70 z-1" />

      {/* Main Content Layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pt-8 md:pt-16 pointer-events-none">
        {/* Left Hero Typography Card */}
        <div className="max-w-2xl pointer-events-auto bg-white/85 backdrop-blur-md p-6 sm:p-10 rounded-2xl border border-zinc-200/90 shadow-sm">
          {/* Eyebrow / Tagline */}
          <div className="flex items-center gap-2 mb-4">
            <DemoBadge size="sm" />
            <span className="text-[11px] font-mono font-medium text-zinc-500 uppercase tracking-wider">
              AI + IoT Architectural Concept
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-950 leading-[1.08] mb-4">
            MILLIONS OF PEOPLE.
            <br />
            <span className="text-zinc-400 font-light">ONE INTELLIGENT SYSTEM.</span>
          </h1>

          <div className="flex items-center gap-3 py-1 mb-5">
            <span className="text-xl sm:text-2xl font-black tracking-widest text-orange-600 font-mono">
              AI KUMBH
            </span>
            <span className="h-4 w-px bg-zinc-300"></span>
            <span className="text-xs sm:text-sm font-semibold tracking-wider text-zinc-700 font-mono">
              SENSE. PREDICT. REDIRECT. PROTECT.
            </span>
          </div>

          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed mb-8 max-w-xl">
            A conceptual cyber-physical system orchestrating computer vision, distributed ESP32 micro-sensors,
            ToF laser gates, and predictive spatial intelligence to mitigate surge risks at massive spiritual gatherings.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenCommandCenter}
              id="hero-open-command-center"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs sm:text-sm font-bold tracking-wider text-white bg-zinc-950 hover:bg-orange-600 active:bg-orange-700 rounded-lg transition-all shadow-sm group"
            >
              <Zap className="w-4 h-4 text-orange-400 group-hover:text-white transition-colors" />
              OPEN COMMAND CENTER
            </button>
            <button
              onClick={onExplore}
              id="hero-explore-intelligence"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold tracking-wider text-zinc-800 bg-zinc-100 hover:bg-zinc-200/80 active:bg-zinc-200 border border-zinc-200 rounded-lg transition-all"
            >
              EXPLORE INTELLIGENCE
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Floating Quick Status Widget */}
        <div className="pointer-events-auto bg-white/90 backdrop-blur-md p-5 rounded-xl border border-zinc-200/90 shadow-sm w-full sm:w-80 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <span className="text-xs font-mono font-semibold tracking-wider text-zinc-500">
              3D ENVIRONMENT TELEMETRY
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              ACTIVE STREAM
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono">
            <div className="p-2.5 bg-zinc-50 rounded-lg border border-zinc-100">
              <span className="text-[10px] text-zinc-500 block uppercase">MONITORED FLOW</span>
              <span className="text-lg font-bold text-zinc-900">18,420</span>
              <span className="text-[9px] text-zinc-400 block">current headcount</span>
            </div>
            <div className="p-2.5 bg-orange-50/50 rounded-lg border border-orange-100">
              <span className="text-[10px] text-orange-600 block uppercase font-semibold">SURGE SECTOR</span>
              <span className="text-lg font-bold text-orange-700">SEC-12</span>
              <span className="text-[9px] text-orange-500 block">87% saturation</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-1 text-xs">
            <div className="flex items-center justify-between text-zinc-600">
              <span className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
                <Shield className="w-3.5 h-3.5 text-zinc-400" />
                Active Sensor Array
              </span>
              <span className="font-mono font-semibold text-zinc-800">24 Nodes</span>
            </div>
            <div className="flex items-center justify-between text-zinc-600">
              <span className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
                <Compass className="w-3.5 h-3.5 text-zinc-400" />
                Bypass Route Status
              </span>
              <span className="font-mono font-semibold text-emerald-600">STANDBY (Route B)</span>
            </div>
          </div>

          <p className="text-[11px] text-zinc-400 border-t border-zinc-100 pt-2 leading-tight">
            * Drag to tilt & explore the 3D terrain representation. Orange arcs indicate active IoT edge packets.
          </p>
        </div>
      </div>

      {/* Bottom Floating Core Pipeline Bar */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-6">
        <div className="bg-white/80 backdrop-blur-md border border-zinc-200/80 rounded-xl p-3 sm:p-4 shadow-xs">
          <div className="flex items-center justify-between gap-2 overflow-x-auto text-[11px] font-mono tracking-wider text-zinc-600">
            <span className="font-bold text-zinc-900 shrink-0">CORE PIPELINE:</span>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2 py-1 bg-zinc-100 rounded text-zinc-800 font-semibold">PHYSICAL WORLD</span>
              <span className="text-orange-500">→</span>
              <span className="px-2 py-1 bg-zinc-100 rounded text-zinc-800 font-semibold">SENSORS</span>
              <span className="text-orange-500">→</span>
              <span className="px-2 py-1 bg-zinc-100 rounded text-zinc-800 font-semibold">DATA COLLECTION</span>
              <span className="text-orange-500">→</span>
              <span className="px-2 py-1 bg-orange-50 text-orange-700 font-semibold rounded border border-orange-200">SENSOR FUSION</span>
              <span className="text-orange-500">→</span>
              <span className="px-2 py-1 bg-zinc-100 rounded text-zinc-800 font-semibold">AI ANALYSIS</span>
              <span className="text-orange-500">→</span>
              <span className="px-2 py-1 bg-zinc-100 rounded text-zinc-800 font-semibold">PREDICTION</span>
              <span className="text-orange-500">→</span>
              <span className="px-2 py-1 bg-rose-50 text-rose-700 font-semibold rounded border border-rose-200">RISK DETECTION</span>
              <span className="text-orange-500">→</span>
              <span className="px-2 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded border border-emerald-200">ROUTE RECOMMENDATION</span>
              <span className="text-orange-500">→</span>
              <span className="px-2 py-1 bg-zinc-900 text-white font-semibold rounded">EMERGENCY RESPONSE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
