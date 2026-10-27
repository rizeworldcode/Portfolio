import Hero from './components/Hero/Hero'
import CurvedShowcase from './components/CurvedCarousel/CurvedShowcase'
import SwellStreamSection from './components/SwellCast/SwellStreamSection'
import CategoryReels from './components/CategoryReels/CategoryReels'
import Footer from './components/Footer/Footer'
import './App.css'

function App() {
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
