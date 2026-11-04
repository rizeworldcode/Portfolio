import './App.css'
import Hero from './components/Hero/Hero'
import PinterestGallery from './components/PinterestGallery/PinterestGallery'
import Footer from './components/Footer/Footer'

function App() {
  return (
    <div className="app-wrapper">
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