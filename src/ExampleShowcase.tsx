import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import {
  TransitionSeries,
  linearTiming,
  springTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";

const COLORS = {
  dark: "#0f0f23",
  accent: "#6366f1",
  accentLight: "#818cf8",
  white: "#ffffff",
  gray: "#94a3b8",
};

const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ fps, frame, config: { damping: 100 } });
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleY = interpolate(frame, [15, 35], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtitleOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lineWidth = interpolate(frame, [10, 40], [0, 400], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${COLORS.dark} 0%, #1a1a3e 100%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            fontSize: 90,
            fontWeight: 800,
            color: COLORS.white,
            fontFamily: "system-ui, sans-serif",
            transform: `scale(${titleScale})`,
            opacity: titleOpacity,
            letterSpacing: -2,
          }}
        >
          Remotion
        </div>
        <div
          style={{
            width: lineWidth,
            height: 4,
            background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accentLight})`,
            borderRadius: 2,
          }}
        />
        <div
          style={{
            fontSize: 32,
            color: COLORS.gray,
            fontFamily: "system-ui, sans-serif",
            fontWeight: 400,
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
          }}
        >
          React-powered video creation
        </div>
      </div>
    </AbsoluteFill>
  );
};

const FeatureSlide: React.FC<{ title: string; items: string[] }> = ({
  title,
  items,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ fps, frame, config: { damping: 200 } });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${COLORS.dark} 0%, #1e1e3f 100%)`,
        justifyContent: "center",
        alignItems: "center",
        padding: 120,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          width: "100%",
          gap: 40,
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: COLORS.accentLight,
            fontFamily: "system-ui, sans-serif",
            transform: `translateX(${interpolate(titleSpring, [0, 1], [-100, 0])}px)`,
            opacity: titleSpring,
          }}
        >
          {title}
        </div>
        {items.map((item, i) => {
          const delay = 10 + i * 8;
          const itemOpacity = interpolate(frame, [delay, delay + 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const itemX = interpolate(frame, [delay, delay + 15], [60, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                opacity: itemOpacity,
                transform: `translateX(${itemX}px)`,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  background: COLORS.accent,
                }}
              />
              <div
                style={{
                  fontSize: 36,
                  color: COLORS.white,
                  fontFamily: "system-ui, sans-serif",
                  fontWeight: 400,
                }}
              >
                {item}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const AnimatedCounter: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    fps,
    frame,
    config: { damping: 100, mass: 0.5 },
  });

  const count = Math.round(interpolate(progress, [0, 1], [0, 30]));

  const circleRadius = 180;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference * (1 - progress);

  const pulseScale = interpolate(
    frame % 30,
    [0, 15, 30],
    [1, 1.05, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        background: COLORS.dark,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: 400,
          height: 400,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${pulseScale})`,
        }}
      >
        <svg width={400} height={400} viewBox="0 0 400 400">
          <circle
            cx={200}
            cy={200}
            r={circleRadius}
            fill="none"
            stroke="#1e1e3f"
            strokeWidth={8}
          />
          <circle
            cx={200}
            cy={200}
            r={circleRadius}
            fill="none"
            stroke={COLORS.accent}
            strokeWidth={8}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 200 200)"
          />
        </svg>
        <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 96,
              fontWeight: 800,
              color: COLORS.white,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            {count}
          </div>
          <div
            style={{
              fontSize: 24,
              color: COLORS.gray,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            fps
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 140,
          fontSize: 40,
          color: COLORS.accentLight,
          fontFamily: "system-ui, sans-serif",
          fontWeight: 600,
          opacity: interpolate(frame, [20, 35], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Frame-perfect rendering
      </div>
    </AbsoluteFill>
  );
};

const OutroCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ fps, frame, config: { damping: 200 } });

  const glowOpacity = interpolate(
    frame % 60,
    [0, 30, 60],
    [0.3, 0.8, 0.3],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        background: COLORS.dark,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: COLORS.accent,
          opacity: glowOpacity * 0.15,
          filter: "blur(100px)",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          transform: `scale(${scale})`,
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: COLORS.white,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Get Started
        </div>
        <div
          style={{
            fontSize: 28,
            color: COLORS.gray,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          npx create-video@latest
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const ExampleShowcase: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={90}>
        <TitleCard />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        timing={springTiming({ config: { damping: 200 } })}
        presentation={fade()}
      />
      <TransitionSeries.Sequence durationInFrames={90}>
        <FeatureSlide
          title="Why Remotion?"
          items={[
            "Write videos in React",
            "Use any npm package",
            "Server-side rendering",
            "Programmatic video creation",
          ]}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        timing={linearTiming({ durationInFrames: 20 })}
        presentation={wipe()}
      />
      <TransitionSeries.Sequence durationInFrames={90}>
        <AnimatedCounter />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        timing={springTiming({ config: { damping: 200 } })}
        presentation={fade()}
      />
      <TransitionSeries.Sequence durationInFrames={90}>
        <OutroCard />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
