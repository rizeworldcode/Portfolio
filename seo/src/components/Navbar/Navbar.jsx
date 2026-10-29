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

  const navLinks = [
    { label: "Overview", href: "#clients" },
    { label: "Local SEO", href: "#why-us" },
    { label: "Strategy", href: "#services" },
    { label: "Implementation", href: "#how-it-works" },
    { label: "Results", href: "#results" },
    { label: "Deep-Dive", href: "#blog" },
    { label: "Process", href: "#process" },
  ];

  return (
    <header className={`rw-header ${isScrolled ? "rw-header--scrolled" : ""}`}>
      <div className="rw-header__container">
        {/* Brand Logo */}
        <a href="#" className="rw-brand" aria-label="RizeWorld Home">
          <div className="rw-brand__logo-wrap">
            <img src="/RW.png" alt="RizeWorld" className="rw-brand__logo-img" />
          </div>
          <span className="rw-brand__name">RizeWorld</span>
        </a>

        {/* Center Pill Navigation */}
        <nav className="rw-nav" aria-label="Main Navigation">
          <ul className="rw-nav__list">
            {navLinks.map((item) => (
              <li key={item.label} className="rw-nav__item">
                <a
                  href={item.href}
                  className={`rw-nav__link ${activeLink === item.label ? "rw-nav__link--active" : ""}`}
                  onClick={() => setActiveLink(item.label)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right Actions Spacer (keeps center pill nav balanced) */}
        <div className="rw-header__actions" aria-hidden="true" />
      </div>
    </header>
  );
}
