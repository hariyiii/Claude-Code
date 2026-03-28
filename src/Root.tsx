import { Composition } from "remotion";
import { MapAnimation } from "./MapAnimation";
import { StatsVideo } from "./StatsVideo";
import { StoryReel, STORY_DURATION } from "./StoryReel";
import { airports } from "./data/airports";

const FPS = 30;
const FLY_IN = 3 * FPS;
const ROTATE = 6 * FPS;
const FLY_OUT = 3 * FPS;
const TRAVEL = 3 * FPS;
const SCENE = FLY_IN + ROTATE + FLY_OUT;
const TOTAL = airports.length * SCENE + (airports.length - 1) * TRAVEL;

// StatsVideo: 4 slides × ~105 frames avg = 420 frames total
const STATS_TOTAL = 90 + 120 + 120 + 90;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TopAirports"
        component={MapAnimation}
        durationInFrames={TOTAL}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="StatsVideo"
        component={StatsVideo}
        durationInFrames={STATS_TOTAL}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="StoryReel"
        component={StoryReel}
        durationInFrames={STORY_DURATION}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
    </>
  );
};
