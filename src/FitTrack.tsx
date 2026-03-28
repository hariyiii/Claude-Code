import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const ACCENT = "#00FF87";
const BG = "#0A0A0F";
const TEXT_PRIMARY = "#FFFFFF";
const TEXT_DIM = "#888899";

function GlowCircle({
  cx,
  cy,
  r,
  opacity,
}: {
  cx: number;
  cy: number;
  r: number;
  opacity: number;
}) {
  return (
    <ellipse
      cx={cx}
      cy={cy}
      rx={r}
      ry={r * 0.45}
      fill={ACCENT}
      opacity={opacity}
      style={{ filter: `blur(${r * 0.55}px)` }}
    />
  );
}

function PulseRing({ frame, fps }: { frame: number; fps: number }) {
  const rings = [0, 20, 40];
  return (
    <>
      {rings.map((offset, i) => {
        const progress = ((frame + offset) % 80) / 80;
        const scale = interpolate(progress, [0, 1], [0.3, 1.8]);
        const opacity = interpolate(progress, [0, 0.5, 1], [0.6, 0.3, 0]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 220,
              height: 220,
              borderRadius: "50%",
              border: `2px solid ${ACCENT}`,
              transform: `scale(${scale})`,
              opacity,
              left: "50%",
              top: "50%",
              marginLeft: -110,
              marginTop: -110,
            }}
          />
        );
      })}
    </>
  );
}

function HeartIcon({ progress }: { progress: number }) {
  const scale = interpolate(progress, [0, 0.6, 1], [0, 1.15, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        transform: `scale(${scale})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <defs>
          <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={ACCENT} />
            <stop offset="100%" stopColor="#00C6FF" />
          </linearGradient>
        </defs>
        <path
          d="M40 68S8 48 8 26a16 16 0 0132 0 16 16 0 0132 0C72 48 40 68 40 68Z"
          fill="url(#hg)"
        />
      </svg>
    </div>
  );
}

function StatBar({
  label,
  value,
  unit,
  progress,
  delay,
}: {
  label: string;
  value: string;
  unit: string;
  progress: number;
  delay: number;
}) {
  const p = interpolate(progress, [delay, delay + 0.25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const barWidth = interpolate(p, [0, 1], [0, 100]);
  const opacity = interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div style={{ opacity, marginBottom: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
          fontSize: 22,
          color: TEXT_DIM,
          letterSpacing: 2,
          textTransform: "uppercase",
        }}
      >
        <span>{label}</span>
        <span style={{ color: TEXT_PRIMARY, fontWeight: 700 }}>
          {value}
          <span style={{ color: ACCENT, fontSize: 18 }}> {unit}</span>
        </span>
      </div>
      <div
        style={{
          height: 6,
          background: "#1A1A2E",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${barWidth}%`,
            background: `linear-gradient(90deg, ${ACCENT}, #00C6FF)`,
            borderRadius: 3,
          }}
        />
      </div>
    </div>
  );
}

export const FitTrack: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // ── Phase timings (frames @ 30fps) ──
  const PHASE_LOGO_START = 0;
  const PHASE_STATS_START = fps * 4.5;
  const PHASE_TAGLINE_START = fps * 9;
  const PHASE_CTA_START = fps * 12;

  // Logo entrance
  const logoSpring = spring({ frame, fps, config: { damping: 18, stiffness: 90 } });
  const logoY = interpolate(logoSpring, [0, 1], [60, 0]);
  const logoOpacity = interpolate(logoSpring, [0, 1], [0, 1]);

  // Subtitle under logo
  const subtitleDelay = fps * 0.6;
  const subtitleProgress = spring({
    frame: Math.max(0, frame - subtitleDelay),
    fps,
    config: { damping: 20, stiffness: 80 },
  });

  // Stats panel
  const statsProgress = interpolate(
    frame,
    [PHASE_STATS_START, PHASE_STATS_START + fps * 0.5],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const statsPanelY = interpolate(statsProgress, [0, 1], [80, 0]);

  // Tagline
  const taglineProgress = spring({
    frame: Math.max(0, frame - PHASE_TAGLINE_START),
    fps,
    config: { damping: 16, stiffness: 70 },
  });
  const taglineScale = interpolate(taglineProgress, [0, 1], [0.7, 1]);
  const taglineOpacity = interpolate(taglineProgress, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });

  // CTA
  const ctaProgress = spring({
    frame: Math.max(0, frame - PHASE_CTA_START),
    fps,
    config: { damping: 22, stiffness: 100 },
  });
  const ctaOpacity = interpolate(ctaProgress, [0, 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Outro fade
  const outroStart = durationInFrames - fps * 1.5;
  const outroOpacity = interpolate(frame, [outroStart, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Stats visibility
  const statsVisible = frame >= PHASE_STATS_START;
  const statsRelativeProgress = Math.max(
    0,
    (frame - PHASE_STATS_START) / (fps * 2)
  );

  return (
    <AbsoluteFill
      style={{
        background: BG,
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        opacity: outroOpacity,
        overflow: "hidden",
      }}
    >
      {/* Background ambient glows */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
      >
        <GlowCircle cx={960} cy={-80} r={700} opacity={0.18} />
        <GlowCircle cx={200} cy={1100} r={500} opacity={0.1} />
        <GlowCircle cx={1750} cy={900} r={400} opacity={0.08} />
      </svg>

      {/* Subtle grid lines */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        viewBox="0 0 1920 1080"
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <line
            key={i}
            x1={i * 192}
            y1={0}
            x2={i * 192}
            y2={1080}
            stroke="#FFFFFF"
            strokeOpacity={0.025}
            strokeWidth={1}
          />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <line
            key={i}
            x1={0}
            y1={i * 180}
            x2={1920}
            y2={i * 180}
            stroke="#FFFFFF"
            strokeOpacity={0.025}
            strokeWidth={1}
          />
        ))}
      </svg>

      {/* ── Logo section ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: statsVisible ? 100 : 280,
          transition: "padding-top 0.4s",
          opacity: logoOpacity,
          transform: `translateY(${logoY}px)`,
        }}
      >
        {/* Icon + brand row */}
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 16 }}>
          <HeartIcon progress={logoSpring} />
          <div
            style={{
              fontSize: 96,
              fontWeight: 900,
              letterSpacing: -2,
              background: `linear-gradient(135deg, ${TEXT_PRIMARY} 40%, ${ACCENT})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1,
            }}
          >
            FitTrack
          </div>
        </div>

        {/* Accent line */}
        <div
          style={{
            width: interpolate(subtitleProgress, [0, 1], [0, 320]),
            height: 3,
            background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)`,
            borderRadius: 2,
            marginBottom: 20,
          }}
        />

        <div
          style={{
            fontSize: 26,
            color: TEXT_DIM,
            letterSpacing: 6,
            textTransform: "uppercase",
            opacity: subtitleProgress,
          }}
        >
          Fitness &nbsp;·&nbsp; Progress &nbsp;·&nbsp; Results
        </div>
      </div>

      {/* ── Pulse rings (shown during logo phase) ── */}
      {!statsVisible && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            opacity: interpolate(frame, [fps * 3.5, fps * 4.5], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <PulseRing frame={frame} fps={fps} />
        </div>
      )}

      {/* ── Stats panel ── */}
      {statsVisible && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 340,
            transform: `translateX(-50%) translateY(${statsPanelY}px)`,
            width: 700,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24,
            padding: "40px 48px",
            backdropFilter: "blur(12px)",
            opacity: statsProgress,
          }}
        >
          <StatBar
            label="Steps Today"
            value="12,480"
            unit="steps"
            progress={statsRelativeProgress}
            delay={0}
          />
          <StatBar
            label="Calories"
            value="624"
            unit="kcal"
            progress={statsRelativeProgress}
            delay={0.2}
          />
          <StatBar
            label="Active Time"
            value="48"
            unit="min"
            progress={statsRelativeProgress}
            delay={0.4}
          />
        </div>
      )}

      {/* ── Tagline ── */}
      <div
        style={{
          position: "absolute",
          bottom: 200,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: taglineOpacity,
          transform: `scale(${taglineScale})`,
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: -1,
            color: TEXT_PRIMARY,
            textAlign: "center",
          }}
        >
          Move{" "}
          <span
            style={{
              color: ACCENT,
              textShadow: `0 0 40px ${ACCENT}88`,
            }}
          >
            Every Day
          </span>
        </div>
      </div>

      {/* ── CTA ── */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: ctaOpacity,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
            fontSize: 22,
            color: ACCENT,
            letterSpacing: 4,
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          <div
            style={{
              width: 40,
              height: 1,
              background: ACCENT,
              opacity: 0.6,
            }}
          />
          Download FitTrack Today
          <div
            style={{
              width: 40,
              height: 1,
              background: ACCENT,
              opacity: 0.6,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
