import { useEffect, useRef } from "react";

const STEPS = 16;
const FIXED = 1 / 60;
const MAX_DOTS = 8000;
const RESIZE_DEBOUNCE_MS = 100;

const srOnly = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  padding: 0,
  border: 0,
  overflow: "hidden",
  whiteSpace: "nowrap",
  clipPath: "inset(50%)",
};

function parseColor(value) {
  if (!value) return [20, 20, 25];
  // Support hex (#ff6b35)
  if (value.startsWith("#")) {
    let hex = value.slice(1);
    if (hex.length === 3) {
      hex = hex.split("").map((c) => c + c).join("");
    }
    const num = parseInt(hex, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }
  // Support rgb(r, g, b)
  const found = value.match(/-?\d+(\.\d+)?/g);
  if (!found || found.length < 3) return [20, 20, 25];
  return [Number(found[0]), Number(found[1]), Number(found[2])];
}

function buildRamp(from, to) {
  const ramp = [];
  for (let i = 0; i < STEPS; i++) {
    const t = i / (STEPS - 1);
    const r = Math.round(from[0] + (to[0] - from[0]) * t);
    const g = Math.round(from[1] + (to[1] - from[1]) * t);
    const b = Math.round(from[2] + (to[2] - from[2]) * t);
    ramp.push(`rgb(${r}, ${g}, ${b})`);
  }
  return ramp;
}

export default function ScatterGrid({
  text = "RIZEWORLD\nGRAPHIC PORTFOLIO",
  tag = "h1",
  fontFamily = '"Anton", "Outfit", sans-serif',
  fontWeight = "400",
  fontStyle = "normal",
  fontSize,
  letterSpacing = "-0.02em",
  fit = true,
  dotSize = 4,
  dotGap = 2,
  radius = 160,
  strength = 2.2,
  stiffness = 0.015,
  damping = 0.88,
  bleed = 40,
  breathe = true,
  accent = "rgb(255, 107, 53)",
  base = "#ffffff",
  style,
  className,
}) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const minStep = Math.max(2, dotSize + dotGap);
    let step = minStep;
    let dots = [];
    let ripples = [];
    let width = 0;
    let height = 0;
    let ramp = buildRamp(parseColor(base), parseColor(accent));
    let pointerX = -9999;
    let pointerY = -9999;
    let frame = 0;
    let raf = 0;
    let last = 0;
    let acc = 0;
    let clock = 0;
    let paused = false;

    function build() {
      const rect = host.getBoundingClientRect();
      const boxW = Math.max(1, Math.round(rect.width));
      const boxH = Math.max(1, Math.round(rect.height));
      width = boxW + bleed * 2;
      height = boxH + bleed * 2;

      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      canvas.style.left = -bleed + "px";
      canvas.style.top = -bleed + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const mask = document.createElement("canvas");
      mask.width = width;
      mask.height = height;
      const mctx = mask.getContext("2d", { willReadFrequently: true });
      if (!mctx) return;

      const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
      const lineCount = Math.max(1, lines.length);

      let chosen = fontSize || (lineCount > 1 ? boxH * 0.42 : boxH * 0.85);

      const fontString = (px) => `${fontStyle} ${fontWeight} ${px}px ${fontFamily}`;

      let size = chosen;
      mctx.font = fontString(size);

      if (fit) {
        // Measure widest line to fit width
        let maxLineW = 0;
        lines.forEach((l) => {
          const w = mctx.measureText(l).width;
          if (w > maxLineW) maxLineW = w;
        });

        if (maxLineW > 0) {
          const fitWidthSize = size * ((boxW * 0.94) / maxLineW);
          const fitHeightSize = (boxH * 0.9) / (lineCount * 1.15);
          size = Math.min(size, fitWidthSize, fitHeightSize);
          mctx.font = fontString(size);
        }
      }

      mctx.textAlign = "center";
      mctx.textBaseline = "middle";
      mctx.fillStyle = "#000000";

      const lineHeight = size * 1.08;
      const totalTextH = lineCount * lineHeight;
      const startY = (height - totalTextH) / 2 + lineHeight / 2;

      lines.forEach((line, idx) => {
        mctx.fillText(line, width / 2, startY + idx * lineHeight);
      });

      const data = mctx.getImageData(0, 0, width, height).data;

      const countAt = (s) => {
        let n = 0;
        const half = s / 2;
        for (let y = half; y < height; y += s) {
          for (let x = half; x < width; x += s) {
            const px = (Math.round(y) * width + Math.round(x)) * 4;
            if (data[px + 3] > 128) n++;
          }
        }
        return n;
      };

      step = minStep;
      let count = countAt(step);
      let guard = 0;
      while (count > MAX_DOTS && guard < 20) {
        step *= 1.15;
        count = countAt(step);
        guard++;
      }

      const next = [];
      const half = step / 2;
      for (let y = half; y < height; y += step) {
        for (let x = half; x < width; x += step) {
          const px = (Math.round(y) * width + Math.round(x)) * 4;
          if (data[px + 3] > 128) {
            next.push({ hx: x, hy: y, x, y, vx: 0, vy: 0 });
          }
        }
      }
      dots = next;
    }

    function simulate() {
      const r2 = radius * radius;
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const dx = d.x - pointerX;
        const dy = d.y - pointerY;
        const dist2 = dx * dx + dy * dy;

        // Push dots away from pointer
        if (dist2 < r2 && dist2 > 0.5) {
          const dist = Math.sqrt(dist2);
          const f = (1 - dist / radius) * strength;
          d.vx += (dx / dist) * f;
          d.vy += (dy / dist) * f;
        }

        // Ripple shockwaves from clicks/taps
        for (let j = 0; j < ripples.length; j++) {
          const rp = ripples[j];
          const rx = d.x - rp.x;
          const ry = d.y - rp.y;
          const rd = Math.sqrt(rx * rx + ry * ry) || 1;
          const band = Math.abs(rd - rp.r);
          if (band < 30) {
            const f = (1 - band / 30) * 2.8;
            d.vx += (rx / rd) * f;
            d.vy += (ry / rd) * f;
          }
        }

        // Spring return to home position
        d.vx += (d.hx - d.x) * stiffness;
        d.vy += (d.hy - d.y) * stiffness;
        d.vx *= damping;
        d.vy *= damping;
        d.x += d.vx;
        d.y += d.vy;
      }

      // Grow ripples
      for (let j = ripples.length - 1; j >= 0; j--) {
        ripples[j].r += 16;
        if (ripples[j].r > Math.max(width, height) * 1.3) {
          ripples.splice(j, 1);
        }
      }
    }

    function paint() {
      ctx.clearRect(0, 0, width, height);
      const wave = breathe && !reduced;

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const ox = d.x - d.hx;
        const oy = d.y - d.hy;
        const disp = Math.sqrt(ox * ox + oy * oy);
        let level = Math.min(1, disp / 26);
        let lift = 0;

        if (wave) {
          const s = Math.sin(d.hx * 0.012 - clock * 1.8);
          lift = s * 1.5;
          level = Math.max(level, Math.max(0, s - 0.84) * 3.4);
        }

        const idx = Math.min(STEPS - 1, Math.max(0, Math.round(level * (STEPS - 1))));
        ctx.fillStyle = ramp[idx];
        ctx.fillRect(
          Math.round(d.x - dotSize / 2),
          Math.round(d.y + lift - dotSize / 2),
          dotSize,
          dotSize
        );
      }
    }

    function loop(now) {
      if (paused) {
        last = 0;
        raf = requestAnimationFrame(loop);
        return;
      }

      const dt = last ? Math.min(0.05, (now - last) / 1000) : FIXED;
      last = now;
      clock += dt;
      acc += dt;

      let guard = 0;
      while (acc >= FIXED && guard < 5) {
        simulate();
        acc -= FIXED;
        guard++;
      }

      frame++;
      paint();
      raf = requestAnimationFrame(loop);
    }

    function onPointerMove(event) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (x >= -60 && x <= width + 60 && y >= -60 && y <= height + 60) {
        pointerX = x;
        pointerY = y;
      } else {
        pointerX = -9999;
        pointerY = -9999;
      }
    }

    function onPointerLeave() {
      pointerX = -9999;
      pointerY = -9999;
    }

    function onPointerDown(event) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (x >= -40 && x <= width + 40 && y >= -40 && y <= height + 40) {
        if (ripples.length > 3) ripples.shift();
        ripples.push({ x, y, r: 0 });
      }
    }

    build();
    paint();

    let resizeTimer = 0;
    const observer = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        build();
        paint();
      }, RESIZE_DEBOUNCE_MS);
    });
    observer.observe(host);

    const intersectionObserver =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            (entries) => {
              paused = !entries[0]?.isIntersecting;
            },
            { threshold: 0 }
          )
        : null;
    intersectionObserver?.observe(host);

    function onVisibilityChange() {
      if (document.hidden) {
        paused = true;
      } else if (!intersectionObserver || host.getBoundingClientRect().bottom > 0) {
        paused = false;
      }
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    if (document.fonts) {
      document.fonts.ready.then(() => {
        build();
        paint();
      });
    }

    if (!reduced) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerdown", onPointerDown, { passive: true });
      host.addEventListener("pointerleave", onPointerLeave);
      raf = requestAnimationFrame(loop);
    }

    return () => {
      observer.disconnect();
      intersectionObserver?.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.clearTimeout(resizeTimer);
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      host.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [
    text,
    fontFamily,
    fontWeight,
    fontStyle,
    fontSize,
    letterSpacing,
    fit,
    dotSize,
    dotGap,
    radius,
    strength,
    stiffness,
    damping,
    bleed,
    breathe,
    accent,
    base,
  ]);

  const Tag = tag || "h1";

  return (
    <div
      ref={hostRef}
      className={`scattergrid-host ${className || ""}`}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "visible",
        ...style,
      }}
    >
      <Tag style={srOnly}>{text}</Tag>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          display: "block",
          position: "absolute",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
