import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import "./Hero.css";

export default function Hero() {
  const videoRef = useRef(null);
  const [heroVideoSrc, setHeroVideoSrc] = useState("/hero-stream.mp4");
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    // 1. Fetch priority Hero Reel from backend database
    const apiBase = import.meta.env.VITE_API_BASE_URL || "https://portfolio-j73f.onrender.com/api";
    const controller = new AbortController();

    fetch(`${apiBase}/videos/hero`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch hero reel");
        return res.json();
      })
      .then((data) => {
        if (data && (data.videoUrl || data.video)) {
          const v = data.videoUrl || data.video;
          if (v && v.trim()) {
            setHeroVideoSrc(v);
          }
        }
      })
      .catch(() => {
        // Fallback to local faststart hero-stream.mp4
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          // Handled silently if browser autoplay restrictions apply
        });
      }
    }
  }, [heroVideoSrc]);

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
      {/* Background Video (Priority #1 - Preloaded with High Priority) */}
      <div className="ignitex-hero__bg-wrap" aria-hidden="true">
        <video
          ref={videoRef}
          key={heroVideoSrc}
          className="ignitex-hero__bg-video"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setIsVideoLoaded(true)}
          style={{
            opacity: isVideoLoaded ? 1 : 0.8,
            transition: "opacity 0.4s ease-in-out",
          }}
        >
          <source src={heroVideoSrc} type="video/mp4" />
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
