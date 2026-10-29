import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./RadarClients.css";

export default function RadarClients() {
  const [activeBrand, setActiveBrand] = useState(null);
  const [lastPing, setLastPing] = useState({ name: "RIZEWORLD SEO ALWAR", growth: "#1 RANK" });

  // Brand & Keyword entities targeted across Alwar and regional search
  const brands = [
    { id: 1, name: "SEO Agency Alwar", x: 28, y: 22, tier: "LOCAL PACK", growth: "#1 RANK" },
    { id: 2, name: "Web Dev Alwar", x: 38, y: 28, tier: "REGIONAL", growth: "#1 RANK" },
    { id: 3, name: "Digital Marketing", x: 18, y: 39, tier: "COMMERCIAL", growth: "TOP 3" },
    { id: 4, name: "Shalimar Nagar Pack", x: 19, y: 56, tier: "LOCAL", growth: "RANK #1" },
    { id: 5, name: "UIT Colony Search", x: 42, y: 58, tier: "GEO-TARGET", growth: "#1 RANK" },
    { id: 6, name: "Telco Circle Pack", x: 58, y: 64, tier: "LOCAL", growth: "#1 RANK" },
    { id: 7, name: "Rajasthan Tech SEO", x: 62, y: 73, tier: "STATEWIDE", growth: "TOP 5" },
    { id: 8, name: "Local Citations NAP", x: 40, y: 81, tier: "AUTHORITY", growth: "100%" },
    { id: 9, name: "Near Me Queries", x: 65, y: 53, tier: "LOCAL PACK", growth: "#1 RANK" },
    { id: 10, name: "RizeWorld SEO Alwar", x: 74, y: 46, tier: "CORE BRAND", growth: "#1 RANK" },
  ];

  const [sweptBrandId, setSweptBrandId] = useState(10); // default kettlebrook like in video

  // Auto-cycle radar scanner hit on brands matching video at 00:01
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % brands.length;
      const b = brands[index];
      setSweptBrandId(b.id);
      setLastPing({ name: b.name.toUpperCase(), growth: b.growth });
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="radar-section" id="clients">
      <div className="radar-container">
        {/* Left Column: Typography & Info */}
        <div className="radar-left">
          {/* Section Pill */}
          <div className="radar-pill">
            <span className="radar-pill__dot" />
            <span className="radar-pill__text">(01) Project Overview & SEO Objective</span>
          </div>

          {/* Headline */}
          <h2 className="radar-title">
            <span className="radar-title__main">SEO Objective &</span>
            <span className="radar-title__badges">
              <span className="radar-badge radar-badge--orange">Online</span>{" "}
              <span className="radar-badge radar-badge--green">Visibility.</span>
            </span>
          </h2>

          {/* Subtitle */}
          <p className="radar-desc">
            RizeWorld’s SEO strategy was focused on strengthening organic visibility, improving search relevance, and creating a structured website experience for businesses targeting Alwar and surrounding areas.
            <br /><br />
            The approach combined keyword research, on-page SEO, technical optimization, local search, and content strategy to build a stronger foundation for long-term organic growth.
          </p>

          <div className="radar-divider" />

          {/* Reviews & Live Ping */}
          <div className="radar-meta">
            <div className="radar-reviews">
              <span className="radar-reviews__stars">★★★★★</span>
              <span className="radar-reviews__text">4.9 · 126 REVIEWS</span>
            </div>

            <div className="radar-last-ping">
              <span className="radar-last-ping__icon" />
              <span className="radar-last-ping__text">
                LAST PING {lastPing.name} · {lastPing.growth}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Interactive Radar */}
        <div className="radar-right">
          <div className="radar-display">
            {/* Degree Markers */}
            <span className="radar-deg radar-deg--0">000°</span>
            <span className="radar-deg radar-deg--90">090°</span>
            <span className="radar-deg radar-deg--180">180°</span>
            <span className="radar-deg radar-deg--270">270°</span>

            {/* Perimeter Ticks */}
            <div className="radar-ticks" />

            {/* Range Rings with Labels */}
            <div className="radar-ring radar-ring--global">
              <span className="radar-ring__label">GLOBAL</span>
            </div>
            <div className="radar-ring radar-ring--national">
              <span className="radar-ring__label">NATIONAL</span>
            </div>
            <div className="radar-ring radar-ring--regional">
              <span className="radar-ring__label">REGIONAL</span>
            </div>
            <div className="radar-ring radar-ring--local">
              <span className="radar-ring__label">LOCAL</span>
            </div>

            {/* Crosshair Axes */}
            <div className="radar-axis radar-axis--h" />
            <div className="radar-axis radar-axis--v" />

            {/* Rotating Radar Scanner Beam */}
            <div className="radar-scanner">
              <div className="radar-scanner__cone" />
              <div className="radar-scanner__edge" />
            </div>

            {/* Center Origin Dot */}
            <div className="radar-center-dot">
              <span className="radar-center-dot__inner" />
            </div>

            {/* Brand Blips */}
            {brands.map((brand) => {
              const isHighlight = activeBrand?.id === brand.id || sweptBrandId === brand.id;
              const isGreen = brand.tier === "LOCAL PACK" || brand.tier === "LOCAL" || brand.tier === "GEO-TARGET";
              return (
                <div
                  key={brand.id}
                  className={`radar-blip ${
                    isHighlight ? "radar-blip--active radar-blip--swept" : ""
                  } ${isGreen ? "radar-blip--green" : "radar-blip--orange"}`}
                  style={{
                    left: `${brand.x}%`,
                    top: `${brand.y}%`,
                  }}
                  onMouseEnter={() => {
                    setActiveBrand(brand);
                    setLastPing({ name: brand.name.toUpperCase(), growth: brand.growth });
                  }}
                  onMouseLeave={() => setActiveBrand(null)}
                >
                  <span className="radar-blip__dot" />
                  <span className={`radar-blip__name ${isHighlight ? "radar-blip__name--lime" : ""}`}>
                    {brand.name}
                  </span>
                  {activeBrand?.id === brand.id && (
                    <div className="radar-blip__tooltip">
                      <span>{brand.tier}</span> · <strong>{brand.growth}</strong>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
