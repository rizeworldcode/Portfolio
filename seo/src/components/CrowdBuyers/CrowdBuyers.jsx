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
              <span className="crowd-pill__text">(01) Project Overview & SEO Objective</span>
            </div>

            <h2 className="crowd-title">
              <span className="crowd-title__line">SEO Objective &</span>
              <span className="crowd-title__line">
                <span className="crowd-badge">Online Visibility.</span>
              </span>
            </h2>
          </div>

          {/* Right Description, Button & Meta */}
          <div className="crowd-header__right">
            <p className="crowd-desc">
              RizeWorld’s SEO strategy was focused on strengthening organic visibility,
              improving search relevance, and creating a structured website experience
              for businesses targeting Alwar and surrounding areas. The approach combined
              keyword research, on-page SEO, technical optimization, local SEO, and content architecture.
            </p>

            <a href="#results" className="crowd-btn-about">
              <span>View Case Results</span>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>

            <div className="crowd-stats-row">
              <span className="crowd-stat-item">
                <span className="crowd-stat-bullet">•</span> RIZEWORLD SEO
              </span>
              <span className="crowd-stat-item">
                <span className="crowd-stat-bullet">•</span> ALWAR & REGIONAL
              </span>
              <span className="crowd-stat-item">
                <span className="crowd-stat-bullet">•</span> LOCAL SEARCH INTENT
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Crowd & Buyer Targeting Box */}
        <CrowdBox />
      </div>
    </section>
  );
}
