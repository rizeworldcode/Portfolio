import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./CategoryReels.css";

// Reel categories
const CATEGORIES = [
  { id: "all", name: "All Reels", icon: "✨" },
  { id: "hospital", name: "Hospital & Healthcare", icon: "🏥" },
  { id: "school", name: "School & Education", icon: "🎓" },
  { id: "food", name: "Cafe & Restaurant", icon: "🍽️" },
  { id: "realestate", name: "Real Estate & Infra", icon: "🏢" },
  { id: "creative", name: "Commercial & 3D", icon: "⚡" },
  { id: "lifestyle", name: "Lifestyle & Wellness", icon: "🌿" },
];

// Authentic Video Portfolio dataset with authentic video frames (28 Unique Non-Duplicated Reels)
const REELS_DATA = [
  // --- Hospital & Healthcare Reels (7 Unique Reels) ---
  {
    id: "hosp-1",
    title: "Saniya Hospital ICU & Emergency Care",
    category: "hospital",
    categoryLabel: "Hospital Care",
    client: "Saniya Hospital Alwar",
    duration: "0:45",
    views: "184K",
    likes: "12.4K",
    video: "/videos-compressed/saniya-hospital.mp4",
    description:
      "A fast-paced awareness reel showcasing 24/7 emergency care, modern ICU infrastructure, and doctor consultations.",
    tags: ["Healthcare", "Emergency Care", "Doctor Profile", "4K Video"],
  },
  {
    id: "hosp-2",
    title: "Saniya Hospital Specialized Doctors & OPD",
    category: "hospital",
    categoryLabel: "Specialized OPD",
    client: "Saniya Hospital",
    duration: "0:40",
    views: "156K",
    likes: "10.8K",
    video: "/videos-compressed/saniya-bhumika.mp4",
    description:
      "Patient-first medical care featuring surgeon interviews, diagnostic precision, and compassionate nursing staff.",
    tags: ["Hospital OPD", "Medical Care", "Surgery Wing", "Healthcare"],
  },
  {
    id: "hosp-3",
    title: "Dr. Himanshu Bansod Specialist Guidance",
    category: "hospital",
    categoryLabel: "Specialist",
    client: "Dr. Himanshu Bansod",
    duration: "0:35",
    views: "112K",
    likes: "8.2K",
    video: "/videos-compressed/dr-himanshu.mp4",
    description:
      "Engaging health advice and specialist interview reel with kinetic typography, clean sound bites, and medical insights.",
    tags: ["Health Guidance", "Medical Advice", "Specialist Reel"],
  },
  {
    id: "hosp-4",
    title: "Dr. Swati Yadav Patient Wellness & Consult",
    category: "hospital",
    categoryLabel: "Consultation",
    client: "Dr. Swati Yadav Clinic",
    duration: "0:42",
    views: "98K",
    likes: "7.1K",
    video: "/videos-compressed/dr-swati.mp4",
    description:
      "Patient health consult and wellness guidance reel designed for high retention on social media.",
    tags: ["Wellness", "Consultation", "Doctor Branding"],
  },
  {
    id: "hosp-5",
    title: "MediCompares Clinical Diagnostic Scans",
    category: "hospital",
    categoryLabel: "Clinical",
    client: "Medicompares Healthcare",
    duration: "0:50",
    views: "142K",
    likes: "9.5K",
    video: "/videos-compressed/medicompares-15.mp4",
    description:
      "Analytical medical comparison reel highlighting pharmaceutical precision, diagnostic scans, and clinical efficiency.",
    tags: ["Diagnostics", "Clinical Analysis", "Medical Video"],
  },
  {
    id: "hosp-6",
    title: "MediCompares Digital Telemedicine Connect",
    category: "hospital",
    categoryLabel: "Telemedicine",
    client: "MediCompares Health",
    duration: "0:38",
    views: "128K",
    likes: "8.9K",
    video: "/videos-compressed/medicompares-3.mp4",
    description:
      "Modern patient digital consultation walkthrough showing real-time specialist matching and lab test booking.",
    tags: ["Telehealth", "Digital Doctor", "App Promo"],
  },
  {
    id: "hosp-7",
    title: "MediCompares Emergency First-Aid Guide",
    category: "hospital",
    categoryLabel: "Health Tips",
    client: "MediCompares Education",
    duration: "0:44",
    views: "165K",
    likes: "13.2K",
    video: "/videos-compressed/medicompares-4.mp4",
    description:
      "Crucial emergency wellness guidance and quick preventive tips edited with crisp on-screen callouts.",
    tags: ["First Aid", "Health Tips", "Public Awareness"],
  },

  // --- School & Education Reels (5 Unique Reels) ---
  {
    id: "school-1",
    title: "DWPS Admissions Promo Campaign",
    category: "school",
    categoryLabel: "Admissions",
    client: "Delhi World Public School",
    duration: "0:45",
    views: "235K",
    likes: "18.6K",
    video: "/videos-compressed/dwps-admission.mp4",
    description:
      "Inspiring school admissions film highlighting world-class campus facilities, faculty mentorship, and joyful education.",
    tags: ["School Promo", "Campus Tour", "Smart Class", "Admissions"],
  },
  {
    id: "school-2",
    title: "DWPS Campus Building & Growth Architecture",
    category: "school",
    categoryLabel: "Campus Tour",
    client: "DWPS Academy",
    duration: "0:48",
    views: "124K",
    likes: "9.8K",
    video: "/videos-compressed/dwps-build.mp4",
    description:
      "Architectural walkthrough of the evolving school campus, science blocks, and library halls.",
    tags: ["Infrastructure", "Education", "Campus Architecture"],
  },
  {
    id: "school-3",
    title: "DWPS Athletics & Speed Skating Championship",
    category: "school",
    categoryLabel: "Athletics",
    client: "DWPS Alwar Sports",
    duration: "0:40",
    views: "188K",
    likes: "15.3K",
    video: "/videos-compressed/school-dwps.mp4",
    description:
      "Sweeping gimbal shots of athletic training, speed skating, basketball courts, and student teamwork.",
    tags: ["Sports Reel", "Athletics", "Campus Life"],
  },
  {
    id: "school-4",
    title: "DWPS Foundation Day 26 Celebrations",
    category: "school",
    categoryLabel: "Annual Gala",
    client: "DWPS Alwar",
    duration: "0:52",
    views: "210K",
    likes: "17.4K",
    video: "/videos-compressed/dwps-26.mp4",
    description:
      "Vibrant cultural dance performances, stage lighting, musical recitals, and joyous parent applause.",
    tags: ["Annual Function", "Cultural Dance", "Stage Performance"],
  },
  {
    id: "school-5",
    title: "DWPS Academic Assembly & Leadership Reel",
    category: "school",
    categoryLabel: "Assembly",
    client: "DWPS Student Council",
    duration: "0:36",
    views: "145K",
    likes: "11.2K",
    video: "/videos-compressed/dwps-reel-11.mp4",
    description:
      "Morning prayer, student speech showcases, and leadership awards filmed with crisp natural daylight.",
    tags: ["Morning Assembly", "Leadership", "School Values"],
  },

  // --- Cafe & Restaurant Reels (4 Unique Reels) ---
  {
    id: "food-1",
    title: "Kafesa Signature Extension Reveal",
    category: "food",
    categoryLabel: "Ambience",
    client: "Kafesa Lounge",
    duration: "0:42",
    views: "198K",
    likes: "14.2K",
    video: "/videos-compressed/kafesa-extn.mp4",
    description:
      "Warm bokeh lighting, velvet booth seating, and acoustic evening vibes captured with cinematic smooth glides.",
    tags: ["Cafe Ambience", "Interior Reel", "Night Life", "Cozy Coffee"],
  },
  {
    id: "food-2",
    title: "Kafesa Artisan Kitchen Chapter 1",
    category: "food",
    categoryLabel: "Gourmet Kitchen",
    client: "Kafesa Cafe",
    duration: "0:46",
    views: "215K",
    likes: "16.8K",
    video: "/videos-compressed/kafesa-ch1.mp4",
    description:
      "Chef masterclass culinary prep featuring fresh handmade pastas, herb oils, and artisan plating aesthetics.",
    tags: ["Culinary Art", "Chef Special", "Artisan Pasta", "Food Cinema"],
  },
  {
    id: "food-3",
    title: "Sigdi Food Lounge Grand Experience",
    category: "food",
    categoryLabel: "Royal Dining",
    client: "Sigdi Food Lounge",
    duration: "0:48",
    views: "280K",
    likes: "22.1K",
    video: "/videos-compressed/sigdi-final.mp4",
    description:
      "A grand celebratory food documentary featuring rich biryanis, aromatic curries, and happy family feasts.",
    tags: ["Grand Dining", "Indian Cuisine", "Family Feast"],
  },
  {
    id: "food-4",
    title: "Sigdi Influencer BBQ Charcoal Fest",
    category: "food",
    categoryLabel: "Influencer Collab",
    client: "Sigdi Restaurant",
    duration: "0:39",
    views: "340K",
    likes: "29.4K",
    video: "/videos-compressed/sigdi-influencer.mp4",
    description:
      "Viral food creator meetup tasting smoky kebabs, melted cheese garlic naans, and spicy mocktails.",
    tags: ["Foodie Meet", "Viral Food", "BBQ Feast"],
  },

  // --- Real Estate & Architecture Reels (4 Unique Reels) ---
  {
    id: "real-1",
    title: "Avantika Spring Collection Living",
    category: "realestate",
    categoryLabel: "Architecture",
    client: "Avantika Group",
    duration: "0:45",
    views: "165K",
    likes: "12.7K",
    video: "/videos-compressed/avan-spring.mp4",
    description:
      "Sun-drenched architectural views capturing spring florals, open balconies, and peaceful residential layouts.",
    tags: ["Spring Living", "Real Estate", "Nature Views"],
  },
  {
    id: "real-2",
    title: "Avantika Navratri Festive Grand Gala",
    category: "realestate",
    categoryLabel: "Festive Living",
    client: "Avantika Township",
    duration: "0:50",
    views: "230K",
    likes: "19.3K",
    video: "/videos-compressed/avantika-navratri.mp4",
    description:
      "Glittering fairy lights, garba community celebrations, and joyous resident gatherings across township lawns.",
    tags: ["Festive Living", "Garba Night", "Community Township"],
  },
  {
    id: "real-3",
    title: "Bhavik Luxury 3BHK Flat Interior Tour",
    category: "realestate",
    categoryLabel: "Interiors",
    client: "Bhavik Infra",
    duration: "0:52",
    views: "194K",
    likes: "14.8K",
    video: "/videos-compressed/bhavik-flat.mp4",
    description:
      "Modern 3BHK flat interior tour highlighting smart modular kitchen, ambient lighting, and master bedrooms.",
    tags: ["Flat Tour", "Interior Design", "Modern Living"],
  },
  {
    id: "real-4",
    title: "Bhavik Infra Commercial Development",
    category: "realestate",
    categoryLabel: "Commercial Hub",
    client: "Bhavik Infrastructure",
    duration: "0:44",
    views: "145K",
    likes: "10.9K",
    video: "/videos-compressed/bhavik-infra.mp4",
    description:
      "Mega construction milestones, structural engineering precision, and modern commercial facade reveal.",
    tags: ["Commercial Infra", "Construction", "Engineering"],
  },

  // --- Brand Commercials & Products (6 Unique Reels) ---
  {
    id: "creative-1",
    title: "Shivaura Citirin Luxury Gemstone Film",
    category: "creative",
    categoryLabel: "Product Promo",
    client: "Shivaura Gemstone",
    duration: "0:38",
    views: "215K",
    likes: "17.4K",
    video: "/videos-compressed/shivaura-citirin.mp4",
    description:
      "Sensory luxury product film showcasing sparkling gemstone cuts, radiant gold accents, and macro elegance.",
    tags: ["Luxury Product", "Jewelry", "Macro Shine"],
  },
  {
    id: "creative-2",
    title: "Shivaura Royal Heritage Jewelry Commercial",
    category: "creative",
    categoryLabel: "Brand Film",
    client: "Shivaura Jewels",
    duration: "0:54",
    views: "320K",
    likes: "26.8K",
    video: "/videos-compressed/shivaura-final.mp4",
    description:
      "Heritage bridal necklace elegance set against rich velvet draping and royal studio lighting.",
    tags: ["Bridal Jewelry", "Royal Heritage", "Commercial Film"],
  },
  {
    id: "creative-3",
    title: "Zoniraz Urban Fashion Lookbook Commercial",
    category: "creative",
    categoryLabel: "Fashion Film",
    client: "Zoniraz Apparel",
    duration: "0:50",
    views: "275K",
    likes: "21.6K",
    video: "/videos-compressed/zoniraz-final.mp4",
    description:
      "Fast-paced retail brand commercial edited with sound sync, electric color grading, and store visit energy.",
    tags: ["Fashion Lookbook", "Retail Brand", "Sound Sync"],
  },
  {
    id: "creative-4",
    title: "Zoniraz KD Streetwear Drop Campaign",
    category: "creative",
    categoryLabel: "Streetwear",
    client: "Zoniraz Streetwear",
    duration: "0:42",
    views: "295K",
    likes: "24.3K",
    video: "/videos-compressed/zoniraz-kd.mp4",
    description:
      "Kinetic jump cuts, urban neon cityscapes, and bold graphic streetwear styles styled for Gen-Z trendsetters.",
    tags: ["Streetwear", "Gen-Z Fashion", "Kinetic Edits"],
  },
  {
    id: "creative-5",
    title: "Ambhuti High-Performance Adhesives Reel 2.1",
    category: "creative",
    categoryLabel: "Product Power",
    client: "Ambhuti Chemicals",
    duration: "0:40",
    views: "160K",
    likes: "12.5K",
    video: "/videos-compressed/ambhuti-reel-2-1.mp4",
    description:
      "Industrial formulation strength demonstrated with high-speed macro splash and high-durability tensile bonding.",
    tags: ["Adhesive", "Industrial Film", "Macro Strength"],
  },
  {
    id: "creative-6",
    title: "Ambhuti Tile Adhesive Extreme Weather Grip",
    category: "creative",
    categoryLabel: "Build Tech",
    client: "Ambhuti Build",
    duration: "0:36",
    views: "148K",
    likes: "11.1K",
    video: "/videos-compressed/ambhuti-tile-2.mp4",
    description:
      "Waterproofing and high-thermal resistance test showing zero tile detachment under extreme construction testing.",
    tags: ["Build Tech", "Waterproofing", "Tile Adhesive"],
  },

  // --- Lifestyle & Wellness Reels (2 Unique Reels) ---
  {
    id: "life-1",
    title: "Mindful Community Group Yoga Gathering",
    category: "lifestyle",
    categoryLabel: "Community Yoga",
    client: "Yoga Lifestyle Life",
    duration: "0:44",
    views: "178K",
    likes: "14.6K",
    video: "/videos-compressed/yoga-group.mp4",
    description:
      "Synchronized sunrise flow, peaceful breathing techniques, and uplifting community yoga in nature.",
    tags: ["Group Yoga", "Community Wellness", "Sunrise Flow"],
  },
  {
    id: "life-2",
    title: "Breath & Balance Cinematic Yoga Short Film",
    category: "lifestyle",
    categoryLabel: "Cinematic Film",
    client: "Yoga Living Foundation",
    duration: "0:56",
    views: "240K",
    likes: "19.8K",
    video: "/videos-compressed/yoga-shortfilm.mp4",
    description:
      "An introspective short film exploring meditation, fluid movement, and inner peace in mountain valleys.",
    tags: ["Yoga Short Film", "Meditation", "Cinematic Wellness"],
  },
];

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
          src={reel.video}
          loop
          muted
          playsInline
          preload="metadata"
          className="reel-card__video"
        />

        {/* Gradient Overlays */}
        <div className="reel-card__overlay-top" />
        <div className="reel-card__overlay-bottom" />

        {/* Top Badges */}
        <div className="reel-card__top">
          <span className="reel-card__category-badge">{reel.categoryLabel}</span>
          <span className="reel-card__duration-badge">{reel.duration}</span>
        </div>

        {/* Center Play Icon */}
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
}

export default function CategoryReels() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedReel, setSelectedReel] = useState(null);

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
            Explore industry-specific reels for healthcare, schools, restaurants, real estate,
            brand commercials, and wellness. Hover to preview or click to watch with full audio.
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
            {filteredReels.map((reel, index) => (
              <SmartReelCard
                key={reel.id}
                reel={reel}
                index={index}
                onSelect={setSelectedReel}
              />
            ))}
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
                ✕
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
                    key={selectedReel.video}
                    src={selectedReel.video}
                    controls
                    autoPlay
                    playsInline
                    className="reel-modal-video"
                  />
                </div>
              </div>

              {/* Info Column */}
              <div className="reel-modal-info-col">
                <div className="reel-modal-badge-row">
                  <span className="reel-modal-badge">{selectedReel.categoryLabel}</span>
                  <span className="reel-modal-duration">{selectedReel.duration}</span>
                </div>

                <h3 className="reel-modal-title">{selectedReel.title}</h3>
                <p className="reel-modal-client">Client: {selectedReel.client}</p>

                <p className="reel-modal-desc">{selectedReel.description}</p>

                {/* Stats */}
                <div className="reel-modal-stats-row">
                  <div className="reel-modal-stat-box">
                    <span className="reel-modal-stat-num">{selectedReel.views}</span>
                    <span className="reel-modal-stat-label">Organic Reach</span>
                  </div>
                  <div className="reel-modal-stat-box">
                    <span className="reel-modal-stat-num">{selectedReel.likes}</span>
                    <span className="reel-modal-stat-label">Likes & Shares</span>
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
