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
              <span className="crowd-pill__text">(01) Why Reachwise</span>
            </div>

            <h2 className="crowd-title">
              <span className="crowd-title__line">Everyone is a crowd.</span>
              <span className="crowd-title__line">
                We find <span className="crowd-badge">your buyers.</span>
              </span>
            </h2>
          </div>

          {/* Right Description, Button & Meta */}
          <div className="crowd-header__right">
            <p className="crowd-desc">
              Most brands aren't invisible. They're talking to the wrong people.
              We find the searches, feeds and audiences where your buyers
              already are — and put you there.
            </p>

            <a href="#about" className="crowd-btn-about">
              <span>About us</span>
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
                <span className="crowd-stat-bullet">•</span> FOUNDED 2018
              </span>
              <span className="crowd-stat-item">
                <span className="crowd-stat-bullet">•</span> 16 PEOPLE
              </span>
              <span className="crowd-stat-item">
                <span className="crowd-stat-bullet">•</span> NEW YORK • REMOTE
              </span>
            </div>
          </div>
        </div>

        {/* Box design removed as requested by user - ready to rebuild freshly */}
      </div>
    </section>
  );
}
