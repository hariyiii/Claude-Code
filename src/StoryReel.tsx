import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  random,
} from "remotion";

// ─── Config ───────────────────────────────────────────────────────────────────

const FPS = 30;

export const SEGMENTS = [
  { durationInFrames: 90 },  // Intro
  { durationInFrames: 90 },  // Big stat
  { durationInFrames: 90 },  // Behind the scenes
  { durationInFrames: 90 },  // Quote
  { durationInFrames: 90 },  // CTA
];

export const STORY_DURATION = SEGMENTS.reduce(
  (acc, s) => acc + s.durationInFrames,
  0
);

// ─── Story progress bar ───────────────────────────────────────────────────────

const ProgressBar: React.FC<{ totalFrames: number }> = ({ totalFrames }) => {
  const frame = useCurrentFrame();
  let elapsed = 0;

  return (
    <div
      style={{
        position: "absolute",
        top: 56,
        left: 40,
        right: 40,
        display: "flex",
        gap: 8,
        zIndex: 100,
      }}
    >
      {SEGMENTS.map((seg, i) => {
        const segStart = elapsed;
        elapsed += seg.durationInFrames;

        const segProgress = interpolate(
          frame,
          [segStart, segStart + seg.durationInFrames],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              background: "rgba(255,255,255,0.35)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${segProgress * 100}%`,
                height: "100%",
                background: "#fff",
                borderRadius: 2,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

// ─── Avatar row ──────────────────────────────────────────────────────────────

const AvatarRow: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 80,
        left: 40,
        display: "flex",
        alignItems: "center",
        gap: 14,
        opacity,
        zIndex: 100,
      }}
    >
      {/* Avatar circle */}
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #f97316, #ec4899)",
          border: "3px solid #fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 32,
        }}
      >
        ✨
      </div>
      <div>
        <div
          style={{
            color: "#fff",
            fontWeight: 700,
            fontSize: 30,
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1.1,
          }}
        >
          highlights
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.75)",
            fontSize: 22,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          3 min ago
        </div>
      </div>
    </div>
  );
};

// ─── Floating tag ────────────────────────────────────────────────────────────

const Tag: React.FC<{ text: string; delay: number; x: number; y: number; color: string }> = ({
  text,
  delay,
  x,
  y,
  color,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ fps, frame: frame - delay, config: { damping: 80, stiffness: 120 } });
  const opacity = interpolate(frame - delay, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity,
        transform: `scale(${enter})`,
        background: color,
        color: "#fff",
        fontSize: 26,
        fontWeight: 700,
        fontFamily: "system-ui, sans-serif",
        padding: "10px 24px",
        borderRadius: 100,
      }}
    >
      {text}
    </div>
  );
};

// ─── Decorative shapes ────────────────────────────────────────────────────────

const Blob: React.FC<{ x: number; y: number; size: number; color: string; seed: string }> = ({
  x,
  y,
  size,
  color,
  seed,
}) => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 90], [0, random(seed) * 30 - 15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x + drift,
        top: y,
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        filter: "blur(80px)",
        opacity: 0.6,
      }}
    />
  );
};

// ─── Segment 1 – Intro ────────────────────────────────────────────────────────

const IntroSegment: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleEnter = spring({ fps, frame: frame - 8, config: { damping: 70, stiffness: 80 } });
  const subEnter = spring({ fps, frame: frame - 22, config: { damping: 80, stiffness: 90 } });
  const emojiScale = spring({ fps, frame: frame - 5, config: { damping: 60, stiffness: 100 } });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(160deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
      }}
    >
      <Blob x={-100} y={200} size={500} color="#6366f1" seed="b1" />
      <Blob x={400} y={900} size={400} color="#ec4899" seed="b2" />

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
          padding: "0 60px",
        }}
      >
        <div
          style={{
            fontSize: 120,
            transform: `scale(${emojiScale})`,
            lineHeight: 1,
          }}
        >
          🔥
        </div>

        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: "#fff",
            textAlign: "center",
            lineHeight: 1.05,
            letterSpacing: "-2px",
            fontFamily: "system-ui, sans-serif",
            transform: `translateY(${(1 - titleEnter) * 60}px)`,
            opacity: titleEnter,
          }}
        >
          This week
          <br />
          was
          <span
            style={{
              background: "linear-gradient(90deg, #f97316, #ec4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {" "}wild.
          </span>
        </div>

        <div
          style={{
            fontSize: 36,
            color: "rgba(255,255,255,0.7)",
            textAlign: "center",
            fontFamily: "system-ui, sans-serif",
            transform: `translateY(${(1 - subEnter) * 40}px)`,
            opacity: subEnter,
          }}
        >
          Here's your weekly recap ✨
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Segment 2 – Big Stat ─────────────────────────────────────────────────────

const StatSegment: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelEnter = spring({ fps, frame: frame - 5, config: { damping: 80 } });
  const numEnter = spring({ fps, frame: frame - 12, config: { damping: 60, stiffness: 70 } });
  const descEnter = spring({ fps, frame: frame - 30, config: { damping: 90 } });

  const countProgress = spring({ fps, frame: frame - 10, config: { damping: 50, stiffness: 60 } });
  const displayNum = Math.round(countProgress * 2847);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(160deg, #0a0a0a 0%, #111827 100%)",
      }}
    >
      <Blob x={-80} y={600} size={600} color="#6366f1" seed="s1" />
      <Blob x={300} y={100} size={350} color="#8b5cf6" seed="s2" />

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          padding: "0 60px",
        }}
      >
        <div
          style={{
            fontSize: 32,
            fontWeight: 600,
            color: "#a78bfa",
            letterSpacing: 6,
            textTransform: "uppercase",
            fontFamily: "system-ui, sans-serif",
            opacity: labelEnter,
            transform: `translateY(${(1 - labelEnter) * -20}px)`,
          }}
        >
          New followers
        </div>

        <div
          style={{
            fontSize: 200,
            fontWeight: 900,
            color: "#fff",
            lineHeight: 0.9,
            fontFamily: "system-ui, sans-serif",
            transform: `scale(${numEnter})`,
            letterSpacing: "-8px",
          }}
        >
          {displayNum.toLocaleString()}
        </div>

        <div
          style={{
            width: 120,
            height: 5,
            borderRadius: 3,
            background: "linear-gradient(90deg, #6366f1, #a78bfa)",
            opacity: descEnter,
          }}
        />

        <div
          style={{
            fontSize: 34,
            color: "rgba(255,255,255,0.65)",
            textAlign: "center",
            fontFamily: "system-ui, sans-serif",
            opacity: descEnter,
            transform: `translateY(${(1 - descEnter) * 30}px)`,
          }}
        >
          in a single week 🤯
        </div>
      </div>

      <Tag text="📈 +340%" delay={40} x={60} y={820} color="#6366f1" />
      <Tag text="All time high" delay={50} x={500} y={900} color="#ec4899" />
    </AbsoluteFill>
  );
};

// ─── Segment 3 – Behind the scenes ────────────────────────────────────────────

const BehindSegment: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const gridItems = [
    { emoji: "☕", label: "6am starts", color: "#f97316", seed: "g1" },
    { emoji: "💻", label: "Deep work", color: "#6366f1", seed: "g2" },
    { emoji: "🎙️", label: "3 podcasts", color: "#ec4899", seed: "g3" },
    { emoji: "✈️", label: "2 cities", color: "#06b6d4", seed: "g4" },
  ];

  const titleEnter = spring({ fps, frame: frame - 5, config: { damping: 80 } });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(160deg, #0d1117 0%, #161b22 100%)",
        padding: "0 48px",
      }}
    >
      <Blob x={200} y={300} size={400} color="#06b6d4" seed="bh1" />
      <Blob x={-100} y={1200} size={500} color="#8b5cf6" seed="bh2" />

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 48,
          right: 48,
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 40,
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: "#fff",
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1.1,
            opacity: titleEnter,
            transform: `translateX(${(1 - titleEnter) * -40}px)`,
          }}
        >
          Behind
          <br />
          the scenes
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
          }}
        >
          {gridItems.map((item, i) => {
            const enter = spring({
              fps,
              frame: frame - 15 - i * 8,
              config: { damping: 90, stiffness: 100 },
            });
            const opacity = interpolate(frame - 15 - i * 8, [0, 10], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <div
                key={item.seed}
                style={{
                  background: `${item.color}18`,
                  border: `2px solid ${item.color}44`,
                  borderRadius: 28,
                  padding: "36px 28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  opacity,
                  transform: `scale(${enter})`,
                }}
              >
                <div style={{ fontSize: 64 }}>{item.emoji}</div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: "#fff",
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Segment 4 – Quote ────────────────────────────────────────────────────────

const QuoteSegment: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgEnter = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const quoteEnter = spring({ fps, frame: frame - 10, config: { damping: 70, stiffness: 70 } });
  const authorEnter = spring({ fps, frame: frame - 35, config: { damping: 80 } });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(160deg, #1a0533 0%, #2d1b69 50%, #0f0c29 100%)",
      }}
    >
      {/* Big decorative quote mark */}
      <div
        style={{
          position: "absolute",
          top: 260,
          left: 40,
          fontSize: 400,
          lineHeight: 1,
          color: "rgba(139,92,246,0.15)",
          fontFamily: "Georgia, serif",
          userSelect: "none",
        }}
      >
        "
      </div>

      <Blob x={300} y={800} size={450} color="#a855f7" seed="q1" />

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          transform: "translateY(-50%)",
          padding: "0 72px",
          display: "flex",
          flexDirection: "column",
          gap: 48,
        }}
      >
        <div
          style={{
            fontSize: 60,
            fontWeight: 800,
            color: "#fff",
            lineHeight: 1.2,
            fontFamily: "system-ui, sans-serif",
            opacity: quoteEnter,
            transform: `translateY(${(1 - quoteEnter) * 50}px)`,
          }}
        >
          "Consistency beats talent every single time."
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            opacity: authorEnter,
            transform: `translateX(${(1 - authorEnter) * -30}px)`,
          }}
        >
          <div
            style={{
              width: 60,
              height: 3,
              background: "linear-gradient(90deg, #a855f7, #ec4899)",
              borderRadius: 2,
            }}
          />
          <div
            style={{
              fontSize: 30,
              color: "#c084fc",
              fontFamily: "system-ui, sans-serif",
              fontWeight: 600,
            }}
          >
            This week's lesson
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Segment 5 – CTA ─────────────────────────────────────────────────────────

const CTASegment: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgScale = interpolate(frame, [0, 30], [1.05, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleEnter = spring({ fps, frame: frame - 8, config: { damping: 70, stiffness: 80 } });
  const btnEnter = spring({ fps, frame: frame - 25, config: { damping: 80, stiffness: 100 } });
  const subEnter = spring({ fps, frame: frame - 40, config: { damping: 80 } });

  const btnPulse = interpolate(
    frame,
    [50, 65, 80],
    [1, 1.04, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(160deg, #0c1a12 0%, #052e16 100%)",
        transform: `scale(${bgScale})`,
      }}
    >
      <Blob x={-80} y={400} size={550} color="#10b981" seed="c1" />
      <Blob x={350} y={1100} size={400} color="#34d399" seed="c2" />

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 36,
          padding: "0 60px",
        }}
      >
        <div style={{ fontSize: 100, lineHeight: 1 }}>🎯</div>

        <div
          style={{
            fontSize: 76,
            fontWeight: 900,
            color: "#fff",
            textAlign: "center",
            lineHeight: 1.05,
            fontFamily: "system-ui, sans-serif",
            letterSpacing: "-2px",
            opacity: titleEnter,
            transform: `translateY(${(1 - titleEnter) * 50}px)`,
          }}
        >
          Next week
          <br />
          is{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #10b981, #34d399)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            yours.
          </span>
        </div>

        <div
          style={{
            background: "linear-gradient(90deg, #10b981, #059669)",
            borderRadius: 100,
            padding: "28px 72px",
            fontSize: 38,
            fontWeight: 800,
            color: "#fff",
            fontFamily: "system-ui, sans-serif",
            opacity: btnEnter,
            transform: `scale(${btnEnter * btnPulse})`,
            letterSpacing: "-0.5px",
          }}
        >
          Follow for more →
        </div>

        <div
          style={{
            fontSize: 30,
            color: "rgba(255,255,255,0.5)",
            textAlign: "center",
            fontFamily: "system-ui, sans-serif",
            opacity: subEnter,
            transform: `translateY(${(1 - subEnter) * 20}px)`,
          }}
        >
          New content every Monday ✌️
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Root story reel ──────────────────────────────────────────────────────────

export const StoryReel: React.FC = () => {
  const segmentStarts = SEGMENTS.reduce<number[]>((acc, seg, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + SEGMENTS[i - 1].durationInFrames);
    return acc;
  }, []);

  return (
    <AbsoluteFill>
      {/* Segments */}
      <Sequence from={segmentStarts[0]} durationInFrames={SEGMENTS[0].durationInFrames}>
        <IntroSegment />
      </Sequence>
      <Sequence from={segmentStarts[1]} durationInFrames={SEGMENTS[1].durationInFrames}>
        <StatSegment />
      </Sequence>
      <Sequence from={segmentStarts[2]} durationInFrames={SEGMENTS[2].durationInFrames}>
        <BehindSegment />
      </Sequence>
      <Sequence from={segmentStarts[3]} durationInFrames={SEGMENTS[3].durationInFrames}>
        <QuoteSegment />
      </Sequence>
      <Sequence from={segmentStarts[4]} durationInFrames={SEGMENTS[4].durationInFrames}>
        <CTASegment />
      </Sequence>

      {/* Story chrome (progress bar + avatar) always on top */}
      <ProgressBar totalFrames={STORY_DURATION} />
      <AvatarRow />
    </AbsoluteFill>
  );
};
