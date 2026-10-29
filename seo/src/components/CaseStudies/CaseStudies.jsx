import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import "./CaseStudies.css";

export default function CaseStudies() {
  const [activeClientIndex, setActiveClientIndex] = useState(0);
  const [sliderPos, setSliderPos] = useState(38); // percentage split
  const [isDragging, setIsDragging] = useState(false);
  const [cardWidth, setCardWidth] = useState(1380);
  const containerRef = useRef(null);

  const clients = [
    {
      id: "local-seo",
      name: "Local SEO in Alwar",
      year: "2026",
      metricLabel: "LOCAL SEARCH VISIBILITY",
      beforeVal: "Unranked",
      afterVal: "#1 Local Pack",
      metricUnit: "",
      avatar: "/local-seo-alwar-rank.jpeg",
      summary: "Ranked #1 in Alwar",
      desc: "Improved local search visibility and strengthened location relevance across Alwar & surrounding areas.",
      tag1: "Local SEO",
      tag2: "Alwar Pack",
    },
    {
      id: "target-keywords",
      name: "Target Keywords",
      year: "2026",
      metricLabel: "SEARCH INTENT MAPPING",
      beforeVal: "Scattered",
      afterVal: "Structured",
      metricUnit: "",
      avatar: "/target-keywords-report.jpeg",
      summary: "Commercial & Local",
      desc: "Structured relevant commercial and local keywords around appropriate website pages.",
      tag1: "Keywords",
      tag2: "Search Intent",
    },
    {
      id: "technical-seo",
      name: "Technical SEO",
      year: "2026",
      metricLabel: "CRAWLABILITY & HEALTH",
      beforeVal: "48%",
      afterVal: "99%",
      metricUnit: "",
      avatar: "/technical-seo-code.jpeg",
      summary: "Crawl-Friendly Setup",
      desc: "Improved the website’s technical foundation, crawlability, and search-friendly structure.",
      tag1: "Technical",
      tag2: "Core Web Vitals",
    },
    {
      id: "on-page-seo",
      name: "On-Page SEO",
      year: "2026",
      metricLabel: "METADATA & HEADINGS",
      beforeVal: "Basic",
      afterVal: "Optimized",
      metricUnit: "",
      avatar: "/onpage-seo-mapping.jpeg",
      summary: "Page Relevance",
      desc: "Refined content, metadata, headings, images, and internal linking for clearer page relevance.",
      tag1: "On-Page",
      tag2: "Internal Links",
    },
  ];

  const current = clients[activeClientIndex];

  // Keep cardWidth synchronized with real container width
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setCardWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Drag & Move handler for the before/after split slider
  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPos(percent);
  }, []);

  // Global pointer/touch listeners while dragging so fast drags never break
  useEffect(() => {
    if (!isDragging) return;

    const onPointerMove = (e) => {
      const clientX = e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX;
      if (clientX !== undefined) {
        handleMove(clientX);
      }
    };

    const onPointerUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);
    window.addEventListener("touchcancel", onPointerUp);

    return () => {
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
      window.removeEventListener("touchcancel", onPointerUp);
    };
  }, [isDragging, handleMove]);

  return (
    <section className="cases-section" id="results">
      <div className="cases-container">
        {/* ============================================================
            TOP HEADER AREA
            ============================================================ */}
        <div className="cases-header">
          <div className="cases-header__left">
            <div className="cases-pill">
              <span className="cases-pill__dot" />
              <span className="cases-pill__text">(05) SEO Results & Visibility</span>
            </div>

            <h2 className="cases-title">
              <span className="cases-title__row">Results You Can</span>
              <span className="cases-title__highlight">Count.</span>
            </h2>
          </div>

          <div className="cases-header__right">
            <p className="cases-desc">
              The SEO work focused on building a stronger organic-search foundation for RizeWorld by improving local relevance, keyword targeting, technical structure, and on-page optimization.
            </p>
          </div>
        </div>

        {/* ============================================================
            HORIZONTAL CLIENT PILL TABS
            ============================================================ */}
        <div className="cases-tabs-rail">
          {clients.map((c, idx) => (
            <button
              key={c.id}
              type="button"
              className={`cases-tab-pill ${
                idx === activeClientIndex ? "cases-tab-pill--active" : ""
              }`}
              onClick={() => setActiveClientIndex(idx)}
            >
              <div className="cases-tab-pill__avatar">
                <img src={c.avatar} alt={c.name} />
              </div>
              <div className="cases-tab-pill__meta">
                <span className="cases-tab-pill__name">{c.name}</span>
                <span className="cases-tab-pill__summary">{c.summary}</span>
              </div>
            </button>
          ))}
        </div>

        {/* ============================================================
            INTERACTIVE BEFORE / AFTER SLIDER CARD
            ============================================================ */}
        <div
          ref={containerRef}
          className={`cases-card ${isDragging ? "cases-card--dragging" : ""}`}
          onMouseDown={(e) => {
            setIsDragging(true);
            handleMove(e.clientX);
          }}
          onTouchStart={(e) => {
            if (e.touches && e.touches[0]) {
              setIsDragging(true);
              handleMove(e.touches[0].clientX);
            }
          }}
        >
          {/* Top Badges Row (Flex container prevents overlap) */}
          <div className="cases-card__top-bar">
            <div className="cases-card__badge-left">
              <span className="cases-card__badge-dot" />
              <span className="cases-card__badge-text">
                {current.name} · 2026
              </span>
            </div>

            <div className="cases-card__badge-right">
              <span>{current.metricLabel}</span>
            </div>
          </div>

          {/* ============================================================
              FULL-COLOR "AFTER" LAYER (BACKGROUND)
              ============================================================ */}
          <div className="cases-layer cases-layer--after">
            <img
              src={current.avatar}
              alt="After transformation"
              className="cases-layer__img"
            />
            {/* Dark contrast gradient */}
            <div className="cases-layer__gradient" />

            {/* Glowing Lime Ascending Growth Curve Chart */}
            <svg
              className="cases-growth-chart"
              viewBox="0 0 1000 400"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="limeFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d4ff00" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#d4ff00" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Shaded Area Under Curve */}
              <motion.path
                d="M 280 380 Q 500 340, 650 300 T 1000 180 L 1000 400 L 280 400 Z"
                fill="url(#limeFill)"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.2 }}
              />
              {/* Highlighting Curve Line with path draw animation */}
              <motion.path
                d="M 280 380 Q 500 340, 650 300 T 1000 180"
                fill="none"
                stroke="#d4ff00"
                strokeWidth="4.5"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1.6, ease: "easeOut" }}
              />
            </svg>

            {/* Bottom Right "After" Stat */}
            <div className="cases-stat cases-stat--after">
              <div className="cases-stat__tag cases-stat__tag--lime">
                <span className="cases-stat__dot" />
                <span>AFTER</span>
              </div>
              <div className="cases-stat__val cases-stat__val--lime">
                {current.afterVal}
              </div>
            </div>
          </div>

          {/* ============================================================
              GRAYSCALE "BEFORE" LAYER (CLIPPED BY SLIDER)
              ============================================================ */}
          <div
            className="cases-layer cases-layer--before"
            style={{ width: `${sliderPos}%` }}
          >
            <div
              className="cases-layer__inner-wrapper"
              style={{ width: `${cardWidth}px` }}
            >
              <img
                src={current.avatar}
                alt="Before transformation"
                className="cases-layer__img cases-layer__img--bw"
              />
              <div className="cases-layer__dim-overlay" />

              {/* Flat Dotted Baseline Chart */}
              <svg
                className="cases-growth-chart"
                viewBox="0 0 1000 400"
                preserveAspectRatio="none"
              >
                <path
                  d="M 0 380 L 1000 380"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.4)"
                  strokeWidth="2.5"
                  strokeDasharray="6 6"
                />
              </svg>

              {/* Bottom Left "Before" Stat */}
              <div className="cases-stat cases-stat--before">
                <div className="cases-stat__tag">BEFORE</div>
                <div className="cases-stat__val cases-stat__val--dim">
                  {current.beforeVal}
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================
              DRAGGABLE SLIDER DIVIDER HANDLE
              ============================================================ */}
          <div
            className="cases-slider-handle"
            style={{ left: `${sliderPos}%` }}
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={() => setIsDragging(true)}
          >
            <div className="cases-slider-handle__line" />
            <div className="cases-slider-handle__knob">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom Case Details Bar */}
        <div className="cases-detail-bar">
          <div className="cases-detail-bar__left">
            <div className="cases-detail-bar__cat">Alwar Local Search — 2026</div>
            <h3 className="cases-detail-bar__title">
              {current.name}
            </h3>
          </div>

          <div className="cases-detail-bar__right">
            <p className="cases-detail-bar__desc">
              {current.desc}
            </p>
            <div className="cases-detail-bar__actions">
              <span className="cases-detail-pill">{current.tag1}</span>
              <span className="cases-detail-pill">{current.tag2}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
