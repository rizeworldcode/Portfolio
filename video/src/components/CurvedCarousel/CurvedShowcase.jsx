import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CurvedMediaCarousel from "./CurvedMediaCarousel";
import "./CurvedShowcase.css";

// Curated Showcase items (Videos & Motion Visuals)
const SHOWCASE_ITEMS = [
  {
    id: "reel-1",
    title: "Rizeworld Master Showreel",
    category: "Full Production · 4K",
    client: "Rizeworld Studios",
    year: "2026",
    description:
      "A fast-paced dynamic montage showcasing our best cinematography, color grading, sound design, and motion identity.",
    video: "/hero-video.mp4",
    image: "/showcase/port.jpg",
    tags: ["Cinematic", "Showreel", "4K Video", "Sound Design"],
  },
  {
    id: "item-2",
    title: "Creative Brand Identity",
    category: "Motion Graphics · Identity",
    client: "Creative Corp",
    year: "2026",
    description:
      "Modern brand identity film featuring kinetic typography, sleek 3D renders, and futuristic aesthetic pacing.",
    image: "/showcase/creative.jpg",
    tags: ["Typography", "3D Motion", "Brand Film"],
  },
  {
    id: "item-3",
    title: "Kafesa Gourmet Spotlight",
    category: "Commercial · Color Grade",
    client: "Kafesa Cafe & Bistro",
    year: "2025",
    description:
      "Mouth-watering culinary commercial with high-speed macro food shots and atmospheric warm color grading.",
    image: "/showcase/kafesa.jpg",
    tags: ["Macro Video", "Food & Beverage", "Commercial"],
  },
  {
    id: "item-4",
    title: "The Sweet Bite 3D VFX",
    category: "Product Promo · 3D VFX",
    client: "Brownie Bites Co.",
    year: "2025",
    description:
      "Dynamic 3D product animation highlighting textures, ingredients, and irresistible packaging reveal.",
    image: "/showcase/brownie.png",
    tags: ["VFX", "CGI", "Product Reveal"],
  },
  {
    id: "item-5",
    title: "Clap Box Studio Sessions",
    category: "Music Video · Sound Sync",
    client: "Clap Box Records",
    year: "2025",
    description:
      "High-energy live music showcase edited to rhythm with aggressive glitch cuts and neon stage lighting.",
    image: "/showcase/clapbox.jpg",
    tags: ["Music Sync", "Stage Light", "Dynamic Cut"],
  },
  {
    id: "item-6",
    title: "Avantika Royal Living",
    category: "Real Estate & Architecture",
    client: "Avantika Group",
    year: "2025",
    description:
      "Cinematic architectural walkthrough combining high-definition FPV drone sweeps and elegant interior framing.",
    image: "/showcase/avantika.jpg",
    tags: ["Drone 4K", "Architecture", "Luxury Tour"],
  },
  {
    id: "item-7",
    title: "DWPS Horizons Campaign",
    category: "Institutional Video · Docu",
    client: "DWPS Alwar",
    year: "2025",
    description:
      "Inspiring documentary-style campus story capturing academic excellence, sports passion, and student life.",
    image: "/showcase/dwps.png",
    tags: ["Docu-Style", "Education", "Storytelling"],
  },
  {
    id: "item-8",
    title: "Serenity Yoga & Wellness",
    category: "Lifestyle Documentary",
    client: "Saniya Life",
    year: "2025",
    description:
      "Calming, organic visual study of movement and nature, crafted with gentle lighting and meditative pacing.",
    image: "/showcase/yoga.jpg",
    tags: ["Lifestyle", "Slow Motion", "Wellness"],
  },
];

export default function CurvedShowcase() {
  const [activeItem, setActiveItem] = useState(null);
  const [autoplay, setAutoplay] = useState(true);
  const [speed, setSpeed] = useState(38);
  const [direction, setDirection] = useState("left");
  const [activeIdx, setActiveIdx] = useState(0);

  const handleCardClick = (item, idx) => {
    setActiveItem(item);
    setActiveIdx(idx);
  };

  const currentHighlight = SHOWCASE_ITEMS[activeIdx] || SHOWCASE_ITEMS[0];

  return (
    <section className="curved-showcase" id="projects">
      {/* Subtle Background Glows */}
      <div className="curved-showcase__ambient-glow curved-showcase__ambient-glow--top" />
      <div className="curved-showcase__ambient-glow curved-showcase__ambient-glow--center" />

      {/* ========================================================
          1. SECTION HEADER
          ======================================================== */}
      <div className="curved-showcase__header">
        <motion.div
          className="curved-showcase__pill"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="curved-showcase__pill-dot" />
          <span>CURVED 3D SHOWCASE · 2026</span>
        </motion.div>

        <motion.h2
          className="curved-showcase__title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Curated Visual Stories <span className="curved-showcase__title-amp">&</span> Motion Works
        </motion.h2>

        <motion.p
          className="curved-showcase__subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Rendered through an interactive 3D cylindrical canvas. Drag horizontally or scroll to
          explore our cinematic reels, commercials, and brand films.
        </motion.p>

        {/* Quick interactive controls */}
        <div className="curved-showcase__controls">
          <div className="curved-showcase__status">
            <span className="curved-showcase__count">
              <strong>{String(activeIdx + 1).padStart(2, "0")}</strong> /{" "}
              {String(SHOWCASE_ITEMS.length).padStart(2, "0")}
            </span>
            <span className="curved-showcase__highlight-name">
              {currentHighlight.title}
            </span>
          </div>

          <div className="curved-showcase__actions">
            {/* Play/Pause Autoplay */}
            <button
              type="button"
              className={`curved-showcase__btn ${
                autoplay ? "curved-showcase__btn--active" : ""
              }`}
              onClick={() => setAutoplay(!autoplay)}
              title={autoplay ? "Pause Auto Motion" : "Resume Auto Motion"}
            >
              {autoplay ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                  <span>Pause Motion</span>
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <span>Auto Flow</span>
                </>
              )}
            </button>

            {/* Reverse Direction */}
            <button
              type="button"
              className="curved-showcase__btn"
              onClick={() => setDirection(direction === "left" ? "right" : "left")}
              title="Reverse Direction"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <span>{direction === "left" ? "Dir: Left" : "Dir: Right"}</span>
            </button>

            {/* Drag hint badge */}
            <div className="curved-showcase__drag-hint">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M8 7h8M8 12h8M8 17h8" />
              </svg>
              <span>Drag to Glide</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. THE CURVED 3D CANVAS CAROUSEL
          ======================================================== */}
      <div className="curved-showcase__carousel-wrap">
        <CurvedMediaCarousel
          images={SHOWCASE_ITEMS}
          layout={{
            cardHeight: 64,
            aspect: 0.72,
            gap: 28,
            cardRadius: 16,
            imageZoom: 1.05,
            offsetY: 0,
          }}
          curve={{
            curve: 0.72,
            power: 2,
            slant: 0,
            smoothness: 2,
          }}
          appearance={{
            background: "#ffffff",
            radius: "0px",
            edgeShade: 0.25,
            shadeColor: "#ffffff",
          }}
          motion={{
            autoplay: autoplay,
            speed: speed,
            direction: direction,
            pauseOnHover: true,
          }}
          interaction={{
            draggable: true,
            inertia: true,
            friction: 3.2,
            dragSensitivity: 1.1,
            snap: false,
            wheel: true,
          }}
          media={{
            loopMode: "loop",
            videoPlay: "always",
          }}
          hoverFx={{
            hoverEnabled: true,
            hoverScale: 1.12,
            hoverDuration: 280,
            hoverDim: 0.2,
          }}
          arrowsGroup={{
            arrows: true,
            arrowSize: 52,
            arrowOffset: 32,
            arrowBg: "#ffffff",
            arrowColor: "#111111",
          }}
          onCardClick={handleCardClick}
          activeIndexChange={(idx) => setActiveIdx(idx)}
          style={{ width: "100%", height: "100%" }}
        />

        {/* Ambient bottom fade for cinematic integration */}
        <div className="curved-showcase__fade-bottom" />
      </div>

      {/* ========================================================
          3. ACTIVE CARD META TICKER
          ======================================================== */}
      <div className="curved-showcase__footer">
        <div className="curved-showcase__meta">
          <span className="curved-showcase__meta-tag">
            {currentHighlight.category}
          </span>
          <h3 className="curved-showcase__meta-title">
            {currentHighlight.title}
          </h3>
          <p className="curved-showcase__meta-desc">
            {currentHighlight.description}
          </p>
        </div>

        <button
          type="button"
          className="curved-showcase__view-btn"
          onClick={() => setActiveItem(currentHighlight)}
        >
          <span>View Project Details</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>

      {/* ========================================================
          4. PROJECT DETAILS MODAL / LIGHTBOX
          ======================================================== */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            className="curved-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveItem(null)}
          >
            <motion.div
              className="curved-modal-card"
              initial={{ scale: 0.92, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                className="curved-modal-close"
                onClick={() => setActiveItem(null)}
                aria-label="Close dialog"
              >
                ✕
              </button>

              {/* Media Container */}
              <div className="curved-modal-media">
                {activeItem.video ? (
                  <video
                    src={activeItem.video}
                    controls
                    autoPlay
                    playsInline
                    className="curved-modal-video"
                  />
                ) : (
                  <img
                    src={activeItem.image}
                    alt={activeItem.title}
                    className="curved-modal-image"
                  />
                )}
              </div>

              {/* Information */}
              <div className="curved-modal-info">
                <div className="curved-modal-badge-row">
                  <span className="curved-modal-badge">{activeItem.category}</span>
                  <span className="curved-modal-year">{activeItem.year}</span>
                </div>

                <h3 className="curved-modal-title">{activeItem.title}</h3>
                <p className="curved-modal-client">Client: {activeItem.client}</p>
                <p className="curved-modal-desc">{activeItem.description}</p>

                <div className="curved-modal-tags">
                  {activeItem.tags?.map((tag) => (
                    <span key={tag} className="curved-modal-tag">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="curved-modal-actions">
                  <a href="#contact" className="curved-modal-cta" onClick={() => setActiveItem(null)}>
                    <span>Start a Project Like This</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
