import React from "react";
import { useCurrentFrame, interpolate, useVideoConfig } from "remotion";

export const SpeechWave: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bars = [3, 6, 9, 7, 5, 8, 4, 6, 9, 5, 7, 3, 8, 6, 4];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        height: 40,
        opacity: isActive ? 1 : 0,
        transition: "opacity 0.3s",
      }}
    >
      {bars.map((baseH, i) => {
        const waveHeight = isActive
          ? interpolate(
              Math.sin(((frame * 0.3 + i * 0.8) * Math.PI) / 5),
              [-1, 1],
              [4, baseH * 3.5]
            )
          : 4;

        return (
          <div
            key={i}
            style={{
              width: 4,
              height: waveHeight,
              borderRadius: 2,
              background: "linear-gradient(to top, #ff6b35, #fff)",
              transition: "height 0.05s",
            }}
          />
        );
      })}
    </div>
  );
};
