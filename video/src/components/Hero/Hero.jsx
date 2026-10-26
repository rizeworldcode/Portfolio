import { useState } from "react";
import { motion } from "framer-motion";
import "./Hero.css";

export default function Hero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Services list matching reference
  const services = [
    { num: "(01)", label: "Brand identity design" },
    { num: "(02)", label: "Framer development" },
    { num: "(03)", label: "UI/UX strategy" },
    { num: "(04)", label: "Creative campaigns" },
  ];

  // Motion variants
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (custom = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 24,
        stiffness: 180,
        delay: custom * 0.1,
      },
    }),
  };

  return (
    <header className="ignitex-hero" id="home">
      {/* 3D Metallic Sculpture Background */}
      <div className="ignitex-hero__bg-wrap" aria-hidden="true">
        <img
          src="/hero-bg.jpg"
          alt="3D Dark Chrome Sculpture Background"
          className="ignitex-hero__bg-img"
        />
        {/* Cinematic Vignette Overlays for Maximum Readability */}
        <div className="ignitex-hero__overlay-left" />
        <div className="ignitex-hero__overlay-top" />
        <div className="ignitex-hero__overlay-bottom" />
      </div>

      {/* ========================================================
          1. TOP NAVIGATION BAR
          ======================================================== */}
      <motion.nav
        className="ignitex-nav"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        aria-label="Main Navigation"
      >
        {/* Brand Logo */}
        <a href="#home" className="ignitex-nav__logo" aria-label="IGNITEX Homepage">
          IGNITEX<span className="ignitex-nav__logo-tm">™</span>
        </a>

        {/* Center Location */}
        <div className="ignitex-nav__location">
          Based in: <strong>Los Angeles, USA</strong>
        </div>

        {/* Right Menu Links */}
        <div className="ignitex-nav__menu">
          <ul className="ignitex-nav__links">
            <li>
              <a href="#home" className="ignitex-nav__link ignitex-nav__link--active">
                <span className="ignitex-nav__dot" aria-hidden="true" />
                Home
              </a>
            </li>
            <li>
              <a href="#about" className="ignitex-nav__link">
                About us
              </a>
            </li>
            <li>
              <a href="#projects" className="ignitex-nav__link">
                Projects <sup className="ignitex-nav__sup">(07)</sup>
              </a>
            </li>
            <li>
              <a href="#contact" className="ignitex-nav__link">
                Contact
              </a>
            </li>
          </ul>

          {/* Hamburger Menu Toggle (Mobile) */}
          <button
            type="button"
            className={`ignitex-nav__hamburger ${
              mobileMenuOpen ? "is-open" : ""
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="ignitex-nav__bar ignitex-nav__bar--1" />
            <span className="ignitex-nav__bar ignitex-nav__bar--2" />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <motion.div
          className="ignitex-mobile-drawer"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <a
            href="#home"
            onClick={() => setMobileMenuOpen(false)}
            className="ignitex-mobile-drawer__link"
          >
            Home
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="ignitex-mobile-drawer__link"
          >
            About us
          </a>
          <a
            href="#projects"
            onClick={() => setMobileMenuOpen(false)}
            className="ignitex-mobile-drawer__link"
          >
            Projects (07)
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="ignitex-mobile-drawer__link"
          >
            Contact
          </a>
        </motion.div>
      )}

      {/* ========================================================
          2. CENTER HERO TYPOGRAPHY (Design & Strategy)
          ======================================================== */}
      <div className="ignitex-hero__center">
        <h1 className="ignitex-hero__headline">
          <motion.div
            className="ignitex-hero__line ignitex-hero__line--1"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            <span className="ignitex-hero__word">Design</span>
          </motion.div>

          <motion.div
            className="ignitex-hero__line ignitex-hero__line--2"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            <span className="ignitex-hero__ampersand">&amp;</span>
            <span className="ignitex-hero__word">Strategy</span>
          </motion.div>
        </h1>
      </div>

      {/* ========================================================
          3. BOTTOM AREA (Description on Left, Services & CTA on Right)
          ======================================================== */}
      <div className="ignitex-hero__bottom">
        {/* Bottom Left */}
        <motion.div
          className="ignitex-hero__bottom-left"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          <div className="ignitex-hero__desc-box">
            <span className="ignitex-hero__sparkle" aria-hidden="true">
              ✦
            </span>
            <p className="ignitex-hero__desc">
              We turn bold ideas into standout brands and sleek websites. Let's
              bring your vision to life.
            </p>
          </div>
          <p className="ignitex-hero__copyright">© 2026 Ignitex creative agency</p>
        </motion.div>

        {/* Bottom Right: Services List + Pill CTA Button */}
        <motion.div
          className="ignitex-hero__bottom-right"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
        >
          <ul className="ignitex-hero__services" aria-label="Services List">
            {services.map((item, index) => (
              <li key={index} className="ignitex-hero__service-item">
                <span className="ignitex-hero__service-num">{item.num}</span>
                <span className="ignitex-hero__service-label">{item.label}</span>
              </li>
            ))}
          </ul>

          <a href="#contact" className="ignitex-hero__cta-btn">
            <span className="ignitex-hero__cta-text">Let's work together</span>
            <span className="ignitex-hero__cta-arrow" aria-hidden="true">
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
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </a>
        </motion.div>
      </div>
    </header>
  );
}
