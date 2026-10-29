import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Channels.css";

export default function Channels() {
  const [activeChannel, setActiveChannel] = useState("01");

  const channelsData = [
    {
      id: "01",
      name: "On-Page SEO",
      verticalName: "On-Page SEO",
      bgColor: "#e0e3de",
      pillBg: "#11141a",
      textColor: "#ffffff",
      desc: "Optimizing page structure, metadata, headings, content, images, and internal links.",
      badge: "Structure & Metadata",
      price: "Pillar 01",
      features: [
        "Page structure & heading hierarchy",
        "Meta titles & meta descriptions",
        "Search-intent focused content",
        "Image optimization & alt tags",
        "Contextual internal linking",
      ],
      type: "search",
    },
    {
      id: "02",
      name: "Local SEO",
      verticalName: "Local SEO",
      bgColor: "#11141a",
      pillBg: "#11141a",
      textColor: "#ffffff",
      desc: "Improving local relevance through Google Business Profile, citations, and location-focused optimization.",
      badge: "Ranked #1 in Alwar",
      price: "Pillar 02",
      features: [
        "Google Business Profile (GBP) audit",
        "Primary & secondary category targeting",
        "Local citation building & NAP audit",
        "Location-focused landing pages",
        "Alwar local search pack dominance",
      ],
      type: "local",
    },
    {
      id: "03",
      name: "Technical SEO",
      verticalName: "Technical SEO",
      bgColor: "#ffffff",
      pillBg: "#ffffff",
      textColor: "#11141a",
      desc: "Strengthening crawlability, indexability, website structure, page performance, and technical foundations.",
      badge: "Crawl-Friendly",
      price: "Pillar 03",
      features: [
        "Crawlability & indexation health",
        "Clean URL hierarchy & taxonomy",
        "Page load performance & Core Web Vitals",
        "Structured data & schema markup",
        "Mobile usability & responsive UX",
      ],
      type: "tech",
    },
    {
      id: "04",
      name: "Content Optimization",
      verticalName: "Content & Intent",
      bgColor: "#d4ff00",
      pillBg: "#d4ff00",
      textColor: "#11141a",
      desc: "Creating relevant, readable content that addresses what users are actually searching for.",
      badge: "Search Intent",
      price: "Pillar 04",
      features: [
        "Search-intent mapping & queries",
        "Reader-first content depth",
        "Clear answering of search intent",
        "User experience & dwell time signals",
        "Content freshening & updates",
      ],
      type: "content",
    },
    {
      id: "05",
      name: "Target Keywords",
      verticalName: "Target Keywords",
      bgColor: "#11141a",
      pillBg: "#11141a",
      textColor: "#ffffff",
      desc: "Mapping relevant commercial and local search terms to the pages where they make the most sense.",
      badge: "Commercial & Local",
      price: "Pillar 05",
      features: [
        "Commercial & transactional keyword mapping",
        "Local Alwar search query discovery",
        "Competitor keyword opportunity analysis",
        "Logical page-to-keyword assignment",
        "Search volume & conversion intent",
      ],
      type: "keywords",
    },
    {
      id: "06",
      name: "Organic Results",
      verticalName: "Organic Results",
      bgColor: "#e7eae5",
      pillBg: "#e7eae5",
      textColor: "#11141a",
      desc: "Monitoring search visibility and using performance data to guide ongoing SEO improvements.",
      badge: "Data-Guided",
      price: "Pillar 06",
      features: [
        "Search Console visibility monitoring",
        "Local map pack rank tracking",
        "Click-through rate (CTR) optimization",
        "Actionable performance data reviews",
        "Continuous iterative refinement",
      ],
      type: "results",
    },
  ];

  const currentChannel = channelsData.find((c) => c.id === activeChannel) || channelsData[0];

  return (
    <section className="channels-section" id="services">
      <div className="channels-container">
        {/* ============================================================
            TOP HEADER AREA
            ============================================================ */}
        <div className="channels-header">
          <div className="channels-header__left">
            <div className="channels-pill">
              <span className="channels-pill__dot" />
              <span className="channels-pill__text">(03) SEO Strategy</span>
            </div>

            <h2 className="channels-title">
              <span className="channels-title__row">SEO Strategy.</span>
              <span className="channels-title__row">
                <span className="channels-badge">Six</span> Core Pillars.
              </span>
            </h2>
          </div>

          <div className="channels-header__right">
            <p className="channels-desc">
              RizeWorld’s SEO process brings together technical foundations, content relevance, local search optimization, and ongoing performance analysis. Each activity supports a specific stage of the organic search journey.
            </p>
          </div>
        </div>

        {/* ============================================================
            THE ACCORDION CHANNELS DECK (INLINE 6-ITEM HORIZONTAL ACCORDION)
            ============================================================ */}
        <div
          className="channels-deck"
          onWheel={(e) => {
            // Smoothly switch channels on wheel scroll
            if (Math.abs(e.deltaY) > 25 || Math.abs(e.deltaX) > 25) {
              const ids = channelsData.map((c) => c.id);
              const currentIndex = ids.indexOf(activeChannel);
              const direction = (e.deltaY > 0 || e.deltaX > 0) ? 1 : -1;
              const nextIndex = Math.max(0, Math.min(ids.length - 1, currentIndex + direction));
              if (nextIndex !== currentIndex) {
                setActiveChannel(ids[nextIndex]);
              }
            }
          }}
        >
          {channelsData.map((ch) => {
            const isActive = ch.id === activeChannel;
            const isDarkCard = ch.bgColor === "#11141a" || ch.bgColor === "#000000" || ch.bgColor === "#0a0b0e";

            if (isActive) {
              return (
                <motion.div
                  key={ch.id}
                  layout
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                  className={`channels-active-card channels-active-card--${ch.id} ${
                    isDarkCard ? "channels-active-card--dark" : "channels-active-card--light"
                  }`}
                  style={{ backgroundColor: ch.bgColor }}
                >
                  {/* Top Left Number Circle */}
                  <div className="channels-card-badge channels-card-badge--top">
                    {ch.id}
                  </div>

                  {/* Card Content Split: Left Mockup, Right Details */}
                  <div className="channels-card-inner">
                    {/* Left Side: Mockup Window depending on SEO pillar */}
                    {ch.id === "02" ? (
                      /* Local SEO Google Map & Business Pack Mockup */
                      <div className="channels-mockup channels-mockup--social">
                        <div className="channels-social-reel-box" style={{ background: "#0a0c10" }}>
                          <div className="channels-social-reel-header">
                            <span className="channels-social-reel-tag">GOOGLE MAP PACK</span>
                            <span className="channels-social-reel-views">#1 IN ALWAR</span>
                          </div>
                          <div className="channels-social-reel-body" style={{ flexDirection: "column", gap: "8px", alignItems: "flex-start" }}>
                            <div style={{ color: "#d4ff00", fontSize: "14px", fontWeight: "700" }}>★ ★ ★ ★ ★ (5.0)</div>
                            <div style={{ color: "#ffffff", fontSize: "13px", fontWeight: "600" }}>RizeWorld — Digital Agency Alwar</div>
                            <div style={{ color: "#94a3b8", fontSize: "11px" }}>📍 Shalimar Nagar, UIT Colony, Alwar</div>
                          </div>
                          <div className="channels-social-reel-footer">
                            <div className="channels-social-handle">100% NAP Consistency</div>
                            <div className="channels-social-caption">Google Business Profile fully optimized & verified</div>
                            <div className="channels-social-stats">✔ Verified · ✔ Citations active · ✔ #1 Local Pack</div>
                          </div>
                        </div>
                      </div>
                    ) : ch.id === "03" ? (
                      /* Technical SEO Crawl & Health Mockup */
                      <div className="channels-mockup channels-mockup--ads">
                        <div className="channels-ads-box">
                          <span className="channels-ads-pill">TECHNICAL AUDIT</span>
                          <h5 className="channels-ads-headline">
                            Crawlability, Core Web Vitals & Clean URL Architecture
                          </h5>
                          <div className="channels-ads-metrics">
                            <div className="channels-ads-metric">
                              <span className="channels-ads-val">99%</span>
                              <span className="channels-ads-sub">CRAWL HEALTH</span>
                            </div>
                            <div className="channels-ads-metric">
                              <span className="channels-ads-val">0.4s</span>
                              <span className="channels-ads-sub">LCP SPEED</span>
                            </div>
                          </div>
                          {/* Bar Chart */}
                          <div className="channels-ads-chart">
                            <span style={{ height: "40%" }} />
                            <span style={{ height: "65%" }} />
                            <span style={{ height: "80%" }} />
                            <span style={{ height: "92%" }} />
                            <span style={{ height: "100%" }} className="active-bar" />
                          </div>
                        </div>
                      </div>
                    ) : ch.id === "04" ? (
                      /* Content Optimization Mockup */
                      <div className="channels-mockup channels-mockup--content">
                        <div className="channels-content-card">
                          <div className="channels-content-header">
                            <span className="channels-content-tag">SEARCH INTENT</span>
                          </div>
                          <h4 className="channels-content-title">User Intent |</h4>
                          <p className="channels-content-sub">Comprehensive topic clusters & answers</p>
                          <div className="channels-content-reads">
                            <span>▲ Matched to high-converting queries</span>
                          </div>
                        </div>
                      </div>
                    ) : ch.id === "05" ? (
                      /* Target Keywords Mockup */
                      <div className="channels-mockup channels-mockup--web">
                        <div className="channels-web-wireframe">
                          <div className="channels-web-browser-bar">
                            <div className="channels-web-nav-dots">
                              <span className="dot--red" />
                              <span className="dot--yellow" />
                              <span className="dot--green" />
                            </div>
                            <div className="channels-web-url-bar">rizeworld.com/services</div>
                          </div>
                          <div className="channels-web-hero-block">
                            <div className="channels-web-block-header">
                              <span className="channels-web-badge-mini">KEYWORD MAP</span>
                              <span className="channels-web-speed-badge">RANK #1</span>
                            </div>
                            <div style={{ color: "#ffffff", fontSize: "12px", margin: "8px 0" }}>
                              Target: "seo company alwar" → /seo-services
                            </div>
                            <div className="channels-web-sub-bar" />
                            <div className="channels-web-btn-mock">Mapped Intent →</div>
                          </div>
                          <div className="channels-web-code-row">
                            <span className="channels-web-code-pill">Commercial Intent</span>
                            <span className="channels-web-meta-pill">High Conversion</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Default On-Page / Search SERP Mockup */
                      <div className="channels-mockup">
                        {/* Search Header */}
                        <div className="channels-mockup__search-bar">
                          <span className="channels-mockup__search-icon">🔍</span>
                          <span className="channels-mockup__search-text">seo company in alwar</span>
                          <span className="channels-mockup__cursor">|</span>
                        </div>

                        <div className="channels-mockup__meta">
                          About 184,000 results · 0.28 s
                        </div>

                        {/* Search Result 1 (Highlighted Client Result) */}
                        <div className="channels-mockup__item channels-mockup__item--highlight">
                          <div className="channels-mockup__item-header">
                            <span className="channels-mockup__live-dot" />
                            <span className="channels-mockup__brand-url">rizeworld.com</span>
                          </div>
                          <div className="channels-mockup__brand-title">
                            RizeWorld — SEO Objective & Online Visibility
                          </div>
                          <span className="channels-mockup__rank-pill">#1</span>
                        </div>

                        {/* Search Result 2 */}
                        <div className="channels-mockup__item channels-mockup__item--dim">
                          <div className="channels-mockup__url">directory-alwar.com</div>
                          <div className="channels-mockup__line channels-mockup__line--short" />
                        </div>

                        {/* Search Result 3 */}
                        <div className="channels-mockup__item channels-mockup__item--dim">
                          <div className="channels-mockup__url">marketing-portal.in</div>
                          <div className="channels-mockup__line" />
                        </div>
                      </div>
                    )}

                    {/* Right Side: Channel Information & Deliverables */}
                    <div className="channels-info">
                      <h3 className="channels-info__title">{ch.name}</h3>
                      <p className="channels-info__desc">{ch.desc}</p>

                      <div className="channels-info__included-label">WHAT'S INCLUDED</div>
                      <ul className="channels-info__list">
                        {ch.features.map((feat, idx) => (
                          <li key={idx} className="channels-info__item">
                            <span className="channels-info__check">✔</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="channels-info__footer">
                        <div className="channels-info__meta">
                          <span className="channels-info__badge-pill">
                            <span className="channels-info__badge-dot">•</span>
                            {ch.badge}
                          </span>
                          <div className="channels-info__price-box">
                            <span className="channels-info__price-label">FROM</span>
                            <span className="channels-info__price-val">{ch.price}</span>
                          </div>
                        </div>

                        <a href="#explore" className="channels-btn-explore">
                          <span>Explore</span>
                          <span className="channels-btn-explore__icon">
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
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Left Minus Icon */}
                  <div className="channels-card-badge channels-card-badge--bottom">
                    −
                  </div>
                </motion.div>
              );
            }

            // Inactive vertical pill tab
            return (
              <motion.button
                key={ch.id}
                layout
                type="button"
                className={`channels-tab-strip channels-tab-strip--${ch.id}`}
                style={{
                  backgroundColor: ch.pillBg,
                  color: ch.textColor,
                }}
                onClick={() => setActiveChannel(ch.id)}
                title={`Expand ${ch.name}`}
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
              >
                {/* Top Number */}
                <span className="channels-tab-strip__num">{ch.id}</span>

                {/* Vertical Name */}
                <span className="channels-tab-strip__title">
                  {ch.verticalName}
                </span>

                {/* Bottom Plus */}
                <span className="channels-tab-strip__plus">+</span>
              </motion.button>
            );
          })}
        </div>

        {/* ============================================================
            BOTTOM INDICATOR & CONTROLS
            ============================================================ */}
        <div className="channels-bottom-bar">
          <div className="channels-progress">
            <div className="channels-progress__bars">
              {channelsData.map((c) => (
                <span
                  key={c.id}
                  className={`channels-progress__segment ${
                    c.id === activeChannel ? "channels-progress__segment--active" : ""
                  }`}
                  onClick={() => setActiveChannel(c.id)}
                />
              ))}
            </div>

            <div className="channels-progress__tag">
              <span className="channels-progress__num">{activeChannel} / 06</span>
              <span className="channels-progress__name">{currentChannel.name.toUpperCase()}</span>
            </div>
          </div>

          <div className="channels-hint">
            <span className="channels-hint__icon">■</span>
            <span className="channels-hint__text">
              SCROLL TO SWITCH CHANNELS, OR PICK ONE
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
