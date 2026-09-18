import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Users, AlertTriangle, ShieldCheck, Activity, Radio, ArrowUpRight, ChevronRight } from 'lucide-react';
import { DemoBadge } from './DisclaimerBanner';
import { INITIAL_SECTORS } from '../data/kumbhData';
import { Sector } from '../types';

interface LiveIntelligenceProps {
  onSelectSectorForMap: (sectorId: string) => void;
  onOpenAlternateRoute: () => void;
}

export const LiveIntelligence: React.FC<LiveIntelligenceProps> = ({
  onSelectSectorForMap,
  onOpenAlternateRoute
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [sectors, setSectors] = useState<Sector[]>(INITIAL_SECTORS);
  const [selectedSector, setSelectedSector] = useState<Sector>(INITIAL_SECTORS[0]); // Sector 12
  const [elevateSurge, setElevateSurge] = useState(true);

  // 3D Density Map
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfbfbfc);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 14, 18);
    camera.lookAt(0, 1, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    // Studio Lighting
    const amb = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(amb);
    const dir = new THREE.DirectionalLight(0xffedd5, 1.6);
    dir.position.set(12, 22, 12);
    dir.castShadow = true;
    scene.add(dir);

    // Floor Base
    const baseGeo = new THREE.PlaneGeometry(28, 28);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0xf4f4f5, roughness: 0.9 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.rotation.x = -Math.PI / 2;
    scene.add(base);

    const grid = new THREE.GridHelper(28, 28, 0xe4e4e7, 0xf4f4f5);
    scene.add(grid);

    // Sector Terrain Pillars representing Density
    const sectorMeshes: { id: string; mesh: THREE.Mesh; beacon?: THREE.Mesh; baseHeight: number }[] = [];

    sectors.forEach((sec) => {
      // Density-based elevation: Critical (87%) is high, Normal (22%) is low
      const h = (sec.currentDensity / 100) * 4.2 + 0.5;
      const geo = new THREE.BoxGeometry(3.6, h, 3.6);

      // Color mapping: Low -> light zinc, Med -> amber tint, High/Critical -> red/orange
      let colorHex = 0xf4f4f5;
      if (sec.risk === 'CRITICAL') colorHex = 0xfee2e2;
      else if (sec.risk === 'HIGH') colorHex = 0xffedd5;
      else if (sec.risk === 'MODERATE') colorHex = 0xfef3c7;

      const mat = new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.5,
        metalness: 0.1
      });
      const pillar = new THREE.Mesh(geo, mat);
      pillar.position.set(sec.x * 2.8, h / 2, sec.z * 2.8);
      pillar.castShadow = true;
      pillar.receiveShadow = true;
      scene.add(pillar);

      // Edge outline
      const edges = new THREE.EdgesGeometry(geo);
      const edgeColor = sec.risk === 'CRITICAL' ? 0xea580c : sec.risk === 'HIGH' ? 0xf97316 : 0xa1a1aa;
      const wireframe = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: edgeColor }));
      pillar.add(wireframe);

      // Warning marker / pulsing beacon for Critical & High zones
      let beacon: THREE.Mesh | undefined;
      if (sec.risk === 'CRITICAL' || sec.risk === 'HIGH') {
        const bGeo = new THREE.ConeGeometry(0.35, 0.8, 8);
        const bMat = new THREE.MeshBasicMaterial({ color: 0xea580c });
        beacon = new THREE.Mesh(bGeo, bMat);
        beacon.rotation.x = Math.PI;
        beacon.position.set(sec.x * 2.8, h + 0.8, sec.z * 2.8);
        scene.add(beacon);
      }

      sectorMeshes.push({ id: sec.id, mesh: pillar, beacon, baseHeight: h });
    });

    // Animate subtle rotation & pulsing beacons
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Slow pan/orbit
      scene.rotation.y = Math.sin(elapsed * 0.1) * 0.15;

      sectorMeshes.forEach((item) => {
        if (item.beacon) {
          item.beacon.position.y = item.baseHeight + 0.8 + Math.sin(elapsed * 4) * 0.2;
          item.beacon.rotation.y = elapsed * 3;
        }
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
  }, [sectors]);

  return (
    <section id="live-intelligence" className="py-20 bg-zinc-50 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-500">
                EDGE STREAM ACTIVE • REFRESH 1000MS
              </span>
              <DemoBadge size="sm" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 uppercase">
              LIVE CROWD INTELLIGENCE
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-500">
              TERRAIN HEIGHT = RELATIVE DENSITY SATURATION
            </span>
          </div>
        </div>

        {/* Top Operational Telemetry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 mb-10">
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-zinc-200/80 shadow-2xs">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider">TOTAL CROWD</span>
              <Users className="w-4 h-4 text-zinc-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-zinc-950">
              18,420
            </div>
            <span className="text-[10px] text-zinc-400 block mt-1">Sum of fused zones</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl border border-zinc-200/80 shadow-2xs">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider">ACTIVE ZONES</span>
              <Activity className="w-4 h-4 text-zinc-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-zinc-950">
              08
            </div>
            <span className="text-[10px] text-emerald-600 block mt-1">100% spatial coverage</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl border border-orange-200/90 shadow-2xs bg-orange-50/20">
            <div className="flex items-center justify-between text-orange-500 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">HIGH-DENSITY ZONES</span>
              <AlertTriangle className="w-4 h-4 text-orange-600 animate-pulse" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-orange-700">
              02
            </div>
            <span className="text-[10px] text-orange-600 font-medium block mt-1">Sec 12 (87%), Sec 07 (74%)</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl border border-zinc-200/80 shadow-2xs">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider">SENSOR NODES</span>
              <Radio className="w-4 h-4 text-zinc-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-zinc-950">
              24
            </div>
            <span className="text-[10px] text-zinc-400 block mt-1">ESP32 + ToF + Vision</span>
          </div>

          <div className="col-span-2 md:col-span-1 bg-white p-4 sm:p-5 rounded-xl border border-zinc-200/80 shadow-2xs">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider">SYSTEM STATUS</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-base sm:text-xl font-extrabold font-mono text-emerald-700">
              OPERATIONAL
            </div>
            <span className="text-[10px] text-emerald-600 block mt-1">All telemetry nominal</span>
          </div>
        </div>

        {/* 3D Density Elevation Map & Sector Details Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* 3D Terrain Density Canvas */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-zinc-200 p-3 sm:p-5 relative flex flex-col shadow-xs">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-zinc-800 uppercase">
                  3D CROWD-DENSITY ELEVATION MESH
                </span>
                <span className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded font-mono">
                  Z-AXIS ALTITUDE = DENSITY
                </span>
              </div>
              <DemoBadge size="sm" />
            </div>

            <div
              ref={mountRef}
              className="w-full h-[380px] sm:h-[440px] rounded-xl overflow-hidden cursor-move"
            />

            {/* Density Legend Bar */}
            <div className="mt-4 pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="text-zinc-400 text-[11px]">DENSITY SCALE:</span>
                <span className="flex items-center gap-1 text-zinc-700">
                  <span className="w-3 h-3 rounded bg-zinc-200 border border-zinc-300"></span>
                  Low (&lt;40%)
                </span>
                <span className="flex items-center gap-1 text-amber-800">
                  <span className="w-3 h-3 rounded bg-amber-100 border border-amber-300"></span>
                  Medium (40-70%)
                </span>
                <span className="flex items-center gap-1 text-orange-700">
                  <span className="w-3 h-3 rounded bg-orange-100 border border-orange-300"></span>
                  High (70-85%)
                </span>
                <span className="flex items-center gap-1 text-red-700 font-bold">
                  <span className="w-3 h-3 rounded bg-red-200 border border-red-400 animate-pulse"></span>
                  Critical (&gt;85%)
                </span>
              </div>

              <div className="text-[11px] text-zinc-500">
                Notice: Sector 12 rises to maximum elevation as density crosses 87%.
              </div>
            </div>
          </div>

          {/* Right Selected Sector Focus */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
            {/* Sector Picker List */}
            <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-2xs space-y-3">
              <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider block">
                ZONAL SATURATION SELECTOR
              </span>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {sectors.map((sec) => {
                  const isSelected = selectedSector.id === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => setSelectedSector(sec)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg border text-left text-xs transition-all ${
                        isSelected
                          ? 'bg-zinc-900 text-white border-zinc-900 font-semibold'
                          : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            sec.risk === 'CRITICAL'
                              ? 'bg-red-500 animate-pulse'
                              : sec.risk === 'HIGH'
                              ? 'bg-orange-500'
                              : 'bg-emerald-500'
                          }`}
                        />
                        <span className="font-mono font-bold">{sec.id}</span>
                        <span className="truncate max-w-[130px]">{sec.name.split('(')[0]}</span>
                      </div>
                      <span className="font-mono">{sec.currentDensity}%</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Sector Telemetry Detail */}
            <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-2xs flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-orange-600 font-bold">
                      FOCUS ZONE TELEMETRY
                    </span>
                    <h3 className="text-lg font-extrabold text-zinc-950">
                      {selectedSector.name}
                    </h3>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                      selectedSector.risk === 'CRITICAL'
                        ? 'bg-red-100 text-red-700 border border-red-200'
                        : selectedSector.risk === 'HIGH'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {selectedSector.risk}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 font-mono text-xs mb-4">
                  <div className="p-2.5 bg-zinc-50 rounded-lg border border-zinc-100">
                    <span className="text-[10px] text-zinc-400 block uppercase">CURRENT DENSITY</span>
                    <span className="text-xl font-bold text-zinc-900">{selectedSector.currentDensity}%</span>
                  </div>
                  <div className="p-2.5 bg-orange-50/60 rounded-lg border border-orange-100">
                    <span className="text-[10px] text-orange-600 block uppercase font-semibold">PREDICTED DENSITY</span>
                    <span className="text-xl font-bold text-orange-700">{selectedSector.predictedDensity}%</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-zinc-100 text-zinc-600">
                    <span>Current Estimated Count</span>
                    <span className="font-mono font-semibold text-zinc-900">
                      {selectedSector.currentCount.toLocaleString()} / {selectedSector.capacity.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-100 text-zinc-600">
                    <span>Status Condition</span>
                    <span className="font-mono font-medium text-zinc-800">{selectedSector.status}</span>
                  </div>
                  <div className="py-2 text-xs bg-orange-50/50 p-2.5 rounded-lg border border-orange-200/80">
                    <span className="font-mono font-bold text-[10px] uppercase text-orange-800 block mb-0.5">
                      AI RECOMMENDED ACTION:
                    </span>
                    <span className="font-semibold text-orange-950">{selectedSector.action}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex gap-2">
                <button
                  onClick={() => onSelectSectorForMap(selectedSector.id)}
                  className="flex-1 py-2 px-3 text-xs font-semibold bg-zinc-900 text-white hover:bg-zinc-800 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  Inspect in 3D Map
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                {selectedSector.id === 'SEC-12' && (
                  <button
                    onClick={onOpenAlternateRoute}
                    className="py-2 px-3 text-xs font-semibold bg-orange-600 text-white hover:bg-orange-700 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    Divert Inflow
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
