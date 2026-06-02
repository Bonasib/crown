import React from "react";
import { Composition } from "remotion";
import { RondaAd } from "./RondaAd";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="RondaAd"
        component={RondaAd}
        durationInFrames={540}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
    </>
  );
};
