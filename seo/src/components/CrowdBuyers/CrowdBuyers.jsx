import CrowdBox from "./CrowdBox";
import defaultSeoContent from "../../data/seoContent.json";
import "./CrowdBuyers.css";

export default function CrowdBuyers() {
  const content = defaultSeoContent?.localSeo || {};
  const stats = content.statsBullets || ["GOOGLE BUSINESS PROFILE", "NAP CONSISTENCY", "ALWAR LOCAL SEARCH"];
  const cards = content.cards || [];

  return (
    <section className="crowd-section" id="why-us">
      <div className="crowd-container">
        {/* Top Header Area */}
        <div className="crowd-header">
          {/* Left Title & Pill */}
          <div className="crowd-header__left">
            <div className="crowd-pill">
              <span className="crowd-pill__dot" />
              <span className="crowd-pill__text">
                {content.sectionPill || "(02) Local SEO Strategy (Alwar)"}
              </span>
            </div>

            <h2 className="crowd-title">
              <span className="crowd-title__line">{content.titleLine1 || "Local SEO Dominance."}</span>
              <span className="crowd-title__line">
                Ranked #1 in <span className="crowd-badge">{content.titleBadge || "Alwar & Local Pack."}</span>
              </span>
            </h2>
          </div>

          {/* Right Description, Button & Meta */}
          <div className="crowd-header__right">
            <p className="crowd-desc">
              {content.description || "A local SEO strategy was developed to improve RizeWorld’s visibility for relevant searches in Alwar. The focus was on strengthening Google Business Profile signals, local relevance, citations, and location-based website optimization."}
            </p>

            <div className="crowd-stats-row">
              {stats.map((bullet, i) => (
                <span key={i} className="crowd-stat-item">
                  <span className="crowd-stat-bullet">•</span> {bullet}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Three Local SEO Strategy Cards */}
        <div className="crowd-cards-grid">
          {cards.map((card, idx) => (
            <div key={card.id || idx} className="crowd-card">
              <div className={`crowd-card__badge ${idx === 1 ? "crowd-card__badge--green" : "crowd-card__badge--orange"}`}>
                {card.badge || `0${idx + 1}`}
              </div>
              <h3 className="crowd-card__title">{card.title}</h3>
              <p className="crowd-card__desc">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Interactive Crowd & Buyer Targeting Box */}
        <CrowdBox key="crowd-box-dual-color-v2" />
      </div>
    </section>
  );
}
