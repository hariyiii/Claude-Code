import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Series,
} from "remotion";

// ─── Data ────────────────────────────────────────────────────────────────────

const STATS = [
  { label: "Revenue", value: 4.2, unit: "M", suffix: "+18% YoY", color: "#6366f1" },
  { label: "Users", value: 128, unit: "K", suffix: "+42% YoY", color: "#06b6d4" },
  { label: "NPS Score", value: 87, unit: "", suffix: "Industry avg: 32", color: "#10b981" },
];

// ─── Animated counter ────────────────────────────────────────────────────────

const Counter: React.FC<{ target: number; unit: string }> = ({ target, unit }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({ fps, frame, config: { damping: 60, stiffness: 80 } });
  const current = progress * target;

  const display =
    target >= 100
      ? Math.round(current).toString()
      : current.toFixed(1);

  return (
    <span>
      {display}
      {unit}
    </span>
  );
};

// ─── Single stat card ─────────────────────────────────────────────────────────

const StatCard: React.FC<{
  label: string;
  value: number;
  unit: string;
  suffix: string;
  color: string;
  delay: number;
}> = ({ label, value, unit, suffix, color, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    fps,
    frame: frame - delay,
    config: { damping: 120, stiffness: 100 },
  });

  const opacity = interpolate(frame - delay, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${(1 - enter) * 60}px)`,
        background: "rgba(255,255,255,0.05)",
        border: `2px solid ${color}33`,
        borderRadius: 24,
        padding: "48px 64px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        flex: 1,
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Accent bar */}
      <div
        style={{
          width: 48,
          height: 5,
          borderRadius: 4,
          background: color,
          marginBottom: 8,
        }}
      />

      {/* Big number */}
      <div
        style={{
          fontSize: 96,
          fontWeight: 800,
          color,
          lineHeight: 1,
          letterSpacing: "-2px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <Sequence from={delay}>
          <Counter target={value} unit={unit} />
        </Sequence>
      </div>

      {/* Label */}
      <div
        style={{
          fontSize: 36,
          fontWeight: 600,
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {label}
      </div>

      {/* Suffix */}
      <div
        style={{
          fontSize: 24,
          color: "#94a3b8",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {suffix}
      </div>
    </div>
  );
};

// ─── Bar chart ────────────────────────────────────────────────────────────────

const CHART_DATA = [
  { month: "Sep", value: 62 },
  { month: "Oct", value: 74 },
  { month: "Nov", value: 68 },
  { month: "Dec", value: 91 },
  { month: "Jan", value: 85 },
  { month: "Feb", value: 100 },
];

const BarChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 20,
        height: 220,
        padding: "0 24px",
      }}
    >
      {CHART_DATA.map((d, i) => {
        const barSpring = spring({
          fps,
          frame: frame - i * 4,
          config: { damping: 100, stiffness: 80 },
        });

        const height = barSpring * (d.value / 100) * 200;
        const opacity = interpolate(frame - i * 4, [0, 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={d.month}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              flex: 1,
              opacity,
            }}
          >
            <div
              style={{
                width: "100%",
                height,
                background:
                  i === CHART_DATA.length - 1
                    ? "linear-gradient(180deg, #818cf8 0%, #6366f1 100%)"
                    : "rgba(99,102,241,0.4)",
                borderRadius: "8px 8px 0 0",
              }}
            />
            <div
              style={{
                fontSize: 22,
                color: "#94a3b8",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              {d.month}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Title slide ─────────────────────────────────────────────────────────────

const TitleSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleEnter = spring({ fps, frame, config: { damping: 80, stiffness: 60 } });
  const subtitleOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lineWidth = interpolate(frame, [15, 50], [0, 320], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
      }}
    >
      <div
        style={{
          fontSize: 100,
          fontWeight: 900,
          color: "#fff",
          transform: `translateY(${(1 - titleEnter) * -80}px)`,
          fontFamily: "system-ui, sans-serif",
          letterSpacing: "-3px",
          textAlign: "center",
        }}
      >
        Q1 2026
      </div>
      <div
        style={{
          width: lineWidth,
          height: 4,
          borderRadius: 2,
          background: "linear-gradient(90deg, #6366f1, #06b6d4)",
        }}
      />
      <div
        style={{
          fontSize: 40,
          color: "#94a3b8",
          opacity: subtitleOpacity,
          fontFamily: "system-ui, sans-serif",
          fontWeight: 500,
        }}
      >
        Business Performance Review
      </div>
    </AbsoluteFill>
  );
};

// ─── Stats slide ─────────────────────────────────────────────────────────────

const StatsSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headingEnter = spring({ fps, frame, config: { damping: 100 } });
  const headingOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
        padding: "80px 100px",
        display: "flex",
        flexDirection: "column",
        gap: 60,
      }}
    >
      {/* Heading */}
      <div
        style={{
          fontSize: 52,
          fontWeight: 700,
          color: "#fff",
          opacity: headingOpacity,
          transform: `translateX(${(1 - headingEnter) * -40}px)`,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        Key Metrics
      </div>

      {/* Cards row */}
      <div style={{ display: "flex", gap: 40, flex: 1 }}>
        {STATS.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 8 + 5} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─── Chart slide ─────────────────────────────────────────────────────────────

const ChartSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ fps, frame, config: { damping: 100 } });
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
        padding: "80px 100px",
        display: "flex",
        flexDirection: "column",
        gap: 48,
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateX(${(1 - enter) * -40}px)`,
        }}
      >
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#fff",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Revenue Trend
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#94a3b8",
            marginTop: 8,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Last 6 months (indexed)
        </div>
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "2px solid rgba(99,102,241,0.2)",
          borderRadius: 24,
          padding: "48px 48px 32px",
          flex: 1,
        }}
      >
        <BarChart />
      </div>
    </AbsoluteFill>
  );
};

// ─── Outro slide ─────────────────────────────────────────────────────────────

const OutroSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ fps, frame, config: { damping: 80, stiffness: 60 } });
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 32,
      }}
    >
      <div
        style={{
          fontSize: 120,
          transform: `scale(${scale})`,
          opacity,
        }}
      >
        🚀
      </div>
      <div
        style={{
          fontSize: 64,
          fontWeight: 800,
          color: "#fff",
          opacity,
          fontFamily: "system-ui, sans-serif",
          letterSpacing: "-2px",
        }}
      >
        Strong Quarter
      </div>
      <div
        style={{
          fontSize: 32,
          color: "#6366f1",
          opacity,
          fontFamily: "system-ui, sans-serif",
          fontWeight: 600,
        }}
      >
        Onwards to Q2
      </div>
    </AbsoluteFill>
  );
};

// ─── Root composition ─────────────────────────────────────────────────────────

export const StatsVideo: React.FC = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={90}>
        <TitleSlide />
      </Series.Sequence>
      <Series.Sequence durationInFrames={120}>
        <StatsSlide />
      </Series.Sequence>
      <Series.Sequence durationInFrames={120}>
        <ChartSlide />
      </Series.Sequence>
      <Series.Sequence durationInFrames={90}>
        <OutroSlide />
      </Series.Sequence>
    </Series>
  );
};
