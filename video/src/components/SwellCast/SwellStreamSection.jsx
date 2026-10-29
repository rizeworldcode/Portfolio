import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiSparkles } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";
import { FiArrowRight } from "react-icons/fi";
import SwellCastPro from "./SwellCastPro";
import "./SwellStreamSection.css";

// Helper for clean URL encoding with spaces
const vPath = (p) => encodeURI(p);

// Dedicated Ambient & Cinematic Stream Reels (10 Unique Reels - 0 Duplication)
const STREAM_CARDS = [
  {
    media: "video",
    video: "/videos-compressed/june-17.mp4",
    title: "17th June Milestone Visuals",
    category: "Event Film",
    client: "Rizeworld Events",
    year: "2026",
    description: "Milestone anniversary visual piece celebrating production milestones, keynotes, and achievements.",
  },
  {
    media: "video",
    video: "/videos-compressed/water-cinematic.mp4",
    title: "Elemental Water Macro Cinema",
    category: "Macro Visual",
    client: "Cinematic Nature Studies",
    year: "2026",
    description: "Hypnotic high-speed liquid dynamics, macro droplets, and ambient aquatic light refraction.",
  },
  {
    media: "video",
    video: "/videos-compressed/stone-trees.mp4",
    title: "Stone & Trees Organic Space",
    category: "Landscape Design",
    client: "Eco Living Studio",
    year: "2026",
    description: "Atmospheric architectural study integrating ancient stone walls with lush living foliage.",
  },
  {
    media: "video",
    video: "/videos-compressed/ambhuti-tile-1.mp4",
    title: "Ambhuti High Bond Material Film",
    category: "Industrial Reel",
    client: "Ambhuti Group",
    year: "2025",
    description: "Industrial strength and product durability demonstrated through heavy-load impact tests.",
  },
  {
    media: "video",
    video: "/videos-compressed/saniya-ambience.mp4",
    title: "Saniya Hospital Ambience & Stories",
    category: "Healthcare Docu",
    client: "Saniya Hospital",
    year: "2025",
    description: "Heartwarming patient recovery testimonials and calming interior medical ambience.",
  },
  {
    media: "video",
    video: "/videos-compressed/bhau-final.mp4",
    title: "High-Octane Cinematic Action Showcase",
    category: "Action Cinema",
    client: "Apex Motion Pictures",
    year: "2025",
    description: "Dynamic stunt choreography, gritty cinematic drama, and high-speed chase sequences edited with pulse-pounding rhythm.",
  },
  {
    media: "video",
    video: "/videos-compressed/rize-institute.mp4",
    title: "Rize Creative Academy Hub",
    category: "Academy Reel",
    client: "Rize Institute",
    year: "2025",
    description: "Behind the scenes of digital creators, video editors, and design innovators building careers.",
  },
  {
    media: "video",
    video: "/videos-compressed/influencer-reel.mp4",
    title: "Creator Influencer Viral Campaign",
    category: "Influencer Reel",
    client: "Creator Network",
    year: "2025",
    description: "High-energy social media influencer activation designed for explosive engagement and reach.",
  },
  {
    media: "video",
    video: "/videos-compressed/zoniraz-franchise.mp4",
    title: "Zoniraz Franchise Launch Gala",
    category: "Franchise Film",
    client: "Zoniraz Retail",
    year: "2025",
    description: "Exclusive retail business opportunity walkthrough showcasing turnkey store models.",
  },
  {
    media: "video",
    video: "/videos-compressed/yoga-adventure.mp4",
    title: "Himalayan Outdoor Yoga Adventure",
    category: "Adventure Reel",
    client: "Yoga Lifestyle Life",
    year: "2025",
    description: "Epic mountain peaks, high-altitude breathwork, and breathtaking adventure cinematography.",
  },
];

export default function SwellStreamSection() {
  const [selectedCard, setSelectedCard] = useState(null);

  return (
    <section className="swell-section" id="stream">
      {/* The Pure SwellCast Dual Stream Canvas with Centered Headline */}
      <div className="swell-section__canvas-wrap">
        <SwellCastPro
          cards={STREAM_CARDS}
          showText={true}
          lineLead="Made to be"
          lineAccent="remembered"
          lineTrail=""
          textX={62}
          textColor="#111111"
          accentColor="#111111"
          background="#ffffff"
          spread={1}
          startSize={0.32}
          endSize={1.02}
          growth={3}
          ratio={0.58}
          gap={28}
          radius={0.08}
          flow={0.25}
          direction="outward"
          hoverSlow={0.22}
          drag={true}
          wheel={true}
          vScroll="page"
          scrollGain={0.65}
          smear={0.4}
          bulge={0.22}
          bend={0.28}
          depthBlur={1}
          focusX={58}
          focusWidth={0.2}
          maxVideos={2}
          onSelect={(card) => setSelectedCard(card)}
          style={{ width: "100%", height: "100%" }}
        />

        {/* Bottom Right Minimal Badge (as seen in screenshot) */}
        <div className="swell-section__badge-pill">
          <HiSparkles size={13} style={{ marginRight: "5px" }} />
          <span>Made in Rizeworld</span>
        </div>
      </div>

      {/* Optional Card Detail Modal on Click */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            className="swell-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              className="swell-modal-card"
              initial={{ scale: 0.92, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 24 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="swell-modal-close"
                onClick={() => setSelectedCard(null)}
                aria-label="Close modal"
              >
                <IoClose size={22} />
              </button>

              <div className="swell-modal-media">
                <video
                  ref={(el) => {
                    if (el) {
                      const p = el.play();
                      if (p && typeof p.catch === "function") {
                        p.catch(() => {
                          el.muted = true;
                          el.play();
                        });
                      }
                    }
                  }}
                  key={selectedCard.video}
                  src={selectedCard.video}
                  controls
                  autoPlay
                  playsInline
                  className="swell-modal-video"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
