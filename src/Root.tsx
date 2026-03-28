import { Composition } from "remotion";
import { MapAnimation } from "./MapAnimation";
import { ExampleShowcase } from "./ExampleShowcase";
import { airports } from "./data/airports";

const FPS = 30;
const FLY_IN = 3 * FPS;
const ROTATE = 6 * FPS;
const FLY_OUT = 3 * FPS;
const TRAVEL = 3 * FPS;
const SCENE = FLY_IN + ROTATE + FLY_OUT;
const TOTAL = airports.length * SCENE + (airports.length - 1) * TRAVEL;

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
        id="ExampleShowcase"
        component={ExampleShowcase}
        durationInFrames={330}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
