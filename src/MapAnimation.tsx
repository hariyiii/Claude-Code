import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { airports } from "./data/airports";
import { Globe } from "./Globe";
import { AirportScene } from "./AirportScene";
import { LowerThird } from "./LowerThird";

// Timing constants (in seconds)
const FLY_IN_SEC = 3;
const ROTATE_SEC = 6;
const FLY_OUT_SEC = 3;
const TRAVEL_SEC = 3;

export const SCENE_DURATION_SEC = FLY_IN_SEC + ROTATE_SEC + FLY_OUT_SEC;
export const TOTAL_DURATION_SEC =
  airports.length * SCENE_DURATION_SEC + (airports.length - 1) * TRAVEL_SEC;

export const MapAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const FLY_IN = FLY_IN_SEC * fps;
  const ROTATE = ROTATE_SEC * fps;
  const FLY_OUT = FLY_OUT_SEC * fps;
  const TRAVEL = TRAVEL_SEC * fps;
  const SCENE = FLY_IN + ROTATE + FLY_OUT;

  // Determine current scene
  let elapsed = 0;
  let airportIndex = 0;
  let localFrame = 0;
  let sceneStart = 0;

  for (let i = 0; i < airports.length; i++) {
    const dur = SCENE + (i < airports.length - 1 ? TRAVEL : 0);
    if (frame < elapsed + dur) {
      airportIndex = i;
      localFrame = frame - elapsed;
      sceneStart = elapsed;
      break;
    }
    elapsed += dur;
    if (i === airports.length - 1) {
      airportIndex = i;
      localFrame = SCENE;
      sceneStart = elapsed - SCENE;
    }
  }

  const airport = airports[airportIndex];
  const nextAirport = airports[Math.min(airportIndex + 1, airports.length - 1)];

  // Phase detection
  const inFlyIn = localFrame < FLY_IN;
  const inRotate = localFrame >= FLY_IN && localFrame < FLY_IN + ROTATE;
  const inFlyOut =
    localFrame >= FLY_IN + ROTATE && localFrame < SCENE;
  const inTravel = localFrame >= SCENE;

  // Zoom progress: 0 = globe view, 1 = airport view
  let zoomProgress: number;
  if (inFlyIn) {
    zoomProgress = interpolate(localFrame, [0, FLY_IN], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });
  } else if (inRotate) {
    zoomProgress = 1;
  } else if (inFlyOut) {
    zoomProgress = interpolate(
      localFrame - FLY_IN - ROTATE,
      [0, FLY_OUT],
      [1, 0],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.cubic),
      },
    );
  } else {
    zoomProgress = 0;
  }

  // Rotation progress during rotate phase
  let rotationProgress = 0;
  if (inRotate) {
    rotationProgress = interpolate(
      localFrame - FLY_IN,
      [0, ROTATE],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      },
    );
  }

  // Globe center during travel
  let globeCenterLng = airport.lng;
  let globeCenterLat = airport.lat;
  if (inTravel) {
    const travelProgress = interpolate(
      localFrame - SCENE,
      [0, TRAVEL],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.cubic),
      },
    );
    globeCenterLng = interpolate(
      travelProgress,
      [0, 1],
      [airport.lng, nextAirport.lng],
    );
    globeCenterLat = interpolate(
      travelProgress,
      [0, 1],
      [airport.lat, nextAirport.lat],
    );
  }

  // Globe scale: shrinks as we zoom in
  const globeOpacity = interpolate(zoomProgress, [0, 0.6], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Airport scene opacity: appears as we zoom in
  const airportSceneOpacity = interpolate(zoomProgress, [0.3, 0.7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Build lower third sequences
  const lowerThirdSequences: Array<{
    from: number;
    duration: number;
    airport: (typeof airports)[number];
  }> = [];
  let seqOffset = 0;
  for (let i = 0; i < airports.length; i++) {
    const ltStart = seqOffset + Math.floor(FLY_IN * 0.5);
    const ltDuration = Math.floor(ROTATE + FLY_IN * 0.3);
    lowerThirdSequences.push({
      from: ltStart,
      duration: ltDuration,
      airport: airports[i],
    });
    seqOffset += SCENE + (i < airports.length - 1 ? TRAVEL : 0);
  }

  // Flight path line during travel
  const showFlightPath = inTravel;

  // Globe radius with pulse effect on zoom
  const baseRadius = Math.min(width, height) * 0.4;
  const globeRadius = interpolate(zoomProgress, [0, 1], [baseRadius, baseRadius * 2.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const airportMarkers = airports.map((ap) => ({
    lng: ap.lng,
    lat: ap.lat,
    code: ap.code,
    active: ap.code === airport.code,
  }));

  return (
    <AbsoluteFill style={{ backgroundColor: "#050d1a" }}>
      {/* Starfield background */}
      <StarField width={width} height={height} />

      {/* Globe layer */}
      <Globe
        centerLng={globeCenterLng}
        centerLat={globeCenterLat}
        width={width}
        height={height}
        radius={globeRadius}
        opacity={globeOpacity}
        showGrid
        highlightLng={airport.lng}
        highlightLat={airport.lat}
        airports={airportMarkers}
      />

      {/* Airport zoomed-in scene */}
      {zoomProgress > 0.1 && (
        <div style={{ opacity: airportSceneOpacity }}>
          <AirportScene
            airport={airport}
            rotationProgress={rotationProgress}
            zoomProgress={zoomProgress}
          />
        </div>
      )}

      {/* Zoom transition flash */}
      {zoomProgress > 0.4 && zoomProgress < 0.7 && (
        <AbsoluteFill
          style={{
            backgroundColor: "white",
            opacity: interpolate(zoomProgress, [0.4, 0.55, 0.7], [0, 0.08, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        />
      )}

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Lower thirds */}
      {lowerThirdSequences.map((seq) => (
        <Sequence
          key={seq.airport.code}
          from={seq.from}
          durationInFrames={seq.duration}
          layout="none"
        >
          <LowerThird airport={seq.airport} durationInFrames={seq.duration} />
        </Sequence>
      ))}

      {/* Title bar */}
      <AbsoluteFill>
        <div
          style={{
            position: "absolute",
            top: 30,
            right: 40,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: 16,
              fontFamily: "monospace",
              letterSpacing: 3,
            }}
          >
            WORLD'S BUSIEST AIRPORTS 2023
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Simple starfield background
const StarField: React.FC<{ width: number; height: number }> = ({
  width,
  height,
}) => {
  const stars = React.useMemo(() => {
    const rng = (s: number) => {
      let seed = s;
      return () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
      };
    };
    const r = rng(42);
    return Array.from({ length: 80 }, () => ({
      x: r() * width,
      y: r() * height,
      size: 0.5 + r() * 1.5,
      opacity: 0.2 + r() * 0.5,
    }));
  }, [width, height]);

  return (
    <svg
      width={width}
      height={height}
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      {stars.map((s, i) => (
        <circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.size}
          fill="white"
          opacity={s.opacity}
        />
      ))}
    </svg>
  );
};
