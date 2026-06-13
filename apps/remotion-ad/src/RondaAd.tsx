import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img,
  staticFile,
  AbsoluteFill,
  Sequence,
  Easing,
} from "remotion";
import { fontFamily } from "./fonts";
import { SpeechWave } from "./components/SpeechWave";
import { Subtitle } from "./components/Subtitle";
import { ColorGrade } from "./components/ColorGrade";

// Subtitle timeline at 30fps — total 18s = 540 frames
const SUBTITLES = [
  { text: "السلام عليكم",                           start: 15,  end: 75,  highlight: true  },
  { text: "معكم أبو بكر",                            start: 75,  end: 145, highlight: false },
  { text: "من شركة روندا التجارية",                  start: 145, end: 240, highlight: false },
  { text: "في الصين، مدينة فوشان",                   start: 240, end: 330, highlight: false },
  { text: "سنأخذكم لأكبر مصنع مطابخ في العالم",      start: 330, end: 460, highlight: false },
  { text: "تابعونا! 🔔",                             start: 460, end: 540, highlight: true  },
];

// ── Top branding bar ────────────────────────────────────────────────────────
const BrandingBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scaleX = spring({ frame, fps, config: { damping: 14, stiffness: 160 }, from: 0, to: 1 });

  return (
    <div
      style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: 90,
        background: "linear-gradient(180deg, rgba(0,0,0,0.78) 0%, transparent 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 16,
        transform: `scaleX(${scaleX})`,
        transformOrigin: "center top",
      }}
    >
      <div style={{ fontFamily, fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: 2, direction: "rtl", textShadow: "0 2px 12px rgba(0,0,0,0.8)", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ background: "linear-gradient(135deg,#cc0000,#ff4444)", padding: "4px 14px", borderRadius: 8, fontSize: 22 }}>روندا</span>
        <span style={{ fontSize: 20, opacity: 0.9 }}>للتجارة العالمية</span>
      </div>
    </div>
  );
};

// ── China accent line ────────────────────────────────────────────────────────
const AccentLine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scaleX = spring({ frame, fps, config: { damping: 14, stiffness: 160 }, from: 0, to: 1 });
  return (
    <div style={{ position: "absolute", top: 90, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#cc0000,#ffde00,#cc0000)", transform: `scaleX(${scaleX})`, transformOrigin: "center" }} />
  );
};

// ── City badge ───────────────────────────────────────────────────────────────
const CityBadge: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 15, 75, 90], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const translateX = interpolate(frame, [0, 15], [60, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div style={{ position: "absolute", top: 110, right: 20, background: "linear-gradient(135deg,#cc0000,#880000)", borderRadius: 12, padding: "8px 16px", opacity, transform: `translateX(${translateX}px)` }}>
      <div style={{ color: "#fff", fontFamily, fontSize: 22, fontWeight: 700, direction: "rtl", textAlign: "center" }}>
        🇨🇳 فوشان، الصين
      </div>
    </div>
  );
};

// ── Final CTA overlay ────────────────────────────────────────────────────────
const CtaOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 15, 65, 80], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const scale = spring({ frame, fps, config: { damping: 12, stiffness: 200 }, from: 0.5, to: 1 });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ opacity, transform: `scale(${scale})`, background: "linear-gradient(135deg,rgba(200,0,0,0.92),rgba(100,0,0,0.92))", borderRadius: 24, padding: "20px 50px", textAlign: "center", border: "2px solid rgba(255,100,100,0.6)" }}>
        <div style={{ color: "#fff", fontFamily, fontSize: 52, fontWeight: 900, direction: "rtl" }}>تابعونا 🔔</div>
        <div style={{ color: "rgba(255,220,220,0.9)", fontFamily, fontSize: 24, marginTop: 6, direction: "rtl" }}>روندا التجارية — الصين</div>
      </div>
    </AbsoluteFill>
  );
};

// ── Main composition ─────────────────────────────────────────────────────────
export const RondaAd: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const entryOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Very subtle organic scale to give liveliness (no CSS transition)
  const gestureScale = interpolate(
    Math.sin((frame * Math.PI) / 45),
    [-1, 1],
    [1.0, 1.004]
  );

  const isSpeaking = SUBTITLES.some((s) => frame >= s.start && frame <= s.end);

  return (
    <ColorGrade>
      <AbsoluteFill style={{ background: "#000", opacity: entryOpacity }}>

        {/* Background image — unchanged scene */}
        <AbsoluteFill>
          <Img
            src={staticFile("abu-bakr.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              transform: `scale(${gestureScale})`,
              // Color correction via CSS filter (not transition — applied per frame)
              filter: "brightness(1.08) contrast(1.05) saturate(1.10)",
              transformOrigin: "center center",
            }}
          />
        </AbsoluteFill>

        {/* Bottom readability gradient */}
        <AbsoluteFill style={{ background: "linear-gradient(0deg,rgba(0,0,0,0.80) 0%,rgba(0,0,0,0.40) 35%,transparent 60%)", pointerEvents: "none" }} />

        {/* Branding bar */}
        <Sequence from={5}>
          <BrandingBar />
        </Sequence>

        {/* China accent line */}
        <Sequence from={5}>
          <AccentLine />
        </Sequence>

        {/* City badge — shown during "في الصين" subtitle */}
        <Sequence from={240} durationInFrames={90}>
          <CityBadge />
        </Sequence>

        {/* Speech wave visualizer */}
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 210 }}>
          <SpeechWave isActive={isSpeaking} />
        </AbsoluteFill>

        {/* Subtitles */}
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 60 }}>
          {SUBTITLES.map((s) => (
            <Subtitle
              key={s.text}
              text={s.text}
              startFrame={s.start}
              endFrame={s.end}
              highlight={s.highlight}
            />
          ))}
        </AbsoluteFill>

        {/* Final CTA */}
        <Sequence from={460} durationInFrames={80}>
          <CtaOverlay />
        </Sequence>

      </AbsoluteFill>
    </ColorGrade>
  );
};
