import './App.css'
import Hero from './components/Hero/Hero'
import Categories from './components/Categories/Categories'
import Footer from './components/Footer/Footer'

function App() {
  return (
    <div className="app-wrapper">
      {/* Noise texture overlay */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* ==========================================
          SECTIONS
          ========================================== */}

      {/* ✅ Section 1: Hero */}
      <Hero />

      {/* ✅ Section 2: Categories Showcase */}
      <Categories />

      {/* ✅ Section 3: Liquid Glass Footer */}
      <Footer />
    </div>
  )
}

export default App