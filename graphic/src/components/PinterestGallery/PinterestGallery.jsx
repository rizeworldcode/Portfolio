import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PORTFOLIO_CATEGORIES } from "../../data/portfolioData";
import CategoryDetail from "../Categories/CategoryDetail";
import "./PinterestGallery.css";

// Dynamic responsive masonry column hook
function useColumnCount() {
  const [cols, setCols] = useState(4);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setCols(2);
      else if (w < 1024) setCols(3);
      else if (w < 1500) setCols(4);
      else setCols(5);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return cols;
}

export default function PinterestGallery() {
  const columnCount = useColumnCount();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(null);
  const [viewMode, setViewMode] = useState("masonry"); // "masonry" (default) or "categories"
  const [selectedCategoryForModal, setSelectedCategoryForModal] = useState(null);
  const searchInputRef = useRef(null);

  // Smartly interleaved & mixed feed across all categories (Pinterest Style)
  const allItems = useMemo(() => {
    // Group images by category
    const categoryGroups = PORTFOLIO_CATEGORIES.map((cat) =>
      (cat.images || []).map((img, idx) => ({
        ...img,
        uniqueId: `${cat.id}-${idx}-${img.name}`,
        categoryId: cat.id,
        categoryTitle: cat.title,
        categoryTag: cat.tag,
      }))
    );

    // High-impact priority order so diverse visual styles mix right from the top
    const priorityOrder = [
      "gym_fitness",
      "food",
      "gemstone",
      "fashion_clothing",
      "beauty_wellness",
      "branding",
      "products",
      "healthcare",
      "automotive_retail",
      "institute",
      "education",
      "realestate",
      "election",
    ];

    const sortedGroups = [...categoryGroups].sort((a, b) => {
      const aId = a[0]?.categoryId || "";
      const bId = b[0]?.categoryId || "";
      const aIdx = priorityOrder.indexOf(aId);
      const bIdx = priorityOrder.indexOf(bId);
      return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
    });

    // Interleave items round-robin so adjacent cards are always from different industries
    const mixed = [];
    const maxLen = Math.max(...sortedGroups.map((g) => g.length), 0);

    for (let i = 0; i < maxLen; i++) {
      for (let g = 0; g < sortedGroups.length; g++) {
        if (i < sortedGroups[g].length) {
          mixed.push(sortedGroups[g][i]);
        }
      }
    }

    return mixed;
  }, []);

  // Filter items based on search query (matches name, category title, tag, or id)
  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return allItems.filter((item) => {
      if (q) {
        const matchName = item.name.toLowerCase().includes(q);
        const matchCat = item.categoryTitle.toLowerCase().includes(q);
        const matchTag = item.categoryTag.toLowerCase().includes(q);
        const matchId = item.categoryId.toLowerCase().includes(q);
        return matchName || matchCat || matchTag || matchId;
      }
      return true;
    });
  }, [allItems, searchQuery]);

  // Distribute items into balanced masonry columns
  const masonryColumns = useMemo(() => {
    const effectiveCols = Math.min(columnCount, Math.max(1, filteredItems.length));
    const cols = Array.from({ length: effectiveCols }, () => []);
    const colHeights = Array(effectiveCols).fill(0);

    filteredItems.forEach((item, globalIdx) => {
      let shortest = 0;
      for (let c = 1; c < effectiveCols; c++) {
        if (colHeights[c] < colHeights[shortest] - 0.28) shortest = c;
      }
      cols[shortest].push({ item, globalIdx });
      colHeights[shortest] += item.aspectRatio || 1.33;
    });

    return cols;
  }, [filteredItems, columnCount]);

  // Lightbox keyboard navigation
  const handleKeyDown = useCallback(
    (e) => {
      if (activeLightboxIndex === null) return;
      if (e.key === "Escape") {
        setActiveLightboxIndex(null);
      } else if (e.key === "ArrowRight") {
        setActiveLightboxIndex((prev) => (prev + 1) % filteredItems.length);
      } else if (e.key === "ArrowLeft") {
        setActiveLightboxIndex((prev) =>
          prev === 0 ? filteredItems.length - 1 : prev - 1
        );
      }
    },
    [activeLightboxIndex, filteredItems.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (activeLightboxIndex !== null) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [activeLightboxIndex]);

  const activeLightboxItem =
    activeLightboxIndex !== null ? filteredItems[activeLightboxIndex] : null;

  return (
    <section className="pinterest-gallery" id="portfolio-gallery" aria-label="Visual Portfolio Showcase">
      <div className="pinterest-gallery__container">

        {/* ========================================================
            PERMANENT STICKY SEARCH & CATEGORY CONTROLS
            ======================================================== */}
        <div className="pinterest-controls">
          <div className="pinterest-controls__glass">

            {/* Top Row: Search Input + View Switcher + Count */}
            <div className="pinterest-search-row">
              <div className="pinterest-search-input-wrap">
                <svg className="pinterest-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 230+ creatives (e.g. food, gym, jewellery, fashion, yoga, packaging)..."
                  className="pinterest-search-input"
                  aria-label="Search graphic designs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="pinterest-search-clear"
                    onClick={() => {
                      setSearchQuery("");
                      searchInputRef.current?.focus();
                    }}
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* View Switcher Pill */}
              <div className="pinterest-actions-wrap">
                <div className="pinterest-view-switcher" role="tablist" aria-label="Layout view switcher">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={viewMode === "masonry"}
                    className={`pinterest-view-btn ${viewMode === "masonry" ? "is-active" : ""}`}
                    onClick={() => setViewMode("masonry")}
                    title="Masonry Feed (Pinterest View)"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="7" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                      <rect x="14" y="3" width="7" height="6" rx="2" stroke="currentColor" strokeWidth="2" />
                      <rect x="14" y="12" width="7" height="9" rx="2" stroke="currentColor" strokeWidth="2" />
                      <rect x="3" y="17" width="7" height="4" rx="2" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span>Feed View</span>
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={viewMode === "categories"}
                    className={`pinterest-view-btn ${viewMode === "categories" ? "is-active" : ""}`}
                    onClick={() => setViewMode("categories")}
                    title="Industry Cards (3D View)"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="2" />
                      <rect x="13" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="2" />
                      <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="2" />
                      <rect x="13" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span>Categories</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================
            VIEW MODE 1: PINTEREST MASONRY FEED (DEFAULT)
            ======================================================== */}
        {viewMode === "masonry" && (
          <div className="pinterest-masonry-wrapper">
            {filteredItems.length === 0 ? (
              <div className="pinterest-empty-state">
                <div className="pinterest-empty-icon">🔍</div>
                <h3>No creatives found for "{searchQuery}"</h3>
                <p>Try searching with another keyword (e.g. food, gym, jewellery, fashion, yoga, packaging).</p>
                <button
                  type="button"
                  className="pinterest-empty-reset-btn"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search & Show All
                </button>
              </div>
            ) : (
              <div className="pinterest-masonry-grid">
                {masonryColumns.map((col, colIdx) => (
                  <div key={`col-${colIdx}`} className="pinterest-masonry-column">
                    {col.map(({ item, globalIdx }) => (
                      <motion.div
                        key={item.uniqueId}
                        className="pinterest-card"
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "100px" }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        onClick={() => setActiveLightboxIndex(globalIdx)}
                        role="button"
                        tabIndex={0}
                        aria-label={`View ${item.name} from ${item.categoryTitle}`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setActiveLightboxIndex(globalIdx);
                          }
                        }}
                      >
                        <div className="pinterest-card__img-container">
                          <img
                            src={encodeURI(item.src)}
                            alt={item.name}
                            loading="lazy"
                            decoding="async"
                            className="pinterest-card__img"
                          />
                        </div>

                        {/* Hover Overlay */}
                        <div className="pinterest-card__overlay">
                          <div className="pinterest-card__top">
                            <span className="pinterest-card__tag">
                              {item.categoryTag || item.categoryTitle}
                            </span>
                            <div className="pinterest-card__zoom-btn" title="Expand creative">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path
                                  d="M15 3H21V9M9 21H3V15M21 3L14 10M3 21L10 14"
                                  stroke="currentColor"
                                  strokeWidth="2.2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          </div>

                          <div className="pinterest-card__bottom">
                            <h4 className="pinterest-card__title">{item.name}</h4>
                            <span className="pinterest-card__category">{item.categoryTitle}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            VIEW MODE 2: INDUSTRY 3D CARDS VIEW
            ======================================================== */}
        {viewMode === "categories" && (
          <div className="pinterest-categories-wrapper">
            <div className="pinterest-categories-grid">
              {PORTFOLIO_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className="pinterest-category-card"
                  onClick={() => setSelectedCategoryForModal(cat)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedCategoryForModal(cat);
                    }
                  }}
                >
                  <div className="pinterest-category-card__img-wrap">
                    <img
                      src={encodeURI(cat.coverImage)}
                      alt={cat.title}
                      loading="lazy"
                      className="pinterest-category-card__img"
                    />
                  </div>
                  <div className="pinterest-category-card__overlay" />
                  <div className="pinterest-category-card__content">
                    <span className="pinterest-category-card__tag">{cat.tag}</span>
                    <h3 className="pinterest-category-card__title">{cat.title}</h3>
                    <p className="pinterest-category-card__meta">
                      {cat.itemCount > 0 ? `${cat.itemCount} Designs` : "Showcase"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ========================================================
          FULLSCREEN PINTEREST LIGHTBOX MODAL
          ======================================================== */}
      <AnimatePresence>
        {activeLightboxItem && (
          <motion.div
            className="pinterest-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setActiveLightboxIndex(null)}
          >
            <div className="pinterest-lightbox__backdrop" />

            <div
              className="pinterest-lightbox__content"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                className="pinterest-lightbox__close"
                onClick={() => setActiveLightboxIndex(null)}
                aria-label="Close preview"
              >
                ✕
              </button>

              {/* Prev Arrow */}
              {filteredItems.length > 1 && (
                <button
                  type="button"
                  className="pinterest-lightbox__nav pinterest-lightbox__nav--prev"
                  onClick={() =>
                    setActiveLightboxIndex((prev) =>
                      prev === 0 ? filteredItems.length - 1 : prev - 1
                    )
                  }
                  aria-label="Previous creative"
                >
                  ‹
                </button>
              )}

              {/* Next Arrow */}
              {filteredItems.length > 1 && (
                <button
                  type="button"
                  className="pinterest-lightbox__nav pinterest-lightbox__nav--next"
                  onClick={() =>
                    setActiveLightboxIndex(
                      (prev) => (prev + 1) % filteredItems.length
                    )
                  }
                  aria-label="Next creative"
                >
                  ›
                </button>
              )}

              {/* Main Image Frame */}
              <div className="pinterest-lightbox__image-frame">
                <img
                  src={encodeURI(activeLightboxItem.src)}
                  alt={activeLightboxItem.name}
                  className="pinterest-lightbox__img"
                />
              </div>

              {/* Bottom Caption Bar */}
              <div className="pinterest-lightbox__caption">
                <div className="pinterest-lightbox__meta">
                  <span className="pinterest-lightbox__tag">
                    {activeLightboxItem.categoryTag || activeLightboxItem.categoryTitle}
                  </span>
                  <h3 className="pinterest-lightbox__title">{activeLightboxItem.name}</h3>
                  <span className="pinterest-lightbox__sub">
                    Industry: {activeLightboxItem.categoryTitle}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Modal if clicked from Category View */}
      <AnimatePresence>
        {selectedCategoryForModal && (
          <CategoryDetail
            category={selectedCategoryForModal}
            onClose={() => setSelectedCategoryForModal(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

