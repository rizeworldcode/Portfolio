import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "./CrowdBuyers.css";

export default function CrowdBuyers() {
  const [activeCluster, setActiveCluster] = useState("FEEDS");
  const [ratio, setRatio] = useState(848);
  const canvasRef = useRef(null);

  const clusters = [
    {
      id: "SEARCH",
      label: "SEARCH",
      cx: 34,
      cy: 50,
      radius: 14,
      detail: '299 searching "dentist near me"',
      count: 299,
      ratioVal: 32,
    },
    {
      id: "FEEDS",
      label: "FEEDS",
      cx: 58,
      cy: 32,
      radius: 16,
      detail: "1,892 following #coffee",
      count: 1892,
      ratioVal: 12,
    },
    {
      id: "AUDIENCES",
      label: "AUDIENCES",
      cx: 80,
      cy: 56,
      radius: 15,
      detail: "78 lookalikes",
      count: 78,
      ratioVal: 24,
    },
  ];

  // Animate ratio down when switching clusters
  const handleClusterSelect = (cl) => {
    setActiveCluster(cl.id);
    const start = ratio;
    const end = cl.ratioVal;
    const duration = 600;
    const startTime = performance.now();

    const animateNumber = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setRatio(Math.floor(start + (end - start) * ease));

      if (progress < 1) {
        requestAnimationFrame(animateNumber);
      }
    };
    requestAnimationFrame(animateNumber);
  };

  // Draw particle starry crowd on Canvas for ultra-smooth 60fps rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    // Generate background crowd particles
    const numParticles = 480;
    const particles = [];
    const width = canvas.getBoundingClientRect().width;
    const height = canvas.getBoundingClientRect().height;

    // Ambient scattered particles
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.2 + 0.6,
        alpha: Math.random() * 0.4 + 0.15,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        isCluster: false,
      });
    }

    // Cluster concentrated particles
    clusters.forEach((cl) => {
      const clusterX = (cl.cx / 100) * width;
      const clusterY = (cl.cy / 100) * height;
      const clusterR = (cl.radius / 100) * width;

      for (let j = 0; j < 35; j++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * clusterR * 0.85;
        particles.push({
          x: clusterX + Math.cos(angle) * dist,
          y: clusterY + Math.sin(angle) * dist,
          radius: Math.random() * 1.8 + 1.2,
          alpha: Math.random() * 0.4 + 0.6,
          twinkleSpeed: Math.random() * 0.03 + 0.01,
          isCluster: true,
          clusterId: cl.id,
        });
      }
    });

    let time = 0;
    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        const currentAlpha =
          p.alpha + Math.sin(time * 3 + p.x) * (p.isCluster ? 0.2 : 0.08);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (p.isCluster) {
          ctx.fillStyle = `rgba(212, 255, 0, ${Math.max(0.2, currentAlpha)})`;
          ctx.shadowColor = "#d4ff00";
          ctx.shadowBlur = 6;
        } else {
          ctx.fillStyle = `rgba(220, 225, 235, ${Math.max(0.08, currentAlpha)})`;
          ctx.shadowBlur = 0;
        }
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="crowd-section" id="why-us">
      <div className="crowd-container">
        {/* ============================================================
            TOP HEADER AREA (FROM IMAGE 2)
            ============================================================ */}
        <div className="crowd-header">
          {/* Left Title & Pill */}
          <div className="crowd-header__left">
            <div className="crowd-pill">
              <span className="crowd-pill__dot" />
              <span className="crowd-pill__text">(01) Why Reachwise</span>
            </div>

            <h2 className="crowd-title">
              <span className="crowd-title__line">Everyone is a crowd.</span>
              <span className="crowd-title__line">
                We find <span className="crowd-badge">your</span>{" "}
                <span className="crowd-badge">buyers.</span>
              </span>
            </h2>
          </div>

          {/* Right Description, Button & Meta */}
          <div className="crowd-header__right">
            <p className="crowd-desc">
              Most brands aren't invisible. They're talking to the wrong people.
              We find the searches, feeds and audiences where your buyers
              already are — and put you there.
            </p>

            <a href="#about" className="crowd-btn-about">
              <span>About us</span>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>

            <div className="crowd-stats-row">
              <span className="crowd-stat-item">
                <span className="crowd-stat-bullet">•</span> FOUNDED 2016
              </span>
              <span className="crowd-stat-item">
                <span className="crowd-stat-bullet">•</span> 38 PEOPLE
              </span>
              <span className="crowd-stat-item">
                <span className="crowd-stat-bullet">•</span> NEW YORK + REMOTE
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================
            BOTTOM INTERACTIVE CROWD BOX (FROM IMAGE 1 & 2)
            ============================================================ */}
        <div className="crowd-box">
          {/* Canvas for galaxy/crowd particles */}
          <canvas ref={canvasRef} className="crowd-canvas" />

          {/* Top Left Tag */}
          <div className="crowd-box__tag">
            <span className="crowd-box__dot" />
            <span className="crowd-box__tag-text">
              1,200 PEOPLE IN THE CROWD
            </span>
          </div>

          {/* Bottom Left Big Stat */}
          <div className="crowd-box__stat">
            <div className="crowd-box__ratio">
              <span className="crowd-box__prefix">1 in</span>
              <span className="crowd-box__number">{ratio}</span>
            </div>
            <div className="crowd-box__label">is your buyer</div>
          </div>

          {/* Interactive Cluster Circles & Pills */}
          {clusters.map((cl) => (
            <div
              key={cl.id}
              className={`crowd-cluster ${
                activeCluster === cl.id ? "crowd-cluster--active" : ""
              }`}
              style={{
                left: `${cl.cx}%`,
                top: `${cl.cy}%`,
              }}
              onClick={() => handleClusterSelect(cl)}
              onMouseEnter={() => handleClusterSelect(cl)}
            >
              {/* Outer boundary circle */}
              <div className="crowd-cluster__circle" />

              {/* Cluster Tag & Detail text */}
              <div className="crowd-cluster__info">
                <span className="crowd-cluster__pill">{cl.label}</span>
                <span className="crowd-cluster__detail">{cl.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
