import React from "react";

export const ColorGrade: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Base content */}
      <div style={{ position: "absolute", inset: 0 }}>{children}</div>

      {/* Warm color grade overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,200,100,0.04) 0%, rgba(200,80,0,0.06) 100%)",
          mixBlendMode: "multiply",
          pointerEvents: "none",
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 40%, transparent 45%, rgba(0,0,0,0.55) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Subtle contrast boost via luminosity */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.05)",
          mixBlendMode: "multiply",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
