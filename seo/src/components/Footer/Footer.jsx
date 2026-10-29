import { useState, useEffect } from "react";
import "./Footer.css";

export default function Footer() {
  const [alwarTime, setAlwarTime] = useState("");

  // Live Alwar, India Time (Asia/Kolkata)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone: "Asia/Kolkata",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      };
      setAlwarTime(now.toLocaleTimeString("en-US", options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [wordmarkPos, setWordmarkPos] = useState({ x: 50, y: 50 });
  const [isOverWordmark, setIsOverWordmark] = useState(false);

  const handleWordmarkMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setWordmarkPos({ x, y });
  };

  return (
    <footer className="rw-footer" id="contact">
      <div className="rw-footer__container">
        {/* ============================================================
            TOP 4-COLUMN GRID
            ============================================================ */}
        <div className="rw-footer__top">
          {/* Column 1: Brand Info & CTA */}
          <div className="rw-footer__col rw-footer__col--brand">
            <a href="#" onClick={scrollToTop} className="rw-footer__brand">
              <div className="rw-footer__brand-logo-wrap">
                <img src="/RW.png" alt="RizeWorld" className="rw-footer__brand-logo-img" />
              </div>
              <span className="rw-footer__brand-name">RizeWorld</span>
            </a>

            <p className="rw-footer__tagline">
              RizeWorld’s SEO strategy combines on-page SEO, technical optimization, content strategy, and local SEO to create a stronger digital presence and reach potential customers through organic search.
            </p>

            {/* Availability Pill */}
            <div className="rw-footer__status-pill">
              <span className="rw-footer__status-dot" />
              <span className="rw-footer__status-text">
                Ranked #1 in Alwar & Local Pack
              </span>
            </div>

          </div>

          {/* Column 2: PORTFOLIO */}
          <div className="rw-footer__col">
            <div className="rw-footer__col-heading">PORTFOLIO</div>
            <ul className="rw-footer__links">
              <li><a href="#clients">(01) Project Overview</a></li>
              <li><a href="#why-us">(02) Local SEO Strategy</a></li>
              <li><a href="#services">(03) SEO Strategy Pillars</a></li>
              <li><a href="#how-it-works">(04) Search Intent Funnel</a></li>
              <li><a href="#results">(05) SEO Results</a></li>
              <li><a href="#blog">(06) Deep-Dive Analysis</a></li>
              <li><a href="#process">(07) Step-by-Step Process</a></li>
            </ul>
          </div>

          {/* Column 4: CONTACT & LOCATION */}
          <div className="rw-footer__col rw-footer__col--contact">
            <div className="rw-footer__col-heading">CONTACT</div>
            <div className="rw-footer__contact-details">
              <div className="rw-footer__contact-item">
                <span className="rw-footer__contact-label">Email</span>
                <a href="mailto:hr.rizeworld@gmail.com" className="rw-footer__contact-link">
                  hr.rizeworld@gmail.com
                </a>
              </div>

              <div className="rw-footer__contact-item">
                <span className="rw-footer__contact-label">Phone Number</span>
                <a href="tel:+919024615510" className="rw-footer__contact-link">
                  +91 90246 15510
                </a>
              </div>

              <div className="rw-footer__contact-item">
                <span className="rw-footer__contact-label">Address</span>
                <span className="rw-footer__contact-text" style={{ lineHeight: "1.5", fontSize: "12px", color: "#94a3b8" }}>
                  C-198, near Telco Circle, UIT Colony, Shalimar Nagar, Alwar, Rajasthan 301001, India
                </span>
              </div>
            </div>

            {/* Social Pills */}
            <div className="rw-footer__social-pills">
              <div className="rw-footer__social-row">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="rw-social-pill">
                  Instagram
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="rw-social-pill">
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            DIVIDER & "MOVE OVER THE NAME" HINT
            ============================================================ */}
        <div className="rw-footer__mid-bar">
          <div className="rw-footer__divider" />
          <div className="rw-footer__hint">MOVE OVER THE NAME</div>
        </div>

        {/* ============================================================
            COLOSSAL GIANT WORDMARK WITH SPOTLIGHT
            ============================================================ */}
        <div
          className="rw-footer__giant-wordmark"
          onClick={scrollToTop}
          onMouseMove={handleWordmarkMouseMove}
          onMouseEnter={() => setIsOverWordmark(true)}
          onMouseLeave={() => setIsOverWordmark(false)}
          style={{
            "--mouse-x": `${wordmarkPos.x}%`,
            "--mouse-y": `${wordmarkPos.y}%`,
          }}
        >
          {/* Base Light-Gray Text Layer */}
          <span className="rw-footer__wordmark-text rw-footer__wordmark-text--base">
            RizeWorld
          </span>

          {/* Glowing Brand Orange Text Layer (Clipped to circular torch around mouse) */}
          <span
            className={`rw-footer__wordmark-text rw-footer__wordmark-text--orange ${
              isOverWordmark ? "rw-footer__wordmark-text--visible" : ""
            }`}
            aria-hidden="true"
          >
            RizeWorld
          </span>

          {/* Lime Spotlight Halo Ring */}
          {isOverWordmark && (
            <div
              className="rw-footer__wordmark-spotlight"
              style={{
                left: `${wordmarkPos.x}%`,
                top: `${wordmarkPos.y}%`,
              }}
              aria-hidden="true"
            />
          )}
        </div>

        {/* ============================================================
            BOTTOM SUB-FOOTER
            ============================================================ */}
        <div className="rw-footer__bottom">
          <div className="rw-footer__copyright">
            <span>© 2026 RIZEWORLD — SEO PORTFOLIO</span>
          </div>

          <div className="rw-footer__clock">
            <span className="rw-footer__clock-dot" />
            <span>LOCAL TIME {alwarTime || "12:21"} — ALWAR, INDIA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
