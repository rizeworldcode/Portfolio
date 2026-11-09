import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import "./Hero.css";

export default function Hero() {
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
      {/* Background Video (Clean, Original Quality, No Effects) */}
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
          <source src="/export .mp4" type="video/mp4" />
        </video>
      </div>

      {/* ========================================================
          1. TOP NAVIGATION BAR (Brand Logo Only - Buttons moved to Section 2)
          ======================================================== */}
      <motion.nav
        className="ignitex-nav"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        aria-label="Main Navigation"
      >
        {/* Brand Logo */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="ignitex-nav__logo"
          aria-label="Rizeworld Homepage"
        >
          <img src="/RW.png" alt="Rizeworld" className="ignitex-nav__logo-img" />
        </a>
      </motion.nav>

      {/* ========================================================
          3. BOTTOM AREA (Description on Left)
          ======================================================== */}
      <div className="ignitex-hero__bottom">
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
