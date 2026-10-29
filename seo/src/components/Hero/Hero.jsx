import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "./Hero.css";

export default function Hero() {
  const [activeTab, setActiveTab] = useState("01");
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [counter, setCounter] = useState(1280000);
  const heroRef = useRef(null);

  // Animated counter for people reached
  useEffect(() => {
    const target = 1286432;
    const duration = 2000;
    const start = 1280000;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCounter(Math.floor(start + (target - start) * easeOut));

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  }, []);

  // Track mouse for dynamic spotlight beam & radar effect
  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const services = [
    { id: "01", label: "SEO" },
    { id: "02", label: "Social media" },
    { id: "03", label: "Paid ads" },
    { id: "04", label: "Content" },
  ];

  return (
    <section
      ref={heroRef}
      className="hero-section"
      onMouseMove={handleMouseMove}
      id="hero"
    >
      {/* Background Crowd Photography */}
      <div className="hero-bg">
        <img
          src="/crowd-bg.jpg"
          alt="Aerial crowd perspective"
          className="hero-bg__img"
        />
        {/* Dark cinematic vignette overlays */}
        <div className="hero-bg__overlay-top" />
        <div className="hero-bg__overlay-bottom" />
        <div className="hero-bg__overlay-radial" />

        {/* Dynamic Lime Spotlight Beam & Cursor Spotlight */}
        <div
          className="hero-spotlight-beam"
          style={{
            "--beam-x": `${mousePos.x}%`,
            "--beam-y": `${mousePos.y}%`,
          }}
          aria-hidden="true"
        />
        {/* Cursor tracking spotlight circle */}
        <div
          className="hero-cursor-spotlight"
          style={{
            left: `${mousePos.x}%`,
            top: `${mousePos.y}%`,
          }}
          aria-hidden="true"
        />

        {/* Floating Social Proof Event Pills over the crowd */}
        <div className="hero-floating-pills" aria-hidden="true">
          <div className="hero-float-pill hero-float-pill--1">
            <span className="hero-float-pill__icon">⭐</span>
            <span className="hero-float-pill__text">5 star review</span>
          </div>
          <div className="hero-float-pill hero-float-pill--2">
            <span className="hero-float-pill__dot" />
            <span className="hero-float-pill__text">17 leads today</span>
          </div>
          <div className="hero-float-pill hero-float-pill--3">
            <span className="hero-float-pill__icon">⚡</span>
            <span className="hero-float-pill__text">28 new followers</span>
          </div>
        </div>
      </div>

      {/* Top Right Radar Tracker */}
      <div className="hero-radar-tracker">
        <div className="hero-radar-tracker__header">
          <span className="hero-radar-tracker__pulse-ring" />
          <span className="hero-radar-tracker__text">
            MOVE TO REACH · CLICK TO LAUNCH A CAMPAIGN
          </span>
        </div>
        <div className="hero-radar-circle">
          <div className="hero-radar-circle__crosshair-h" />
          <div className="hero-radar-circle__crosshair-v" />
          <div className="hero-radar-circle__sweep" />
          <span className="hero-radar-circle__dot" />
          <span className="hero-radar-circle__label">REACH</span>
        </div>
      </div>

      {/* Main Hero Center Content */}
      <div className="hero-content">
        {/* Status Pill Badge */}
        <motion.div
          className="hero-status-pill"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="hero-status-pill__dot" />
          <span className="hero-status-pill__text">
            RizeWorld · Ranked #1 in Alwar & Local Pack
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="hero-title__row">Get seen by</span>
          <span className="hero-title__row">
            the{" "}
            <span className="hero-badge-pill">
              right
            </span>{" "}
            <span className="hero-badge-pill">
              crowd.
            </span>
          </span>
        </motion.h1>

        {/* Subtitle / Paragraph */}
        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
        >
          RizeWorld’s SEO strategy combines keyword research, on-page SEO, technical optimization, local search, and content strategy to build a stronger foundation for long-term organic growth.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
        >
          {/* Primary Strategy Button */}
          <a href="#clients" className="hero-btn-primary">
            <span>Explore SEO Strategy</span>
            <span className="hero-btn-primary__icon">
              <svg
                width="16"
                height="16"
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
            </span>
          </a>

          {/* Secondary Work Button */}
          <a href="#results" className="hero-btn-secondary">
            <span>See Results</span>
            <svg
              className="hero-btn-secondary__arrow"
              width="15"
              height="15"
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
        </motion.div>
      </div>

      {/* Bottom Hero Bar (3 Columns: Metrics, Filter Pills, Social Proof) */}
      <motion.div
        className="hero-bottom-bar"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        {/* Left Column: People Reached Metric */}
        <div className="hero-stat-card">
          <div className="hero-stat-card__eyebrow">
            <span className="hero-stat-card__dot" />
            <span>PEOPLE REACHED FOR CLIENTS THIS MONTH</span>
          </div>
          <div className="hero-stat-card__number">
            {counter.toLocaleString()}
          </div>
        </div>

        {/* Center Column: Interactive Service Pills */}
        <div className="hero-service-tabs">
          {services.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`hero-tab-pill ${
                activeTab === item.id ? "hero-tab-pill--active" : ""
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="hero-tab-pill__num">{item.id}</span>
              <span className="hero-tab-pill__label">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Right Column: Rating & Brand Trust */}
        <div className="hero-social-proof">
          <div className="hero-social-proof__stars-row">
            <div className="hero-social-proof__stars">
              {"★".repeat(5)}
            </div>
            <span className="hero-social-proof__rating">
              4.9 · 126 client reviews
            </span>
          </div>
          <div className="hero-social-proof__sub">
            140+ brands grown
          </div>
        </div>
      </motion.div>
    </section>
  );
}
