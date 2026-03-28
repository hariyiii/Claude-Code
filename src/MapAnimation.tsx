import React, { useCallback, useEffect, useRef } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import mapboxgl from "mapbox-gl";
import { airports } from "./data/airports";
import { LowerThird } from "./LowerThird";

// Timing constants (in seconds)
const FLY_IN_SEC = 3;
const ROTATE_SEC = 6;
const FLY_OUT_SEC = 3;
const TRAVEL_SEC = 3;

// Camera constants
const ZOOMED_OUT_ZOOM = 3;
const ZOOMED_IN_ZOOM = 15.5;
const ZOOMED_IN_PITCH = 62;

export const MapAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [handle] = React.useState(() => delayRender("Loading map"));

  const FLY_IN = FLY_IN_SEC * fps;
  const ROTATE = ROTATE_SEC * fps;
  const FLY_OUT = FLY_OUT_SEC * fps;
  const TRAVEL = TRAVEL_SEC * fps;

  const SCENE_DURATION = FLY_IN + ROTATE + FLY_OUT;
  const LOWER_THIRD_DURATION = ROTATE + FLY_IN * 0.4;

  // Calculate which airport scene we're in and the local frame
  const getSceneInfo = useCallback(
    (globalFrame: number) => {
      let elapsed = 0;
      for (let i = 0; i < airports.length; i++) {
        const sceneStart = elapsed;
        const sceneDuration = SCENE_DURATION + (i < airports.length - 1 ? TRAVEL : 0);
        if (globalFrame < elapsed + sceneDuration) {
          return {
            airportIndex: i,
            localFrame: globalFrame - sceneStart,
            sceneStart,
          };
        }
        elapsed += sceneDuration;
      }
      return {
        airportIndex: airports.length - 1,
        localFrame: SCENE_DURATION,
        sceneStart: elapsed - SCENE_DURATION,
      };
    },
    [SCENE_DURATION, TRAVEL],
  );

  // Compute camera state for a given global frame
  const getCameraState = useCallback(
    (globalFrame: number) => {
      const { airportIndex, localFrame } = getSceneInfo(globalFrame);
      const airport = airports[airportIndex];

      // Phase 1: Fly in (zoom in + pitch up)
      if (localFrame < FLY_IN) {
        const progress = interpolate(localFrame, [0, FLY_IN], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.cubic),
        });
        return {
          lng: airport.lng,
          lat: airport.lat,
          zoom: interpolate(progress, [0, 1], [ZOOMED_OUT_ZOOM, ZOOMED_IN_ZOOM]),
          bearing: 0,
          pitch: interpolate(progress, [0, 1], [0, ZOOMED_IN_PITCH]),
        };
      }

      // Phase 2: Rotate 360° at zoomed-in level
      if (localFrame < FLY_IN + ROTATE) {
        const rotateFrame = localFrame - FLY_IN;
        const bearing = interpolate(rotateFrame, [0, ROTATE], [0, 360], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return {
          lng: airport.lng,
          lat: airport.lat,
          zoom: ZOOMED_IN_ZOOM,
          bearing,
          pitch: ZOOMED_IN_PITCH,
        };
      }

      // Phase 3: Fly out (zoom out + pitch down)
      if (localFrame < SCENE_DURATION) {
        const flyOutFrame = localFrame - FLY_IN - ROTATE;
        const progress = interpolate(flyOutFrame, [0, FLY_OUT], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.cubic),
        });
        return {
          lng: airport.lng,
          lat: airport.lat,
          zoom: interpolate(progress, [0, 1], [ZOOMED_IN_ZOOM, ZOOMED_OUT_ZOOM]),
          bearing: interpolate(progress, [0, 1], [360, 360]),
          pitch: interpolate(progress, [0, 1], [ZOOMED_IN_PITCH, 0]),
        };
      }

      // Phase 4: Travel to next airport
      const travelFrame = localFrame - SCENE_DURATION;
      const nextAirport = airports[Math.min(airportIndex + 1, airports.length - 1)];
      const progress = interpolate(travelFrame, [0, TRAVEL], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.cubic),
      });

      // Arc path: zoom out further at midpoint, then back down
      const arcZoom = interpolate(
        progress,
        [0, 0.5, 1],
        [ZOOMED_OUT_ZOOM, Math.max(ZOOMED_OUT_ZOOM - 2, 1.5), ZOOMED_OUT_ZOOM],
      );

      return {
        lng: interpolate(progress, [0, 1], [airport.lng, nextAirport.lng]),
        lat: interpolate(progress, [0, 1], [airport.lat, nextAirport.lat]),
        zoom: arcZoom,
        bearing: 0,
        pitch: 0,
      };
    },
    [FLY_IN, ROTATE, FLY_OUT, SCENE_DURATION, TRAVEL, getSceneInfo],
  );

  // Initialize the map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const token = process.env.REMOTION_MAPBOX_TOKEN ?? process.env.MAPBOX_TOKEN ?? "";

    const map = new mapboxgl.Map({
      container: containerRef.current,
      accessToken: token,
      style: "mapbox://styles/mapbox/standard",
      center: [airports[0].lng, airports[0].lat],
      zoom: ZOOMED_OUT_ZOOM,
      bearing: 0,
      pitch: 0,
      interactive: false,
      fadeDuration: 0,
      attributionControl: false,
    });

    map.on("style.load", () => {
      // Enable 3D buildings
      map.setConfigProperty("basemap", "show3dObjects", true);
      map.setConfigProperty("basemap", "showPointOfInterestLabels", false);
      map.setConfigProperty("basemap", "showTransitLabels", false);
      map.setConfigProperty("basemap", "showPlaceLabels", true);
      map.setConfigProperty("basemap", "lightPreset", "day");

      continueRender(handle);
    });

    mapRef.current = map;
  }, [handle]);

  // Update camera position on every frame
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const camera = getCameraState(frame);
    map.jumpTo({
      center: [camera.lng, camera.lat],
      zoom: camera.zoom,
      bearing: camera.bearing,
      pitch: camera.pitch,
    });
    map.triggerRepaint();
  }, [frame, getCameraState]);

  // Build Sequence offsets for lower thirds
  const sequences: Array<{
    from: number;
    duration: number;
    airport: (typeof airports)[number];
  }> = [];

  let offset = 0;
  for (let i = 0; i < airports.length; i++) {
    // Lower third appears during the last 40% of fly-in and all of rotation
    const lowerThirdStart = offset + Math.floor(FLY_IN * 0.6);
    sequences.push({
      from: lowerThirdStart,
      duration: Math.floor(LOWER_THIRD_DURATION),
      airport: airports[i],
    });
    offset += SCENE_DURATION + (i < airports.length - 1 ? TRAVEL : 0);
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a1628" }}>
      {/* Map container */}
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width,
          height,
        }}
      />

      {/* Vignette overlay */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Lower thirds */}
      {sequences.map((seq) => (
        <Sequence
          key={seq.airport.code}
          from={seq.from}
          durationInFrames={seq.duration}
          layout="none"
        >
          <LowerThird airport={seq.airport} durationInFrames={seq.duration} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
