import { Composition } from "remotion";
import { MapAnimation } from "./MapAnimation";
import { airports } from "./data/airports";

// Timing constants must match MapAnimation.tsx
const FPS = 30;
const FLY_IN = 3 * FPS;
const ROTATE = 6 * FPS;
const FLY_OUT = 3 * FPS;
const TRAVEL = 3 * FPS;
const SCENE_DURATION = FLY_IN + ROTATE + FLY_OUT;
const TOTAL_DURATION =
  airports.length * SCENE_DURATION + (airports.length - 1) * TRAVEL;

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="TopAirports"
      component={MapAnimation}
      durationInFrames={TOTAL_DURATION}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
