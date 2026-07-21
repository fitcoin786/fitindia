import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  MapPin, 
  Navigation, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  Flame, 
  Zap, 
  Activity, 
  ShieldCheck, 
  Radio, 
  Eye, 
  Play, 
  Pause
} from 'lucide-react';
import { TelemetryPoint } from '../types';

export interface GPSLocationPoint {
  lat: number;
  lng: number;
  timestamp?: number;
  speedKmh?: number;
  altitude?: number;
}

interface InteractiveTrailMapProps {
  currentGps?: GPSLocationPoint | null;
  routePath?: GPSLocationPoint[];
  isMining?: boolean;
  selectedActivity?: string;
  speedKmh?: number;
  distanceKm?: number;
  caloriesBurned?: number;
}

export const InteractiveTrailMap: React.FC<InteractiveTrailMapProps> = ({
  currentGps,
  routePath = [],
  isMining = false,
  selectedActivity = 'Running',
  speedKmh = 10.2,
  distanceKm = 1.45,
  caloriesBurned = 180
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapStyle, setMapStyle] = useState<'dark' | 'satellite' | 'heatmap'>('dark');
  const [zoomLevel, setZoomLevel] = useState(15);
  const [autoCenter, setAutoCenter] = useState(true);
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Generate fallback / demo trail path if user has only 1 point or stationary
  const [localPoints, setLocalPoints] = useState<GPSLocationPoint[]>([]);

  // Base center point (Default: San Francisco / Silicon Valley coordinates or user's real GPS)
  const defaultLat = currentGps?.lat || 37.7749;
  const defaultLng = currentGps?.lng || -122.4194;

  // Sync routePath or simulate organic GPS movement
  useEffect(() => {
    if (routePath && routePath.length > 2) {
      setLocalPoints(routePath);
    } else {
      // Create a smooth organic 10-point running loop around current coordinates
      const demoTrail: GPSLocationPoint[] = [];
      const baseLat = defaultLat;
      const baseLng = defaultLng;

      for (let i = 0; i < 15; i++) {
        const angle = (i / 15) * Math.PI * 1.5;
        const radiusLat = 0.003 * Math.sin(angle) + (i * 0.00015);
        const radiusLng = 0.0035 * Math.cos(angle) + (i * 0.0002);

        demoTrail.push({
          lat: baseLat + radiusLat,
          lng: baseLng + radiusLng,
          speedKmh: 8 + Math.sin(i) * 3,
          altitude: 45 + i * 2,
          timestamp: Date.now() - (15 - i) * 10000
        });
      }
      setLocalPoints(demoTrail);
    }
  }, [routePath, defaultLat, defaultLng]);

  // Live GPS point appended when mining
  useEffect(() => {
    if (isMining && currentGps) {
      setLocalPoints(prev => {
        const last = prev[prev.length - 1];
        if (last && Math.abs(last.lat - currentGps.lat) < 0.000001 && Math.abs(last.lng - currentGps.lng) < 0.000001) {
          return prev;
        }
        return [...prev, currentGps];
      });
    }
  }, [currentGps, isMining]);

  // Map coordinate bounds projection math
  const getProjectedCoordinates = (points: GPSLocationPoint[]) => {
    if (points.length === 0) return { pathString: '', projectedPoints: [], centerScreen: { x: 200, y: 150 } };

    let minLat = points[0].lat;
    let maxLat = points[0].lat;
    let minLng = points[0].lng;
    let maxLng = points[0].lng;

    points.forEach(p => {
      if (p.lat < minLat) minLat = p.lat;
      if (p.lat > maxLat) maxLat = p.lat;
      if (p.lng < minLng) minLng = p.lng;
      if (p.lng > maxLng) maxLng = p.lng;
    });

    const latRange = Math.max(0.001, maxLat - minLat);
    const lngRange = Math.max(0.001, maxLng - minLng);

    const padding = 40;
    const width = 600;
    const height = 300;

    const projectedPoints = points.map(p => {
      const x = padding + ((p.lng - minLng) / lngRange) * (width - 2 * padding);
      // Invert Y for screen coordinates
      const y = height - (padding + ((p.lat - minLat) / latRange) * (height - 2 * padding));
      return { ...p, x, y };
    });

    const pathString = projectedPoints.reduce((acc, point, index) => {
      return index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
    }, '');

    const lastPoint = projectedPoints[projectedPoints.length - 1];
    const centerScreen = lastPoint ? { x: lastPoint.x, y: lastPoint.y } : { x: width / 2, y: height / 2 };

    return { pathString, projectedPoints, centerScreen };
  };

  const { pathString, projectedPoints, centerScreen } = getProjectedCoordinates(localPoints);
  const currentPoint = projectedPoints[projectedPoints.length - 1];
  const startPoint = projectedPoints[0];

  return (
    <div className={`transition-all duration-300 ${
      isFullscreen 
        ? 'fixed inset-0 z-50 bg-slate-950 p-6 flex flex-col justify-between overflow-auto' 
        : 'bg-slate-900/90 border border-emerald-900/50 rounded-2xl p-5 shadow-xl relative overflow-hidden space-y-4'
    }`}>
      {/* Background glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md">
            <Navigation className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-white text-base">GPS Movement Polyline Trail</h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                isMining 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse' 
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                {isMining ? 'LIVE RECORDING' : 'READY TO RECORD'}
              </span>
            </div>
            <p className="text-xs text-slate-400">Interactive Solana proof-of-burn spatial route canvas</p>
          </div>
        </div>

        {/* Map View Mode Toggles & Zoom Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Map Layer Switcher */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex text-xs font-mono">
            <button
              onClick={() => setMapStyle('dark')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                mapStyle === 'dark' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Dark Grid
            </button>
            <button
              onClick={() => setMapStyle('satellite')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                mapStyle === 'satellite' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Topo
            </button>
            <button
              onClick={() => setMapStyle('heatmap')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                mapStyle === 'heatmap' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Speed Heatmap
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Map'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Interactive Map Canvas Window */}
      <div className={`relative rounded-xl border border-slate-800 overflow-hidden ${
        isFullscreen ? 'h-[75vh] w-full' : 'h-72 w-full'
      } bg-slate-950 flex items-center justify-center`}>

        {/* Map Grid Background Pattern */}
        <div 
          className={`absolute inset-0 opacity-20 pointer-events-none ${
            mapStyle === 'satellite' 
              ? 'bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]' 
              : mapStyle === 'heatmap'
              ? 'bg-[linear-gradient(to_right,#f59e0b15_1px,transparent_1px),linear-gradient(to_bottom,#f59e0b15_1px,transparent_1px)] bg-[size:24px_24px]'
              : 'bg-[linear-gradient(to_right,#10b98115_1px,transparent_1px),linear-gradient(to_bottom,#10b98115_1px,transparent_1px)] bg-[size:30px_30px]'
          }`}
        ></div>

        {/* Topo / Terrain Contour Visual Overlay Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 600 300">
          <ellipse cx="300" cy="150" rx="250" ry="120" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" />
          <ellipse cx="300" cy="150" rx="180" ry="80" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" />
          <ellipse cx="300" cy="150" rx="100" ry="40" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" />
        </svg>

        {/* Render GPS Polyline Trail SVG */}
        <svg className="w-full h-full relative z-10" viewBox="0 0 600 300">
          {/* Subtle Glow Trail Shadow */}
          {pathString && (
            <path
              d={pathString}
              fill="none"
              stroke={mapStyle === 'heatmap' ? '#f59e0b' : '#10b981'}
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.2"
              className="blur-sm"
            />
          )}

          {/* Main Sharp Polyline */}
          {pathString && (
            <path
              d={pathString}
              fill="none"
              stroke={mapStyle === 'heatmap' ? 'url(#heatmapGradient)' : '#10b981'}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Heatmap Gradient Definition */}
          <defs>
            <linearGradient id="heatmapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          {/* Waypoint Interactive Circles */}
          {projectedPoints.map((pt, idx) => (
            <circle
              key={idx}
              cx={pt.x}
              cy={pt.y}
              r={hoveredPointIndex === idx ? 6 : 3}
              fill={idx === projectedPoints.length - 1 ? '#f59e0b' : '#10b981'}
              className="cursor-pointer transition-all hover:scale-150"
              onMouseEnter={() => setHoveredPointIndex(idx)}
              onMouseLeave={() => setHoveredPointIndex(null)}
            />
          ))}

          {/* Start Marker (Green Flag Point) */}
          {startPoint && (
            <g transform={`translate(${startPoint.x}, ${startPoint.y})`}>
              <circle r="8" fill="#10b981" opacity="0.3" />
              <circle r="4" fill="#10b981" />
            </g>
          )}

          {/* Live Current GPS Position Pin (Pulse Radar) */}
          {currentPoint && (
            <g transform={`translate(${currentPoint.x}, ${currentPoint.y})`}>
              <circle r="16" fill="#10b981" className="animate-ping" opacity="0.4" />
              <circle r="10" fill="#047857" stroke="#10b981" strokeWidth="2" />
              <circle r="5" fill="#f59e0b" />
            </g>
          )}
        </svg>

        {/* Live Overlay Telemetry Widget HUD */}
        <div className="absolute top-3 left-3 bg-slate-950/90 border border-slate-800 backdrop-blur-md rounded-xl p-3 text-xs font-mono text-slate-300 space-y-1 z-20 shadow-lg">
          <div className="flex items-center gap-1.5 font-bold text-emerald-400">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>GPS TELEMETRY OVERLAY</span>
          </div>
          <div className="text-[11px] flex items-center justify-between gap-4 text-slate-400">
            <span>Points Logged:</span>
            <span className="text-white font-bold">{localPoints.length} Waypoints</span>
          </div>
          <div className="text-[11px] flex items-center justify-between gap-4 text-slate-400">
            <span>Distance:</span>
            <span className="text-emerald-300 font-bold">{distanceKm.toFixed(2)} km</span>
          </div>
          <div className="text-[11px] flex items-center justify-between gap-4 text-slate-400">
            <span>Current Speed:</span>
            <span className="text-amber-300 font-bold">{speedKmh} km/h</span>
          </div>
        </div>

        {/* Selected Waypoint Tooltip Popup */}
        {hoveredPointIndex !== null && localPoints[hoveredPointIndex] && (
          <div className="absolute bottom-3 right-3 bg-slate-900 border border-amber-500/50 p-2.5 rounded-xl font-mono text-[11px] text-slate-200 z-20 shadow-xl space-y-1">
            <div className="font-bold text-amber-400">Waypoint #{hoveredPointIndex + 1}</div>
            <div>Lat: {localPoints[hoveredPointIndex].lat.toFixed(5)}°</div>
            <div>Lng: {localPoints[hoveredPointIndex].lng.toFixed(5)}°</div>
            <div>Est Speed: {localPoints[hoveredPointIndex].speedKmh?.toFixed(1) || '10.2'} km/h</div>
          </div>
        )}

        {/* Current Location Badge Footer */}
        <div className="absolute bottom-3 left-3 bg-slate-950/80 border border-slate-800 backdrop-blur px-3 py-1.5 rounded-xl text-[11px] font-mono text-slate-300 flex items-center gap-2 z-20">
          <MapPin className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
          <span>
            {currentGps
              ? `Lat: ${currentGps.lat.toFixed(5)}°, Lng: ${currentGps.lng.toFixed(5)}°`
              : `Lat: ${defaultLat.toFixed(5)}°, Lng: ${defaultLng.toFixed(5)}°`}
          </span>
        </div>
      </div>

    </div>
  );
};
