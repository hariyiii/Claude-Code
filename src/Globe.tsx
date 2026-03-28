import React from "react";
import { interpolate, Easing } from "remotion";

// Simplified world coastline data as [lng, lat] polylines
// (major continent outlines, heavily simplified for SVG rendering)
const COASTLINES: [number, number][][] = [
  // North America
  [
    [-130, 50], [-125, 55], [-120, 60], [-140, 60], [-165, 62],
    [-168, 65], [-165, 70], [-155, 72], [-130, 72], [-120, 70],
    [-95, 72], [-85, 70], [-75, 62], [-60, 52], [-65, 45],
    [-70, 43], [-75, 35], [-82, 25], [-90, 30], [-97, 26],
    [-105, 22], [-115, 30], [-120, 35], [-125, 42], [-130, 50],
  ],
  // South America
  [
    [-80, 10], [-75, 5], [-70, 12], [-60, 5], [-50, 0],
    [-35, -5], [-38, -15], [-40, -22], [-48, -28], [-55, -35],
    [-68, -55], [-75, -50], [-72, -40], [-70, -30], [-70, -18],
    [-75, -10], [-80, 0], [-80, 10],
  ],
  // Europe
  [
    [-10, 36], [-5, 36], [0, 38], [3, 43], [-2, 44],
    [-8, 44], [-10, 44], [-8, 48], [0, 48], [3, 50],
    [5, 52], [8, 55], [12, 56], [10, 58], [12, 60],
    [18, 63], [25, 65], [30, 70], [28, 60], [30, 55],
    [28, 42], [25, 38], [22, 38], [20, 40], [15, 38],
    [12, 38], [8, 39], [5, 38], [0, 36], [-10, 36],
  ],
  // Africa
  [
    [-15, 12], [-18, 15], [-15, 28], [-5, 36], [10, 38],
    [12, 32], [25, 32], [32, 30], [35, 12], [42, 12],
    [50, 12], [48, 5], [42, 0], [40, -5], [35, -15],
    [32, -28], [28, -34], [18, -35], [15, -28], [12, -18],
    [10, -5], [10, 5], [5, 5], [0, 5], [-5, 5],
    [-10, 8], [-15, 12],
  ],
  // Asia
  [
    [30, 70], [50, 70], [70, 72], [100, 72], [120, 70],
    [140, 60], [150, 60], [160, 60], [170, 65], [180, 68],
    [180, 55], [160, 55], [150, 48], [140, 50], [135, 45],
    [130, 42], [128, 38], [122, 30], [118, 25], [110, 20],
    [105, 15], [100, 15], [100, 5], [105, 0], [115, -5],
    [120, -8], [105, -8], [95, 5], [80, 8], [75, 15],
    [72, 20], [65, 25], [58, 25], [50, 28], [48, 30],
    [42, 38], [38, 40], [30, 42], [28, 42], [30, 55],
    [28, 60], [30, 70],
  ],
  // Australia
  [
    [115, -20], [120, -15], [130, -12], [138, -12], [142, -15],
    [148, -20], [152, -25], [153, -30], [148, -38], [140, -38],
    [132, -35], [120, -35], [115, -32], [113, -25], [115, -20],
  ],
];

// Orthographic projection
function project(
  lng: number,
  lat: number,
  centerLng: number,
  centerLat: number,
  radius: number,
): { x: number; y: number; visible: boolean } {
  const lambda = (lng * Math.PI) / 180;
  const phi = (lat * Math.PI) / 180;
  const lambda0 = (centerLng * Math.PI) / 180;
  const phi0 = (centerLat * Math.PI) / 180;

  const cosC =
    Math.sin(phi0) * Math.sin(phi) +
    Math.cos(phi0) * Math.cos(phi) * Math.cos(lambda - lambda0);

  const x =
    radius * Math.cos(phi) * Math.sin(lambda - lambda0);
  const y =
    radius *
    (Math.cos(phi0) * Math.sin(phi) -
      Math.sin(phi0) * Math.cos(phi) * Math.cos(lambda - lambda0));

  return { x, y, visible: cosC > 0 };
}

interface GlobeProps {
  centerLng: number;
  centerLat: number;
  width: number;
  height: number;
  radius: number;
  opacity?: number;
  showGrid?: boolean;
  highlightLng?: number;
  highlightLat?: number;
  airports?: Array<{ lng: number; lat: number; code: string; active: boolean }>;
}

export const Globe: React.FC<GlobeProps> = ({
  centerLng,
  centerLat,
  width,
  height,
  radius,
  opacity = 1,
  showGrid = true,
  highlightLng,
  highlightLat,
  airports = [],
}) => {
  const cx = width / 2;
  const cy = height / 2;

  // Build coastline paths
  const coastlinePaths = COASTLINES.map((line, i) => {
    const segments: string[] = [];
    let inPath = false;
    for (let j = 0; j < line.length; j++) {
      const { x, y, visible } = project(
        line[j][0],
        line[j][1],
        centerLng,
        centerLat,
        radius,
      );
      if (visible) {
        segments.push(`${inPath ? "L" : "M"}${cx + x},${cy - y}`);
        inPath = true;
      } else {
        inPath = false;
      }
    }
    return segments.join(" ");
  });

  // Grid lines (meridians and parallels)
  const gridPaths: string[] = [];
  if (showGrid) {
    // Meridians every 40°
    for (let lng = -180; lng <= 180; lng += 40) {
      const pts: string[] = [];
      let inPath = false;
      for (let lat = -90; lat <= 90; lat += 10) {
        const { x, y, visible } = project(lng, lat, centerLng, centerLat, radius);
        if (visible) {
          pts.push(`${inPath ? "L" : "M"}${cx + x},${cy - y}`);
          inPath = true;
        } else {
          inPath = false;
        }
      }
      gridPaths.push(pts.join(" "));
    }
    // Parallels every 40°
    for (let lat = -40; lat <= 40; lat += 40) {
      const pts: string[] = [];
      let inPath = false;
      for (let lng = -180; lng <= 180; lng += 10) {
        const { x, y, visible } = project(lng, lat, centerLng, centerLat, radius);
        if (visible) {
          pts.push(`${inPath ? "L" : "M"}${cx + x},${cy - y}`);
          inPath = true;
        } else {
          inPath = false;
        }
      }
      gridPaths.push(pts.join(" "));
    }
  }

  // Airport markers
  const markers = airports
    .map((ap) => {
      const { x, y, visible } = project(ap.lng, ap.lat, centerLng, centerLat, radius);
      return { ...ap, x: cx + x, y: cy - y, visible };
    })
    .filter((m) => m.visible);

  // Highlight pulse
  let highlightMarker: { x: number; y: number } | null = null;
  if (highlightLng !== undefined && highlightLat !== undefined) {
    const { x, y, visible } = project(
      highlightLng,
      highlightLat,
      centerLng,
      centerLat,
      radius,
    );
    if (visible) highlightMarker = { x: cx + x, y: cy - y };
  }

  return (
    <svg
      width={width}
      height={height}
      style={{ position: "absolute", top: 0, left: 0, opacity }}
    >
      <defs>
        <radialGradient id="globeGrad" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#1a2a4a" />
          <stop offset="85%" stopColor="#0a1628" />
          <stop offset="100%" stopColor="#050d1a" />
        </radialGradient>
        <radialGradient id="glowGrad" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#FF6B35" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Globe sphere */}
      <circle cx={cx} cy={cy} r={radius} fill="url(#globeGrad)" />
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="#1e3a5f"
        strokeWidth={1.5}
      />

      {/* Grid */}
      {gridPaths.map((d, i) => (
        <path
          key={`grid-${i}`}
          d={d}
          fill="none"
          stroke="#1e3a5f"
          strokeWidth={0.5}
          opacity={0.4}
        />
      ))}

      {/* Coastlines */}
      {coastlinePaths.map((d, i) => (
        <path
          key={`coast-${i}`}
          d={d}
          fill="none"
          stroke="#3a7bd5"
          strokeWidth={1.2}
          opacity={0.7}
        />
      ))}

      {/* Airport markers */}
      {markers.map((m) => (
        <React.Fragment key={m.code}>
          {m.active ? (
            <>
              <circle cx={m.x} cy={m.y} r={12} fill="url(#glowGrad)" />
              <circle
                cx={m.x}
                cy={m.y}
                r={5}
                fill="#FF6B35"
                filter="url(#glow)"
              />
            </>
          ) : (
            <circle cx={m.x} cy={m.y} r={3} fill="#5a8ec5" opacity={0.6} />
          )}
        </React.Fragment>
      ))}

      {/* Highlight pulse */}
      {highlightMarker && (
        <>
          <circle
            cx={highlightMarker.x}
            cy={highlightMarker.y}
            r={20}
            fill="none"
            stroke="#FF6B35"
            strokeWidth={2}
            opacity={0.5}
          />
          <circle
            cx={highlightMarker.x}
            cy={highlightMarker.y}
            r={35}
            fill="none"
            stroke="#FF6B35"
            strokeWidth={1}
            opacity={0.2}
          />
        </>
      )}

      {/* Atmosphere glow */}
      <circle
        cx={cx}
        cy={cy}
        r={radius + 8}
        fill="none"
        stroke="#3a7bd5"
        strokeWidth={6}
        opacity={0.1}
      />
    </svg>
  );
};
