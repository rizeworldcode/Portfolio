import { useEffect } from 'react'
import './App.css'
import Hero from './components/Hero/Hero'
import PinterestGallery from './components/PinterestGallery/PinterestGallery'
import Footer from './components/Footer/Footer'
import PortfolioHubNav from './components/PortfolioHub/PortfolioHubNav'

function App() {
  // Automatically strip '#hero' or any hash from address bar on load
  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  return (
    <div className="app-wrapper">
      {/* Floating Portfolio Switcher & Main Website Return Dock (Top Center) */}
      <PortfolioHubNav current="graphic" />

      {/* Noise texture overlay */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* ==========================================
          SECTIONS
          ========================================== */}

      {/* ✅ Section 1: Monumental Hero */}
      <Hero />

      {/* ✅ Section 2: Pinterest Visual Showcase & Sticky Filter */}
      <PinterestGallery />

      {/* ✅ Section 3: Liquid Glass Footer */}
      <Footer />
    </div>
  )
}

export default App