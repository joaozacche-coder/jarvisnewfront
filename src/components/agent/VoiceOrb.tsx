"use client";

import { useState, useMemo, useCallback } from "react";
import { Mic, Volume2, Square } from "lucide-react";

type OrbState = "idle" | "listening" | "speaking";

const WAVE_COUNT = 26;

export default function VoiceOrb() {
  const [state, setState] = useState<OrbState>("idle");
  const [transcript, setTranscript] = useState("");

  /* Pre-computed stable wave bar data to avoid flicker on re-renders */
  const waveBars = useMemo(
    () =>
      Array.from({ length: WAVE_COUNT }, (_, i) => ({
        duration: 0.38 + ((i * 17) % 7) * 0.06,
        delay: i * 0.038,
        opacity: 0.45 + ((i * 13) % 10) * 0.055,
      })),
    []
  );

  const handleClick = useCallback(() => {
    if (state === "idle") {
      setState("listening");
      setTranscript("Ouvindo...");
      setTimeout(() => {
        setState("speaking");
        setTranscript("Entendido. Estou processando sua solicitação...");
        setTimeout(() => {
          setState("idle");
          setTranscript("");
        }, 3200);
      }, 2600);
    } else {
      setState("idle");
      setTranscript("");
    }
  }, [state]);

  const orbAnimation =
    state === "idle"
      ? "orb-idle 3s ease-in-out infinite"
      : state === "listening"
      ? "orb-listening 1.1s ease-in-out infinite"
      : "orb-speaking 0.38s ease-in-out infinite";

  const orbGlow =
    state === "idle"
      ? "0 0 40px rgba(124,106,247,0.28), 0 0 80px rgba(124,106,247,0.1), inset 0 0 24px rgba(124,106,247,0.12)"
      : state === "listening"
      ? "0 0 60px rgba(124,106,247,0.65), 0 0 120px rgba(124,106,247,0.32), inset 0 0 32px rgba(124,106,247,0.18)"
      : "0 0 52px rgba(124,106,247,0.55), 0 0 104px rgba(124,106,247,0.25), inset 0 0 28px rgba(124,106,247,0.15)";

  const orbBg =
    state === "idle"
      ? "radial-gradient(circle at 38% 32%, #B4A8FF 0%, #7C6AF7 48%, #4E3FD4 100%)"
      : state === "listening"
      ? "radial-gradient(circle at 38% 32%, #CEC8FF 0%, #8B7BFF 48%, #5B4ED8 100%)"
      : "radial-gradient(circle at 38% 32%, #B4A8FF 0%, #7C6AF7 45%, #3D31C0 100%)";

  const ringVisible = state !== "idle";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "36px",
      }}
    >
      {/* ── Orb + rings ── */}
      <div
        style={{
          position: "relative",
          width: "160px",
          height: "160px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Pulse rings */}
        {ringVisible && (
          <>
            <span
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "1px solid rgba(124,106,247,0.35)",
                animation: "orb-ring 2.2s ease-out infinite",
              }}
            />
            <span
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "1px solid rgba(124,106,247,0.2)",
                animation: "orb-ring 2.2s ease-out infinite 0.75s",
              }}
            />
            <span
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "1px solid rgba(124,106,247,0.1)",
                animation: "orb-ring 2.2s ease-out infinite 1.5s",
              }}
            />
          </>
        )}

        {/* Main orb button */}
        <button
          onClick={handleClick}
          title={state === "idle" ? "Falar com JARVIS" : "Parar"}
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            position: "relative",
            zIndex: 2,
            background: orbBg,
            boxShadow: orbGlow,
            animation: orbAnimation,
            transition: "box-shadow 0.3s ease",
            outline: "none",
          }}
        >
          {/* Specular highlight */}
          <span
            style={{
              position: "absolute",
              top: "16%",
              left: "22%",
              width: "28%",
              height: "28%",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255,255,255,0.45) 0%, transparent 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Icon */}
          <span
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {state === "idle" && (
              <Mic
                size={30}
                color="rgba(255,255,255,0.92)"
                strokeWidth={1.5}
              />
            )}

            {state === "listening" && (
              <WaveBars bars={waveBars} />
            )}

            {state === "speaking" && (
              <Volume2
                size={30}
                color="rgba(255,255,255,0.92)"
                strokeWidth={1.5}
              />
            )}
          </span>
        </button>
      </div>

      {/* ── Status text ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          textAlign: "center",
        }}
      >
        <StatusLabel state={state} />

        {transcript && (
          <p
            className="animate-fade-in-up"
            style={{
              fontSize: "14.5px",
              color: "var(--text-primary)",
              maxWidth: "320px",
              lineHeight: 1.55,
            }}
          >
            {transcript}
          </p>
        )}

        {state !== "idle" && (
          <button
            onClick={handleClick}
            style={{
              marginTop: "4px",
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "5px 12px",
              borderRadius: "20px",
              border: "1px solid rgba(248,113,113,0.25)",
              background: "rgba(248,113,113,0.07)",
              color: "var(--danger)",
              fontSize: "12px",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s ease",
            }}
          >
            <Square size={10} fill="currentColor" />
            Parar
          </button>
        )}
      </div>

      {/* ── Speaking waveform ── */}
      {state === "speaking" && (
        <div
          className="animate-fade-in"
          style={{
            display: "flex",
            gap: "3px",
            alignItems: "center",
            height: "36px",
          }}
        >
          {waveBars.map((bar, i) => (
            <div
              key={i}
              style={{
                width: "3px",
                height: "100%",
                borderRadius: "2px",
                background: `rgba(124,106,247,${bar.opacity})`,
                transformOrigin: "center",
                animation: `wave-bar ${bar.duration}s ease-in-out infinite ${bar.delay}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Animated wave bars (listening state icon) ── */
function WaveBars({
  bars,
}: {
  bars: { duration: number; delay: number; opacity: number }[];
}) {
  const innerBars = bars.slice(0, 5);
  return (
    <div
      style={{
        display: "flex",
        gap: "3px",
        alignItems: "center",
        height: "28px",
      }}
    >
      {innerBars.map((bar, i) => (
        <div
          key={i}
          style={{
            width: "3px",
            height: "100%",
            borderRadius: "2px",
            background: "rgba(255,255,255,0.9)",
            transformOrigin: "center",
            animation: `wave-bar ${bar.duration}s ease-in-out infinite ${bar.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Status label with animated dot ── */
function StatusLabel({ state }: { state: OrbState }) {
  const dotColor =
    state === "idle"
      ? "transparent"
      : state === "listening"
      ? "var(--accent)"
      : "var(--success)";

  const label =
    state === "idle"
      ? "Clique para falar com JARVIS"
      : state === "listening"
      ? "Ouvindo você..."
      : "Processando resposta...";

  const textColor =
    state === "idle" ? "var(--text-secondary)" : "var(--text-primary)";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "7px",
      }}
    >
      {state !== "idle" && (
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: dotColor,
            animation: "pulse-dot 1.2s ease-in-out infinite",
            flexShrink: 0,
          }}
        />
      )}
      <span
        style={{
          fontSize: "13px",
          color: textColor,
          fontWeight: state !== "idle" ? 500 : 400,
          transition: "color 0.25s ease",
        }}
      >
        {label}
      </span>
    </div>
  );
}
