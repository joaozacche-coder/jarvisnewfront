"use client";

import { useEffect, useRef } from "react";

const SIDEBAR_W    = 52;      // px — must match Sidebar width
const ORB_TOP      = 0.11;    // 11vh
const ORB_SIZE_VH  = 0.52;    // 52vh
const ORB_SIZE_MAX = 520;     // px cap

interface P {
  x: number; y: number;
  size: number;
  baseOpacity: number; opacity: number;
  twinkleSpeed: number; twinkleOffset: number;
  dx: number; dy: number;
  sphere: boolean;
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    /* Orb geometry — mirrors the CSS layout exactly */
    const getOrb = () => {
      const size = Math.min(canvas.height * ORB_SIZE_VH, ORB_SIZE_MAX);
      return {
        cx: SIDEBAR_W + (canvas.width - SIDEBAR_W) / 2,
        cy: canvas.height * ORB_TOP + size / 2,
        r:  size / 2,
      };
    };

    const build = (): P[] => {
      const { cx, cy, r } = getOrb();
      const list: P[] = [];

      /* ── Sphere particles (purple cluster) ── */
      for (let i = 0; i < 260; i++) {
        const angle = Math.random() * Math.PI * 2;
        // sqrt for uniform disk distribution — slightly denser at edge
        const rad   = Math.pow(Math.random(), 0.65) * r * 0.88;
        const bright = Math.random() > 0.75;
        const size  = bright ? 1.1 + Math.random() * 0.9 : 0.4 + Math.random() * 0.65;
        const base  = bright ? 0.30 + Math.random() * 0.30 : 0.08 + Math.random() * 0.18;
        list.push({
          x: cx + Math.cos(angle) * rad,
          y: cy + Math.sin(angle) * rad,
          size, baseOpacity: base, opacity: base,
          twinkleSpeed:  0.4 + Math.random() * 1.4,
          twinkleOffset: Math.random() * Math.PI * 2,
          dx: (Math.random() - 0.5) * 0.14,
          dy: (Math.random() - 0.5) * 0.14,
          sphere: true,
        });
      }

      /* ── Background stars ── */
      for (let i = 0; i < 80; i++) {
        const bright = Math.random() > 0.85;
        const size  = bright ? 1.2 + Math.random() * 0.7 : 0.3 + Math.random() * 0.45;
        const base  = bright ? 0.14 + Math.random() * 0.12 : 0.03 + Math.random() * 0.05;
        list.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size, baseOpacity: base, opacity: base,
          twinkleSpeed:  0.2 + Math.random() * 0.7,
          twinkleOffset: Math.random() * Math.PI * 2,
          dx: (Math.random() - 0.5) * 0.028,
          dy: (Math.random() - 0.5) * 0.028,
          sphere: false,
        });
      }

      return list;
    };

    let particles = build();
    let animId: number;
    const start = performance.now();

    const draw = (now: number) => {
      const t = (now - start) * 0.001;
      const { cx, cy, r } = getOrb();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.dx;
        p.y += p.dy;

        if (p.sphere) {
          /* Keep inside sphere — respawn at center-ish area when escaping */
          const dist = Math.hypot(p.x - cx, p.y - cy);
          if (dist > r * 0.9) {
            const a2   = Math.random() * Math.PI * 2;
            const rad2 = Math.random() * r * 0.35;
            p.x = cx + Math.cos(a2) * rad2;
            p.y = cy + Math.sin(a2) * rad2;
          }
          p.opacity = p.baseOpacity + Math.sin(t * p.twinkleSpeed + p.twinkleOffset) * p.baseOpacity * 0.55;

          /* Colour: lavender-white at center → deep violet at edge */
          const ratio = Math.hypot(p.x - cx, p.y - cy) / r;
          const rCh = Math.round(180 + (100 - 180) * ratio);   // 180 → 100
          const gCh = Math.round(170 + (80  - 170) * ratio);   // 170 → 80
          const bCh = 255;
          /* Fade out near boundary */
          const fade = ratio > 0.78 ? Math.max(0, 1 - (ratio - 0.78) / 0.12) : 1;
          ctx.fillStyle = `rgba(${rCh},${gCh},${bCh},${p.opacity * fade})`;
        } else {
          /* Stars wrap around screen */
          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width)  p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;
          p.opacity = p.baseOpacity + Math.sin(t * p.twinkleSpeed + p.twinkleOffset) * p.baseOpacity * 0.45;
          ctx.fillStyle = `rgba(195,210,255,${p.opacity})`;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    const onResize = () => { resize(); particles = build(); };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
