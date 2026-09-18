import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Camera, Radio, Cpu, Wifi, Activity, Volume2, ArrowDown, Eye, CheckCircle2, Info } from 'lucide-react';
import { DemoBadge } from './DisclaimerBanner';

interface SensorInfo {
  id: string;
  name: string;
  type: string;
  specs: string;
  frequency: string;
  protocol: string;
  description: string;
  color: string;
  threePos: [number, number, number];
}

const SENSORS: SensorInfo[] = [
  {
    id: 'CAM',
    name: 'COMPUTER VISION CAMERA',
    type: 'Optical Sensing',
    specs: '4K 60fps Edge AI Neural Stream',
    frequency: '30 fps inferred',
    protocol: 'RTSP / H.265 / Edge Tensor',
    description: 'Pedestrian detection bounding boxes, spatial cluster density estimation, and vector trajectory speed tracking.',
    color: '#0284c7',
    threePos: [-6, 3, 2]
  },
  {
    id: 'IR_TOF',
    name: 'IR / ToF LASER CURTAIN',
    type: 'Beam-Break Counting',
    specs: '940nm Multi-Zone Time-of-Flight',
    frequency: '50 Hz polling',
    protocol: 'I2C / GPIO interrupt',
    description: 'Sub-millimeter flight-of-time sensor capturing bidirectional entry and exit counts at narrow security bottlenecks.',
    color: '#ea580c',
    threePos: [-3.5, 2.4, -2]
  },
  {
    id: 'ESP32',
    name: 'ESP32 IoT EDGE BRIDGE',
    type: 'Edge Micro-Controller',
    specs: 'Dual-core Xtensa 240MHz + LoRa',
    frequency: 'Continuous pipeline',
    protocol: 'ESP-NOW / MQTT / LoRaWAN',
    description: 'Ruggedized field hub aggregating local sensor streams, applying edge deduplication, and streaming telemetry to gateway.',
    color: '#0f172a',
    threePos: [0, 4, 0]
  },
  {
    id: 'BLE',
    name: 'BLE SAFETY RECEIVER',
    type: 'Proximity RSSI Triangulation',
    specs: 'Bluetooth 5.2 Long Range Mesh',
    frequency: '100ms advert sweep',
    protocol: 'BLE GAP Broadcast',
    description: 'Passive receiver array picking up periodic beacon pings from opt-in pilgrim safety wristbands to isolate zone presence.',
    color: '#8b5cf6',
    threePos: [3.5, 2.6, -2.5]
  },
  {
    id: 'BME280',
    name: 'BME280 ENVIRONMENT SENSOR',
    type: 'Atmospheric Microclimate',
    specs: 'Temp ±0.5°C, Hum ±3%, Baro ±1hPa',
    frequency: '1 Hz sample rate',
    protocol: 'I2C Bus',
    description: 'Quantifies ambient micro-climate heat indices. Critical note: Monitors temperature/humidity context, NOT crowd size.',
    color: '#059669',
    threePos: [5.5, 2.8, 1.5]
  },
  {
    id: 'ACOUSTIC',
    name: 'ACOUSTIC SOUND SENSOR',
    type: 'Ambient Decibel Level',
    specs: 'Electret MEMS 30dB–120dB',
    frequency: 'Fast SPL RMS',
    protocol: 'Analog ADC / DMA',
    description: 'Monitors collective acoustic decibel levels. Serves as supplementary activity signal; cannot measure crowd numbers alone.',
    color: '#d97706',
    threePos: [2, 2.2, 4]
  }
];

export const SensorNetwork3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedSensor, setSelectedSensor] = useState<SensorInfo>(SENSORS[2]); // ESP32 default
  const [hoveredSensorId, setHoveredSensorId] = useState<string | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfcfcfd);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 10, 18);
    camera.lookAt(0, 1.5, 0);

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
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff7ed, 1.4);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    // Floor Grid
    const grid = new THREE.GridHelper(24, 24, 0xe2e8f0, 0xf1f5f9);
    grid.position.y = -0.5;
    scene.add(grid);

    // AI Core Sphere at top/back
    const aiCoreGeo = new THREE.IcosahedronGeometry(1.2, 2);
    const aiCoreMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      wireframe: true,
      roughness: 0.2
    });
    const aiCore = new THREE.Mesh(aiCoreGeo, aiCoreMat);
    aiCore.position.set(0, 5.5, -4);
    scene.add(aiCore);

    // Inner glowing core
    const innerCoreGeo = new THREE.SphereGeometry(0.7, 16, 16);
    const innerCoreMat = new THREE.MeshBasicMaterial({ color: 0xea580c });
    const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    innerCore.position.copy(aiCore.position);
    scene.add(innerCore);

    // Create 3D Nodes
    const nodeMeshes: { id: string; mesh: THREE.Mesh; ring: THREE.Mesh; pos: THREE.Vector3 }[] = [];

    SENSORS.forEach((s) => {
      const pos = new THREE.Vector3(...s.threePos);

      const geo = new THREE.SphereGeometry(0.55, 24, 24);
      const mat = new THREE.MeshStandardMaterial({
        color: s.id === 'ESP32' ? 0x0f172a : 0xffffff,
        roughness: 0.2,
        metalness: 0.1,
        emissive: new THREE.Color(s.color),
        emissiveIntensity: 0.2
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(pos);
      scene.add(mesh);

      // Pulse Ring
      const ringGeo = new THREE.RingGeometry(0.75, 1.05, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(s.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(pos.x, pos.y - 0.5, pos.z);
      scene.add(ring);

      nodeMeshes.push({ id: s.id, mesh, ring, pos });

      // Connect peripheral sensors to ESP32 node if not ESP32
      if (s.id !== 'ESP32') {
        const espPos = new THREE.Vector3(...SENSORS[2].threePos);
        const curve = new THREE.QuadraticBezierCurve3(
          pos,
          new THREE.Vector3((pos.x + espPos.x) / 2, Math.max(pos.y, espPos.y) + 1.2, (pos.z + espPos.z) / 2),
          espPos
        );
        const pts = curve.getPoints(24);
        const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
        const lineMat = new THREE.LineBasicMaterial({
          color: 0xcfd4dc,
          transparent: true,
          opacity: 0.7
        });
        const line = new THREE.Line(lineGeo, lineMat);
        scene.add(line);
      }
    });

    // ESP32 to AI Core Main Pipeline Line
    const espPos = new THREE.Vector3(...SENSORS[2].threePos);
    const toCoreCurve = new THREE.QuadraticBezierCurve3(
      espPos,
      new THREE.Vector3(0, 6.2, -2),
      aiCore.position
    );
    const toCorePts = toCoreCurve.getPoints(30);
    const coreLineGeo = new THREE.BufferGeometry().setFromPoints(toCorePts);
    const coreLineMat = new THREE.LineBasicMaterial({
      color: 0xea580c,
      linewidth: 2
    });
    const coreLine = new THREE.Line(coreLineGeo, coreLineMat);
    scene.add(coreLine);

    // Traveling Data Packets
    const packetCount = 45;
    const packetGeo = new THREE.BufferGeometry();
    const packetPositions = new Float32Array(packetCount * 3);
    const packetProgress = new Float32Array(packetCount);
    const packetPathIndices = new Uint8Array(packetCount);

    // Build routes into ESP32 and from ESP32 into AI Core
    for (let i = 0; i < packetCount; i++) {
      packetProgress[i] = Math.random();
      packetPathIndices[i] = i % SENSORS.length;
    }

    packetGeo.setAttribute('position', new THREE.BufferAttribute(packetPositions, 3));
    const packetMat = new THREE.PointsMaterial({
      color: 0xea580c,
      size: 0.28,
      transparent: true,
      opacity: 0.95
    });
    const packetPoints = new THREE.Points(packetGeo, packetMat);
    scene.add(packetPoints);

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Rotate AI Core
      aiCore.rotation.y = elapsed * 0.4;
      aiCore.rotation.x = elapsed * 0.2;
      innerCore.scale.setScalar(1 + Math.sin(elapsed * 4) * 0.15);

      // Animate Nodes & Rings
      nodeMeshes.forEach((item, idx) => {
        // Floating motion
        item.mesh.position.y = item.pos.y + Math.sin(elapsed * 2 + idx * 0.8) * 0.15;
        item.ring.position.y = item.mesh.position.y - 0.5;

        // Pulse ring scale
        const scale = 1 + Math.sin(elapsed * 3 + idx) * 0.25;
        item.ring.scale.set(scale, scale, 1);

        // Highlight if hovered or selected
        const isTarget = hoveredSensorId === item.id || selectedSensor.id === item.id;
        const mat = item.mesh.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = isTarget ? 0.9 : 0.25;
      });

      // Animate Packets
      const positions = packetGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < packetCount; i++) {
        packetProgress[i] += 0.012;
        if (packetProgress[i] > 1) packetProgress[i] = 0;

        const sensorIndex = packetPathIndices[i];
        const s = SENSORS[sensorIndex];
        const p = packetProgress[i];

        if (s.id === 'ESP32') {
          // Packet going from ESP32 to AI Core
          const pt = toCoreCurve.getPoint(p);
          positions.setXYZ(i, pt.x, pt.y, pt.z);
        } else {
          // Packet going from Sensor to ESP32
          const start = new THREE.Vector3(...s.threePos);
          const end = new THREE.Vector3(...SENSORS[2].threePos);
          const currentX = start.x + (end.x - start.x) * p;
          const currentY = start.y + (end.y - start.y) * p + Math.sin(p * Math.PI) * 0.8;
          const currentZ = start.z + (end.z - start.z) * p;
          positions.setXYZ(i, currentX, currentY, currentZ);
        }
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
  }, [hoveredSensorId, selectedSensor]);

  return (
    <section id="sensors-intro" className="py-20 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <DemoBadge size="sm" className="mb-3" />
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 uppercase">
            THE CROWD BECOMES DATA.
          </h2>
          <p className="mt-4 text-base text-zinc-600 leading-relaxed">
            Multi-spectral IoT telemetry transforms chaotic human crowd motion into calibrated digital vectors.
            Floating sensor nodes detect, aggregate at the ESP32 edge, and stream into the AI sensor fusion core.
          </p>
        </div>

        {/* Data Journey Visual Flow */}
        <div className="max-w-4xl mx-auto mb-10 bg-zinc-50 border border-zinc-200 rounded-xl p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-700 text-center">
            <div className="flex-1 min-w-[120px] p-2 bg-white rounded-lg border border-zinc-200 shadow-2xs">
              <span className="block font-bold text-zinc-900">1. SENSORS</span>
              <span className="text-[10px] text-zinc-500">6 Multi-Modal Types</span>
            </div>
            <span className="text-orange-500 font-bold">→</span>
            <div className="flex-1 min-w-[120px] p-2 bg-white rounded-lg border border-orange-200 shadow-2xs">
              <span className="block font-bold text-orange-700">2. ESP32 EDGE</span>
              <span className="text-[10px] text-zinc-500">Local Aggregation</span>
            </div>
            <span className="text-orange-500 font-bold">→</span>
            <div className="flex-1 min-w-[120px] p-2 bg-white rounded-lg border border-zinc-200 shadow-2xs">
              <span className="block font-bold text-zinc-900">3. IoT NETWORK</span>
              <span className="text-[10px] text-zinc-500">Wi-Fi & LoRaWAN</span>
            </div>
            <span className="text-orange-500 font-bold">→</span>
            <div className="flex-1 min-w-[120px] p-2 bg-zinc-900 text-white rounded-lg shadow-2xs">
              <span className="block font-bold text-orange-400">4. AI CORE</span>
              <span className="text-[10px] text-zinc-400">Fusion & Predictions</span>
            </div>
          </div>
        </div>

        {/* 3D Interactive Visualization & Details Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* 3D Scene Viewport */}
          <div className="lg:col-span-7 bg-radial from-zinc-50 to-zinc-100 rounded-2xl border border-zinc-200 p-2 relative h-[440px] sm:h-[500px] overflow-hidden shadow-xs">
            <div ref={mountRef} className="w-full h-full cursor-crosshair" />

            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-md border border-zinc-200 text-xs font-mono text-zinc-600 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
              3D SENSOR TOPOLOGY • HOVER/CLICK NODES
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
              <span className="text-[10px] font-mono text-zinc-400 bg-white/80 px-2 py-1 rounded">
                Procedural Three.js Node Mesh
              </span>
              <span className="text-[10px] font-mono text-orange-600 bg-orange-50/90 border border-orange-200 px-2 py-1 rounded">
                Orange Beacons = Active Data Transit
              </span>
            </div>
          </div>

          {/* Interactive Sensor Selector & Info Card */}
          <div className="lg:col-span-5 space-y-4">
            {/* Sensor Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SENSORS.map((s) => {
                const isSelected = selectedSensor.id === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSensor(s)}
                    onMouseEnter={() => setHoveredSensorId(s.id)}
                    onMouseLeave={() => setHoveredSensorId(null)}
                    className={`text-left p-2.5 rounded-lg border transition-all text-xs ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/70 text-orange-950 font-bold shadow-xs'
                        : 'border-zinc-200 bg-white hover:border-zinc-300 text-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] font-bold text-zinc-400">
                        {s.id}
                      </span>
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: s.color }}
                      ></span>
                    </div>
                    <span className="truncate block font-semibold">{s.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Detailed Inspection Card */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 space-y-4">
              <div className="flex items-start justify-between border-b border-zinc-200 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-orange-600 font-bold tracking-wider">
                      [{selectedSensor.id}] ACTIVE INSPECTION
                    </span>
                    <span className="text-[10px] bg-zinc-200 text-zinc-700 px-1.5 py-0.5 rounded font-mono">
                      {selectedSensor.type}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-zinc-900 mt-1">
                    {selectedSensor.name}
                  </h4>
                </div>
                <div className="p-2 bg-white rounded-lg border border-zinc-200 text-zinc-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed">
                {selectedSensor.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-white p-2.5 rounded-md border border-zinc-200">
                  <span className="text-[10px] text-zinc-400 block uppercase">Protocol / Bus</span>
                  <span className="font-semibold text-zinc-800 text-[11px] truncate block">
                    {selectedSensor.protocol}
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-md border border-zinc-200">
                  <span className="text-[10px] text-zinc-400 block uppercase">Sample / Refresh</span>
                  <span className="font-semibold text-zinc-800 text-[11px] truncate block">
                    {selectedSensor.frequency}
                  </span>
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-md border border-zinc-200">
                <span className="text-[10px] font-mono text-zinc-400 block uppercase">Hardware Specification</span>
                <span className="text-xs font-medium text-zinc-800">{selectedSensor.specs}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
