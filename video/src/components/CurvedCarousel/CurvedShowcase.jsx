import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlay, FiPause, FiArrowRight } from "react-icons/fi";
import { HiArrowsRightLeft } from "react-icons/hi2";
import { RiDragMove2Line } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import CurvedMediaCarousel from "./CurvedMediaCarousel";
import "./CurvedShowcase.css";

// Helper for clean URL encoding with spaces
const vPath = (p) => encodeURI(p);

// Curated Showcase items (Web-optimized Videos & Real Frame Posters)
const SHOWCASE_ITEMS = [
  {
    id: "reel-1",
    title: "Rizeworld Master Showreel",
    category: "Full Production · 4K",
    client: "Rizeworld Studios",
    year: "2026",
    description:
      "A fast-paced dynamic montage showcasing our best cinematography, color grading, sound design, and motion identity.",
    video: "/videos-compressed/rizeworld-gmb.mp4",
    tags: ["Cinematic", "Showreel", "4K Video", "Sound Design"],
  },
  {
    id: "item-2",
    title: "Creative Pro Motion & Skills",
    category: "Motion Graphics · Identity",
    client: "Creative Corp",
    year: "2026",
    description:
      "Modern brand identity film featuring kinetic typography, sleek 3D renders, and futuristic aesthetic pacing.",
    video: "/videos-compressed/skills.mp4",
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
    video: "/videos-compressed/kafesa-befr.mp4",
    tags: ["Macro Video", "Food & Beverage", "Commercial"],
  },
  {
    id: "item-4",
    title: "3D Infrastructure CGI Walkthrough",
    category: "Product Promo · 3D VFX",
    client: "Skyline Infra CGI",
    year: "2025",
    description:
      "Dynamic 3D product and architectural animation highlighting textures, lighting, and realistic structural modeling.",
    video: "/videos-compressed/infra-cgi.mp4",
    tags: ["VFX", "CGI", "3D Modeling"],
  },
  {
    id: "item-5",
    title: "Sigdi Sizzling Food Feast",
    category: "Culinary Video · Sound Sync",
    client: "Sigdi Food Lounge",
    year: "2025",
    description:
      "High-energy live kitchen cuts edited to rhythm with smoky grill flames and delicious plating.",
    video: "/videos-compressed/sigdi-b.mp4",
    tags: ["BBQ Grill", "Live Kitchen", "Dynamic Cut"],
  },
  {
    id: "item-6",
    title: "Avantika Royal Living",
    category: "Real Estate & Architecture",
    client: "Avantika Group",
    year: "2025",
    description:
      "Cinematic architectural walkthrough combining high-definition FPV drone sweeps and elegant interior framing.",
    video: "/videos-compressed/avantika-k.mp4",
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
    video: "/videos-compressed/dwps-jerry.mp4",
    tags: ["Docu-Style", "Education", "Storytelling"],
  },
  {
    id: "item-8",
    title: "Serenity Yoga & Nature Film",
    category: "Lifestyle Documentary",
    client: "Yoga Lifestyle Life",
    year: "2025",
    description:
      "Calming, organic visual study of movement and nature, crafted with gentle lighting and meditative pacing.",
    video: "/videos-compressed/yoga-nature.mp4",
    tags: ["Lifestyle", "Slow Motion", "Wellness"],
  },
];

function CurvedModalVideo({ item }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      });
    }
  }, [item?.video]);

  if (!item?.video) return null;

  return (
    <video
      ref={videoRef}
      key={item.video}
      src={item.video}
      controls
      autoPlay
      playsInline
      preload="auto"
      className="curved-modal-video"
    />
  );
}

export default function CurvedShowcase() {
  const [activeItem, setActiveItem] = useState(null);
  const [autoplay, setAutoplay] = useState(true);
  const [speed, setSpeed] = useState(38);
  const [direction, setDirection] = useState("left");
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveItem(null);
      }
    };
    if (activeItem) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeItem]);

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
                  <FiPause size={14} />
                  <span>Pause Motion</span>
                </>
              ) : (
                <>
                  <FiPlay size={14} />
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
              <HiArrowsRightLeft size={14} />
              <span>{direction === "left" ? "Dir: Left" : "Dir: Right"}</span>
            </button>

            {/* Drag hint badge */}
            <div className="curved-showcase__drag-hint">
              <RiDragMove2Line size={15} />
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
          paused={Boolean(activeItem)}
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
            smoothness: 3,
          }}
          appearance={{
            background: "#ffffff",
            radius: "0px",
            edgeShade: 0.25,
            shadeColor: "#ffffff",
          }}
          motion={{
            autoplay: autoplay,
            speed: 28,
            direction: direction,
            pauseOnHover: true,
          }}
          interaction={{
            draggable: true,
            inertia: true,
            friction: 2.0,
            dragSensitivity: 1.0,
            snap: false,
            wheel: true,
          }}
          media={{
            loopMode: "loop",
            videoPlay: "hover",
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
          <FiArrowRight size={16} />
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
                <IoClose size={22} />
              </button>

              {/* Media Container */}
              <div className="curved-modal-media">
                <CurvedModalVideo item={activeItem} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
