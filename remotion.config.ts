import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setChromiumOpenGlRenderer("swangle");
Config.setBrowserExecutable(
  "/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome",
);
Config.setChromeMode("chrome-for-testing");
