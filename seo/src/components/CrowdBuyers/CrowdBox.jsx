import React, { useEffect, useRef, useState, useMemo } from "react";
import "./CrowdBox.css";

// Cluster configurations matching the reference video
const CLUSTERS = [
  {
    id: "search",
    tag: "SEARCH",
    count: "245",
    desc: 'searching "services in Alwar"',
    // Normalized position coordinates (percentage of canvas)
    xPercent: 41,
    yPercent: 54,
    radius: 46,
    particleCount: 55,
  },
  {
    id: "feeds",
    tag: "FEEDS",
    count: "1,284",
    desc: "following #localbusiness",
    xPercent: 62,
    yPercent: 32,
    radius: 52,
    particleCount: 65,
  },
  {
    id: "audiences",
    tag: "AUDIENCES",
    count: "78",
    desc: "high-intent buyers",
    xPercent: 81,
    yPercent: 62,
    radius: 44,
    particleCount: 45,
  },
];

export default function CrowdBox() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [buyerRatio, setBuyerRatio] = useState(1200);
  const [progress, setProgress] = useState(0);
  const [activeCluster, setActiveCluster] = useState(null);

  // References for animation loop
  const animFrameId = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -1000, y: -1000, isHovering: false });
  const scrollProgressRef = useRef(0);

  // Initialize particles once or on resize
  const initParticles = (width, height) => {
    const particles = [];

    // 1. Background "crowd" particles (scattered white/faint dots)
    const backgroundDotCount = Math.floor((width * height) / 3200);
    for (let i = 0; i < backgroundDotCount; i++) {
      particles.push({
        type: "bg",
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        size: Math.random() * 1.6 + 0.8,
        alpha: Math.random() * 0.65 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.008,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }

    // 2. Focused buyer cluster particles (vibrant lime green/yellow dots)
    CLUSTERS.forEach((cluster) => {
      const cx = (cluster.xPercent / 100) * width;
      const cy = (cluster.yPercent / 100) * height;
      const r = cluster.radius;

      for (let i = 0; i < cluster.particleCount; i++) {
        // Distribute within circle
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.sqrt(Math.random()) * (r * 0.85);
        particles.push({
          type: "cluster",
          clusterId: cluster.id,
          targetCx: cx,
          targetCy: cy,
          x: cx + Math.cos(angle) * dist,
          y: cy + Math.sin(angle) * dist,
          baseDistance: dist,
          angle: angle,
          orbitSpeed: (Math.random() - 0.5) * 0.035 + 0.015,
          jitterSpeed: Math.random() * 0.08 + 0.04,
          size: Math.random() * 2.2 + 1.2,
          alpha: Math.random() * 0.4 + 0.6,
        });
      }
    });

    particlesRef.current = particles;
  };

  // Scroll handler to calculate scroll progress within viewport
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Progress: 0 when top enters viewport, 1 when centered/fully in view
      const start = windowHeight * 0.9;
      const end = windowHeight * 0.35;
      const rawProgress = (start - rect.top) / (start - end);
      const clamped = Math.max(0, Math.min(1, rawProgress));

      scrollProgressRef.current = clamped;
      setProgress(clamped);

      // Interpolate number from 1,200 down to 12
      // Using easeOutCubic curve for realistic deceleration
      const eased = 1 - Math.pow(1 - clamped, 3);
      const calculatedRatio = Math.round(1200 - (1200 - 12) * eased);
      setBuyerRatio(calculatedRatio);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // run once on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Canvas drawing & animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
      initParticles(width, height);
    };

    window.addEventListener("resize", handleResize);
    initParticles(width, height);

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      const curProgress = scrollProgressRef.current;
      const mouse = mouseRef.current;

      // 1. Render Clusters background rings & aura
      CLUSTERS.forEach((cluster) => {
        const cx = (cluster.xPercent / 100) * width;
        const cy = (cluster.yPercent / 100) * height;
        const r = cluster.radius;

        // Cluster scale and opacity tied to scroll progress
        const clusterOpacity = Math.min(1, curProgress * 1.25);
        const clusterScale = 0.65 + 0.35 * curProgress;

        if (clusterOpacity > 0.05) {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.scale(clusterScale, clusterScale);

          // Soft radial glow aura
          const auraGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 1.5);
          auraGrad.addColorStop(0, `rgba(212, 255, 0, ${0.18 * clusterOpacity})`);
          auraGrad.addColorStop(0.6, `rgba(212, 255, 0, ${0.05 * clusterOpacity})`);
          auraGrad.addColorStop(1, "rgba(212, 255, 0, 0)");
          ctx.fillStyle = auraGrad;
          ctx.beginPath();
          ctx.arc(0, 0, r * 1.5, 0, Math.PI * 2);
          ctx.fill();

          // Outer dashed / pulsating targeting circle
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(212, 255, 0, ${0.75 * clusterOpacity})`;
          ctx.lineWidth = 1.4;
          ctx.setLineDash([4, 4]);
          ctx.lineDashOffset = -time * 12;
          ctx.stroke();

          // Inner solid subtle circle
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.96, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(212, 255, 0, ${0.25 * clusterOpacity})`;
          ctx.lineWidth = 1;
          ctx.setLineDash([]);
          ctx.stroke();

          ctx.restore();
        }
      });

      // 2. Render particles
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (p.type === "bg") {
          // Drift
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          // Mouse subtle repulsion
          if (mouse.isHovering) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 80 && dist > 0) {
              p.x += (dx / dist) * 1.2;
              p.y += (dy / dist) * 1.2;
            }
          }

          // Twinkle
          const alpha = p.alpha + Math.sin(time * 3 + p.twinklePhase) * 0.15;
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, alpha)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === "cluster") {
          // Cluster buyer particle
          const clusterConfig = CLUSTERS.find((c) => c.id === p.clusterId);
          if (!clusterConfig) continue;

          const cx = (clusterConfig.xPercent / 100) * width;
          const cy = (clusterConfig.yPercent / 100) * height;
          const r = clusterConfig.radius;

          // Orbit and jitter
          p.angle += p.orbitSpeed;
          const currentDist = p.baseDistance + Math.sin(time * 4 + p.angle * 2) * 4;

          const targetX = cx + Math.cos(p.angle) * currentDist;
          const targetY = cy + Math.sin(p.angle) * currentDist;

          // Smooth lerp
          p.x += (targetX - p.x) * 0.12;
          p.y += (targetY - p.y) * 0.12;

          const clusterOpacity = Math.min(1, curProgress * 1.2);

          // Glowing lime yellow dot
          ctx.fillStyle = `rgba(212, 255, 0, ${p.alpha * clusterOpacity})`;
          ctx.shadowColor = "#d4ff00";
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        }
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Mouse handlers for interactive feel
  const handleMouseMove = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      isHovering: true,
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current.isHovering = false;
  };

  // Format ratio number with comma (e.g. 1,095 or 12)
  const formattedRatio = buyerRatio.toLocaleString();

  return (
    <div
      className="crowd-visual-box"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background HTML5 Canvas for crowd & clusters */}
      <canvas ref={canvasRef} className="crowd-canvas" />

      {/* Top Left Tag */}
      <div className="crowd-box__top-tag">
        <span className="crowd-box__top-dot" />
        <span className="crowd-box__top-text">1,200 PEOPLE IN THE CROWD</span>
      </div>

      {/* Interactive Cluster Overlay Labels */}
      <div className="crowd-clusters-overlay">
        {CLUSTERS.map((cluster) => {
          const isFadedIn = progress > 0.15;
          return (
            <div
              key={cluster.id}
              className={`crowd-cluster-callout ${
                isFadedIn ? "is-visible" : ""
              } ${activeCluster === cluster.id ? "is-active" : ""}`}
              style={{
                left: `${cluster.xPercent}%`,
                top: `${cluster.yPercent}%`,
              }}
              onMouseEnter={() => setActiveCluster(cluster.id)}
              onMouseLeave={() => setActiveCluster(null)}
            >
              {/* Badge (Pill) */}
              <div className="cluster-badge">{cluster.tag}</div>

              {/* Description */}
              <div className="cluster-label">
                <span className="cluster-count">{cluster.count}</span>{" "}
                <span className="cluster-desc">{cluster.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Left Dynamic Stat Counter */}
      <div className="crowd-box__bottom-stat">
        <div className="crowd-stat__headline">
          <span className="crowd-stat__prefix">1 in</span>
          <span className="crowd-stat__counter">{formattedRatio}</span>
        </div>
        <div className="crowd-stat__subline">is your buyer</div>
      </div>
    </div>
  );
}
