import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ChevronLeft, ChevronRight, X, Maximize2, Minimize2, Radio, ShieldCheck } from 'lucide-react';
import { SLIDES } from '../data/kumbhData';
import { DemoBadge } from './DisclaimerBanner';

interface PresentationModeProps {
  onClose: () => void;
}

export const PresentationMode: React.FC<PresentationModeProps> = ({ onClose }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const mountRef = useRef<HTMLDivElement>(null);

  const currentSlide = SLIDES[currentSlideIndex];

  // 3D Background scene that adapts smoothly with the slides
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x09090b);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 4, 12);
    camera.lookAt(0, 0, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    // Lights
    const amb = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(amb);
    const dir = new THREE.DirectionalLight(0xea580c, 2.0);
    dir.position.set(5, 10, 5);
    scene.add(dir);

    // Particle Cloud
    const count = 350;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xea580c,
      size: 0.18,
      transparent: true,
      opacity: 0.5
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // Central Morphing Wireframe Core
    const coreGeo = new THREE.IcosahedronGeometry(2.5, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x3f3f46,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      points.rotation.y = elapsed * 0.05;
      coreMesh.rotation.x = elapsed * 0.1;
      coreMesh.rotation.y = elapsed * 0.15;

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
  }, []);

  // Keyboard navigation (ArrowLeft, ArrowRight, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentSlideIndex((prev) => Math.min(prev + 1, SLIDES.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 text-white flex flex-col justify-between overflow-hidden">
      {/* 3D Background Canvas */}
      <div ref={mountRef} className="absolute inset-0 z-0 opacity-40 pointer-events-none" />

      {/* Top Header Bar */}
      <div className="relative z-10 p-6 flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center font-black text-sm">
            K
          </div>
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-orange-400 block">
              AI KUMBH • MASTER PRESENTATION DECK
            </span>
            <span className="text-zinc-400 text-xs font-mono">
              SLIDE {currentSlide.id} OF {SLIDES.length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <DemoBadge size="sm" />
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
            title="Exit Presentation (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Slide Content Center */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/60 border border-orange-800/80 text-orange-400 text-xs font-mono">
            <span>SLIDE {currentSlide.id}</span>
            <span>•</span>
            <span className="uppercase">{currentSlide.subtitle}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase leading-tight font-mono">
            {currentSlide.title}
          </h1>

          <h2 className="text-xl sm:text-2xl font-bold text-orange-400 font-mono">
            {currentSlide.headline}
          </h2>

          {currentSlide.quote && (
            <blockquote className="text-lg sm:text-xl text-zinc-300 font-light max-w-3xl leading-relaxed italic border-l-2 border-orange-500 pl-4 py-1">
              {currentSlide.quote}
            </blockquote>
          )}

          {/* Bullet Points */}
          {currentSlide.bullets && currentSlide.bullets.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {currentSlide.bullets.map((bullet, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-xs flex items-start gap-3 text-sm text-zinc-300 font-mono"
                >
                  <span className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0"></span>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Control Bar */}
      <div className="relative z-10 p-6 border-t border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md flex items-center justify-between">
        {/* Progress indicators */}
        <div className="flex items-center gap-1.5">
          {SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentSlideIndex
                  ? 'w-8 bg-orange-500'
                  : 'w-2 bg-zinc-700 hover:bg-zinc-500'
              }`}
              title={`Jump to Slide ${s.id}`}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentSlideIndex((prev) => Math.max(prev - 1, 0))}
            disabled={currentSlideIndex === 0}
            className="p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:pointer-events-none text-white transition-all flex items-center gap-2 text-xs font-mono font-bold"
          >
            <ChevronLeft className="w-4 h-4" />
            PREV
          </button>
          <button
            onClick={() => setCurrentSlideIndex((prev) => Math.min(prev + 1, SLIDES.length - 1))}
            disabled={currentSlideIndex === SLIDES.length - 1}
            className="p-3 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-30 disabled:pointer-events-none text-white transition-all flex items-center gap-2 text-xs font-mono font-bold"
          >
            NEXT
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
