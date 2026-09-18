export interface Sector {
  id: string;
  name: string;
  x: number;
  z: number;
  currentDensity: number; // 0 - 100%
  predictedDensity: number;
  capacity: number;
  currentCount: number;
  risk: 'NORMAL' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  status: string;
  action: string;
  height: number;
}

export interface SensorNode {
  id: string;
  name: string;
  type: 'CAMERA' | 'IR_TOF' | 'ESP32' | 'BLE' | 'BME280' | 'ACOUSTIC';
  location: string;
  status: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  battery?: number;
  signal: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  lastUpdate: string;
  metric: string;
  value: string | number;
  description: string;
}

export interface RouteOption {
  id: string;
  name: string;
  from: string;
  to: string;
  currentLoad: number; // percentage
  status: 'OPTIMAL' | 'CONGESTED' | 'STANDBY' | 'DIVERTED';
  etaMinutes: number;
  flowRate: string;
}

export interface LostPersonRecord {
  id: string;
  name: string;
  wristbandId: string;
  age: number;
  lastKnownSector: string;
  lastKnownGate: string;
  rssiStrength: number; // dBm
  lastSeenTime: string;
  status: 'SEARCHING' | 'ZONE_LOCATED' | 'AWAITING_VERIFICATION' | 'REUNITED' | 'SOS_ACTIVE';
  batteryLevel: number;
  tamperDetected: boolean;
  sosTriggered: boolean;
}

export interface PresentationSlide {
  id: number;
  title: string;
  subtitle?: string;
  headline: string;
  quote?: string;
  bullets?: string[];
  metrics?: { label: string; value: string; highlight?: boolean }[];
  visualType: 'crowd' | 'pipeline' | 'metrics' | 'map' | 'sensors' | 'lost_person' | 'emergency' | 'prediction' | 'impact' | 'conclusion';
}
