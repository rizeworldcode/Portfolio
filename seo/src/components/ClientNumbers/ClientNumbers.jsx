import { useState } from "react";
import "./ClientNumbers.css";

export default function ClientNumbers() {
  const [filter, setFilter] = useState("COMPOSITE");

  const filters = ["ALL", "COMPOSITE", "SEO", "SOCIAL", "ADS"];

  const stats = [
    {
      id: "01",
      label: "AVERAGE ORGANIC GROWTH",
      value: "212%",
      badge: "VS LAST YEAR",
      points: "M 0 70 Q 50 65, 100 55 T 200 40 T 300 15",
    },
    {
      id: "02",
      label: "RETURN ON AD SPEND",
      value: "6.2x",
      badge: "VS LAST YEAR",
      points: "M 0 65 Q 60 60, 120 48 T 220 32 T 300 12",
    },
    {
      id: "03",
      label: "PEOPLE REACHED IN 2025",
      value: "38M",
      badge: "VS LAST YEAR",
      points: "M 0 68 Q 70 62, 140 50 T 240 28 T 300 10",
    },
    {
      id: "04",
      label: "BRANDS GROWN SINCE 2016",
      value: "140+",
      badge: "VS LAST YEAR",
      points: "M 0 72 Q 50 68, 110 52 T 210 30 T 300 16",
    },
  ];

  const marqueeItems = [
    "12% CLOSER NEAR ME",
    "20 MIN AGO",
    "5-STAR REVIEW · ORBIT LEGAL",
    "NEW LEAD · NORTHSIDE DENTAL",
    "2.4K NEW FOLLOWERS · LUMEN SKIN",
    "+212% MAP PACK · CITY DENTAL",
    "5.4X ROAS · TALLOW",
    "92% ORGANIC LIFT · HAVEN REALTY",
  ];

  return (
    <section className="numbers-section" id="numbers">
      <div className="numbers-container">
        {/* Header */}
        <div className="numbers-header">
          <div className="numbers-header__left">
            <div className="numbers-pill">
              <span className="numbers-pill__dot" />
              <span className="numbers-pill__text">(05) The numbers</span>
            </div>
            <h2 className="numbers-title">What our clients got last year.</h2>
          </div>

          <div className="numbers-header__right">
            <p className="numbers-desc">
              Every client gets the report each month. These are the averages
              across all of them.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="numbers-filters">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              className={`numbers-filter-btn ${
                filter === f ? "numbers-filter-btn--active" : ""
              }`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
          <span className="numbers-timeframe">LAST 12 MONTHS</span>
        </div>

        {/* 4 Stat Cards with Sparklines */}
        <div className="numbers-grid">
          {stats.map((st) => (
            <div key={st.id} className="numbers-card">
              <div className="numbers-card__header">
                <span className="numbers-card__num">{st.id}</span>
                <span className="numbers-card__label">{st.label}</span>
              </div>

              <div className="numbers-card__val">{st.value}</div>

              <div className="numbers-card__sparkline">
                <div className="numbers-card__badge">
                  <span className="numbers-card__arrow">▲</span>
                  <span>{st.badge}</span>
                </div>

                <svg viewBox="0 0 300 80" className="numbers-sparkline-svg">
                  <path
                    d={st.points}
                    fill="none"
                    stroke="#d4ff00"
                    strokeWidth="3"
                  />
                  {/* Glowing shaded area */}
                  <path
                    d={`${st.points} L 300 80 L 0 80 Z`}
                    fill="url(#sparklineGrad)"
                    opacity="0.2"
                  />
                  <defs>
                    <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#d4ff00" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#d4ff00" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="numbers-card__months">
                  <span>JAN</span>
                  <span>DEC</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Infinite Scrolling Ticker Marquee */}
      <div className="numbers-ticker-wrap">
        <div className="numbers-ticker">
          {[...marqueeItems, ...marqueeItems].map((item, idx) => (
            <span key={idx} className="numbers-ticker__item">
              <span className="numbers-ticker__dot" />
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
