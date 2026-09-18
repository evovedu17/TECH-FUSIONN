import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ZoomIn, ZoomOut, RotateCcw, Layers, MapPin, AlertCircle, Compass, Radio, ArrowUpRight, Shield } from 'lucide-react';
import { DemoBadge } from './DisclaimerBanner';
import { INITIAL_SECTORS } from '../data/kumbhData';
import { Sector } from '../types';

interface SmartMap3DProps {
  initialSectorId?: string;
  onActivateAlternateRoute?: () => void;
}

export const SmartMap3D: React.FC<SmartMap3DProps> = ({
  initialSectorId = 'SEC-12',
  onActivateAlternateRoute
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedSector, setSelectedSector] = useState<Sector>(
    INITIAL_SECTORS.find((s) => s.id === initialSectorId) || INITIAL_SECTORS[0]
  );
  const [showSensors, setShowSensors] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [showGates, setShowGates] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(24);

  // References for camera manipulation
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const controlsState = useRef({
    isDragging: false,
    prevMousePos: { x: 0, y: 0 },
    rotation: { x: 0.6, y: 0.2 },
    zoom: 24
  });

  useEffect(() => {
    if (initialSectorId) {
      const match = INITIAL_SECTORS.find((s) => s.id === initialSectorId);
      if (match) setSelectedSector(match);
    }
  }, [initialSectorId]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfcfcfd);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 18, 22);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffedd5, 1.8);
    dirLight.position.set(15, 25, 15);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const mapRoot = new THREE.Group();
    scene.add(mapRoot);

    // 1. Terrain Grid
    const grid = new THREE.GridHelper(32, 32, 0xe2e8f0, 0xf1f5f9);
    mapRoot.add(grid);

    // River
    const riverGeo = new THREE.PlaneGeometry(32, 5);
    const riverMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4, metalness: 0.3 });
    const river = new THREE.Mesh(riverGeo, riverMat);
    river.rotation.x = -Math.PI / 2;
    river.rotation.z = Math.PI / 8;
    river.position.set(0, 0.02, 4);
    mapRoot.add(river);

    // 2. Sector Blocks
    const sectorMeshes: { id: string; mesh: THREE.Mesh; sector: Sector }[] = [];
    const raycastTargets: THREE.Object3D[] = [];

    INITIAL_SECTORS.forEach((sec) => {
      const height = (sec.currentDensity / 100) * 3 + 0.5;
      const geo = new THREE.BoxGeometry(3.5, height, 3.5);

      let color = 0xf8fafc;
      let stroke = 0x94a3b8;
      if (sec.risk === 'CRITICAL') {
        color = 0xfee2e2;
        stroke = 0xea580c;
      } else if (sec.risk === 'HIGH') {
        color = 0xffedd5;
        stroke = 0xf97316;
      } else if (sec.risk === 'MODERATE') {
        color = 0xfef3c7;
        stroke = 0xd97706;
      }

      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.6,
        metalness: 0.05
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(sec.x * 2.6, height / 2, sec.z * 2.6);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { sectorId: sec.id, sector: sec };
      mapRoot.add(mesh);

      const edges = new THREE.EdgesGeometry(geo);
      const wire = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: stroke, linewidth: 2 }));
      mesh.add(wire);

      sectorMeshes.push({ id: sec.id, mesh, sector: sec });
      raycastTargets.push(mesh);
    });

    // 3. Gates Markers
    const gates = [
      { name: 'Gate A (North)', x: 0, z: -8 },
      { name: 'Gate B (Central)', x: -7, z: -3 },
      { name: 'Gate C (East Causeway)', x: 6, z: 2 },
      { name: 'Main Sangam Gate', x: 0, z: 6 }
    ];

    const gateGroup = new THREE.Group();
    gates.forEach((g) => {
      const gGeo = new THREE.CylinderGeometry(0.3, 0.4, 1.2, 8);
      const gMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });
      const gMesh = new THREE.Mesh(gGeo, gMat);
      gMesh.position.set(g.x, 0.6, g.z);
      gateGroup.add(gMesh);

      // Gate Top Marker
      const topGeo = new THREE.RingGeometry(0.3, 0.45, 16);
      const topMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, side: THREE.DoubleSide });
      const top = new THREE.Mesh(topGeo, topMat);
      top.rotation.x = -Math.PI / 2;
      top.position.set(g.x, 1.3, g.z);
      gateGroup.add(top);
    });
    mapRoot.add(gateGroup);

    // 4. Routes and Alternate Routes
    const routeGroup = new THREE.Group();

    // Primary route: Sector 12 (0, 2.6) -> Main Gate (0, 6)
    const primCurve = new THREE.LineCurve3(
      new THREE.Vector3(0, 0.4, 2.6),
      new THREE.Vector3(0, 0.4, 6)
    );
    const primGeo = new THREE.BufferGeometry().setFromPoints(primCurve.getPoints(20));
    const primLine = new THREE.Line(
      primGeo,
      new THREE.LineBasicMaterial({ color: 0xea580c, linewidth: 3 })
    );
    routeGroup.add(primLine);

    // Alternate route: Sector 12 (0, 2.6) -> Route B -> Gate C (6, 2)
    const altCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.4, 2.6),
      new THREE.Vector3(3.5, 0.5, 3.5),
      new THREE.Vector3(6, 0.4, 2)
    ]);
    const altGeo = new THREE.BufferGeometry().setFromPoints(altCurve.getPoints(25));
    const altLine = new THREE.Line(
      altGeo,
      new THREE.LineDashedMaterial({ color: 0x10b981, dashSize: 0.5, gapSize: 0.25 })
    );
    altLine.computeLineDistances();
    routeGroup.add(altLine);

    mapRoot.add(routeGroup);

    // Mouse drag orbit interaction
    const handleMouseDown = (e: MouseEvent) => {
      controlsState.current.isDragging = true;
      controlsState.current.prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!controlsState.current.isDragging) return;
      const dx = e.clientX - controlsState.current.prevMousePos.x;
      const dy = e.clientY - controlsState.current.prevMousePos.y;

      controlsState.current.rotation.y += dx * 0.008;
      controlsState.current.rotation.x = Math.max(
        0.2,
        Math.min(1.2, controlsState.current.rotation.x + dy * 0.008)
      );

      controlsState.current.prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      controlsState.current.isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      controlsState.current.zoom = Math.max(12, Math.min(36, controlsState.current.zoom + e.deltaY * 0.02));
      setZoomLevel(controlsState.current.zoom);
    };

    // Click on Sector to Select
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects(raycastTargets);
      if (intersects.length > 0) {
        const target = intersects[0].object;
        if (target.userData?.sector) {
          setSelectedSector(target.userData.sector);
        }
      }
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('click', handleClick);

    // Animation loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Apply drag rotation
      mapRoot.rotation.y = controlsState.current.rotation.y;
      mapRoot.rotation.x = controlsState.current.rotation.x;

      // Update camera distance based on zoom
      const r = controlsState.current.zoom;
      camera.position.set(0, r * 0.75, r);
      camera.lookAt(0, 0, 0);

      // Gate and route visibility toggles
      gateGroup.visible = showGates;
      routeGroup.visible = showRoutes;

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
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('click', handleClick);
      resizeObserver.disconnect();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [showGates, showRoutes, showSensors]);

  const handleZoom = (delta: number) => {
    controlsState.current.zoom = Math.max(12, Math.min(36, controlsState.current.zoom + delta));
    setZoomLevel(controlsState.current.zoom);
  };

  const handleResetCamera = () => {
    controlsState.current.rotation = { x: 0.6, y: 0.2 };
    controlsState.current.zoom = 24;
    setZoomLevel(24);
  };

  return (
    <section id="smart-map" className="py-20 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-500">
                TACTICAL SPATIAL TWIN
              </span>
              <DemoBadge size="sm" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 uppercase">
              3D SMART CROWD MAP
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Interactive WebGL terrain model. Click sectors to inspect live capacity, routes, and automated diversion orders.
            </p>
          </div>

          {/* Map Controls & Layer Filters */}
          <div className="flex flex-wrap items-center gap-2 bg-zinc-50 border border-zinc-200 p-1.5 rounded-xl">
            <button
              onClick={() => setShowGates(!showGates)}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5 ${
                showGates ? 'bg-white shadow-2xs text-zinc-900 font-semibold' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${showGates ? 'bg-blue-500' : 'bg-zinc-300'}`}></span>
              Gates
            </button>
            <button
              onClick={() => setShowRoutes(!showRoutes)}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5 ${
                showRoutes ? 'bg-white shadow-2xs text-zinc-900 font-semibold' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${showRoutes ? 'bg-emerald-500' : 'bg-zinc-300'}`}></span>
              Flow Routes
            </button>
            <span className="h-4 w-px bg-zinc-200"></span>
            <button
              onClick={() => handleZoom(-3)}
              className="p-1.5 hover:bg-white text-zinc-600 rounded-lg"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom(3)}
              className="p-1.5 hover:bg-white text-zinc-600 rounded-lg"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetCamera}
              className="p-1.5 hover:bg-white text-zinc-600 rounded-lg"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3D Map Viewport & Sector Inspection Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main 3D Canvas */}
          <div className="lg:col-span-8 bg-zinc-50 rounded-2xl border border-zinc-200 p-2 relative h-[480px] sm:h-[560px] overflow-hidden shadow-xs">
            <div
              ref={mountRef}
              className="w-full h-full cursor-grab active:cursor-grabbing rounded-xl overflow-hidden"
              id="smart-map-canvas"
            />

            {/* In-canvas Guidance Overlay */}
            <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-lg border border-zinc-200 text-xs font-mono text-zinc-700 space-y-1 shadow-2xs">
              <div className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-zinc-500" />
                <span className="font-bold">ORBIT: DRAG • ZOOM: SCROLL</span>
              </div>
              <p className="text-[10px] text-zinc-400">Click any 3D sector block to inspect</p>
            </div>

            {/* In-canvas Route Legend */}
            <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
              <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-md border border-zinc-200 text-[11px] font-mono flex items-center gap-3">
                <span className="flex items-center gap-1 text-orange-600">
                  <span className="w-2.5 h-0.5 bg-orange-500"></span> Primary (Congested)
                </span>
                <span className="flex items-center gap-1 text-emerald-600">
                  <span className="w-2.5 h-0.5 bg-emerald-500 border-dashed"></span> Route B (Bypass)
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 bg-white/80 px-2.5 py-1 rounded">
                SIMULATION / DEMO DATA
              </span>
            </div>
          </div>

          {/* Selected Sector Inspector Panel (Matches Exact Prompt Spec) */}
          <div className="lg:col-span-4 bg-zinc-50 border border-zinc-200 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-xs">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-200 pb-4 mb-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-orange-600 font-bold block">
                    SECTOR SELECTION INSPECTOR
                  </span>
                  <h3 className="text-2xl font-black tracking-tight text-zinc-950 font-mono mt-0.5">
                    {selectedSector.id}
                  </h3>
                  <span className="text-xs text-zinc-500">{selectedSector.name}</span>
                </div>
                <DemoBadge size="sm" />
              </div>

              {/* Exact Metrics specified in prompt */}
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-2xs">
                  <span className="text-xs font-mono text-zinc-400 block uppercase">CURRENT DENSITY</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-3xl font-extrabold font-mono text-zinc-950">
                      {selectedSector.currentDensity}%
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">
                      {selectedSector.currentCount.toLocaleString()} persons
                    </span>
                  </div>
                  <div className="w-full bg-zinc-100 h-2 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        selectedSector.currentDensity > 80 ? 'bg-orange-600' : 'bg-zinc-800'
                      }`}
                      style={{ width: `${selectedSector.currentDensity}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-orange-200 shadow-2xs bg-orange-50/20">
                  <span className="text-xs font-mono text-orange-600 font-semibold block uppercase">
                    PREDICTED DENSITY (+30 MIN)
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-3xl font-extrabold font-mono text-orange-700">
                      {selectedSector.predictedDensity}%
                    </span>
                    <span className="text-xs text-orange-600 font-mono font-medium">
                      Impending bottleneck
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div className="p-3 bg-white rounded-xl border border-zinc-200">
                    <span className="text-[10px] text-zinc-400 uppercase block">RISK</span>
                    <span
                      className={`text-base font-extrabold block mt-0.5 ${
                        selectedSector.risk === 'CRITICAL'
                          ? 'text-red-600'
                          : selectedSector.risk === 'HIGH'
                          ? 'text-orange-600'
                          : 'text-zinc-800'
                      }`}
                    >
                      {selectedSector.risk}
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-zinc-200">
                    <span className="text-[10px] text-zinc-400 uppercase block">CAPACITY LIMIT</span>
                    <span className="text-base font-bold text-zinc-900 block mt-0.5">
                      {selectedSector.capacity.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-zinc-900 text-white rounded-xl shadow-xs space-y-1">
                  <span className="text-[10px] font-mono tracking-widest text-orange-400 uppercase font-bold block">
                    AI PROTOCOL ACTION
                  </span>
                  <p className="text-sm font-bold font-mono tracking-wide">
                    {selectedSector.action}
                  </p>
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-4 border-t border-zinc-200">
              <button
                onClick={onActivateAlternateRoute}
                className="w-full py-3 px-4 text-xs font-bold tracking-wider bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                id="smart-map-divert-cta"
              >
                OPEN ALTERNATE ROUTE DIVERSION
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
