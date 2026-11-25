import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiBolt } from "react-icons/hi2";
import {
  RiHospitalLine,
  RiGraduationCapLine,
  RiRestaurant2Line,
  RiBuilding4Line,
  RiLeafLine,
  RiRobotLine,
  RiVipDiamondLine,
  RiGovernmentLine,
} from "react-icons/ri";
import { IoPlay, IoClose } from "react-icons/io5";
import { FiArrowRight } from "react-icons/fi";
import "./CategoryReels.css";

// Reel categories
const CATEGORIES = [
  { id: "hospital", name: "Hospital & Healthcare", icon: <RiHospitalLine /> },
  { id: "school", name: "School & Institute", icon: <RiGraduationCapLine /> },
  { id: "election", name: "Political & Election", icon: <RiGovernmentLine /> },
  { id: "food", name: "Cafe & Restaurant", icon: <RiRestaurant2Line /> },
  { id: "realestate", name: "Real Estate & Infra", icon: <RiBuilding4Line /> },
  { id: "creative", name: "Jewellery & Gemstones", icon: <RiVipDiamondLine /> },
  { id: "lifestyle", name: "Lifestyle & Wellness", icon: <RiLeafLine /> },
  { id: "ai", name: "AI Video", icon: <RiRobotLine /> },
];

import allReelsData from '../../data/allVideos.json';
const REELS_DATA = allReelsData;

// Smart Reel Card with Instant Hover-Play (Zero GPU load when idle, 60fps on hover)
function SmartReelCard({ reel, index, onSelect }) {
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        });
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 24 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className={`reel-card ${isHovered ? "reel-card--hovered" : ""}`}
      onClick={() => onSelect(reel)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="reel-card__frame">
        {/* Real video with its own authentic first frame as poster */}
        <video
          ref={videoRef}
          src={encodeURI(reel.video || reel.videoUrl || reel.rawVideo)}
          poster={encodeURI(reel.poster || (reel.video ? `/posters/${reel.video.split('/').pop().replace('.mp4', '.webp')}` : ''))}
          loop
          muted
          playsInline
          preload="none"
          className="reel-card__video"
          onError={(e) => {
            if (reel.rawVideo && e.currentTarget && !e.currentTarget.src.includes(encodeURI(reel.rawVideo))) {
              e.currentTarget.src = encodeURI(reel.rawVideo);
            }
          }}
        />

        {/* Gradient Overlays */}
        <div className="reel-card__overlay-top" />
        <div className="reel-card__overlay-bottom" />

        {/* Top Badges */}
        <div className="reel-card__top">
          <span className="reel-card__category-badge">{reel.categoryLabel}</span>
        </div>

        {/* Center Play Icon */}
        <div className="reel-card__center-play">
          <div className="reel-card__play-circle">
            <IoPlay size={18} style={{ marginLeft: "2px" }} />
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="reel-card__bottom">
          <h3 className="reel-card__title">{reel.title}</h3>
        </div>
      </div>
    </motion.div>
  );
}

// Helper to map backend category strings to exact category tab ids
function getCategoryKey(cat) {
  const c = (cat || "").toLowerCase();
  if (c.includes("election") || c.includes("politic")) return "election";
  if (c.includes("hospital") || c.includes("health") || c.includes("doctor")) return "hospital";
  if (c.includes("school") || c.includes("institute") || c.includes("educat")) return "school";
  if (c.includes("cafe") || c.includes("restaurant") || c.includes("food") || c.includes("dining")) return "food";
  if (c.includes("real estate") || c.includes("infra") || c.includes("build")) return "realestate";
  if (c.includes("jewel") || c.includes("diamond") || c.includes("gemstone") || c.includes("gold")) return "creative";
  if (c.includes("lifestyle") || c.includes("wellness") || c.includes("yoga")) return "lifestyle";
  if (c.includes("ai") || c.includes("robot")) return "ai";
  return "hospital";
}

export default function CategoryReels() {
  const sectionRef = useRef(null);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [selectedReel, setSelectedReel] = useState(null);
  const [reelsData, setReelsData] = useState(REELS_DATA);

  // Load all live video reels directly from backend API with strict deduplication
  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_BASE_URL || "https://portfolio-j73f.onrender.com/api";
    fetch(`${apiBase}/videos`)
      .then((res) => (res.ok ? res.json() : null))
      .then((liveList) => {
        if (Array.isArray(liveList) && liveList.length > 0) {
          const seen = new Set();
          const cleanList = [];

          liveList.forEach((v) => {
            const rawPath = v.videoUrl || v.video || "";
            const normalized = rawPath.split("?")[0].split("#")[0].trim().replace(/^.*[\\/]/, "").toLowerCase();
            if (!normalized || seen.has(normalized)) return;
            seen.add(normalized);

            const isElection = (v.category || "").toLowerCase().includes("election") || (v.category || "").toLowerCase().includes("politic");
            const cleanCategory = isElection ? "Political & Election" : (v.category || "Video Reel");

            cleanList.push({
              ...v,
              id: v.id || v._id,
              title: v.title || (isElection ? "Election" : "Video Reel"),
              client: v.client || (isElection ? "Election" : "Client"),
              category: cleanCategory,
              categoryLabel: cleanCategory,
              categoryKey: isElection ? "election" : (v.categoryKey || getCategoryKey(cleanCategory)),
              video: rawPath,
              videoUrl: rawPath,
              poster: v.thumbnail || v.poster || (rawPath ? `/posters/${rawPath.split("/").pop().replace(".mp4", ".webp")}` : ""),
            });
          });

          // All reels come directly from backend
          setReelsData(cleanList);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsSectionVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "350px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const isElectionReel = (r) => {
    const cat = (r.category || '').toLowerCase();
    const key = (r.categoryKey || '').toLowerCase();
    return key === 'election' || cat.includes('election') || cat.includes('politic');
  };

  const filteredReels =
    activeCategory === "all"
      ? reelsData
      : reelsData.filter((r) => {
          if (activeCategory === "election") return isElectionReel(r);
          return r.categoryKey === activeCategory || (r.category || '').toLowerCase() === activeCategory.toLowerCase();
        });

  return (
    <section ref={sectionRef} className="category-reels" id="reels">
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
            Explore industry-specific reels for AI video, political & election campaigns, healthcare, schools, restaurants, real estate,
            jewellery & gemstones, and wellness. Hover to preview or click to watch with full audio.
          </motion.p>

          {/* ========================================================
              2. CATEGORY TABS
              ======================================================== */}
          <div className="category-reels__tabs" role="tablist">
            {CATEGORIES.map((cat) => {
              const count = reelsData.filter((r) => {
                if (cat.id === "election") return isElectionReel(r);
                return r.categoryKey === cat.id || (r.category || '').toLowerCase() === cat.name.toLowerCase();
              }).length;
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
            {isSectionVisible && (
              filteredReels.length > 0 ? (
                filteredReels.map((reel, index) => (
                  <SmartReelCard
                    key={reel.id}
                    reel={reel}
                    index={index}
                    onSelect={setSelectedReel}
                  />
                ))
              ) : (
                <motion.div
                  key="empty-category-state"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="category-reels__empty-state"
                >
                  <div className="category-reels__empty-icon">
                    {activeCategory === "election" ? <RiGovernmentLine /> : <RiRobotLine />}
                  </div>
                  <h3 className="category-reels__empty-title">
                    {activeCategory === "election"
                      ? "Political & Election Reels Coming Soon"
                      : "AI Video Reels Coming Soon"}
                  </h3>
                  <p className="category-reels__empty-subtitle">
                    {activeCategory === "election"
                      ? "High-impact campaign reels, political speeches, candidate highlights, and rally videos are ready for upload from the Admin Panel."
                      : "Curated AI-generated video reels, viral avatars, and futuristic video edits are being prepared."}
                  </p>
                  <div className="category-reels__empty-badge">
                    <span>Ready For Uploads</span>
                  </div>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ========================================================
          4. REEL SMARTPHONE LIGHTBOX MODAL
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
              <button
                type="button"
                className="reel-modal-close"
                onClick={() => setSelectedReel(null)}
                aria-label="Close modal"
              >
                <IoClose size={22} />
              </button>

              {/* 9:16 Video Player Column */}
              <div className="reel-modal-player-col">
                <div className="reel-modal-player-wrap">
                  <video
                    ref={(el) => {
                      if (el) {
                        const p = el.play();
                        if (p && typeof p.catch === "function") {
                          p.catch(() => {
                            el.muted = true;
                            el.play().catch(() => {});
                          });
                        }
                      }
                    }}
                    key={selectedReel.video || selectedReel.videoUrl}
                    src={encodeURI(selectedReel.video || selectedReel.videoUrl || selectedReel.rawVideo)}
                    controls
                    autoPlay
                    playsInline
                    className="reel-modal-video"
                    onError={(e) => {
                      if (selectedReel.rawVideo && e.currentTarget && !e.currentTarget.src.includes(encodeURI(selectedReel.rawVideo))) {
                        e.currentTarget.src = encodeURI(selectedReel.rawVideo);
                      }
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
