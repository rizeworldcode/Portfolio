import { motion } from 'framer-motion'
import ScatterGrid from './ScatterGrid'
import './Hero.css'

export default function Hero() {

  const marqueeItems = [
    "RIZEWORLD GRAPHIC STUDIO",
    "BRAND IDENTITY",
    "SOCIAL CAMPAIGNS",
    "PACKAGING DESIGN",
    "MARKETING CREATIVES",
    "PRINT & BILLBOARDS",
    "ALWAR, RAJASTHAN",
  ]

  return (
    <section
      className="hero-monumental hero-scatter-version"
      id="hero"
      aria-label="RizeWorld Graphic Portfolio Hero"
    >
      {/* ---- Ambient Mesh Glow & Interactive Grid ---- */}
      <div className="hero-mesh-bg" aria-hidden="true">
        <div className="hero-glow hero-glow--orange" />
        <div className="hero-glow hero-glow--green" />
        <div className="hero-glow hero-glow--cyan" />
        <div className="hero-grid-pattern" />
      </div>

      {/* ---- Corner Brand Logo ---- */}
      <a href="#hero" className="hero-corner hero-corner--tl hero-corner-brand" aria-label="RizeWorld Logo">
        <img src="/RW.png" alt="RizeWorld Logo" className="hero-corner-logo" />
      </a>

      <div className="hero-corner hero-corner--tr" aria-hidden="true">
        <span>EST. 2025 · ALWAR, INDIA</span>
      </div>



      {/* ---- Main Hero Stage ---- */}
      <div className="hero-stage hero-stage--scatter">
        {/* Top Interactive Kicker Pill */}
        <motion.div
          className="hero-kicker-pill"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <span className="hero-kicker-pill__star">✦</span>
          <span>INTERACTIVE PHYSICS MATRIX</span>
          <span className="hero-kicker-pill__star">✦</span>
        </motion.div>

        {/* ========================================================
            FRAMER SCATTER GRID (Interactive Dot-Matrix Particle Engine)
            ======================================================== */}
        <motion.div
          className="hero-scatter-wrapper"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          <ScatterGrid
            text={"RIZEWORLD\nGRAPHIC PORTFOLIO"}
            tag="h1"
            fontFamily='"Anton", "Outfit", sans-serif'
            fontWeight="400"
            dotSize={4}
            dotGap={2}
            radius={180}
            strength={2.5}
            stiffness={0.016}
            damping={0.88}
            bleed={50}
            breathe={true}
            base="#ffffff"
            accent="#ff6b35"
            className="hero-scatter-canvas"
          />
        </motion.div>



      </div>

      {/* ---- Bottom Kinetic Marquee Ticker ---- */}
      <div className="hero-marquee-container" aria-hidden="true">
        <div className="hero-marquee-track">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((txt, i) => (
            <div key={i} className="hero-marquee-item">
              <span className="hero-marquee-text">{txt}</span>
              <span className="hero-marquee-separator">✦</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
