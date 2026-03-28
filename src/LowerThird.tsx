import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import type { Airport } from "./data/airports";

const ENTER_DURATION = 15;
const EXIT_DURATION = 15;

export const LowerThird: React.FC<{
  airport: Airport;
  durationInFrames: number;
}> = ({ airport, durationInFrames }) => {
  const frame = useCurrentFrame();

  const enterProgress = interpolate(frame, [0, ENTER_DURATION], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const exitProgress = interpolate(
    frame,
    [durationInFrames - EXIT_DURATION, durationInFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const slideX = interpolate(enterProgress, [0, 1], [-100, 0]);
  const slideOutX = interpolate(exitProgress, [0, 1], [0, 100]);
  const translateX = slideX + slideOutX;

  const opacity = interpolate(enterProgress, [0, 0.5], [0, 1], {
    extrapolateRight: "clamp",
  }) * interpolate(exitProgress, [0, 0.5], [1, 0], {
    extrapolateLeft: "clamp",
  });

  const accentBarWidth = interpolate(enterProgress, [0, 1], [0, 6], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 60,
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          transform: `translateX(${translateX}px)`,
          opacity,
        }}
      >
        {/* Accent bar */}
        <div
          style={{
            width: accentBarWidth,
            backgroundColor: "#FF6B35",
            borderRadius: 3,
            marginRight: 16,
          }}
        />

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {/* Rank badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                backgroundColor: "#FF6B35",
                color: "white",
                padding: "4px 14px",
                borderRadius: 4,
                fontSize: 20,
                fontWeight: 800,
                fontFamily:
                  "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
                letterSpacing: 1,
              }}
            >
              #{airport.rank}
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 20,
                fontWeight: 600,
                fontFamily:
                  "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
                letterSpacing: 2,
              }}
            >
              {airport.code}
            </div>
          </div>

          {/* Airport name */}
          <div
            style={{
              color: "white",
              fontSize: 38,
              fontWeight: 700,
              fontFamily:
                "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
              textShadow: "0 2px 20px rgba(0,0,0,0.8)",
              lineHeight: 1.1,
              maxWidth: 600,
            }}
          >
            {airport.name}
          </div>

          {/* City, Country */}
          <div
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: 22,
              fontWeight: 500,
              fontFamily:
                "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
              textShadow: "0 1px 10px rgba(0,0,0,0.6)",
            }}
          >
            {airport.city}, {airport.country}
          </div>

          {/* Passenger count */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 8,
              marginTop: 4,
            }}
          >
            <div
              style={{
                color: "#FF6B35",
                fontSize: 32,
                fontWeight: 800,
                fontFamily:
                  "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
                textShadow: "0 1px 10px rgba(0,0,0,0.6)",
              }}
            >
              {airport.passengers}
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: 18,
                fontWeight: 500,
                fontFamily:
                  "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
              }}
            >
              passengers/year
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
