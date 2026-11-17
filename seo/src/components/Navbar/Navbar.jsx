import { useState, useEffect } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`rw-header ${isScrolled ? "rw-header--scrolled" : ""}`}>
      <div className="rw-header__container">
        {/* Brand Logo */}
        <a 
          href="/" 
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (window.history.replaceState) {
              window.history.replaceState(null, '', window.location.pathname);
            }
          }}
          className="rw-brand" 
          aria-label="RizeWorld Home"
        >
          <div className="rw-brand__logo-wrap">
            <img src="/RW.png" alt="RizeWorld" className="rw-brand__logo-img" />
          </div>
        </a>

        {/* Right Actions Spacer (keeps center clear for top floating hub nav) */}
        <div className="rw-header__actions" aria-hidden="true" />
      </div>
    </header>
  );
}
