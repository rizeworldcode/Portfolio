import { useState, useRef } from "react";
import { motion } from "framer-motion";
import "./CaseStudies.css";

export default function CaseStudies() {
  const [activeClientIndex, setActiveClientIndex] = useState(0);
  const [sliderPos, setSliderPos] = useState(32); // percentage split
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const clients = [
    {
      id: "northside",
      name: "Northside Dental",
      year: "2025",
      metricLabel: "ORGANIC VISITS A MONTH",
      beforeVal: "4,200",
      afterVal: "32,524",
      metricUnit: "",
      avatar: "/dental-clinic.jpg",
      summary: "4,200 → 32,524",
    },
    {
      id: "kettlebrook",
      name: "Kettlebrook Coffee",
      year: "2024",
      metricLabel: "MONTHLY REVENUE",
      beforeVal: "8,100",
      afterVal: "96,400",
      metricUnit: "$",
      avatar: "/crowd-bg.jpg",
      summary: "8,100 → 96,400",
    },
    {
      id: "fitloop",
      name: "Fitloop",
      year: "2024",
      metricLabel: "PAID AD ROAS",
      beforeVal: "1.4x",
      afterVal: "6.2x",
      metricUnit: "",
      avatar: "/crowd-bg.jpg",
      summary: "1.4x → 6.2x",
    },
    {
      id: "haven",
      name: "Haven Realty",
      year: "2025",
      metricLabel: "QUALIFIED LEADS PER MO",
      beforeVal: "14",
      afterVal: "122",
      metricUnit: "",
      avatar: "/dental-clinic.jpg",
      summary: "14 → 122",
    },
    {
      id: "lumen",
      name: "Lumen Skin",
      year: "2024",
      metricLabel: "ECOMMERCE REVENUE",
      beforeVal: "$18k",
      afterVal: "$142k",
      metricUnit: "",
      avatar: "/crowd-bg.jpg",
      summary: "$18k → $142k",
    },
    {
      id: "orbit",
      name: "Orbit Legal",
      year: "2025",
      metricLabel: "CLIENT INQUIRIES / MO",
      beforeVal: "9",
      afterVal: "57",
      metricUnit: "",
      avatar: "/dental-clinic.jpg",
      summary: "9 → 57",
    },
  ];

  const current = clients[activeClientIndex];

  // Drag & Move handler for the before/after split slider
  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPos(percent);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <section className="cases-section" id="results">
      <div className="cases-container">
        {/* ============================================================
            TOP HEADER AREA
            ============================================================ */}
        <div className="cases-header">
          <div className="cases-header__left">
            <h2 className="cases-title">
              <span className="cases-title__row">Results you can</span>
              <span className="cases-title__highlight">count.</span>
            </h2>
          </div>

          <div className="cases-header__right">
            <p className="cases-desc">
              Six clients, six channels, one rule: we report the number that
              pays the bills, before and after.
            </p>
            <a href="#case-studies" className="cases-btn-all">
              <span>All case studies</span>
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
          className="cases-card"
          onMouseMove={handleMouseMove}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => setIsDragging(false)}
        >
          {/* Top Left Tag: Client Name + Year */}
          <div className="cases-card__badge-left">
            <span className="cases-card__badge-dot" />
            <span className="cases-card__badge-text">
              {current.name} · {current.year}
            </span>
          </div>

          {/* Top Right Tag: Metric Label */}
          <div className="cases-card__badge-right">
            <span>{current.metricLabel}</span>
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
              <path
                d="M 280 380 Q 500 340, 650 300 T 1000 180 L 1000 400 L 280 400 Z"
                fill="url(#limeFill)"
              />
              {/* Highlighting Curve Line */}
              <path
                d="M 280 380 Q 500 340, 650 300 T 1000 180"
                fill="none"
                stroke="#d4ff00"
                strokeWidth="4"
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
            <div className="cases-layer__inner-wrapper">
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

        {/* Bottom Case Details Bar (matching video at 00:11) */}
        <div className="cases-detail-bar">
          <div className="cases-detail-bar__left">
            <div className="cases-detail-bar__cat">DENTAL CLINIC · 2025</div>
            <h3 className="cases-detail-bar__title">
              From page 4 to the top 3 for "dentist near me"
            </h3>
          </div>

          <div className="cases-detail-bar__right">
            <p className="cases-detail-bar__desc">
              A local SEO rebuild: 88 location pages, 580 reviews and a content
              plan for every treatment.
            </p>
            <div className="cases-detail-bar__actions">
              <span className="cases-detail-pill">SEO</span>
              <span className="cases-detail-pill">Content</span>
              <a href="#read-case" className="cases-detail-btn">
                <span>READ THE CASE</span>
                <span className="cases-detail-btn__arrow">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
