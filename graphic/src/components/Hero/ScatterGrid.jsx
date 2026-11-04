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
  text = "RIZE WORLD\nGRAPHIC PORTFOLIO",
  tag = "h1",
  fontFamily = '"Anton", "Outfit", sans-serif',
  fontWeight = "400",
  fontStyle = "normal",
  fontSize,
  letterSpacing,
  wordGap,
  lineHeightRatio,
  fit = true,
  dotSize = 4,
  dotGap = 2,
  adaptive = true,
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

    let activeDotSize = dotSize;
    let activeDotGap = dotGap;
    let activeRadius = radius;
    let isMobile = false;

    let step = Math.max(2, dotSize + dotGap);
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

      isMobile = boxW < 600;
      const isTablet = boxW >= 600 && boxW < 1024;

      // ========================================================
      // ADAPTIVE MOBILE DOT SIZE & DENSITY ENGINE
      // ========================================================
      // Dynamically adapts dot size and gap according to screen width.
      // On mobile screens (<600px), standard 4px dots cause severe
      // letter clipping and stroke dropouts. Adaptive micro-dots (2.0px-2.4px)
      // deliver ultra-sharp typography and smooth fluid physics.
      if (adaptive) {
        if (boxW < 380) {
          activeDotSize = 2.0;
          activeDotGap = 1.0;
        } else if (boxW < 520) {
          activeDotSize = 2.2;
          activeDotGap = 1.1;
        } else if (boxW < 768) {
          activeDotSize = 2.8;
          activeDotGap = 1.4;
        } else if (boxW < 1024) {
          activeDotSize = 3.3;
          activeDotGap = 1.6;
        } else {
          activeDotSize = dotSize;
          activeDotGap = dotGap;
        }
      } else {
        activeDotSize = dotSize;
        activeDotGap = dotGap;
      }

      // Proportional interaction radius
      if (isMobile) {
        activeRadius = Math.min(radius, Math.max(65, Math.round(boxW * 0.24)));
      } else if (isTablet) {
        activeRadius = Math.min(radius, Math.max(110, Math.round(boxW * 0.22)));
      } else {
        activeRadius = radius;
      }

      const currentBleed = isMobile ? Math.min(bleed, 30) : bleed;
      width = boxW + currentBleed * 2;
      height = boxH + currentBleed * 2;

      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      canvas.style.left = -currentBleed + "px";
      canvas.style.top = -currentBleed + "px";
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

      // Letter spacing: subtle positive spacing so individual letters don't collide
      const activeLetterSpacing =
        letterSpacing !== undefined
          ? letterSpacing
          : isMobile
          ? "0.035em"
          : "0.015em";

      if ("letterSpacing" in mctx) {
        mctx.letterSpacing = activeLetterSpacing;
      }

      // Dynamic word gap calculator: precisely separates words (e.g. "RIZE" & "WORLD", "GRAPHIC" & "PORTFOLIO")
      const getLineWidth = (lineStr, currentWordGap) => {
        const words = lineStr.split(/\s+/).filter(Boolean);
        if (words.length <= 1) {
          return mctx.measureText(lineStr).width;
        }
        let total = 0;
        words.forEach((w) => {
          total += mctx.measureText(w).width;
        });
        total += (words.length - 1) * currentWordGap;
        return total;
      };

      if (fit) {
        // Measure widest line to fit width with safe mobile margins
        const gapRatio = isMobile ? 0.65 : 0.45;
        let maxLineW = 0;
        lines.forEach((l) => {
          const w = getLineWidth(l, size * gapRatio);
          if (w > maxLineW) maxLineW = w;
        });

        if (maxLineW > 0) {
          const fitMargin = boxW < 520 ? 0.88 : 0.94;
          const fitWidthSize = size * ((boxW * fitMargin) / maxLineW);
          const activeLineRatio =
            lineHeightRatio !== undefined
              ? lineHeightRatio
              : isMobile
              ? 1.38
              : 1.24;
          const fitHeightSize = (boxH * 0.86) / (lineCount * activeLineRatio);
          size = Math.min(size, fitWidthSize, fitHeightSize);
          mctx.font = fontString(size);
          if ("letterSpacing" in mctx) {
            mctx.letterSpacing = activeLetterSpacing;
          }
        }
      }

      // Responsive word gap: distinctly separates words with clear breathing room
      const activeWordGap =
        wordGap !== undefined
          ? wordGap
          : Math.max(
              isMobile ? 22 : 28,
              Math.round(size * (isMobile ? 0.65 : 0.45))
            );

      // Responsive line height: creates clean vertical space between line 1 and line 2
      const activeLineHeight =
        size *
        (lineHeightRatio !== undefined
          ? lineHeightRatio
          : isMobile
          ? 1.38
          : 1.24);

      mctx.textAlign = "center";
      mctx.textBaseline = "middle";
      mctx.fillStyle = "#000000";

      const totalTextH = lineCount * activeLineHeight;
      const startY = (height - totalTextH) / 2 + activeLineHeight / 2;

      lines.forEach((line, idx) => {
        const y = startY + idx * activeLineHeight;
        const words = line.split(/\s+/).filter(Boolean);

        if (words.length <= 1) {
          mctx.fillText(line, width / 2, y);
        } else {
          // Render each word individually with explicit, generous gap
          const wordWidths = words.map((w) => mctx.measureText(w).width);
          const totalLineW =
            wordWidths.reduce((a, b) => a + b, 0) +
            (words.length - 1) * activeWordGap;
          let startX = width / 2 - totalLineW / 2;

          words.forEach((w, i) => {
            const wWidth = wordWidths[i];
            mctx.fillText(w, startX + wWidth / 2, y);
            startX += wWidth + activeWordGap;
          });
        }
      });

      const data = mctx.getImageData(0, 0, width, height).data;

      const countAt = (s) => {
        let n = 0;
        const half = s / 2;
        for (let y = half; y < height; y += s) {
          for (let x = half; x < width; x += s) {
            const px = (Math.round(y) * width + Math.round(x)) * 4;
            if (data[px + 3] > 90) n++;
          }
        }
        return n;
      };

      const minStep = Math.max(2, activeDotSize + activeDotGap);
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
          if (data[px + 3] > 90) {
            next.push({ hx: x, hy: y, x, y, vx: 0, vy: 0 });
          }
        }
      }
      dots = next;
    }

    function simulate() {
      const r2 = activeRadius * activeRadius;
      const currentStrength = isMobile ? Math.min(strength, 2.0) : strength;
      const rippleBand = isMobile ? 22 : 30;
      const rippleForce = isMobile ? 2.0 : 2.8;

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const dx = d.x - pointerX;
        const dy = d.y - pointerY;
        const dist2 = dx * dx + dy * dy;

        // Push dots away from pointer
        if (dist2 < r2 && dist2 > 0.5) {
          const dist = Math.sqrt(dist2);
          const f = (1 - dist / activeRadius) * currentStrength;
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
          if (band < rippleBand) {
            const f = (1 - band / rippleBand) * rippleForce;
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
      const rippleSpeed = isMobile ? 12 : 16;
      for (let j = ripples.length - 1; j >= 0; j--) {
        ripples[j].r += rippleSpeed;
        if (ripples[j].r > Math.max(width, height) * 1.3) {
          ripples.splice(j, 1);
        }
      }
    }

    function paint() {
      ctx.clearRect(0, 0, width, height);
      const wave = breathe && !reduced;

      const freqX = isMobile ? 0.018 : 0.012;
      const freqY = isMobile ? 0.024 : 0.016;
      const speed = isMobile ? 2.2 : 1.8;
      const amp = isMobile ? 3.2 : 1.8;
      const driftAmp = isMobile ? 1.0 : 0.4;

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const ox = d.x - d.hx;
        const oy = d.y - d.hy;
        const disp = Math.sqrt(ox * ox + oy * oy);
        let level = Math.min(1, disp / 26);
        let lift = 0;
        let drift = 0;

        if (wave) {
          // Multi-frequency organic wave for continuous fluid motion on mobile
          const sX = Math.sin(d.hx * freqX - clock * speed);
          const sY = Math.cos(d.hy * freqY + clock * (speed * 0.7));
          const s = (sX + sY * 0.4) / 1.4;
          lift = s * amp;
          drift = Math.sin(d.hy * freqY - clock * 1.2) * driftAmp;

          // Luminous accent sheen traveling across the typographic matrix
          const wavePulse = (sX + 1) * 0.5;
          const highlight = Math.pow(wavePulse, 3.2);
          level = Math.max(level, highlight * 0.75);
        }

        const idx = Math.min(STEPS - 1, Math.max(0, Math.round(level * (STEPS - 1))));
        ctx.fillStyle = ramp[idx];
        ctx.fillRect(
          Math.round(d.x + drift - activeDotSize / 2),
          Math.round(d.y + lift - activeDotSize / 2),
          activeDotSize,
          activeDotSize
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

    function updatePointer(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      if (x >= -60 && x <= width + 60 && y >= -60 && y <= height + 60) {
        pointerX = x;
        pointerY = y;
        return { x, y, inBounds: true };
      } else {
        pointerX = -9999;
        pointerY = -9999;
        return { x, y, inBounds: false };
      }
    }

    function clearPointer() {
      pointerX = -9999;
      pointerY = -9999;
    }

    function onPointerMove(event) {
      updatePointer(event.clientX, event.clientY);
    }

    function onPointerDown(event) {
      const res = updatePointer(event.clientX, event.clientY);
      if (res.inBounds) {
        if (ripples.length > 3) ripples.shift();
        ripples.push({ x: res.x, y: res.y, r: 0 });
      }
    }

    function onPointerUp() {
      clearPointer();
    }

    function onTouchMove(e) {
      if (!e.touches || e.touches.length === 0) return;
      updatePointer(e.touches[0].clientX, e.touches[0].clientY);
    }

    function onTouchStart(e) {
      if (!e.touches || e.touches.length === 0) return;
      const res = updatePointer(e.touches[0].clientX, e.touches[0].clientY);
      if (res.inBounds) {
        if (ripples.length > 3) ripples.shift();
        ripples.push({ x: res.x, y: res.y, r: 0 });
      }
    }

    function onTouchEnd() {
      clearPointer();
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
      window.addEventListener("pointerup", onPointerUp, { passive: true });
      window.addEventListener("pointercancel", onPointerUp, { passive: true });
      host.addEventListener("pointerleave", clearPointer);

      host.addEventListener("touchstart", onTouchStart, { passive: true });
      host.addEventListener("touchmove", onTouchMove, { passive: true });
      host.addEventListener("touchend", onTouchEnd, { passive: true });
      host.addEventListener("touchcancel", onTouchEnd, { passive: true });

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
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      host.removeEventListener("pointerleave", clearPointer);
      host.removeEventListener("touchstart", onTouchStart);
      host.removeEventListener("touchmove", onTouchMove);
      host.removeEventListener("touchend", onTouchEnd);
      host.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [
    text,
    fontFamily,
    fontWeight,
    fontStyle,
    fontSize,
    letterSpacing,
    wordGap,
    lineHeightRatio,
    fit,
    dotSize,
    dotGap,
    adaptive,
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
