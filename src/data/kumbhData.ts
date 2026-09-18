import { Sector, SensorNode, RouteOption, LostPersonRecord, PresentationSlide } from '../types';

export const INITIAL_SECTORS: Sector[] = [
  {
    id: 'SEC-12',
    name: 'Sector 12 (Sangam Ghat East)',
    x: 0,
    z: 1,
    currentDensity: 87,
    predictedDensity: 94,
    capacity: 25000,
    currentCount: 21750,
    risk: 'CRITICAL',
    status: 'SURGE WARNING',
    action: 'REDIRECT INCOMING FLOW',
    height: 3.8
  },
  {
    id: 'SEC-07',
    name: 'Sector 07 (Central Promenade)',
    x: -2.5,
    z: -0.5,
    currentDensity: 74,
    predictedDensity: 79,
    capacity: 20000,
    currentCount: 14800,
    risk: 'HIGH',
    status: 'HEAVY FLOW',
    action: 'MONITOR BOTTLE-NECK',
    height: 2.8
  },
  {
    id: 'SEC-03',
    name: 'Sector 03 (North Transit Hub)',
    x: 2.2,
    z: -1.2,
    currentDensity: 42,
    predictedDensity: 46,
    capacity: 30000,
    currentCount: 12600,
    risk: 'NORMAL',
    status: 'SMOOTH TRANSIT',
    action: 'MAINTAIN DISPATCH',
    height: 1.2
  },
  {
    id: 'SEC-04',
    name: 'Sector 04 (Pontoon Bridge West)',
    x: -1.8,
    z: 2.2,
    currentDensity: 68,
    predictedDensity: 71,
    capacity: 15000,
    currentCount: 10200,
    risk: 'MODERATE',
    status: 'CONTROLLED INGRESS',
    action: 'REGULATE TOF GATES',
    height: 2.2
  },
  {
    id: 'SEC-05',
    name: 'Sector 05 (South Ghats Plaza)',
    x: 1.5,
    z: 2.5,
    currentDensity: 53,
    predictedDensity: 58,
    capacity: 22000,
    currentCount: 11660,
    risk: 'NORMAL',
    status: 'STEADY ABSORPTION',
    action: 'NORMAL MONITORING',
    height: 1.5
  },
  {
    id: 'SEC-09',
    name: 'Sector 09 (Main Concourse)',
    x: -3.2,
    z: -2.4,
    currentDensity: 61,
    predictedDensity: 65,
    capacity: 25000,
    currentCount: 15250,
    risk: 'MODERATE',
    status: 'DISTRIBUTED MOVEMENT',
    action: 'OPTIMIZE SIGNAGE',
    height: 1.9
  },
  {
    id: 'SEC-01',
    name: 'Sector 01 (Railway Approach)',
    x: 3.5,
    z: -2.8,
    currentDensity: 38,
    predictedDensity: 49,
    capacity: 35000,
    currentCount: 13300,
    risk: 'NORMAL',
    status: 'INFLOW STEADY',
    action: 'PRE-STAGE SHUTTLES',
    height: 1.1
  },
  {
    id: 'SEC-15',
    name: 'Sector 15 (Emergency Ring Corridor)',
    x: 0,
    z: -3.5,
    currentDensity: 22,
    predictedDensity: 24,
    capacity: 18000,
    currentCount: 3960,
    risk: 'NORMAL',
    status: 'CLEAR BUFFER',
    action: 'STANDBY EVACUATION ROUTE',
    height: 0.8
  }
];

export const SENSOR_NODES: SensorNode[] = [
  {
    id: 'NODE-07',
    name: 'ESP32 Cluster 07 (Main Spire)',
    type: 'ESP32',
    location: 'Sector 07 — Central Gate B',
    status: 'ONLINE',
    battery: 98,
    signal: 'GOOD',
    lastUpdate: '2 sec ago',
    metric: 'Throughput',
    value: '42.8 pkt/s',
    description: 'Central multi-channel IoT edge bridge orchestrating ToF, BME280, BLE & Acoustic packets via Wi-Fi/LoRa.'
  },
  {
    id: 'CAM-01',
    name: 'CV Overhead Array 01',
    type: 'CAMERA',
    location: 'Sector 12 Sangam Approach',
    status: 'ONLINE',
    signal: 'EXCELLENT',
    lastUpdate: '1 sec ago',
    metric: 'People Detected',
    value: 1842,
    description: 'Deep neural edge camera with pedestrian bounding boxes, velocity vectors, and directional flow analysis.'
  },
  {
    id: 'TOF-04',
    name: 'IR / ToF Bidirectional Gate 04',
    type: 'IR_TOF',
    location: 'Gate 4 Sangam Ingress',
    status: 'ONLINE',
    signal: 'EXCELLENT',
    lastUpdate: 'Just now',
    metric: 'Net Flow',
    value: '+380 / 10m',
    description: 'Sub-millimeter flight-of-time laser curtain recording discrete entry/exit barrier interruptions.'
  },
  {
    id: 'BLE-09',
    name: 'BLE Receiver Array 09',
    type: 'BLE',
    location: 'Sector 07 Zone Perimeter',
    status: 'ONLINE',
    signal: 'GOOD',
    lastUpdate: '3 sec ago',
    metric: 'Active Wristbands',
    value: '412 tracked',
    description: 'Proximity triangulation mesh picking up 2.4GHz chirp broadcasts from opt-in pilgrim safety wristbands.'
  },
  {
    id: 'ENV-12',
    name: 'BME280 Environmental Probe 12',
    type: 'BME280',
    location: 'Sector 12 Riverbank Station',
    status: 'ONLINE',
    signal: 'EXCELLENT',
    lastUpdate: '5 sec ago',
    metric: 'Temp / Humidity',
    value: '32.4°C / 61%',
    description: 'Micro-electromechanical barometric and microclimate monitor. Provides heat stress context, NOT crowd count.'
  },
  {
    id: 'ACOUST-03',
    name: 'Acoustic Sound-Level Node 03',
    type: 'ACOUSTIC',
    location: 'Central Promenade Sector 07',
    status: 'ONLINE',
    signal: 'GOOD',
    lastUpdate: '2 sec ago',
    metric: 'Ambient SPL',
    value: '78 dB',
    description: 'Omnidirectional decibel analysis engine flagging high-frequency collective noise spikes as supplementary context.'
  }
];

export const INITIAL_ROUTES: RouteOption[] = [
  {
    id: 'ROUTE-A',
    name: 'Primary Direct Route',
    from: 'Sector 12 Approach',
    to: 'Main Sangam Gate',
    currentLoad: 88,
    status: 'CONGESTED',
    etaMinutes: 28,
    flowRate: '1,420 persons/min'
  },
  {
    id: 'ROUTE-B',
    name: 'Alternate Route B',
    from: 'Sector 12 Bypass',
    to: 'Gate C Elevated Causeway',
    currentLoad: 28,
    status: 'OPTIMAL',
    etaMinutes: 11,
    flowRate: '480 persons/min'
  }
];

export const DEFAULT_LOST_PERSON: LostPersonRecord = {
  id: 'LP-01',
  name: 'Pilgrim Badge Holder',
  wristbandId: 'KM-48291',
  age: 68,
  lastKnownSector: 'SECTOR 07',
  lastKnownGate: 'GATE B',
  rssiStrength: -68,
  lastSeenTime: '14:42',
  status: 'SEARCHING',
  batteryLevel: 82,
  tamperDetected: false,
  sosTriggered: false
};

export const PREDICTION_POINTS = [
  { time: 'NOW', count: 18420, density: 'MODERATE', risk: 'NORMAL' },
  { time: '+15 MIN', count: 21100, density: 'HIGH', risk: 'ELEVATED' },
  { time: '+30 MIN', count: 24900, density: 'VERY HIGH', risk: 'WARNING' },
  { time: '+45 MIN', count: 27850, density: 'CRITICAL', risk: 'CRITICAL' }
];

export const PRESENTATION_SLIDES: PresentationSlide[] = [
  {
    id: 1,
    title: 'THE PROBLEM',
    headline: 'Unpredictable Surge Dynamics',
    quote: '"Millions of people moving through the same environment can create unpredictable crowd pressure."',
    bullets: [
      'Sudden bottlenecks occur at narrow ghat gates and pontoon bridges',
      'Human visual monitoring alone cannot predict surges 30 minutes in advance',
      'Families and elderly pilgrims frequently become separated in density'
    ],
    visualType: 'crowd'
  },
  {
    id: 2,
    title: 'THE SOLUTION',
    headline: 'Autonomous Feedback Loop',
    quote: 'SENSE. PREDICT. REDIRECT. PROTECT.',
    bullets: [
      'SENSE: IoT & Vision telemetry capture physical density in real time',
      'PREDICT: AI forecast models project surges up to 45 minutes ahead',
      'REDIRECT: Dynamic digital signage & field staff divert 30% of inflow early',
      'PROTECT: Opt-in safety wearables reunite lost individuals swiftly'
    ],
    visualType: 'pipeline'
  },
  {
    id: 3,
    title: 'LIVE CROWD INTELLIGENCE',
    headline: 'Holistic Spatial Awareness',
    metrics: [
      { label: 'Current Estimated Crowd', value: '18,420', highlight: true },
      { label: 'Active Monitored Zones', value: '08' },
      { label: 'High-Density Zones', value: '02', highlight: true },
      { label: 'Predicted Peak Crowd', value: '27,850' }
    ],
    quote: 'SIMULATION / DEMO DATA',
    visualType: 'metrics'
  },
  {
    id: 4,
    title: 'SMART CROWD MAP',
    headline: 'Interactive 3D Sector Elevation',
    quote: 'Terrain height reflects zone density: higher altitude indicates impending bottleneck risk.',
    bullets: [
      'Sector 12: 87% density (Critical elevation)',
      'Sub-second telemetry updates across gates and pontoon approaches',
      'Instant visual cueing for tactical operational commanders'
    ],
    visualType: 'map'
  },
  {
    id: 5,
    title: 'SENSOR ARCHITECTURE',
    headline: 'Multi-Modal IoT Edge Layer',
    quote: 'CAMERA + IR/ToF + ESP32 + BLE + BME280 + ACOUSTIC → IoT NETWORK → SENSOR FUSION → AI',
    bullets: [
      'Overhead optical CV counts density & flow velocity',
      'Laser ToF curtains measure exact directional threshold counts',
      'Micro-climate BME280 monitors heat indices that elevate stress',
      'Acoustic decibel spikes signal supplementary collective distress'
    ],
    visualType: 'sensors'
  },
  {
    id: 6,
    title: 'LOST PERSON SYSTEM',
    headline: 'Rapid Proximity Zone Localization',
    quote: 'BLE WRISTBAND → ESP32 RECEIVERS → ZONE DETECTION → LAST KNOWN LOCATION → AUTHORIZED ASSISTANCE',
    bullets: [
      'Opt-in BLE band periodically chirps unique device ID',
      'Fixed ESP32 beacons log approximate RSSI zone presence',
      'Tamper & SOS trigger instant push to field volunteer squads',
      'Respects privacy: approximate zone detection, not invasive surveillance'
    ],
    visualType: 'lost_person'
  },
  {
    id: 7,
    title: 'EMERGENCY RESPONSE',
    headline: 'Coordinated Surge Containment',
    quote: 'CROWD SURGE DETECTED IN SECTOR 12 — 87% DENSITY (PREDICTED 94%) — RISK: CRITICAL',
    bullets: [
      'AI Recommendation: Temporarily halt inflow at Sector 12 approach',
      'Open Alternate Causeway Route B to bleed off 30% of volume',
      'Dispatch rapid deployment volunteer buffer teams to Gate 4',
      'Alert staging medical units to stand by at perimeter triage tents'
    ],
    visualType: 'emergency'
  },
  {
    id: 8,
    title: 'AI CROWD PREDICTION',
    headline: 'Surge Modeling Ahead of Time',
    metrics: [
      { label: 'NOW', value: '18,420' },
      { label: '+15 MIN', value: '21,100' },
      { label: '+30 MIN', value: '24,900' },
      { label: '+45 MIN (PROJECTED PEAK)', value: '27,850', highlight: true }
    ],
    quote: 'Action: Divert 30% of incoming flow to prevent critical stampede hazard.',
    visualType: 'prediction'
  },
  {
    id: 9,
    title: 'PROJECT IMPACT',
    headline: 'Four Pillars of Public Safety',
    bullets: [
      'REDUCE CONGESTION: Prevent sudden human compression waves',
      'IMPROVE CROWD FLOW: Smooth, predictable transit through sacred sectors',
      'SUPPORT EMERGENCY RESPONSE: Instant telemetry for rescue teams',
      'HELP REUNITE LOST PILGRIMS: Rapid zone narrowing for separated families'
    ],
    visualType: 'impact'
  },
  {
    id: 10,
    title: 'MISSION STATEMENT',
    headline: 'WE DON’T CONTROL THE CROWD. WE UNDERSTAND IT.',
    quote: 'AI KUMBH — SENSE. PREDICT. REDIRECT. PROTECT.',
    bullets: [
      'An intelligent architecture proving ethical AI and IoT sensor fusion',
      'Human-in-the-loop decision support for large spiritual congregations',
      'Demonstration of resilient, fail-soft multi-sensor networks'
    ],
    visualType: 'conclusion'
  }
];

export const KUMBHA_SECTORS: Sector[] = INITIAL_SECTORS;
export const SLIDES: PresentationSlide[] = PRESENTATION_SLIDES;
