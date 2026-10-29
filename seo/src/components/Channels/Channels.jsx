import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Channels.css";

export default function Channels() {
  const [activeChannel, setActiveChannel] = useState("01");

  const channelsData = [
    {
      id: "01",
      name: "SEO",
      verticalName: "SEO",
      bgColor: "#e0e3de",
      pillBg: "#11141a",
      textColor: "#ffffff",
      desc: "Technical fixes, content and links that move you up the page for the words your customers type.",
      badge: "#1 for 212 keywords",
      price: "$1,500/mo",
      features: [
        "Technical audit",
        "Keyword map",
        "4 articles a month",
        "Link building",
        "Monthly ranking report",
      ],
      type: "search",
    },
    {
      id: "02",
      name: "Social media",
      verticalName: "Social media",
      bgColor: "#11141a",
      pillBg: "#11141a",
      textColor: "#ffffff",
      desc: "High-retention shortform video, daily community hooks, and viral reels that build an engaged following.",
      badge: "4.8M monthly views",
      price: "$2,200/mo",
      features: [
        "Content calendar & scripts",
        "Short-form video editing",
        "Creator outreach & collabs",
        "Community management",
        "Viral hook optimization",
      ],
      type: "social",
    },
    {
      id: "03",
      name: "Paid ads",
      verticalName: "Paid ads",
      bgColor: "#ffffff",
      pillBg: "#ffffff",
      textColor: "#11141a",
      desc: "High-converting Google Search & Meta ad funnels engineered for profitable ROAS and lowest CPA.",
      badge: "5.4x average ROAS",
      price: "$2,500/mo",
      features: [
        "Campaign architecture",
        "Creative testing sprint",
        "Retargeting funnels",
        "Server-side tracking (CAPI)",
        "Bi-weekly live optimizations",
      ],
      type: "ads",
    },
    {
      id: "04",
      name: "Content",
      verticalName: "Content",
      bgColor: "#d4ff00",
      pillBg: "#d4ff00",
      textColor: "#11141a",
      desc: "Thought leadership articles, case studies, and lead magnets that position your brand as industry authority.",
      badge: "92% organic lift",
      price: "$1,800/mo",
      features: [
        "In-depth research briefs",
        "Ghostwritten articles",
        "Interactive downloadable guides",
        "Email newsletter issues",
        "Distribution & repurposing",
      ],
      type: "content",
    },
    {
      id: "05",
      name: "Web design",
      verticalName: "Web design",
      bgColor: "#11141a",
      pillBg: "#11141a",
      textColor: "#ffffff",
      desc: "Lightning-fast, conversion-optimized landing pages and websites crafted to turn traffic into paying clients.",
      badge: "99/100 Lighthouse score",
      price: "$3,400/mo",
      features: [
        "Modern UX/UI wireframing",
        "React & modern tech stack",
        "Micro-animations & interactions",
        "Mobile-first responsive",
        "Conversion rate optimization",
      ],
      type: "web",
    },
    {
      id: "06",
      name: "Branding",
      verticalName: "Branding",
      bgColor: "#e7eae5",
      pillBg: "#e7eae5",
      textColor: "#11141a",
      desc: "Distinct visual identity, custom typography, color systems, and guidelines that make your brand unforgettable.",
      badge: "Complete Brand Kit",
      price: "$2,800/mo",
      features: [
        "Brand strategy & positioning",
        "Logo suite & icon system",
        "Design tokens & color guide",
        "Typography hierarchy",
        "Marketing collateral templates",
      ],
      type: "branding",
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
              <span className="channels-pill__text">(02) Services</span>
            </div>

            <h2 className="channels-title">
              <span className="channels-title__row">Six channels.</span>
              <span className="channels-title__row">
                <span className="channels-badge">One</span> growth plan.
              </span>
            </h2>
          </div>

          <div className="channels-header__right">
            <p className="channels-desc">
              SEO, social, ads, content, web and brand under one retainer, one
              team and one monthly report.
            </p>
            <a href="#all-services" className="channels-btn-all">
              <span>All services</span>
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
                    {/* Left Side: Mockup Window depending on channel */}
                    {ch.id === "02" ? (
                      /* Social Media Reel Mockup */
                      <div className="channels-mockup channels-mockup--social">
                        <div className="channels-social-reel-box">
                          <div className="channels-social-reel-header">
                            <span className="channels-social-reel-tag">VIRAL REEL</span>
                            <span className="channels-social-reel-views">4.8M views</span>
                          </div>
                          <div className="channels-social-reel-body">
                            <div className="channels-social-play-btn">▶</div>
                            <div className="channels-social-audio-wave">
                              <span /><span /><span /><span /><span />
                            </div>
                          </div>
                          <div className="channels-social-reel-footer">
                            <div className="channels-social-handle">@reachwise.growth</div>
                            <div className="channels-social-caption">Hook them in the first 2 seconds 🚀</div>
                            <div className="channels-social-stats">❤️ 142k · 💬 3.4k · ↗ 82k shares</div>
                          </div>
                        </div>
                      </div>
                    ) : ch.id === "03" ? (
                      /* Paid Ads Mockup (matching video 00:07) */
                      <div className="channels-mockup channels-mockup--ads">
                        <div className="channels-ads-box">
                          <span className="channels-ads-pill">SPONSORED</span>
                          <h5 className="channels-ads-headline">
                            Free whitening with every new-patient visit
                          </h5>
                          <div className="channels-ads-metrics">
                            <div className="channels-ads-metric">
                              <span className="channels-ads-val">4.2%</span>
                              <span className="channels-ads-sub">CTR</span>
                            </div>
                            <div className="channels-ads-metric">
                              <span className="channels-ads-val">4.8x</span>
                              <span className="channels-ads-sub">ROAS</span>
                            </div>
                          </div>
                          {/* Bar Chart */}
                          <div className="channels-ads-chart">
                            <span style={{ height: "30%" }} />
                            <span style={{ height: "45%" }} />
                            <span style={{ height: "60%" }} />
                            <span style={{ height: "80%" }} />
                            <span style={{ height: "100%" }} className="active-bar" />
                          </div>
                        </div>
                      </div>
                    ) : ch.id === "04" ? (
                      /* Content Mockup (matching video 00:08) */
                      <div className="channels-mockup channels-mockup--content">
                        <div className="channels-content-card">
                          <div className="channels-content-header">
                            <span className="channels-content-tag">4 MIN READ</span>
                          </div>
                          <h4 className="channels-content-title">How to |</h4>
                          <p className="channels-content-sub">Premise editorial</p>
                          <div className="channels-content-reads">
                            <span>▲ 41 reads this week</span>
                          </div>
                        </div>
                      </div>
                    ) : ch.id === "05" ? (
                      /* Web Design Mockup */
                      <div className="channels-mockup channels-mockup--web">
                        <div className="channels-web-wireframe">
                          <div className="channels-web-browser-bar">
                            <div className="channels-web-nav-dots">
                              <span className="dot--red" />
                              <span className="dot--yellow" />
                              <span className="dot--green" />
                            </div>
                            <div className="channels-web-url-bar">yoursite.com/offer</div>
                          </div>
                          <div className="channels-web-hero-block">
                            <div className="channels-web-block-header">
                              <span className="channels-web-badge-mini">NEW LAUNCH</span>
                              <span className="channels-web-speed-badge">⚡ 99/100</span>
                            </div>
                            <div className="channels-web-headline-bar" />
                            <div className="channels-web-sub-bar" />
                            <div className="channels-web-btn-mock">Book Demo →</div>
                          </div>
                          <div className="channels-web-code-row">
                            <span className="channels-web-code-pill">Conversion · 8.2%</span>
                            <span className="channels-web-meta-pill">+214% ROI</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Default SEO / Search SERP Mockup */
                      <div className="channels-mockup">
                        {/* Search Header */}
                        <div className="channels-mockup__search-bar">
                          <span className="channels-mockup__search-icon">🔍</span>
                          <span className="channels-mockup__search-text">dentist near me</span>
                          <span className="channels-mockup__cursor">|</span>
                        </div>

                        <div className="channels-mockup__meta">
                          About 2,140,000 results · 0.42 s
                        </div>

                        {/* Search Result 1 */}
                        <div className="channels-mockup__item channels-mockup__item--dim">
                          <div className="channels-mockup__url">citydentalcare.com</div>
                          <div className="channels-mockup__line channels-mockup__line--short" />
                        </div>

                        {/* Search Result 2 */}
                        <div className="channels-mockup__item channels-mockup__item--dim">
                          <div className="channels-mockup__url">yelp.com · dentists</div>
                          <div className="channels-mockup__line" />
                        </div>

                        {/* Search Result 3 (Highlighted Client Result) */}
                        <div className="channels-mockup__item channels-mockup__item--highlight">
                          <div className="channels-mockup__item-header">
                            <span className="channels-mockup__live-dot" />
                            <span className="channels-mockup__brand-url">yoursite.com</span>
                          </div>
                          <div className="channels-mockup__brand-title">
                            Your brand · dentist near me
                          </div>
                          <span className="channels-mockup__rank-pill">#3</span>
                        </div>

                        {/* Search Result 4 */}
                        <div className="channels-mockup__item channels-mockup__item--dim">
                          <div className="channels-mockup__url">smilecentre.co</div>
                          <div className="channels-mockup__line" />
                        </div>

                        {/* Search Result 5 */}
                        <div className="channels-mockup__item channels-mockup__item--dim">
                          <div className="channels-mockup__url">healthgrades.com</div>
                          <div className="channels-mockup__line channels-mockup__line--short" />
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
