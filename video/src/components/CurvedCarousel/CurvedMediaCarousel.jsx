import { useEffect, useRef, useState, useCallback } from "react";

/**
 * CurvedMediaCarousel - High-performance GPU-accelerated 3D Cylindrical Carousel
 * Renders cards natively using CSS 3D transforms (translate3d + rotateY + perspective)
 * Completely eliminates 2D canvas column-slicing artifacts (vertical lines/stripes/barcode gaps).
 * Delivers locked 60-120 FPS buttery smooth kinetic scrolling, drag inertia, and hover-play.
 */

const DEFAULTS = {
  layout: {
    cardHeight: 64, // % of container height
    aspect: 0.72,   // width/height ratio
    gap: 28,
    cardRadius: 18,
    offsetY: 0,
  },
  motion: {
    autoplay: true,
    speed: 28,
    direction: "left",
    pauseOnHover: true,
  },
  interaction: {
    draggable: true,
    inertia: true,
    friction: 2.0,
    dragSensitivity: 1.0,
    wheel: true,
  },
  arrowsGroup: {
    arrows: true,
    arrowSize: 52,
    arrowOffset: 32,
    arrowBg: "#ffffff",
    arrowColor: "#111111",
  },
};

export default function CurvedMediaCarousel(rawProps) {
  const {
    images = [],
    paused = false,
    onCardClick,
    activeIndexChange,
    style = {},
  } = rawProps;

  const layout = { ...DEFAULTS.layout, ...(rawProps.layout || {}) };
  const motion = { ...DEFAULTS.motion, ...(rawProps.motion || {}) };
  const interaction = { ...DEFAULTS.interaction, ...(rawProps.interaction || {}) };
  const arrowsGroup = { ...DEFAULTS.arrowsGroup, ...(rawProps.arrowsGroup || {}) };

  const wrapRef = useRef(null);
  const [dimensions, setDimensions] = useState({ w: 1200, h: 580 });
  const [currentPos, setCurrentPos] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [isDraggingState, setIsDraggingState] = useState(false);

  // Physics refs
  const posRef = useRef(0);
  const velRef = useRef(0);
  const targetPosRef = useRef(null);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragDataRef = useRef({
    startX: 0,
    startY: 0,
    lastX: 0,
    lastTime: 0,
    dragVel: 0,
    downTime: 0,
  });

  const lastActiveRef = useRef(0);
  const videoRefs = useRef({});
  const propsRef = useRef({ motion, interaction, paused });
  propsRef.current = { motion, interaction, paused };

  const items = Array.isArray(images) ? images : [];
  const N = items.length;

  // Track container dimensions with ResizeObserver
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const updateSize = () => {
      const rect = wrap.getBoundingClientRect();
      const w = wrap.clientWidth || rect.width || 1200;
      const h = wrap.clientHeight || rect.height || 580;
      setDimensions({ w, h });
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  // Main 60-120 FPS animation physics loop
  useEffect(() => {
    let raf = 0;
    let lastT = performance.now();

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;

      const p = propsRef.current;
      if (p.paused || N === 0) return;

      const wrapW = dimensions.w || 1200;
      const cardH = (dimensions.h * layout.cardHeight) / 100;
      const cardW = cardH * layout.aspect;
      const pitch = Math.max(1, cardW + layout.gap);

      if (!isDraggingRef.current) {
        // 1. Smooth target interpolation (for arrow button clicks)
        if (targetPosRef.current !== null) {
          velRef.current = 0;
          const diff = targetPosRef.current - posRef.current;
          posRef.current += diff * (1 - Math.exp(-6 * dt));
          if (Math.abs(diff) < 0.001) {
            posRef.current = targetPosRef.current;
            targetPosRef.current = null;
          }
        } else {
          // 2. Continuous smooth autoplay motion
          const wantAuto =
            p.motion.autoplay && !(p.motion.pauseOnHover && isHoveredRef.current);
          const dir = p.motion.direction === "right" ? -1 : 1;
          const autoVel = wantAuto ? (dir * p.motion.speed) / pitch : 0;

          // 3. Friction & velocity momentum
          velRef.current *= Math.exp(-p.interaction.friction * dt);
          if (Math.abs(velRef.current) < 0.0002) velRef.current = 0;

          posRef.current += (autoVel + velRef.current) * dt;
        }

        // Keep position cleanly within wrapped modular bounds
        if (posRef.current < 0) posRef.current += N * 1000;
        if (posRef.current >= N * 1000) posRef.current -= N * 1000;

        // Sync with React render state
        setCurrentPos(posRef.current);

        // Sync active index for ticker and counter
        const active = Math.round(posRef.current) % N;
        if (active !== lastActiveRef.current) {
          lastActiveRef.current = active;
          if (activeIndexChange) activeIndexChange(active);
        }
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [dimensions, layout.cardHeight, layout.aspect, layout.gap, N, activeIndexChange]);

  // Pointer drag interactions
  const onPointerDown = (e) => {
    if (!interaction.draggable) return;
    targetPosRef.current = null;
    isDraggingRef.current = true;
    setIsDraggingState(true);

    const now = performance.now();
    dragDataRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastTime: now,
      dragVel: 0,
      downTime: now,
    };

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const onPointerMove = (e) => {
    if (!isDraggingRef.current) return;

    const now = performance.now();
    const d = dragDataRef.current;
    const dx = e.clientX - d.lastX;
    const dt = Math.max(0.001, (now - d.lastTime) / 1000);

    const cardH = (dimensions.h * layout.cardHeight) / 100;
    const cardW = cardH * layout.aspect;
    const pitch = Math.max(1, cardW + layout.gap);

    const dPos = (-dx * interaction.dragSensitivity) / pitch;
    posRef.current += dPos;
    setCurrentPos(posRef.current);

    d.dragVel = d.dragVel * 0.7 + (dPos / dt) * 0.3;
    d.lastX = e.clientX;
    d.lastTime = now;
  };

  const onPointerUp = (e) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDraggingState(false);

    const d = dragDataRef.current;
    const dist = Math.hypot(e.clientX - d.startX, e.clientY - d.startY);
    const duration = performance.now() - d.downTime;

    // Release with kinetic inertia
    const isStale = performance.now() - d.lastTime > 80;
    velRef.current = interaction.inertia && !isStale ? d.dragVel : 0;

    // If tap was quick and stationary, trigger card selection
    if (dist < 10 && duration < 320 && onCardClick) {
      const active = Math.round(posRef.current) % N;
      const clickedItem = items[active];
      if (clickedItem) onCardClick(clickedItem, active);
    }
  };

  // Wheel interaction with smooth momentum
  const onWheel = useCallback(
    (e) => {
      if (!interaction.wheel) return;
      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      const delta = isHorizontal ? e.deltaX : e.shiftKey ? e.deltaY : 0;
      if (Math.abs(delta) > 0) {
        e.preventDefault();
        const cardH = (dimensions.h * layout.cardHeight) / 100;
        const cardW = cardH * layout.aspect;
        const pitch = Math.max(1, cardW + layout.gap);
        targetPosRef.current = null;
        velRef.current += (delta / pitch) * interaction.dragSensitivity * 3.2;
      }
    },
    [interaction.wheel, interaction.dragSensitivity, dimensions, layout]
  );

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    wrap.addEventListener("wheel", onWheel, { passive: false });
    return () => wrap.removeEventListener("wheel", onWheel);
  }, [onWheel]);

  // Arrow step buttons
  const step = (dir) => {
    const base = targetPosRef.current !== null ? targetPosRef.current : posRef.current;
    targetPosRef.current = Math.round(base) + dir;
  };

  // Hover video play
  const handleMouseEnterCard = (idx) => {
    setHoveredIdx(idx);
    const v = videoRefs.current[idx];
    if (v && v.paused) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  };

  const handleMouseLeaveCard = (idx) => {
    setHoveredIdx(null);
    const v = videoRefs.current[idx];
    if (v && !v.paused) {
      v.pause();
      v.currentTime = 0;
    }
  };

  // 3D Cylinder geometry calculations
  const { w: W, h: H } = dimensions;
  const cardH = Math.max(120, (H * layout.cardHeight) / 100);
  const cardW = cardH * layout.aspect;
  const R = Math.max(750, Math.min(1150, W * 0.78)); // Cylinder radius in px
  const thetaStep = (cardW + layout.gap) / R;         // Angle per card in radians

  return (
    <div
      ref={wrapRef}
      className="curved-3d-stage"
      style={{
        ...style,
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        perspective: "1200px",
        perspectiveOrigin: "50% 50%",
        cursor: isDraggingState ? "grabbing" : interaction.draggable ? "grab" : "default",
        userSelect: "none",
        WebkitUserSelect: "none",
        touchAction: "pan-y",
        backgroundColor: "#ffffff",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerEnter={() => {
        isHoveredRef.current = true;
      }}
      onPointerLeave={() => {
        isHoveredRef.current = false;
        if (isDraggingRef.current) {
          isDraggingRef.current = false;
          setIsDraggingState(false);
        }
      }}
    >
      {/* 3D Cylindrical Ring Track */}
      <div
        className="curved-3d-track"
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        {items.map((item, idx) => {
          // Wrapped continuous offset from current position
          let diff = idx - (currentPos % N);
          while (diff < -N / 2) diff += N;
          while (diff > N / 2) diff -= N;

          // Don't render cards that are turned away behind viewer
          const isVisible = Math.abs(diff) < 3.8;
          if (!isVisible) return null;

          const angle = diff * thetaStep;
          const deg = angle * (180 / Math.PI);
          const x = Math.sin(angle) * R;
          const z = (Math.cos(angle) - 1) * R;
          const rotateY = -deg; // Rotates card inward facing cylinder center

          const scale = Math.max(0.75, 1 - Math.abs(diff) * 0.035);
          const opacity = Math.max(
            0,
            1 - Math.pow(Math.abs(diff) / 3.4, 2) * 0.58
          );
          const zIndex = Math.round(100 - Math.abs(diff) * 10);
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={item.id || idx}
              className={`curved-3d-card ${isHovered ? "curved-3d-card--hovered" : ""}`}
              style={{
                position: "absolute",
                width: `${cardW}px`,
                height: `${cardH}px`,
                transform: `translate3d(${x}px, 0, ${z}px) rotateY(${rotateY}deg) scale(${
                  isHovered ? scale * 1.06 : scale
                })`,
                transformOrigin: "center center",
                zIndex,
                opacity,
                pointerEvents: "auto",
                cursor: "pointer",
                borderRadius: `${layout.cardRadius}px`,
                overflow: "hidden",
                boxShadow: isHovered
                  ? "0 28px 60px -12px rgba(0, 0, 0, 0.3), 0 0 0 2px #2563eb"
                  : "0 16px 38px -10px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.06)",
                transition: isDraggingState
                  ? "none"
                  : "transform 0.18s ease-out, box-shadow 0.2s ease, opacity 0.2s ease",
                willChange: "transform, opacity",
                backgroundColor: "#000000",
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (onCardClick) onCardClick(item, idx);
              }}
              onMouseEnter={() => handleMouseEnterCard(idx)}
              onMouseLeave={() => handleMouseLeaveCard(idx)}
            >
              {/* Native Video Display (No Images) */}
              {item.video && (
                <video
                  ref={(el) => (videoRefs.current[idx] = el)}
                  src={item.video}
                  muted
                  loop
                  playsInline
                  preload="auto"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    backgroundColor: "#0a0a0f",
                  }}
                />
              )}

              {/* Natural 3D Cylindrical Edge Shading */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(to right, rgba(0,0,0,${Math.min(
                    0.32,
                    Math.abs(diff) * 0.12
                  )}) 0%, transparent 22%, transparent 78%, rgba(0,0,0,${Math.min(
                    0.32,
                    Math.abs(diff) * 0.12
                  )}) 100%)`,
                  pointerEvents: "none",
                }}
              />

              {/* Top Category / Year Badges */}
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  left: 14,
                  right: 14,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  pointerEvents: "none",
                  zIndex: 2,
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#ffffff",
                    background: "rgba(0, 0, 0, 0.5)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    padding: "4px 10px",
                    borderRadius: "999px",
                  }}
                >
                  {item.category?.split("·")[0]?.trim() || "Showreel"}
                </span>
                {item.year && (
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "rgba(255, 255, 255, 0.85)",
                      background: "rgba(0, 0, 0, 0.35)",
                      padding: "3px 8px",
                      borderRadius: "999px",
                    }}
                  >
                    {item.year}
                  </span>
                )}
              </div>

              {/* Center Play Icon Indicator */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: isHovered ? "rgba(37, 99, 235, 0.9)" : "rgba(0, 0, 0, 0.45)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  opacity: isHovered ? 0.95 : 0.75,
                  transition: "all 0.25s ease",
                  pointerEvents: "none",
                  zIndex: 2,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>

              {/* Bottom Metadata */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "48px 16px 16px",
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
                  color: "#ffffff",
                  pointerEvents: "none",
                  zIndex: 2,
                }}
              >
                <p
                  style={{
                    fontSize: "11px",
                    opacity: 0.8,
                    margin: "0 0 3px",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {item.client}
                </p>
                <h4
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    margin: 0,
                    lineHeight: 1.3,
                    color: "#ffffff",
                  }}
                >
                  {item.title}
                </h4>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Left Arrow */}
      {arrowsGroup.arrows && (
        <button
          type="button"
          aria-label="Previous Project"
          className="curved-carousel-arrow curved-carousel-arrow--prev"
          style={{
            position: "absolute",
            top: "50%",
            left: `${arrowsGroup.arrowOffset}px`,
            transform: "translateY(-50%)",
            width: `${arrowsGroup.arrowSize}px`,
            height: `${arrowsGroup.arrowSize}px`,
            borderRadius: "50%",
            background: arrowsGroup.arrowBg || "#ffffff",
            color: arrowsGroup.arrowColor || "#111111",
            border: "1px solid rgba(0, 0, 0, 0.12)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.14)",
            zIndex: 10,
            transition: "transform 0.2s ease, background 0.2s ease, border-color 0.2s ease",
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => step(-1)}
        >
          <svg
            width={arrowsGroup.arrowSize * 0.42}
            height={arrowsGroup.arrowSize * 0.42}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transform: "scaleX(-1)" }}
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Floating Right Arrow */}
      {arrowsGroup.arrows && (
        <button
          type="button"
          aria-label="Next Project"
          className="curved-carousel-arrow curved-carousel-arrow--next"
          style={{
            position: "absolute",
            top: "50%",
            right: `${arrowsGroup.arrowOffset}px`,
            transform: "translateY(-50%)",
            width: `${arrowsGroup.arrowSize}px`,
            height: `${arrowsGroup.arrowSize}px`,
            borderRadius: "50%",
            background: arrowsGroup.arrowBg || "#ffffff",
            color: arrowsGroup.arrowColor || "#111111",
            border: "1px solid rgba(0, 0, 0, 0.12)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.14)",
            zIndex: 10,
            transition: "transform 0.2s ease, background 0.2s ease, border-color 0.2s ease",
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => step(1)}
        >
          <svg
            width={arrowsGroup.arrowSize * 0.42}
            height={arrowsGroup.arrowSize * 0.42}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}
