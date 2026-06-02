import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img,
  staticFile,
  Audio,
} from "remotion";
import { SpeechWave } from "./components/SpeechWave";
import { Subtitle } from "./components/Subtitle";
import { ColorGrade } from "./components/ColorGrade";

// Subtitle timeline (at 30fps)
// Total: 18 seconds = 540 frames
const SUBTITLES = [
  { text: "السلام عليكم", start: 15,  end: 75,  highlight: true },
  { text: "معكم أبو بكر", start: 75,  end: 145, highlight: false },
  { text: "من شركة روندا التجارية", start: 145, end: 240, highlight: false },
  { text: "في الصين، مدينة فوشان", start: 240, end: 330, highlight: false },
  { text: "سنأخذكم لأكبر مصنع مطابخ في العالم", start: 330, end: 460, highlight: false },
  { text: "تابعونا! 🔔", start: 460, end: 540, highlight: true },
];

export const RondaAd: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // Overall entry animation
  const entryOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Logo pulse
  const logoPulse = spring({
    frame: frame - 5,
    fps,
    config: { damping: 12, stiffness: 180 },
    from: 0,
    to: 1,
  });

  // Speaking indicator — active when subtitles are showing
  const isSpeaking = SUBTITLES.some(
    (s) => frame >= s.start && frame <= s.end
  );

  // Hand gesture animation (subtle scale on person for liveliness)
  const gestureScale = interpolate(
    Math.sin((frame * Math.PI) / 45),
    [-1, 1],
    [1.0, 1.004]
  );

  const currentSubtitle = SUBTITLES.find(
    (s) => frame >= s.start && frame <= s.end
  );

  // Subtle image brightness correction
  const imgBrightness = 1.08;
  const imgContrast = 1.05;
  const imgSaturation = 1.1;

  return (
    <ColorGrade>
      <div
        style={{
          width,
          height,
          position: "relative",
          overflow: "hidden",
          background: "#000",
          opacity: entryOpacity,
        }}
      >
        {/* Background image — UNCHANGED scene, fills entire frame */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Img
            src={staticFile("abu-bakr.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              transform: `scale(${gestureScale})`,
              filter: `brightness(${imgBrightness}) contrast(${imgContrast}) saturate(${imgSaturation})`,
              transformOrigin: "center center",
            }}
          />
        </div>

        {/* Top bar — branding */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 90,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, transparent 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 16,
            transform: `scaleX(${logoPulse})`,
            transformOrigin: "center top",
          }}
        >
          <div
            style={{
              fontFamily: "'Cairo', 'Arial', sans-serif",
              fontSize: 28,
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: 2,
              direction: "rtl",
              textShadow: "0 2px 12px rgba(0,0,0,0.8)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              style={{
                background: "linear-gradient(135deg, #cc0000, #ff4444)",
                padding: "4px 14px",
                borderRadius: 8,
                fontSize: 22,
              }}
            >
              روندا
            </span>
            <span style={{ fontSize: 20, opacity: 0.9 }}>
              للتجارة العالمية
            </span>
          </div>
        </div>

        {/* China flag accent line */}
        <div
          style={{
            position: "absolute",
            top: 90,
            left: 0,
            right: 0,
            height: 3,
            background: "linear-gradient(90deg, #cc0000, #ffde00, #cc0000)",
            opacity: logoPulse,
          }}
        />

        {/* Speaking wave — positioned at mouth level of the person */}
        <div
          style={{
            position: "absolute",
            bottom: 200,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 12,
          }}
        >
          <SpeechWave isActive={isSpeaking} />
        </div>

        {/* Subtitle area */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0 20px 20px",
            gap: 8,
          }}
        >
          {SUBTITLES.map((s) => (
            <Subtitle
              key={s.text}
              text={s.text}
              startFrame={s.start}
              endFrame={s.end}
              highlight={s.highlight}
            />
          ))}
        </div>

        {/* Bottom gradient for subtitle readability */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 280,
            background:
              "linear-gradient(0deg, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.40) 60%, transparent 100%)",
            pointerEvents: "none",
          }}
        />

        {/* "فوشان - الصين" city badge */}
        {frame >= 240 && frame <= 330 && (
          <div
            style={{
              position: "absolute",
              top: 110,
              right: 20,
              background: "linear-gradient(135deg, #cc0000 0%, #880000 100%)",
              borderRadius: 12,
              padding: "8px 16px",
              opacity: interpolate(frame, [240, 255, 320, 330], [0, 1, 1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              transform: `translateX(${interpolate(
                frame,
                [240, 255],
                [60, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              )}px)`,
            }}
          >
            <div
              style={{
                color: "#fff",
                fontFamily: "'Cairo', Arial, sans-serif",
                fontSize: 22,
                fontWeight: 700,
                direction: "rtl",
                textAlign: "center",
              }}
            >
              🇨🇳 فوشان، الصين
            </div>
          </div>
        )}

        {/* "Follow" CTA at the end */}
        {frame >= 460 && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) scale(${spring({
                frame: frame - 460,
                fps,
                config: { damping: 12, stiffness: 200 },
                from: 0.5,
                to: 1,
              })})`,
              background:
                "linear-gradient(135deg, rgba(200,0,0,0.92), rgba(100,0,0,0.92))",
              borderRadius: 24,
              padding: "20px 50px",
              textAlign: "center",
              border: "2px solid rgba(255,100,100,0.6)",
              opacity: interpolate(frame, [460, 475, 530, 540], [0, 1, 1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <div
              style={{
                color: "#fff",
                fontFamily: "'Cairo', Arial, sans-serif",
                fontSize: 52,
                fontWeight: 900,
                direction: "rtl",
              }}
            >
              تابعونا 🔔
            </div>
            <div
              style={{
                color: "rgba(255,220,220,0.9)",
                fontFamily: "'Cairo', Arial, sans-serif",
                fontSize: 24,
                marginTop: 6,
                direction: "rtl",
              }}
            >
              روندا التجارية — الصين
            </div>
          </div>
        )}
      </div>
    </ColorGrade>
  );
};
