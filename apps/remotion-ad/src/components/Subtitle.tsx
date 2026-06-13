import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from "remotion";
import { fontFamily } from "../fonts";

interface SubtitleProps {
  text: string;
  startFrame: number;
  endFrame: number;
  highlight?: boolean;
}

export const Subtitle: React.FC<SubtitleProps> = ({
  text,
  startFrame,
  endFrame,
  highlight = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isVisible = frame >= startFrame && frame <= endFrame;
  if (!isVisible) return null;

  const localFrame = frame - startFrame;
  const totalFrames = endFrame - startFrame;

  const opacity = interpolate(
    localFrame,
    [0, 8, totalFrames - 8, totalFrames],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    }
  );

  const slideY = interpolate(localFrame, [0, 12], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const scale = spring({
    frame: localFrame,
    fps,
    config: { damping: 15, stiffness: 200, mass: 0.8 },
    from: 0.9,
    to: 1,
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${slideY}px) scale(${scale})`,
        textAlign: "center",
        direction: "rtl",
        fontFamily,
        fontSize: highlight ? 52 : 44,
        fontWeight: highlight ? 900 : 700,
        color: "#ffffff",
        textShadow: "0 3px 20px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,0.8)",
        lineHeight: 1.4,
        padding: "12px 24px",
        background: highlight
          ? "linear-gradient(135deg, rgba(200,0,0,0.88), rgba(120,0,0,0.88))"
          : "rgba(0,0,0,0.62)",
        borderRadius: 16,
        border: highlight ? "2px solid rgba(255,100,100,0.5)" : "none",
        maxWidth: "90%",
      }}
    >
      {text}
    </div>
  );
};
