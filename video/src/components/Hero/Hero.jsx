import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import "./Hero.css";

export default function Hero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {
        // Handled silently if browser restrictions apply
      });
    }
  }, []);

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
      {/* Background Video & Overlays */}
      <div className="ignitex-hero__bg-wrap" aria-hidden="true">
        <video
          ref={videoRef}
          className="ignitex-hero__bg-video"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
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
        <a href="#home" className="ignitex-nav__logo" aria-label="Rizeworld Homepage">
          Rizeworld<span className="ignitex-nav__logo-tm"></span>
        </a>

        {/* Center Location */}
        <div className="ignitex-nav__location">
          Based in: <strong>Alwar, Rajasthan</strong>
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
            className={`ignitex-nav__hamburger ${mobileMenuOpen ? "is-open" : ""
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

            <p className="ignitex-hero__desc">
              Rizeworld video graphic design portfolio
            </p>
          </div>
          <p className="ignitex-hero__copyright">© 2026 Rizeworld </p>
        </motion.div>

      </div>
    </header>
  );
}
