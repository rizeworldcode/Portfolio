import { useEffect, useRef, useCallback } from "react";

/**
 * CurvedMediaCarousel - High-performance Canvas-based Cylindrical 3D Media Carousel
 * Adapted seamlessly from Framer's CurvedMediaCarousel for pure React & Vite.
 * Cards are rendered column-by-column onto HTML5 Canvas, bending smoothly like a 3D cylinder.
 */

const DEFAULTS = {
  layout: {
    cardHeight: 52, // % of container height
    aspect: 0.72,   // width/height ratio
    gap: 18,
    cardRadius: 18,
    imageZoom: 1.05,
    offsetY: 0,
  },
  curve: {
    curve: 0.75,    // amount: positive = concave (edges bend up/out), negative = convex
    power: 2,       // shape: 2 = smooth parabola
    slant: 0,
    smoothness: 2,  // column slicing size in px (lower = ultra-smooth)
  },
  appearance: {
    background: "#ffffff",
    radius: "0px",
    edgeShade: 0.25,
    shadeColor: "#ffffff",
  },
  motion: {
    autoplay: true,
    speed: 36,
    direction: "left",
    pauseOnHover: true,
  },
  interaction: {
    draggable: true,
    inertia: true,
    friction: 3.2,
    dragSensitivity: 1,
    snap: false,
    wheel: true,
  },
  media: {
    loopMode: "loop", // "loop" or "finite"
    videoPlay: "always",
  },
  hoverFx: {
    hoverEnabled: true,
    hoverScale: 1.1,
    hoverDuration: 300,
    hoverDim: 0.25,
  },
  arrowsGroup: {
    arrows: true,
    arrowSize: 48,
    arrowOffset: 24,
    arrowBg: "rgba(255, 255, 255, 0.08)",
    arrowColor: "#ffffff",
  },
};

// Pick the best drawable source (video frame if ready, else image)
function pickSource(m) {
  if (!m) return null;
  const v = m.video;
  if (v && v.readyState >= 2 && v.videoWidth) {
    return { el: v, w: v.videoWidth, h: v.videoHeight };
  }
  const i = m.img;
  if (i && i.complete && i.naturalWidth) {
    return { el: i, w: i.naturalWidth, h: i.naturalHeight };
  }
  return null;
}

// Merge user props with defaults
function flatten(raw) {
  const out = { ...raw };
  Object.keys(DEFAULTS).forEach((g) => {
    Object.assign(out, DEFAULTS[g], raw[g] || {});
  });
  return out;
}

export default function CurvedMediaCarousel(raw) {
  const props = flatten(raw);
  const { style, onCardClick, activeIndexChange } = raw;
  const { background, radius, arrows } = props;
  const items = Array.isArray(raw.images) ? raw.images : [];

  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const propsRef = useRef(props);
  propsRef.current = props;

  const imgsRef = useRef([]);
  const st = useRef({
    pos: 0,
    vel: 0,
    dragVel: 0,
    dragging: false,
    lastX: 0,
    lastY: 0,
    downX: 0,
    downY: 0,
    downTime: 0,
    lastMove: 0,
    last: 0,
    hover: false,
    px: -1,
    py: -1,
    hoverMap: new Map(),
    hoverTarget: null,
    autoMul: 1,
    bounce: 1,
    inited: false,
    goto: null,
    w: 0,
    h: 0,
    dpr: 1,
    visible: true,
    needsDraw: true,
  });

  const getSrc = (it) => {
    if (typeof it === "string") return it;
    return typeof it?.image === "string" ? it.image : it?.image?.src || it?.src || "";
  };

  const getVideo = (it) => {
    if (!it || typeof it === "string") return "";
    const url = typeof it.videoUrl === "string" ? it.videoUrl.trim() : "";
    if (url) return url;
    return typeof it.video === "string" ? it.video : it.video?.src || "";
  };

  const srcKey = items.map((it) => getSrc(it) + "~" + getVideo(it)).join("|");

  // Load images and videos
  useEffect(() => {
    const list = items || [];
    const entries = list.map((it) => {
      const entry = { data: it };
      const src = getSrc(it);
      if (src) {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          st.current.needsDraw = true;
        };
        img.src = src;
        entry.img = img;
      }
      const vs = getVideo(it);
      if (vs) {
        const v = document.createElement("video");
        v.muted = true;
        v.defaultMuted = true;
        v.loop = true;
        v.playsInline = true;
        v.setAttribute("playsinline", "");
        v.preload = "auto";
        v.onloadeddata = () => {
          st.current.needsDraw = true;
        };
        v.src = vs;
        entry.video = v;
      }
      return entry;
    });

    imgsRef.current = entries;
    st.current.needsDraw = true;

    return () => {
      entries.forEach((e) => {
        if (e.video) {
          e.video.pause();
          e.video.removeAttribute("src");
          e.video.load();
        }
      });
    };
  }, [srcKey]);

  useEffect(() => {
    st.current.needsDraw = true;
  });

  // Calculate card layout metrics
  const metrics = useCallback(() => {
    const p = propsRef.current;
    const s = st.current;
    const cardH = (s.h * p.cardHeight) / 100;
    const cardW = cardH * p.aspect;
    const pitch = Math.max(1, cardW + p.gap);
    return { cardH, cardW, pitch };
  }, []);

  const count = useCallback(() => Math.max(1, imgsRef.current.length || 6), []);

  const getRange = useCallback(
    (n) => {
      const { cardW, pitch } = metrics();
      const W = st.current.w;
      if (W && (n - 1) * pitch + cardW <= W) {
        const m = (n - 1) / 2;
        return [m, m];
      }
      return [0, n - 1];
    },
    [metrics]
  );

  // Main Canvas Draw Routine
  const draw = useCallback(() => {
    const c = canvasRef.current;
    const s = st.current;
    if (!c || !s.w || !s.h) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const p = propsRef.current;
    const W = s.w;
    const H = s.h;

    ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const media = imgsRef.current;
    const n = Math.max(1, media.length || 6);
    const finite = p.loopMode === "finite";
    const srcs = media.map(pickSource);
    const { cardH, cardW, pitch } = metrics();
    if (cardH <= 0 || cardW <= 0) return;

    const cx = W / 2;
    const baseCy = H / 2 + p.offsetY;
    const col = Math.max(1, p.smoothness);
    const r = Math.max(0, Math.min(p.cardRadius, cardW / 2, cardH / 2));
    const slant = Math.tan((p.slant * Math.PI) / 180);
    const zoom = Math.max(1, p.imageZoom);
    const shade = p.edgeShade > 0;

    const hm = s.hoverMap;
    let hoverMax = 0;
    hm.forEach((v) => {
      if (v > hoverMax) hoverMax = v;
    });
    const dim = p.hoverEnabled ? p.hoverDim : 0;

    // Draw one vertical slice of a card (Cylindrical warp)
    const drawCol = (x, xm, k, local, hs) => {
      const base = ctx.globalAlpha;
      const d = Math.abs(xm - cx) / (W / 2);
      const sc = Math.max(0.04, 1 + p.curve * Math.pow(d, p.power));

      // Rounded corner inset calculation
      let inset = 0;
      const e = Math.min(local, cardW - local);
      if (r > 0 && e < r) {
        inset = r - Math.sqrt(Math.max(0, r * r - (r - e) * (r - e)));
      }

      const k2 = sc * hs;
      const full = cardH * k2;
      const cy = baseCy + slant * (xm - cx);
      const top = cy - full / 2 + inset * k2;
      const hh = full - 2 * inset * k2;
      if (hh <= 0) return;

      const srcI = srcs[k];
      if (srcI) {
        const img = srcI.el;
        const iw = srcI.w;
        const ih = srcI.h;
        const ca = cardW / cardH;
        const ia = iw / ih;
        let cw, ch;
        if (ia > ca) {
          ch = ih;
          cw = ih * ca;
        } else {
          cw = iw;
          ch = iw / ca;
        }
        cw /= zoom;
        ch /= zoom;
        const cxs = (iw - cw) / 2;
        const cys = (ih - ch) / 2;
        const sx = cxs + (local / cardW) * cw;
        let sw = Math.max(0.5, (cw * col) / (cardW * hs));
        if (sx + sw > iw) sw = iw - sx;
        if (sw <= 0) return;

        const sy = cys + (inset / cardH) * ch;
        const sh = ch * (1 - (2 * inset) / cardH);

        try {
          ctx.drawImage(img, sx, sy, sw, sh, x, top, col + 0.6, hh);
        } catch (_) {}
      } else {
        const hue = (k * 43 + 215) % 360;
        const light = 50 - 12 * (local / cardW);
        ctx.fillStyle = `hsl(${hue}, 30%, ${light}%)`;
        ctx.fillRect(x, top, col + 0.6, hh);
      }

      // Edge depth shading
      if (shade) {
        ctx.globalAlpha = base * Math.min(1, p.edgeShade * d * d);
        ctx.fillStyle = p.shadeColor;
        ctx.fillRect(x, top, col + 0.6, hh);
        ctx.globalAlpha = base;
      }
    };

    // Pass 1: Unhovered cards
    ctx.globalAlpha = 1 - dim * hoverMax;
    for (let x = 0; x < W; x += col) {
      const xm = x + col / 2;
      const f = s.pos * pitch + cardW / 2 + (xm - cx);
      const idx = Math.floor(f / pitch);
      const local = f - idx * pitch;
      if (local > cardW) continue;
      if (finite && (idx < 0 || idx > n - 1)) continue;
      if ((hm.get(idx) || 0) > 0.001) continue;
      drawCol(x, xm, ((idx % n) + n) % n, local, 1);
    }
    ctx.globalAlpha = 1;

    // Pass 2: Hovered cards on top
    const hovered = Array.from(hm.entries())
      .filter((en) => en[1] > 0.001)
      .sort((a, b) => a[1] - b[1]);

    for (const [idx, v] of hovered) {
      const hs = 1 + (Math.max(1, p.hoverScale) - 1) * v;
      const ccx = cx + (idx - s.pos) * pitch;
      const half = (cardW * hs) / 2;
      const k = ((idx % n) + n) % n;
      const x0 = Math.max(0, Math.floor((ccx - half) / col) * col);
      for (let x = x0; x < W && x < ccx + half; x += col) {
        const xm = x + col / 2;
        const local = cardW / 2 + (xm - ccx) / hs;
        if (local < 0 || local > cardW) continue;
        drawCol(x, xm, k, local, hs);
      }
    }
  }, [metrics]);

  // Main animation / physics loop
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const s = st.current;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const w = wrap.clientWidth || rect.width;
      const h = wrap.clientHeight || rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      s.w = w;
      s.h = h;
      s.dpr = dpr;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      s.needsDraw = true;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const io = new IntersectionObserver(
      (entries) => {
        s.visible = entries[0]?.isIntersecting ?? true;
        if (s.visible) s.needsDraw = true;
      },
      { threshold: 0 }
    );
    io.observe(wrap);

    const onWheel = (ev) => {
      const p = propsRef.current;
      if (!p.wheel) return;
      if (Math.abs(ev.deltaX) > Math.abs(ev.deltaY)) {
        ev.preventDefault();
        const { pitch } = metrics();
        s.goto = null;
        s.pos += (ev.deltaX / pitch) * p.dragSensitivity;
        if (p.loopMode === "finite") {
          const [lo, hi] = getRange(count());
          s.pos = Math.max(lo, Math.min(hi, s.pos));
        }
        s.needsDraw = true;
      }
    };
    wrap.addEventListener("wheel", onWheel, { passive: false });

    let raf = 0;
    s.last = performance.now();

    const tick = (t) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (t - s.last) / 1000);
      s.last = t;
      const p = propsRef.current;
      const nn = count();
      const finite = p.loopMode === "finite";
      const [lo, hi] = getRange(nn);

      if (!s.inited && s.w) {
        s.inited = true;
        if (finite) s.pos = lo;
      }

      let moving = false;

      if (s.visible && !s.dragging) {
        const { pitch } = metrics();
        if (s.goto !== null) {
          s.vel = 0;
          s.pos += (s.goto - s.pos) * (1 - Math.exp(-7 * dt));
          if (Math.abs(s.goto - s.pos) < 0.002) {
            s.pos = s.goto;
            s.goto = null;
          }
          moving = true;
        } else {
          // Autoplay motion
          const wantAuto = p.autoplay && !(p.pauseOnHover && s.hover) ? 1 : 0;
          s.autoMul += (wantAuto - s.autoMul) * (1 - Math.exp(-6 * dt));
          let dir = p.direction === "right" ? -1 : 1;
          if (finite) {
            dir *= s.bounce;
            if (dir > 0 && s.pos >= hi - 0.001) {
              s.bounce *= -1;
              dir = -dir;
            } else if (dir < 0 && s.pos <= lo + 0.001) {
              s.bounce *= -1;
              dir = -dir;
            }
          }

          const canMove = !finite || hi > lo;
          const auto =
            canMove && p.autoplay && s.autoMul > 0.001
              ? (dir * p.speed * s.autoMul) / pitch
              : 0;

          s.vel *= Math.exp(-p.friction * dt);
          if (Math.abs(s.vel) < 0.001) s.vel = 0;
          s.pos += (auto + s.vel) * dt;

          if (auto !== 0 || s.vel !== 0) moving = true;

          // Finite mode bounce
          if (finite && (s.pos < lo || s.pos > hi)) {
            const target = s.pos < lo ? lo : hi;
            s.pos += (target - s.pos) * (1 - Math.exp(-10 * dt));
            s.vel *= 0.5;
            moving = true;
          }

          // Card snapping
          if (p.snap && !p.autoplay && Math.abs(s.vel) < 0.3) {
            let target = Math.round(s.pos);
            if (finite) target = Math.max(lo, Math.min(hi, target));
            if (Math.abs(target - s.pos) > 5e-4) {
              s.pos += (target - s.pos) * (1 - Math.exp(-8 * dt));
              moving = true;
            }
          }
        }
      }

      // Video playback sync
      {
        const media = imgsRef.current;
        let playing = false;
        if (media.some((m) => m.video)) {
          const rc = Math.round(s.pos);
          const kc = finite
            ? Math.max(0, Math.min(nn - 1, rc))
            : ((rc % nn) + nn) % nn;
          media.forEach((m, k) => {
            const v = m.video;
            if (!v) return;
            const want = s.visible && (p.videoPlay === "always" || k === kc);
            if (want) {
              if (v.paused) v.play().catch(() => {});
              if (v.readyState >= 2) playing = true;
            } else if (!v.paused) {
              v.pause();
            }
          });
        }
        if (playing) s.needsDraw = true;
      }

      // Hover card scaling detection
      if (p.hoverEnabled && s.visible) {
        const { cardH, cardW, pitch } = metrics();
        let target = null;
        if (!s.dragging && s.px >= 0 && cardH > 0) {
          const cxm = s.w / 2;
          const baseCy = s.h / 2 + p.offsetY;
          const slant = Math.tan((p.slant * Math.PI) / 180);
          const test = (idx, hs) => {
            if (finite && (idx < 0 || idx > nn - 1)) return false;
            const ccx = cxm + (idx - s.pos) * pitch;
            if (Math.abs(s.px - ccx) > (cardW * hs) / 2) return false;
            const d = Math.abs(s.px - cxm) / (s.w / 2);
            const sc = Math.max(0.04, 1 + p.curve * Math.pow(d, p.power));
            const cy = baseCy + slant * (s.px - cxm);
            return Math.abs(s.py - cy) <= (cardH * sc * hs) / 2;
          };

          if (s.hoverTarget !== null) {
            const v = s.hoverMap.get(s.hoverTarget) || 0;
            if (test(s.hoverTarget, 1 + (Math.max(1, p.hoverScale) - 1) * v)) {
              target = s.hoverTarget;
            }
          }
          if (target === null) {
            const f = s.pos * pitch + cardW / 2 + (s.px - cxm);
            const idx = Math.floor(f / pitch);
            if (test(idx, 1)) target = idx;
          }
        }

        s.hoverTarget = target;
        if (target !== null && !s.hoverMap.has(target)) s.hoverMap.set(target, 0);

        const rate = 1 - Math.exp((-dt * 4) / Math.max(0.05, p.hoverDuration / 1000));
        s.hoverMap.forEach((v, key) => {
          const goal = key === target ? 1 : 0;
          let nv = v + (goal - v) * rate;
          if (Math.abs(goal - nv) < 0.002) nv = goal;
          if (nv === 0 && goal === 0) s.hoverMap.delete(key);
          else s.hoverMap.set(key, nv);
          if (nv !== v) moving = true;
        });
      } else if (s.hoverMap.size) {
        s.hoverMap.clear();
        s.hoverTarget = null;
        s.needsDraw = true;
      }

      if (activeIndexChange) {
        const currentActive = ((Math.round(s.pos) % nn) + nn) % nn;
        if (st.current.lastActive !== currentActive) {
          st.current.lastActive = currentActive;
          activeIndexChange(currentActive);
        }
      }

      if (s.visible && (moving || s.dragging || s.needsDraw)) {
        draw();
        s.needsDraw = false;
      }
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      wrap.removeEventListener("wheel", onWheel);
    };
  }, [draw, metrics, count, getRange, activeIndexChange]);

  // Pointer Interaction (Drag + Click detection)
  const onPointerDown = (e) => {
    if (!props.draggable) return;
    const s = st.current;
    s.dragging = true;
    s.goto = null;
    s.lastX = e.clientX;
    s.lastY = e.clientY;
    s.downX = e.clientX;
    s.downY = e.clientY;
    s.downTime = performance.now();
    s.lastMove = performance.now();
    s.dragVel = 0;
    s.vel = 0;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const onPointerMove = (e) => {
    const s = st.current;
    if (e.pointerType === "mouse") {
      const rect = e.currentTarget.getBoundingClientRect();
      s.px = e.clientX - rect.left;
      s.py = e.clientY - rect.top;
    }
    if (!s.dragging) return;
    const { pitch } = metrics();
    const now = performance.now();
    const dx = e.clientX - s.lastX;
    const dtMove = Math.max(0.001, (now - s.lastMove) / 1000);
    const dCards = (-dx * props.dragSensitivity) / pitch;
    let dc = dCards;
    if (props.loopMode === "finite") {
      const [lo, hi] = getRange(count());
      if ((s.pos < lo && dc < 0) || (s.pos > hi && dc > 0)) dc *= 0.35;
    }
    s.pos += dc;
    s.dragVel = s.dragVel * 0.6 + (dCards / dtMove) * 0.4;
    s.lastX = e.clientX;
    s.lastY = e.clientY;
    s.lastMove = now;
    s.needsDraw = true;
  };

  const endDrag = (e) => {
    const s = st.current;
    if (!s.dragging) return;
    s.dragging = false;

    // Check if this was a quick tap/click
    if (e && onCardClick) {
      const dist = Math.hypot(e.clientX - s.downX, e.clientY - s.downY);
      const duration = performance.now() - s.downTime;
      if (dist < 8 && duration < 320) {
        // Find which card was clicked
        if (s.hoverTarget !== null && imgsRef.current.length > 0) {
          const nn = count();
          const clickedIdx = ((s.hoverTarget % nn) + nn) % nn;
          const clickedItem = imgsRef.current[clickedIdx]?.data;
          if (clickedItem) {
            onCardClick(clickedItem, clickedIdx);
          }
        }
      }
    }

    const stale = performance.now() - s.lastMove > 90;
    s.vel = props.inertia && !stale ? s.dragVel : 0;
  };

  const step = (dir) => {
    const s = st.current;
    const base = s.goto !== null ? s.goto : Math.round(s.pos);
    let t = base + dir;
    if (props.loopMode === "finite") {
      const [lo, hi] = getRange(count());
      t = Math.max(lo, Math.min(hi, t));
    }
    s.goto = t;
    s.needsDraw = true;
  };

  return (
    <div
      ref={wrapRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerEnter={() => (st.current.hover = true)}
      onPointerLeave={() => {
        st.current.hover = false;
        st.current.px = -1;
        st.current.py = -1;
        endDrag();
      }}
      style={{
        ...style,
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background,
        borderRadius: radius,
        cursor: props.draggable ? "grab" : "default",
        touchAction: "pan-y",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          pointerEvents: "none",
        }}
      />

      {arrows && (
        <>
          <button
            type="button"
            aria-label="Previous Project"
            className="curved-carousel-arrow curved-carousel-arrow--prev"
            style={{
              position: "absolute",
              top: "50%",
              left: props.arrowOffset,
              transform: "translateY(-50%)",
              width: props.arrowSize,
              height: props.arrowSize,
              borderRadius: "50%",
              background: props.arrowBg,
              color: props.arrowColor,
              border: "1px solid rgba(0, 0, 0, 0.12)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.12)",
              zIndex: 10,
              transition: "transform 0.2s ease, background 0.2s ease, border-color 0.2s ease",
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => step(-1)}
          >
            <svg
              width={props.arrowSize * 0.42}
              height={props.arrowSize * 0.42}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transform: "scaleX(-1)" }}
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            type="button"
            aria-label="Next Project"
            className="curved-carousel-arrow curved-carousel-arrow--next"
            style={{
              position: "absolute",
              top: "50%",
              right: props.arrowOffset,
              transform: "translateY(-50%)",
              width: props.arrowSize,
              height: props.arrowSize,
              borderRadius: "50%",
              background: props.arrowBg,
              color: props.arrowColor,
              border: "1px solid rgba(0, 0, 0, 0.12)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.12)",
              zIndex: 10,
              transition: "transform 0.2s ease, background 0.2s ease, border-color 0.2s ease",
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => step(1)}
          >
            <svg
              width={props.arrowSize * 0.42}
              height={props.arrowSize * 0.42}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
