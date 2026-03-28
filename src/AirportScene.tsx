import React from "react";
import { AbsoluteFill, interpolate, useVideoConfig } from "remotion";
import type { Airport } from "./data/airports";

export const AirportScene: React.FC<{
  airport: Airport;
  rotationProgress: number; // 0 to 1 → 0° to 360°
  zoomProgress: number; // 0 = zoomed out, 1 = fully zoomed in
}> = ({ airport, rotationProgress, zoomProgress }) => {
  const { width, height } = useVideoConfig();

  const rotation = rotationProgress * 360;
  const scale = interpolate(zoomProgress, [0, 1], [0.3, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a1020", opacity: zoomProgress }}>
      <div
        style={{
          position: "absolute",
          width: width * 2,
          height: height * 2,
          left: -width * 0.5,
          top: -height * 0.5,
          transform: `rotate(${rotation}deg) scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        {/* City grid via CSS background */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundImage: `
              linear-gradient(rgba(26, 48, 80, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(26, 48, 80, 0.5) 1px, transparent 1px),
              linear-gradient(rgba(26, 48, 80, 0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(26, 48, 80, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: "160px 160px, 160px 160px, 40px 40px, 40px 40px",
          }}
        />

        <svg width={width * 2} height={height * 2}>
          {/* Runways */}
          <line
            x1={width * 0.55}
            y1={height * 0.45}
            x2={width * 0.95}
            y2={height * 1.05}
            stroke="#354555"
            strokeWidth={14}
          />
          <line
            x1={width * 0.55}
            y1={height * 0.45}
            x2={width * 0.95}
            y2={height * 1.05}
            stroke="#5a7a6a"
            strokeWidth={1}
            strokeDasharray="20,15"
          />
          <line
            x1={width * 0.45}
            y1={height * 0.75}
            x2={width * 1.05}
            y2={height * 0.75}
            stroke="#354555"
            strokeWidth={14}
          />
          <line
            x1={width * 0.45}
            y1={height * 0.75}
            x2={width * 1.05}
            y2={height * 0.75}
            stroke="#5a7a6a"
            strokeWidth={1}
            strokeDasharray="20,15"
          />

          {/* Terminal */}
          <rect
            x={width * 0.85}
            y={height * 0.75}
            width={120}
            height={80}
            fill="#1a2a40"
            stroke="#2a4a6a"
            strokeWidth={1}
            rx={4}
          />
          <rect
            x={width * 0.9}
            y={height * 0.65}
            width={80}
            height={60}
            fill="#1a2a40"
            stroke="#2a4a6a"
            strokeWidth={1}
            rx={4}
          />

          {/* Center marker */}
          <circle cx={width} cy={height} r={8} fill="#FF6B35" opacity={0.9} />
          <circle
            cx={width}
            cy={height}
            r={25}
            fill="none"
            stroke="#FF6B35"
            strokeWidth={1.5}
            opacity={0.4}
          />
        </svg>
      </div>

      {/* Scan lines via CSS */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.03) 3px, rgba(0,0,0,0.03) 4px)",
          pointerEvents: "none",
        }}
      />

      {/* HUD corners + coords */}
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <polyline
          points="60,30 30,30 30,60"
          fill="none"
          stroke="#3a7bd5"
          strokeWidth={2}
          opacity={0.5}
        />
        <polyline
          points={`${width - 60},30 ${width - 30},30 ${width - 30},60`}
          fill="none"
          stroke="#3a7bd5"
          strokeWidth={2}
          opacity={0.5}
        />
        <polyline
          points={`60,${height - 30} 30,${height - 30} 30,${height - 60}`}
          fill="none"
          stroke="#3a7bd5"
          strokeWidth={2}
          opacity={0.5}
        />
        <polyline
          points={`${width - 60},${height - 30} ${width - 30},${height - 30} ${width - 30},${height - 60}`}
          fill="none"
          stroke="#3a7bd5"
          strokeWidth={2}
          opacity={0.5}
        />
        <text
          x={40}
          y={height - 45}
          fill="#3a7bd5"
          fontSize={14}
          fontFamily="monospace"
          opacity={0.6}
        >
          {airport.lat.toFixed(4)}°N {Math.abs(airport.lng).toFixed(4)}°
          {airport.lng >= 0 ? "E" : "W"}
        </text>
      </svg>
    </AbsoluteFill>
  );
};
