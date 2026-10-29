import CrowdBox from "./CrowdBox";
import "./CrowdBuyers.css";

export default function CrowdBuyers() {
  return (
    <section className="crowd-section" id="why-us">
      <div className="crowd-container">
        {/* Top Header Area */}
        <div className="crowd-header">
          {/* Left Title & Pill */}
          <div className="crowd-header__left">
            <div className="crowd-pill">
              <span className="crowd-pill__dot" />
              <span className="crowd-pill__text">(02) Local SEO Strategy (Alwar)</span>
            </div>

            <h2 className="crowd-title">
              <span className="crowd-title__line">Local SEO Dominance.</span>
              <span className="crowd-title__line">
                Ranked #1 in <span className="crowd-badge">Alwar & Local Pack.</span>
              </span>
            </h2>
          </div>

          {/* Right Description, Button & Meta */}
          <div className="crowd-header__right">
            <p className="crowd-desc">
              A local SEO strategy was developed to improve RizeWorld’s visibility for relevant searches in Alwar. The focus was on strengthening Google Business Profile signals, local relevance, citations, and location-based website optimization.
            </p>

            <div className="crowd-stats-row">
              <span className="crowd-stat-item">
                <span className="crowd-stat-bullet">•</span> GOOGLE BUSINESS PROFILE
              </span>
              <span className="crowd-stat-item">
                <span className="crowd-stat-bullet">•</span> NAP CONSISTENCY
              </span>
              <span className="crowd-stat-item">
                <span className="crowd-stat-bullet">•</span> ALWAR LOCAL SEARCH
              </span>
            </div>
          </div>
        </div>

        {/* Three Local SEO Strategy Cards */}
        <div className="crowd-cards-grid">
          <div className="crowd-card">
            <div className="crowd-card__badge crowd-card__badge--orange">01</div>
            <h3 className="crowd-card__title">Google Business Profile (GBP)</h3>
            <p className="crowd-card__desc">
              Optimized business information, primary categories, services, and local signals to improve visibility for relevant searches.
            </p>
          </div>

          <div className="crowd-card">
            <div className="crowd-card__badge crowd-card__badge--green">02</div>
            <h3 className="crowd-card__title">Local Citations & NAP Consistency</h3>
            <p className="crowd-card__desc">
              Maintained consistent business information across relevant directories, listings, and citation sources.
            </p>
          </div>

          <div className="crowd-card">
            <div className="crowd-card__badge crowd-card__badge--orange">03</div>
            <h3 className="crowd-card__title">Location-Based On-Page Signals</h3>
            <p className="crowd-card__desc">
              Strengthened location relevance through locally focused content, headings, structured data, and service information.
            </p>
          </div>
        </div>

        {/* Interactive Crowd & Buyer Targeting Box */}
        <CrowdBox key="crowd-box-dual-color-v2" />
      </div>
    </section>
  );
}
