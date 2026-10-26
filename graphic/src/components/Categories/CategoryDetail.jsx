import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./CategoryDetail.css";

export default function CategoryDetail({ category, onClose }) {
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [columnCount, setColumnCount] = useState(3);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Responsive column count based on viewport
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w >= 1480) setColumnCount(4);
      else if (w >= 940) setColumnCount(3);
      else if (w >= 600) setColumnCount(2);
      else setColumnCount(1);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock body scroll when view is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const images = category.images;

  // Balanced column count: adapts so pages with fewer images never look empty or left-heavy
  const effectiveCols = Math.min(columnCount, Math.max(1, images.length));
  const columns = Array.from({ length: effectiveCols }, () => []);
  images.forEach((img, idx) => {
    columns[idx % effectiveCols].push({ img, idx });
  });

  // Keyboard navigation for lightbox & close
  const handleKeyDown = useCallback(
    (e) => {
      if (activeImageIndex === null) {
        if (e.key === "Escape") onClose();
        return;
      }
      if (e.key === "Escape") {
        setActiveImageIndex(null);
      } else if (e.key === "ArrowRight") {
        setActiveImageIndex((prev) => (prev + 1) % images.length);
      } else if (e.key === "ArrowLeft") {
        setActiveImageIndex((prev) =>
          prev === 0 ? images.length - 1 : prev - 1
        );
      }
    },
    [activeImageIndex, images.length, onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const activeImage =
    activeImageIndex !== null ? images[activeImageIndex] : null;

  return (
    <motion.div
      className="category-detail-view"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="category-detail__ambient" />

      {/* ---- Top Navigation Bar ---- */}
      <nav className="category-detail__nav">
        <button
          className="category-detail__back-btn"
          onClick={onClose}
          aria-label="Back to all categories"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M19 12H5M5 12L12 19M5 12L12 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="category-detail__back-text-full">Back to Categories</span>
          <span className="category-detail__back-text-short">Back</span>
        </button>

        <div className="category-detail__nav-meta">
          <span className="category-detail__badge">{category.tag}</span>
          <button
            className="category-detail__close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* ---- Header Section ---- */}
      <header className="category-detail__header">
        <span className="category-detail__tag-line">{category.category}</span>
        <h1 className="category-detail__title">{category.title}</h1>
        <p className="category-detail__desc">{category.description}</p>

        <div className="category-detail__stats">
          <div className="category-detail__count-pill">
            {images.length} {images.length === 1 ? "Design" : "Designs"} Showcase
          </div>
        </div>
      </header>

      {/* ---- Balanced Gallery (Clean: No File Names on Cards!) ---- */}
      <div className="category-detail__gallery-wrapper">
        <div className="category-detail__columns">
          {columns.map((col, colIdx) => (
            <div key={colIdx} className="category-detail__col">
              {col.map(({ img, idx }) => (
                <motion.div
                  key={img.src}
                  className="gallery-card"
                  onClick={() => setActiveImageIndex(idx)}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  <img
                    src={encodeURI(img.src)}
                    alt=""
                    loading="lazy"
                    className="gallery-card__img"
                  />
                  <div className="gallery-card__overlay">
                    <span className="gallery-card__zoom-pill">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M15 3H21V9M9 21H3V15M21 3L14 10M3 21L10 14"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      View Full Size
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ---- Lightbox Modal ---- */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            className="lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImageIndex(null)}
            onTouchStart={(e) => {
              setTouchEnd(null);
              setTouchStart(e.targetTouches[0].clientX);
            }}
            onTouchMove={(e) => setTouchEnd(e.targetTouches[0].clientX)}
            onTouchEnd={() => {
              if (!touchStart || !touchEnd) return;
              const diff = touchStart - touchEnd;
              if (diff > 45) {
                setActiveImageIndex((prev) => (prev + 1) % images.length);
              } else if (diff < -45) {
                setActiveImageIndex((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1
                );
              }
            }}
          >
            {/* Prev button */}
            <button
              className="lightbox-nav lightbox-nav--prev"
              onClick={(e) => {
                e.stopPropagation();
                setActiveImageIndex((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1
                );
              }}
              aria-label="Previous image"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 19L8 12L15 5"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Next button */}
            <button
              className="lightbox-nav lightbox-nav--next"
              onClick={(e) => {
                e.stopPropagation();
                setActiveImageIndex((prev) => (prev + 1) % images.length);
              }}
              aria-label="Next image"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 5L16 12L9 19"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Main Image content */}
            <motion.div
              className="lightbox-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <button
                className="lightbox-close"
                onClick={() => setActiveImageIndex(null)}
                aria-label="Close Lightbox"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <img
                src={encodeURI(activeImage.src)}
                alt=""
                className="lightbox-image"
              />

              <div className="lightbox-caption">
                <span>
                  {activeImageIndex + 1} / {images.length}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}