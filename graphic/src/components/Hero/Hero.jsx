import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Hero.css'

// ============================================================
// Background images — Framer uses these 3 rotating images.
// Replace src with your own graphic design work images later.
// ============================================================
const BG_IMAGES = [
  {
    id: 0,
    src: 'https://framerusercontent.com/images/aNw3R9XeyYODanAlOKvak2sMx4.jpg?scale-down-to=2048',
    alt: 'Graphic Design Work — Branding',
  },
  {
    id: 1,
    src: 'https://framerusercontent.com/images/sJACy2r9cxC1q6TuXddQMROLc.jpg?scale-down-to=2048',
    alt: 'Graphic Design Work — Interior',
  },
  {
    id: 2,
    src: 'https://framerusercontent.com/images/o1BxKXEmW8ktDD4Io0d4pvwoM.jpg?scale-down-to=2048',
    alt: 'Graphic Design Work — Editorial',
  },
]

// ============================================================
// Animation Variants (matching Framer spring transitions)
// ============================================================

// Background: starts scaled-down (0.05) then grows to full (1)
const bgVariants = {
  initial: { scale: 0.05, opacity: 1 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', bounce: 0, duration: 1.8 },
  },
  exit: {
    opacity: 0,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
}

// Text: fades + slides up with stagger
const textContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2, delayChildren: 0.4 },
  },
}

const textItemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', bounce: 0, duration: 1.2 },
  },
}

// Thumbnails: stagger in from below
const thumbContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 1.1 },
  },
}

const thumbItemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', bounce: 0, duration: 1.0 },
  },
}

// ============================================================
// Hero Component
// ============================================================
export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)

  // Auto-cycle images every 5 seconds (optional, can remove)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % BG_IMAGES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  // Trigger entrance animation once
  useEffect(() => {
    const t = setTimeout(() => setHasAnimated(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className="hero" id="hero" aria-label="Hero Section">

      {/* ---- Background Image Layer ---- */}
      <div className="hero__bg-layer" aria-hidden="true">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIndex}
            src={BG_IMAGES[activeIndex].src}
            alt={BG_IMAGES[activeIndex].alt}
            className="hero__bg-image"
            variants={bgVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          />
        </AnimatePresence>
      </div>

      {/* ---- Top gradient darkening ---- */}
      <div className="hero__top-overlay" aria-hidden="true" />

      {/* ---- Center Text Content ---- */}
      <motion.div
        className="hero__content"
        variants={textContainerVariants}
        initial="hidden"
        animate={hasAnimated ? 'visible' : 'hidden'}
      >
        <motion.div
          className="hero__logo-badge"
          variants={textItemVariants}
          whileHover={{ scale: 1.08, rotate: [0, -3, 3, 0] }}
          transition={{ duration: 0.3 }}
        >
          <img src="/RW.png" alt="RW Rizeworld Logo" className="hero__logo-img" />
        </motion.div>

        <motion.h1
          className="hero__main-title"
          variants={textItemVariants}
        >
          Rizeworld
        </motion.h1>

        <motion.p
          className="hero__sub-title"
          variants={textItemVariants}
        >
          Graphic Design Portfolio
        </motion.p>
      </motion.div>

      {/* ---- Bottom Blur Gradient ---- */}
      <div className="hero__blur-overlay" aria-hidden="true" />

      {/* ---- Scroll Indicator ---- */}
      <motion.div
        className="hero__scroll-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        aria-hidden="true"
      >
        <span>Scroll</span>
        <div className="hero__scroll-line" />
      </motion.div>

      {/* ---- Bottom Thumbnail Switcher ---- */}
      <motion.div
        className="hero__thumbnails"
        variants={thumbContainerVariants}
        initial="hidden"
        animate={hasAnimated ? 'visible' : 'hidden'}
        role="group"
        aria-label="Select background image"
      >
        {BG_IMAGES.map((img, index) => (
          <motion.button
            key={img.id}
            className={`hero__thumb ${index === 1 ? 'hero__thumb--md' : 'hero__thumb--sm'
              } ${index === activeIndex ? 'hero__thumb--active' : ''}`}
            variants={thumbItemVariants}
            whileHover={{ scale: 1.06, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveIndex(index)}
            aria-label={`View background ${index + 1}: ${img.alt}`}
            aria-pressed={index === activeIndex}
          >
            <img src={img.src} alt={img.alt} loading="lazy" />
          </motion.button>
        ))}
      </motion.div>
    </section>
  )
}
