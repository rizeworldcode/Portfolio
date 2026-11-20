import { useState, useEffect } from 'react';
import './PortfolioHubNav.css';

const LINKS = {
  main: 'https://rizeworld.in/',
  video: 'https://videoportfolio.rizeworld.in/',
  graphic: 'https://graphicportfolio.rizeworld.in/',
  seo: 'https://seoportfolio.rizeworld.in/',
};

export default function PortfolioHubNav({ current = 'graphic' }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e, key) => {
    if (current === key) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`portfolio-hub-dock ${isScrolled ? 'portfolio-hub-dock--scrolled' : ''}`}
      aria-label="Portfolio Switcher and Main Site Navigation"
    >
      {/* ⬅ Back to Main Website */}
      <a
        href={LINKS.main}
        className="portfolio-hub-link portfolio-hub-link--back"
        title="Return to Main Rizeworld Website"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span className="portfolio-hub-text-full">Main Website</span>
        <span className="portfolio-hub-text-short">Main</span>
      </a>

      {/* Vertical Glass Divider */}
      <span className="portfolio-hub-divider" aria-hidden="true" />

      {/* 🎬 Video Portfolio Tab */}
      <a
        href={LINKS.video}
        onClick={(e) => handleClick(e, 'video')}
        className={`portfolio-hub-link ${current === 'video' ? 'portfolio-hub-link--active' : ''}`}
        title="Switch to Video Production Portfolio"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="23 7 16 12 23 17 23 7" fill="currentColor" fillOpacity="0.25"></polygon>
          <rect x="1" y="5" width="15" height="14" rx="2.5" ry="2.5"></rect>
        </svg>
        <span>Video</span>
        {current === 'video' && <span className="portfolio-hub-dot" />}
      </a>

      {/* 🎨 Graphic Portfolio Tab */}
      <a
        href={LINKS.graphic}
        onClick={(e) => handleClick(e, 'graphic')}
        className={`portfolio-hub-link ${current === 'graphic' ? 'portfolio-hub-link--active' : ''}`}
        title="Switch to Graphic Design Portfolio"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2a10 10 0 1 0 10 10c0-1.8-1.4-3-3-3h-1.5a1.5 1.5 0 0 1-1.5-1.5V6a4 4 0 0 0-4-4z"></path>
          <circle cx="8" cy="9" r="1.3" fill="currentColor"></circle>
          <circle cx="12" cy="7" r="1.3" fill="currentColor"></circle>
          <circle cx="16" cy="9" r="1.3" fill="currentColor"></circle>
          <circle cx="9" cy="14" r="1.3" fill="currentColor"></circle>
        </svg>
        <span>Graphic</span>
        {current === 'graphic' && <span className="portfolio-hub-dot" />}
      </a>

      {/* 🚀 SEO Portfolio Tab */}
      <a
        href={LINKS.seo}
        onClick={(e) => handleClick(e, 'seo')}
        className={`portfolio-hub-link ${current === 'seo' ? 'portfolio-hub-link--active' : ''}`}
        title="Switch to SEO & Ranking Portfolio"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
          <polyline points="16 7 22 7 22 13"></polyline>
        </svg>
        <span>SEO</span>
        {current === 'seo' && <span className="portfolio-hub-dot" />}
      </a>
    </nav>
  );
}
