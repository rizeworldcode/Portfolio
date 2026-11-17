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
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="2.5" ry="2.5"></rect>
          <line x1="7" y1="2" x2="7" y2="22"></line>
          <line x1="17" y1="2" x2="17" y2="22"></line>
          <line x1="2" y1="12" x2="22" y2="12"></line>
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
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
          <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
          <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
          <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2z"></path>
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
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
          <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
        </svg>
        <span>SEO</span>
        {current === 'seo' && <span className="portfolio-hub-dot" />}
      </a>
    </nav>
  );
}
