import React, { useState } from 'react';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { Navbar } from './components/Navbar';
import { Hero3D } from './components/Hero3D';
import { SensorNetwork3D } from './components/SensorNetwork3D';
import { LiveIntelligence } from './components/LiveIntelligence';
import { SmartMap3D } from './components/SmartMap3D';
import { AlternateRouting } from './components/AlternateRouting';
import { SensorArchitecture } from './components/SensorArchitecture';
import { SensorFusion3D } from './components/SensorFusion3D';
import { LostPersonSystem } from './components/LostPersonSystem';
import { EmergencyResponse } from './components/EmergencyResponse';
import { AiPrediction } from './components/AiPrediction';
import { SensorFailureDemo } from './components/SensorFailureDemo';
import { ProjectImpact } from './components/ProjectImpact';
import { Footer } from './components/Footer';
import { CommandCenter } from './components/CommandCenter';
import { PresentationMode } from './components/PresentationMode';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [showCommandCenter, setShowCommandCenter] = useState(false);
  const [showPresentation, setShowPresentation] = useState(false);
  const [selectedMapSectorId, setSelectedMapSectorId] = useState<string>('SEC-12');

  // Callback to trigger diversion from other components (like Prediction or Emergency)
  const handleActivateDiversion = () => {
    const altRouteElem = document.getElementById('alternate-routing');
    if (altRouteElem) {
      altRouteElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectSectorForMap = (sectorId: string) => {
    setSelectedMapSectorId(sectorId);
    const mapElem = document.getElementById('smart-map');
    if (mapElem) {
      mapElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-950 font-sans selection:bg-orange-500 selection:text-white relative">
      {/* Top Universal Disclaimer Ribbon */}
      <DisclaimerBanner />

      {/* Global Navigation Bar */}
      <Navbar
        onOpenCommandCenter={() => setShowCommandCenter(true)}
        onOpenPresentation={() => setShowPresentation(true)}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content Sections */}
      <main className="pt-18">
        {/* Section 2, 3, 4: Hero 3D Scene + Real-time Telemetry + System Metrics */}
        <section id="home">
          <Hero3D
            onOpenCommandCenter={() => setShowCommandCenter(true)}
            onExplore={() => {
              const el = document.getElementById('sensors');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </section>

        {/* Section 5 & 6: 3D Hardware Sensor Network Ecosystem */}
        <SensorNetwork3D />

        {/* Section 7 & 8: Real-Time Live Intelligence & Elevation Map */}
        <LiveIntelligence
          onSelectSectorForMap={handleSelectSectorForMap}
          onOpenAlternateRoute={handleActivateDiversion}
        />

        {/* Section 8: Interactive Smart Map 3D */}
        <section id="smart-map" className="py-20 bg-white border-b border-zinc-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-orange-600 block mb-1">
                SPATIAL SECTOR TOPOLOGY
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 uppercase">
                INTERACTIVE 3D SMART MAP
              </h2>
              <p className="mt-3 text-base text-zinc-600">
                Explore the Sangam Ghat topography, gate checkpoint curtains, and real-time pedestrian density vectors in 3D.
              </p>
            </div>

            <SmartMap3D
              initialSectorId={selectedMapSectorId}
              onActivateAlternateRoute={handleActivateDiversion}
            />
          </div>
        </section>

        {/* Section 9: Smart Alternate Routing */}
        <AlternateRouting />

        {/* Section 10-14: Hardware Sensing Layer (Camera, IR/ToF, ESP32, BME280, Acoustic) */}
        <SensorArchitecture />

        {/* Section 15: Grand 3D Sensor Fusion Core */}
        <SensorFusion3D />

        {/* Section 16-21: Lost Person Safety Band System (BLE, Tamper, Verification, Privacy) */}
        <LostPersonSystem />

        {/* Section 22-23: Emergency Response Simulation & AI Recommendations */}
        <EmergencyResponse onDivertRoute={handleActivateDiversion} />

        {/* Section 24-25: AI Crowd Prediction Curves & Predictive Pipeline */}
        <AiPrediction onActivateDiversion={handleActivateDiversion} />

        {/* Section 27: System Resilience & Graceful Degradation */}
        <SensorFailureDemo />

        {/* Section 28: Projected Outcomes & Impact Targets */}
        <ProjectImpact />
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Full-Screen Integrated Command Center Modal */}
      {showCommandCenter && (
        <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200">
          <CommandCenter onClose={() => setShowCommandCenter(false)} />
        </div>
      )}

      {/* Full-Screen Presentation Mode Slide Deck */}
      {showPresentation && (
        <PresentationMode onClose={() => setShowPresentation(false)} />
      )}
    </div>
  );
}
