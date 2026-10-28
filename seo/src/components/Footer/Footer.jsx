import { useState, useEffect } from "react";
import "./Footer.css";

export default function Footer() {
  const [nyTime, setNyTime] = useState("");

  // Live New York Time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone: "America/New_York",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      };
      setNyTime(now.toLocaleTimeString("en-US", options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="rw-footer" id="contact">
      <div className="rw-footer__container">
        {/* ============================================================
            TOP 5-COLUMN GRID
            ============================================================ */}
        <div className="rw-footer__top">
          {/* Column 1: Brand Info & CTA */}
          <div className="rw-footer__col rw-footer__col--brand">
            <a href="#" onClick={scrollToTop} className="rw-footer__brand">
              <div className="rw-footer__brand-icon">
                <span className="rw-footer__wave rw-footer__wave--left" />
                <span className="rw-footer__dot" />
                <span className="rw-footer__wave rw-footer__wave--right" />
              </div>
              <span className="rw-footer__brand-name">Reachwise</span>
            </a>

            <p className="rw-footer__tagline">
              SEO, social media and paid ads that bring the right people to your
              door.
            </p>

            {/* Availability Pill */}
            <div className="rw-footer__status-pill">
              <span className="rw-footer__status-dot" />
              <span className="rw-footer__status-text">
                Now booking Q4 · 3 spots left
              </span>
            </div>

            {/* CTA Button */}
            <a href="#audit" className="rw-footer__btn-cta">
              <span>Book a strategy call</span>
              <span className="rw-footer__btn-icon">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </span>
            </a>
          </div>

          {/* Column 2: SERVICES */}
          <div className="rw-footer__col">
            <div className="rw-footer__col-heading">SERVICES</div>
            <ul className="rw-footer__links">
              <li><a href="#services">SEO</a></li>
              <li><a href="#services">Social media</a></li>
              <li><a href="#services">Paid ads</a></li>
              <li><a href="#services">Content</a></li>
              <li><a href="#services">Web design</a></li>
              <li><a href="#services">Branding</a></li>
            </ul>
          </div>

          {/* Column 3: COMPANY */}
          <div className="rw-footer__col">
            <div className="rw-footer__col-heading">COMPANY</div>
            <ul className="rw-footer__links">
              <li><a href="#why-us">About</a></li>
              <li><a href="#clients">Work</a></li>
              <li><a href="#audit">Team</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#audit">Contact</a></li>
            </ul>
          </div>

          {/* Column 4: RESOURCES */}
          <div className="rw-footer__col">
            <div className="rw-footer__col-heading">RESOURCES</div>
            <ul className="rw-footer__links">
              <li><a href="#blog">Blog</a></li>
              <li><a href="#services">Pricing</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>

          {/* Column 5: CONTACT */}
          <div className="rw-footer__col rw-footer__col--contact">
            <div className="rw-footer__col-heading">CONTACT</div>
            <div className="rw-footer__contact-details">
              <a href="mailto:hello@reachwisestudio.com" className="rw-footer__contact-link">
                hello@reachwisestudio.com
              </a>
              <a href="tel:+12125550186" className="rw-footer__contact-link">
                +1 (212) 555-0186
              </a>
              <span className="rw-footer__contact-text">New York</span>
            </div>

            {/* Social Pills */}
            <div className="rw-footer__social-pills">
              <div className="rw-footer__social-row">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="rw-social-pill">
                  Instagram
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="rw-social-pill">
                  TikTok
                </a>
              </div>
              <div className="rw-footer__social-row">
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="rw-social-pill">
                  LinkedIn
                </a>
                <a href="https://x.com" target="_blank" rel="noreferrer" className="rw-social-pill">
                  X
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
            COLOSSAL GIANT WORDMARK
            ============================================================ */}
        <div className="rw-footer__giant-wordmark" onClick={scrollToTop}>
          <span className="rw-footer__wordmark-text">Reachwise</span>
        </div>

        {/* ============================================================
            BOTTOM SUB-FOOTER
            ============================================================ */}
        <div className="rw-footer__bottom">
          <div className="rw-footer__copyright">
            <span>© 2026 REACHWISE</span>
            <a href="#privacy">PRIVACY</a>
            <a href="#terms">TERMS</a>
            <a href="#cookies">COOKIES</a>
          </div>

          <div className="rw-footer__clock">
            <span className="rw-footer__clock-dot" />
            <span>LOCAL TIME {nyTime || "12:00"} · NEW YORK</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
