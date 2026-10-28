import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./RadarClients.css";

export default function RadarClients() {
  const [activeBrand, setActiveBrand] = useState(null);
  const [lastPing, setLastPing] = useState({ name: "NORTHSIDE DENTAL", growth: "+212%" });

  // Brand data with coordinates on the radar (% from center or x,y on a 500x500 plane)
  const brands = [
    { id: 1, name: "brightline", x: 28, y: 22, tier: "GLOBAL", growth: "+184%" },
    { id: 2, name: "Northside Dental", x: 38, y: 28, tier: "NATIONAL", growth: "+212%" },
    { id: 3, name: "VERDE STUDIO", x: 18, y: 39, tier: "GLOBAL", growth: "+145%" },
    { id: 4, name: "PARCEL & CO", x: 19, y: 56, tier: "NATIONAL", growth: "+96%" },
    { id: 5, name: "Tallow", x: 42, y: 58, tier: "LOCAL", growth: "+310%" },
    { id: 6, name: "Lumen Skin", x: 58, y: 64, tier: "REGIONAL", growth: "+270%" },
    { id: 7, name: "HAVEN REALTY", x: 62, y: 73, tier: "NATIONAL", growth: "+160%" },
    { id: 8, name: "orbit legal", x: 40, y: 81, tier: "GLOBAL", growth: "+130%" },
    { id: 9, name: "FITLOOP", x: 65, y: 53, tier: "REGIONAL", growth: "+195%" },
    { id: 10, name: "kettlebrook coffee", x: 74, y: 46, tier: "GLOBAL", growth: "+225%" },
  ];

  // Rotate "last ping" every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomBrand = brands[Math.floor(Math.random() * brands.length)];
      setLastPing({ name: randomBrand.name.toUpperCase(), growth: randomBrand.growth });
    }, 3500);
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
            <span className="radar-pill__text">(02) Clients</span>
          </div>

          {/* Headline */}
          <h2 className="radar-title">
            <span className="radar-title__main">140+ brands</span>
            <span className="radar-title__badges">
              <span className="radar-badge">on</span>{" "}
              <span className="radar-badge">our</span>{" "}
              <span className="radar-badge">radar.</span>
            </span>
          </h2>

          {/* Subtitle */}
          <p className="radar-desc">
            Local clinics, cafés and online shops to national brands. Every one
            of them came to us to be found by more of the right people.
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
            {brands.map((brand) => (
              <div
                key={brand.id}
                className={`radar-blip ${
                  activeBrand?.id === brand.id ? "radar-blip--active" : ""
                }`}
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
                <span className="radar-blip__name">{brand.name}</span>
                {activeBrand?.id === brand.id && (
                  <div className="radar-blip__tooltip">
                    <span>{brand.tier}</span> · <strong>{brand.growth}</strong>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
