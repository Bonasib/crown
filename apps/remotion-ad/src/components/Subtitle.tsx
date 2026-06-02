import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import React from "react";

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

  const isActive = frame >= startFrame && frame <= endFrame;

  const opacity = interpolate(
    frame,
    [startFrame, startFrame + 8, endFrame - 8, endFrame],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const slideY = interpolate(
    frame,
    [startFrame, startFrame + 12],
    [20, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const scale = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 15, stiffness: 200, mass: 0.8 },
    from: 0.9,
    to: 1,
  });

  if (!isActive && frame > endFrame) return null;

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${slideY}px) scale(${scale})`,
        textAlign: "center",
        direction: "rtl",
        fontFamily: "'Cairo', 'Noto Kufi Arabic', 'Arial', sans-serif",
        fontSize: highlight ? 52 : 44,
        fontWeight: highlight ? 900 : 700,
        color: "#ffffff",
        textShadow: "0 3px 20px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,0.8)",
        lineHeight: 1.4,
        padding: "12px 24px",
        background: highlight
          ? "linear-gradient(135deg, rgba(200,0,0,0.85), rgba(120,0,0,0.85))"
          : "rgba(0,0,0,0.6)",
        borderRadius: 16,
        backdropFilter: "blur(4px)",
        border: highlight ? "2px solid rgba(255,100,100,0.5)" : "none",
        maxWidth: "90%",
      }}
    >
      {text}
    </div>
  );
};
