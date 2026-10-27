import {
  FaInstagram,
  FaFacebook,
} from "react-icons/fa6";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiArrowUp,
  FiArrowUpRight,
} from "react-icons/fi";
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
                  href="https://www.instagram.com/rizeworld?stkn=MWYxOGs5NGhhdnNsNA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="minimal-footer__link"
                >
                  <FaInstagram style={{ marginRight: "8px", verticalAlign: "middle" }} />
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/share/1DSttbn2GU/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="minimal-footer__link"
                >
                  <FaFacebook style={{ marginRight: "8px", verticalAlign: "middle" }} />
                  Facebook
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
                  Projects
                </a>
              </li>
              <li>
                <a href="#reels" className="minimal-footer__link">
                  Reels
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Location Map */}
          <div className="minimal-footer__col minimal-footer__col--map">
            <span className="minimal-footer__label">LOCATION</span>
            <div className="minimal-footer__map-frame">
              <iframe
                title="Rizeworld Digital Marketing Location"
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14142.512843594879!2d76.624095!3d27.605054!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397299b899b566c7%3A0xe68fc99d665ba773!2sRizeworld%20Digital%20Marketing%20Pvt%20Ltd%20Company!5e0!3m2!1sen!2sin!4v1793098561885!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>

          {/* Column 4: Contact */}
          <div className="minimal-footer__col minimal-footer__col--contact">
            <span className="minimal-footer__label">CONTACT</span>
            <div className="minimal-footer__contact-details">
              <a
                href="https://maps.google.com/?q=Rizeworld+Digital+Marketing+Pvt+Ltd+Company+C198,+near+Telco+Circle,+UIT+colony,+Shalimar+Nagar,+Alwar,+Rajasthan+301001"
                target="_blank"
                rel="noopener noreferrer"
                className="minimal-footer__contact-item minimal-footer__address"
              >
                <FiMapPin style={{ marginRight: "6px", verticalAlign: "top", marginTop: "3px", flexShrink: 0 }} />
                <span>C-198, near Telco Circle, UIT colony, Shalimar Nagar, Alwar, Rajasthan 301001, India</span>
              </a>
              <a
                href="tel:+919024615510"
                className="minimal-footer__contact-item"
              >
                <FiPhone style={{ marginRight: "6px", verticalAlign: "middle" }} />
                Phone: +91 90246 15510
              </a>
            </div>
          </div>
        </div>

        {/* ========================================================
            2. GIANT HERO BRAND TITLE (MAMMOTH TEXT ACROSS VIEWPORT)
            ======================================================== */}
        <div className="minimal-footer__giant-wrap">
          <div className="minimal-footer__logo-badge">
            <img src="/RW.png" alt="Rizeworld Logo" className="minimal-footer__logo-img" />
          </div>
          <h1 className="minimal-footer__giant-title">Rizeworld</h1>
        </div>

        {/* ========================================================
            3. BOTTOM SUB-BAR (GET IN TOUCH, BACK TO TOP, YEAR)
            ======================================================== */}
        <div className="minimal-footer__bottom">
          <div className="minimal-footer__bottom-left">
            <a href="mailto:rizeworld@gmail.com" className="minimal-footer__bottom-link">
              <span>GET IN TOUCH</span>
              <FiArrowUpRight size={14} style={{ marginLeft: "4px", verticalAlign: "middle" }} />
            </a>
          </div>

          <div className="minimal-footer__bottom-center">
            <button
              type="button"
              onClick={scrollToTop}
              className="minimal-footer__top-btn"
            >
              <span>BACK TO TOP</span>
              <FiArrowUp size={14} style={{ marginLeft: "4px", verticalAlign: "middle" }} />
            </button>
          </div>

          <div className="minimal-footer__bottom-right">
            <span className="minimal-footer__year">©2026 Rizeworld</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
