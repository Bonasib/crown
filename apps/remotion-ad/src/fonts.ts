import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const fontFamily = "Cairo";

export const loadCairoFont = () =>
  Promise.all([
    loadFont({
      family: fontFamily,
      url: staticFile("fonts/Cairo-700.ttf"),
      weight: "700",
      format: "truetype",
    }),
    loadFont({
      family: fontFamily,
      url: staticFile("fonts/Cairo-900.ttf"),
      weight: "900",
      format: "truetype",
    }),
  ]);
