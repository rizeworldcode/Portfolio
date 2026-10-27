import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./CategoryReels.css";

// Reel categories
const CATEGORIES = [
  { id: "all", name: "All Reels", icon: "✨" },
  { id: "hospital", name: "Hospital & Healthcare", icon: "🏥" },
  { id: "school", name: "School & Education", icon: "🎓" },
  { id: "food", name: "Cafe & Food", icon: "🍽️" },
  { id: "realestate", name: "Real Estate & Infra", icon: "🏢" },
  { id: "creative", name: "Commercial & 3D", icon: "⚡" },
];

// Curated Reels dataset
const REELS_DATA = [
  // --- Hospital & Healthcare Reels ---
  {
    id: "hosp-1",
    title: "Saniya Hospital Facility & Care",
    category: "hospital",
    categoryLabel: "Hospital",
    client: "Saniya Hospital Alwar",
    duration: "0:45",
    views: "184K",
    likes: "12.4K",
    poster: "/reels/saniya.jpg",
    video: "/hero-video.mp4",
    description:
      "A fast-paced awareness reel showcasing 24/7 emergency care, modern ICU infrastructure, and compassionate patient handling.",
    tags: ["Healthcare", "Emergency Care", "Doctor Profile", "4K Video"],
  },
  {
    id: "hosp-2",
    title: "Doctor Specialist Health Guidance",
    category: "hospital",
    categoryLabel: "Healthcare",
    client: "MediCare Clinic",
    duration: "0:32",
    views: "98K",
    likes: "6.8K",
    poster: "/reels/doctor.jpg",
    video: "/hero-video.mp4",
    description:
      "Engaging health tips short with clear kinetic typography, dynamic cuts, and medical advice sound bites.",
    tags: ["Health Tips", "Medical Advice", "Specialist Reel"],
  },
  {
    id: "hosp-3",
    title: "Dr. Jayant Theraja Consultation Reel",
    category: "hospital",
    categoryLabel: "Doctor Profile",
    client: "Dr. Theraja Clinic",
    duration: "0:52",
    views: "142K",
    likes: "9.1K",
    poster: "/reels/theraja.png",
    video: "/hero-video.mp4",
    description:
      "Professional doctor branding reel highlighting years of clinical experience, patient diagnostics, and modern consultation.",
    tags: ["Doctor Branding", "Consultation", "Trust Building"],
  },

  // --- School & Education Reels ---
  {
    id: "school-1",
    title: "DWPS Future Horizons Campus Reel",
    category: "school",
    categoryLabel: "School",
    client: "Delhi World Public School",
    duration: "0:50",
    views: "235K",
    likes: "18.6K",
    poster: "/reels/dwps-fly.png",
    video: "/hero-video.mp4",
    description:
      "A cinematic school promo highlighting smart classrooms, robotics labs, green campus life, and student joy.",
    tags: ["School Promo", "Campus Tour", "Smart Class", "Admissions"],
  },
  {
    id: "school-2",
    title: "Annual Sports & Badminton Championship",
    category: "school",
    categoryLabel: "Sports Day",
    client: "DWPS Sports Academy",
    duration: "0:36",
    views: "128K",
    likes: "8.3K",
    poster: "/reels/dwps-sports.jpg",
    video: "/hero-video.mp4",
    description:
      "High-energy sports reel edited to modern beats with fast speed-ramps, sweat, and championship trophy moments.",
    tags: ["Sports Reel", "Badminton", "High Energy", "Speed Ramp"],
  },
  {
    id: "school-3",
    title: "Speed Skating Academy Champions",
    category: "school",
    categoryLabel: "Extracurricular",
    client: "DWPS Sports",
    duration: "0:28",
    views: "94K",
    likes: "7.2K",
    poster: "/reels/dwps-skating.png",
    video: "/hero-video.mp4",
    description:
      "Smooth gimbal tracking shots capturing young speed skaters racing through the academy rink.",
    tags: ["Skating", "Youth Sports", "Action Cut"],
  },

  // --- Cafe & Restaurant Reels ---
  {
    id: "food-1",
    title: "Kafesa Gourmet Burger Spotlight",
    category: "food",
    categoryLabel: "Restaurant",
    client: "Kafesa Cafe & Bistro",
    duration: "0:30",
    views: "312K",
    likes: "24.5K",
    poster: "/reels/burger.jpg",
    video: "/hero-video.mp4",
    description:
      "Sizzling patty grill, melted cheese pour, and crispy lettuce crunch captured in macro slow motion.",
    tags: ["Food Reel", "Burger Promo", "Macro Shots", "ASMR"],
  },
  {
    id: "food-2",
    title: "Summer Lime Mojito Mixology",
    category: "food",
    categoryLabel: "Beverage",
    client: "Kafesa Bar",
    duration: "0:24",
    views: "178K",
    likes: "11.3K",
    poster: "/reels/mojito.jpg",
    video: "/hero-video.mp4",
    description:
      "A thirst-quenching mixology reel featuring crystal ice drops, fresh mint crush, and effervescent soda splash.",
    tags: ["Mixology", "Cocktails", "Summer Vibe"],
  },
  {
    id: "food-3",
    title: "The Sweet Bite Brownie Sensation",
    category: "food",
    categoryLabel: "Bakery & Dessert",
    client: "Sweet Bites Dessert Co.",
    duration: "0:38",
    views: "265K",
    likes: "19.8K",
    poster: "/showcase/brownie.png",
    video: "/hero-video.mp4",
    description:
      "Warm fudge chocolate brownie with rich vanilla drizzle shot at 120fps high-frame-rate.",
    tags: ["Dessert Reel", "Chocolate", "Slow Motion 120fps"],
  },

  // --- Real Estate & Architecture Reels ---
  {
    id: "real-1",
    title: "Avantika Royal Living Villa Tour",
    category: "realestate",
    categoryLabel: "Real Estate",
    client: "Avantika Residences",
    duration: "1:05",
    views: "420K",
    likes: "32.1K",
    poster: "/reels/avantika-estate.jpg",
    video: "/hero-video.mp4",
    description:
      "Ultra-luxurious architectural walkthrough showcasing high ceilings, Italian marble flooring, and sunset garden drone sweeps.",
    tags: ["Luxury Villa", "Drone FPV", "Real Estate Walkthrough"],
  },
  {
    id: "real-2",
    title: "Modern Commercial Infrastructure",
    category: "realestate",
    categoryLabel: "Infrastructure",
    client: "Rize Infra Projects",
    duration: "0:48",
    views: "106K",
    likes: "7.9K",
    poster: "/reels/infra.jpg",
    video: "/hero-video.mp4",
    description:
      "Timelapse construction highlights, steel framing engineering, and sleek corporate glass elevation.",
    tags: ["Architecture", "Infrastructure", "Engineering"],
  },

  // --- Brand Commercials & 3D ---
  {
    id: "creative-1",
    title: "Creative Pro Kinetic Brand Film",
    category: "creative",
    categoryLabel: "Brand Commercial",
    client: "Creative Pro Skills",
    duration: "0:35",
    views: "295K",
    likes: "21.4K",
    poster: "/showcase/creative.jpg",
    video: "/hero-video.mp4",
    description:
      "Bold visual design teaser with futuristic 3D renders, sound-synced kinetic text, and neon color palettes.",
    tags: ["Motion Graphics", "Brand Identity", "Kinetic Typography"],
  },
];

export default function CategoryReels() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedReel, setSelectedReel] = useState(null);
  const [playingCardId, setPlayingCardId] = useState(null);

  const filteredReels =
    activeCategory === "all"
      ? REELS_DATA
      : REELS_DATA.filter((r) => r.category === activeCategory);

  return (
    <section className="category-reels" id="reels">
      <div className="category-reels__container">
        {/* ========================================================
            1. SECTION HEADER
            ======================================================== */}
        <div className="category-reels__header">
          <motion.div
            className="category-reels__pill"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="category-reels__pill-dot" />
            <span>INDUSTRY REELS & SHORTS</span>
          </motion.div>

          <motion.h2
            className="category-reels__title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Curated Category Reels <span className="category-reels__title-amp">&</span> Viral Edits
          </motion.h2>

          <motion.p
            className="category-reels__subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Browse high-engagement vertical reels tailored for healthcare, schools, restaurants,
            real estate, and brand commercials. Click any reel to watch with sound.
          </motion.p>

          {/* ========================================================
              2. CATEGORY TABS
              ======================================================== */}
          <div className="category-reels__tabs" role="tablist">
            {CATEGORIES.map((cat) => {
              const count =
                cat.id === "all"
                  ? REELS_DATA.length
                  : REELS_DATA.filter((r) => r.category === cat.id).length;
              const isActive = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`category-reels__tab ${
                    isActive ? "category-reels__tab--active" : ""
                  }`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <span className="category-reels__tab-icon">{cat.icon}</span>
                  <span className="category-reels__tab-name">{cat.name}</span>
                  <span className="category-reels__tab-count">
                    {String(count).padStart(2, "0")}
                  </span>

                  {isActive && (
                    <motion.div
                      layoutId="activeReelCategoryTab"
                      className="category-reels__tab-highlight"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            3. REELS GRID (VERTICAL 9:16 ASPECT RATIO)
            ======================================================== */}
        <motion.div layout className="category-reels__grid">
          <AnimatePresence mode="popLayout">
            {filteredReels.map((reel, index) => {
              const isCardPlaying = playingCardId === reel.id;

              return (
                <motion.div
                  key={reel.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 24 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 24 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="reel-card"
                  onClick={() => setSelectedReel(reel)}
                  onMouseEnter={() => setPlayingCardId(reel.id)}
                  onMouseLeave={() => setPlayingCardId(null)}
                >
                  {/* Smartphone-like vertical media box */}
                  <div className="reel-card__frame">
                    {/* Media: Image poster or auto-hover video */}
                    {isCardPlaying && reel.video ? (
                      <video
                        src={reel.video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="reel-card__video"
                      />
                    ) : (
                      <img
                        src={reel.poster}
                        alt={reel.title}
                        loading="lazy"
                        className="reel-card__img"
                      />
                    )}

                    {/* Dark gradient overlay for text readability */}
                    <div className="reel-card__overlay-top" />
                    <div className="reel-card__overlay-bottom" />

                    {/* Top Badges */}
                    <div className="reel-card__top">
                      <span className="reel-card__category-badge">
                        {reel.categoryLabel}
                      </span>
                      <span className="reel-card__duration-badge">
                        {reel.duration}
                      </span>
                    </div>

                    {/* Center Play Icon (Appears on hover) */}
                    <div className="reel-card__center-play">
                      <div className="reel-card__play-circle">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </div>
                    </div>

                    {/* Bottom Metadata */}
                    <div className="reel-card__bottom">
                      <p className="reel-card__client">{reel.client}</p>
                      <h3 className="reel-card__title">{reel.title}</h3>

                      <div className="reel-card__stats">
                        <div className="reel-card__stat">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          <span>{reel.views}</span>
                        </div>
                        <div className="reel-card__stat">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                          <span>{reel.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ========================================================
          4. REEL MODAL / SMARTPHONE LIGHTBOX PLAYER
          ======================================================== */}
      <AnimatePresence>
        {selectedReel && (
          <motion.div
            className="reel-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedReel(null)}
          >
            <motion.div
              className="reel-modal-card"
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                className="reel-modal-close"
                onClick={() => setSelectedReel(null)}
                aria-label="Close modal"
              >
                ✕
              </button>

              {/* 9:16 Video Player Column */}
              <div className="reel-modal-player-col">
                <div className="reel-modal-player-wrap">
                  {selectedReel.video ? (
                    <video
                      src={selectedReel.video}
                      controls
                      autoPlay
                      playsInline
                      className="reel-modal-video"
                    />
                  ) : (
                    <img
                      src={selectedReel.poster}
                      alt={selectedReel.title}
                      className="reel-modal-image"
                    />
                  )}
                </div>
              </div>

              {/* Information Column */}
              <div className="reel-modal-info-col">
                <div className="reel-modal-badge-row">
                  <span className="reel-modal-badge">{selectedReel.categoryLabel}</span>
                  <span className="reel-modal-duration">{selectedReel.duration}</span>
                </div>

                <h3 className="reel-modal-title">{selectedReel.title}</h3>
                <p className="reel-modal-client">Client: {selectedReel.client}</p>

                <p className="reel-modal-desc">{selectedReel.description}</p>

                {/* Stats Row */}
                <div className="reel-modal-stats-row">
                  <div className="reel-modal-stat-box">
                    <span className="reel-modal-stat-num">{selectedReel.views}</span>
                    <span className="reel-modal-stat-label">Organic Views</span>
                  </div>
                  <div className="reel-modal-stat-box">
                    <span className="reel-modal-stat-num">{selectedReel.likes}</span>
                    <span className="reel-modal-stat-label">Engagement Likes</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="reel-modal-tags">
                  {selectedReel.tags?.map((t) => (
                    <span key={t} className="reel-modal-tag">
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="reel-modal-actions">
                  <a
                    href="#contact"
                    className="reel-modal-cta"
                    onClick={() => setSelectedReel(null)}
                  >
                    <span>Create a Reel Like This</span>
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
