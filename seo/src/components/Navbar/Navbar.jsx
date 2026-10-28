import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [activeLink, setActiveLink] = useState("Services");

  const navLinks = ["Services", "Work", "Pricing", "About", "Blog"];

  return (
    <header className="rw-header">
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
            <span className="rw-btn-book__icon">
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
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
