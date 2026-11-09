import { useEffect } from 'react'
import Hero from './components/Hero/Hero'
import CurvedShowcase from './components/CurvedCarousel/CurvedShowcase'
import SwellStreamSection from './components/SwellCast/SwellStreamSection'
import CategoryReels from './components/CategoryReels/CategoryReels'
import Footer from './components/Footer/Footer'
import './App.css'

function App() {
  useEffect(() => {
    // If browser arrives with #home or any hash in URL, cleanly remove it without page reload
    if (window.location.hash) {
      const hash = window.location.hash;
      if (hash === '#home' || hash === '#') {
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else {
        const el = document.querySelector(hash);
        if (el) {
          setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
        }
      }
      // Remove '#' and hash from browser address bar
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    if (window.location.pathname === '/home' || window.location.pathname === '/home/') {
      window.history.replaceState(null, '', '/' + window.location.search);
    }
  }, []);

  return (
    <div className="app-container">
      <Hero />
      <CurvedShowcase />
      <SwellStreamSection />
      <CategoryReels />
      <Footer />
    </div>
  )
}

export default App
