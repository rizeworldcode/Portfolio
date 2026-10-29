import { useState, useEffect } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [activeLink, setActiveLink] = useState("Services");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = ["Services", "Work", "Pricing", "About", "Blog"];

  return (
    <header className={`rw-header ${isScrolled ? "rw-header--scrolled" : ""}`}>
      <div className="rw-header__container">
        {/* Brand Logo */}
        <a href="#" className="rw-brand" aria-label="Reachwise Home">
          <div className="rw-brand__icon" aria-hidden="true">
            {/* Concentric radar / signal logo */}
            <span className="rw-brand__wave rw-brand__wave--left" />
            <span className="rw-brand__dot" />
            <span className="rw-brand__wave rw-brand__wave--right" />
          </div>
          <span className="rw-brand__name">Reachwise</span>
        </a>

        {/* Center Pill Navigation */}
        <nav className="rw-nav" aria-label="Main Navigation">
          <ul className="rw-nav__list">
            {navLinks.map((link) => (
              <li key={link} className="rw-nav__item">
                <a
                  href={`#${link.toLowerCase()}`}
                  className={`rw-nav__link ${activeLink === link ? "rw-nav__link--active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveLink(link);
                  }}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right CTA Button */}
        <div className="rw-header__actions">
          <a href="#book-call" className="rw-btn-book">
            <span>Book a call</span>
            <span className="rw-btn-book__icon" aria-hidden="true">
              {/* Calendar icon matching screenshot */}
              <svg
                width="12"
                height="12"
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
      </div>
    </header>
  );
}
