import "./Footer.css";

export default function Footer() {
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="minimal-footer" id="contact">
      <div className="minimal-footer__container">
        {/* ========================================================
            1. TOP INFO COLUMNS (SOCIALS, MENU, CONTACT)
            ======================================================== */}
        <div className="minimal-footer__top">
          {/* Column 1: Socials */}
          <div className="minimal-footer__col">
            <span className="minimal-footer__label">SOCIALS</span>
            <ul className="minimal-footer__list">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="minimal-footer__link"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://threads.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="minimal-footer__link"
                >
                  Threads
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="minimal-footer__link"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="minimal-footer__link"
                >
                  YouTube
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Menu */}
          <div className="minimal-footer__col">
            <span className="minimal-footer__label">MENU</span>
            <ul className="minimal-footer__list">
              <li>
                <a href="#home" className="minimal-footer__link">
                  Home
                </a>
              </li>
              <li>
                <a href="#projects" className="minimal-footer__link">
                  Work
                </a>
              </li>
              <li>
                <a href="#about" className="minimal-footer__link">
                  About
                </a>
              </li>
              <li>
                <a href="#contact" className="minimal-footer__link">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="minimal-footer__col minimal-footer__col--contact">
            <span className="minimal-footer__label">CONTACT</span>
            <div className="minimal-footer__contact-details">
              <a
                href="mailto:rizeworld@gmail.com"
                className="minimal-footer__contact-item"
              >
                rizeworld@gmail.com
              </a>
              <a
                href="tel:+919876543210"
                className="minimal-footer__contact-item"
              >
                +91 98765 43210
              </a>
              <span className="minimal-footer__location">
                Alwar, Rajasthan, IN
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================
            2. GIANT HERO BRAND TITLE (MAMMOTH TEXT ACROSS VIEWPORT)
            ======================================================== */}
        <div className="minimal-footer__giant-wrap">
          <h1 className="minimal-footer__giant-title">Rizeworld</h1>
        </div>

        {/* ========================================================
            3. BOTTOM SUB-BAR (GET IN TOUCH, BACK TO TOP, YEAR)
            ======================================================== */}
        <div className="minimal-footer__bottom">
          <div className="minimal-footer__bottom-left">
            <a href="mailto:rizeworld@gmail.com" className="minimal-footer__bottom-link">
              GET IN TOUCH ↗
            </a>
          </div>

          <div className="minimal-footer__bottom-center">
            <button
              type="button"
              onClick={scrollToTop}
              className="minimal-footer__top-btn"
            >
              BACK TO TOP ↑
            </button>
          </div>

          <div className="minimal-footer__bottom-right">
            <span className="minimal-footer__year">©2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
