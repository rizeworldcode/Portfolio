import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SwellCastPro from "./SwellCastPro";
import "./SwellStreamSection.css";

// Diverse visual media cards
const STREAM_CARDS = [
  {
    image: "/showcase/creative.jpg",
    title: "Cinematic Kinetic Motion",
    category: "Motion Graphics · 4K",
    client: "Creative Corp",
    year: "2026",
    description: "Futuristic kinetic visual typography and 3D fluid motion design.",
  },
  {
    video: "/hero-video.mp4",
    image: "/showcase/port.jpg",
    title: "Rizeworld Master Reel",
    category: "Showreel · Full Edit",
    client: "Rizeworld Studios",
    year: "2026",
    description: "Signature master montage of cinematic cuts, sound design, and color pacing.",
  },
  {
    image: "/showcase/kafesa.jpg",
    title: "Kafesa Gourmet Spotlight",
    category: "Commercial · Macro 4K",
    client: "Kafesa Bistro",
    year: "2025",
    description: "Mouth-watering commercial focusing on high-frame-rate steam and sizzling textures.",
  },
  {
    image: "/showcase/brownie.png",
    title: "Sweet Bite CGI Product",
    category: "3D VFX · Product CGI",
    client: "Brownie Bites",
    year: "2025",
    description: "Ultra-realistic 3D chocolate simulation, particles, and packaging explosion.",
  },
  {
    image: "/showcase/avantika.jpg",
    title: "Avantika Royal Living",
    category: "Architectural Drone Tour",
    client: "Avantika Residences",
    year: "2025",
    description: "Sweeping FPV drone footage through royal estate interiors and sunlit facades.",
  },
  {
    image: "/showcase/clapbox.jpg",
    title: "Clap Box Studio Beats",
    category: "Music Visualizer · Edit",
    client: "Clap Box Music",
    year: "2025",
    description: "Rhythmic bass-synced motion cuts with electric chromatic aberration effects.",
  },
  {
    image: "/showcase/dwps.png",
    title: "DWPS Horizons Campaign",
    category: "Brand Storytelling",
    client: "DWPS Alwar",
    year: "2025",
    description: "Heartfelt documentary capturing youth aspirations, sports triumphs, and education.",
  },
  {
    image: "/showcase/yoga.jpg",
    title: "Serenity Yoga & Nature",
    category: "Slow Motion Docu",
    client: "Saniya Life",
    year: "2025",
    description: "Serene sunrise aesthetics, atmospheric fog, and peaceful meditative cadence.",
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
          startSize={0.28}
          endSize={0.96}
          growth={3}
          ratio={1.08}
          gap={32}
          radius={0.08}
          flow={0.35}
          direction="outward"
          hoverSlow={0.22}
          drag={true}
          wheel={true}
          vScroll="page"
          scrollGain={1}
          smear={0.6}
          bulge={0.22}
          bend={0.28}
          depthBlur={1}
          focusX={58}
          focusWidth={0.2}
          maxVideos={4}
          onSelect={(card) => setSelectedCard(card)}
          style={{ width: "100%", height: "100%" }}
        />

        {/* Bottom Right Minimal Badge (as seen in screenshot) */}
        <div className="swell-section__badge-pill">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
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
                ✕
              </button>

              <div className="swell-modal-media">
                {selectedCard.video ? (
                  <video
                    src={selectedCard.video}
                    controls
                    autoPlay
                    playsInline
                    className="swell-modal-video"
                  />
                ) : (
                  <img
                    src={selectedCard.image}
                    alt={selectedCard.title}
                    className="swell-modal-image"
                  />
                )}
              </div>

              <div className="swell-modal-info">
                <span className="swell-modal-badge">{selectedCard.category || "Showcase"}</span>
                <h3 className="swell-modal-title">{selectedCard.title}</h3>
                {selectedCard.client && (
                  <p className="swell-modal-client">Client: {selectedCard.client}</p>
                )}
                {selectedCard.description && (
                  <p className="swell-modal-desc">{selectedCard.description}</p>
                )}

                <div className="swell-modal-footer">
                  <a href="#contact" className="swell-modal-cta" onClick={() => setSelectedCard(null)}>
                    <span>Inquire for Similar Project</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
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
