import { motion } from "framer-motion";
import "./Footer.css";

export default function Footer() {
  const scrollToHero = () => {
    const heroElem = document.getElementById("hero");
    if (heroElem) {
      heroElem.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const scrollToCategories = () => {
    const catElem = document.getElementById("categories");
    if (catElem) {
      catElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="vitrio-footer-section" aria-label="Footer">
      {/* Floating Liquid Silver-Glass Card */}
      <motion.div
        className="vitrio-card"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ type: "spring", bounce: 0.1, duration: 0.9 }}
      >
        {/* Top Area: Left Brand & Form + Right 3 Link Columns */}
        <div className="vitrio-card__top">
          {/* Left Side */}
          <div className="vitrio-card__left">
            <div className="vitrio-card__brand">
              <div className="vitrio-card__logo-badge">
                <img src="/RW.png" alt="RW Logo" className="vitrio-card__logo-img" />
              </div>
              <span className="vitrio-card__brand-name">Rizeworld</span>
            </div>

            <p className="vitrio-card__tagline">
              Liquid glass interfaces, crafted with care for modern products and
              teams that love detail.
            </p>

            {/* Contact Card with Address and Phone */}
            <div className="vitrio-card__contact-card">
              <a
                href="https://maps.google.com/?q=Rizeworld+Digital+Marketing+Pvt+Ltd+Company+C198,+near+Telco+Circle,+UIT+colony,+Shalimar+Nagar,+Alwar,+Rajasthan+301001"
                target="_blank"
                rel="noopener noreferrer"
                className="vitrio-card__contact-item"
                aria-label="View office location on Google Maps"
              >
                <svg
                  className="vitrio-card__contact-icon vitrio-card__contact-icon--pin"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 21C16 16.5 19 13.5 19 9.5C19 5.5 16 2.5 12 2.5C8 2.5 5 5.5 5 9.5C5 13.5 8 16.5 12 21Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span>C-198, near Telco Circle, UIT colony, Shalimar Nagar, Alwar, Rajasthan 301001, India</span>
              </a>

              <div className="vitrio-card__contact-divider" />

              <a
                href="tel:+919024615510"
                className="vitrio-card__contact-item"
                aria-label="Call Rizeworld at +91 90246 15510"
              >
                <svg
                  className="vitrio-card__contact-icon vitrio-card__contact-icon--phone"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span><strong>Phone:</strong> +91 90246 15510</span>
              </a>
            </div>
          </div>

          {/* Middle Side: Centered Navigation */}
          <div className="vitrio-card__nav-col">
            <span className="vitrio-card__col-title">NAVIGATION</span>
            <ul className="vitrio-card__text-list">
              <li>
                <button
                  type="button"
                  onClick={scrollToHero}
                  className="vitrio-card__text-link"
                >
                  Hero
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={scrollToCategories}
                  className="vitrio-card__text-link"
                >
                  Categories
                </button>
              </li>
            </ul>
          </div>

          {/* Right Side: Google Map Box */}
          <div className="vitrio-card__map-box" title="Rizeworld Office Location Map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3535.6282173521754!2d76.6240945!3d27.6050538!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397299b899b566c7%3A0xe68fc99d665ba773!2sRizeworld%20Digital%20Marketing%20Pvt%20Ltd%20Company!5e0!3m2!1sen!2sin!4v1793009491981!5m2!1sen!2sin"
              className="vitrio-card__map-iframe"
              title="Rizeworld Digital Marketing Location"
              loading="lazy"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>

        {/* Bottom Area: Copyright on left, Social circular buttons on right */}
        <div className="vitrio-card__bottom">
          <p className="vitrio-card__copyright">
            © {new Date().getFullYear()} Rizeworld. <strong>Made by Rizeworld</strong>
          </p>

          <div className="vitrio-card__socials">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/rizeworld?stkn=MWYxOGs5NGhhdnNsNA=="
              target="_blank"
              rel="noopener noreferrer"
              className="vitrio-card__social-pill"
              aria-label="Instagram"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <rect
                  x="2"
                  y="2"
                  width="20"
                  height="20"
                  rx="5"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/share/1DSttbn2GU/"
              target="_blank"
              rel="noopener noreferrer"
              className="vitrio-card__social-pill"
              aria-label="Facebook"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}