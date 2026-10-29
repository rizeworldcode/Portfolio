import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./BlogInsights.css";

const initialArticles = {
  featured: {
    id: "featured",
    category: "ON-PAGE SEO — CASE STUDY 2026",
    date: "OCTOBER 2026",
    readTime: "CASE STUDY",
    readsBadge: "Search Intent Focus",
    title: "On-Page SEO: Structuring Content Around User Search Intent",
    excerpt:
      "The website content and page structure were optimized around relevant services and search intent, making important information easier for users and search engines to understand.",
    img: "/deepdive-serp-rank.jpeg",
  },
  stacked: [
    {
      id: "article-2",
      category: "LOCAL SEO — CASE STUDY 2026",
      date: "OCTOBER 2026",
      readTime: "ALWAR PACK",
      readsBadge: "Google Search Console",
      title: "Local SEO Strategy: Improving Search Visibility in Alwar",
      excerpt:
        "A local SEO strategy focused on improving visibility for relevant digital marketing and web development searches in Alwar and surrounding areas.",
      img: "/deepdive-gsc-performance.jpeg",
    },
    {
      id: "article-3",
      category: "TECHNICAL SEO — CASE STUDY 2026",
      date: "OCTOBER 2026",
      readTime: "CORE VITALS",
      readsBadge: "Growth Metrics",
      title: "Technical SEO: Crawl-Friendly Foundation & URL Structure",
      excerpt:
        "Technical improvements focused on creating a cleaner website structure, improving crawlability, strengthening URL organization, and supporting better search-engine accessibility.",
      img: "/deepdive-analytics-comparison.jpeg",
    },
  ],
};

export default function BlogInsights() {
  const [articles, setArticles] = useState(initialArticles);

  const handleSwapCard = (index) => {
    setArticles((prev) => {
      const clickedCard = prev.stacked[index];
      const newStacked = [...prev.stacked];
      newStacked[index] = prev.featured;
      return {
        featured: clickedCard,
        stacked: newStacked,
      };
    });
  };

  return (
    <section className="blog-section" id="blog">
      <div className="blog-container">
        {/* ============================================================
            HEADER AREA
            ============================================================ */}
        <div className="blog-header">
          <div className="blog-header__left">
            <div className="blog-pill">
              <span className="blog-pill__dot" />
              <span className="blog-pill__text">(06) SEO Deep-Dive</span>
            </div>

            <h2 className="blog-title">
              <span className="blog-title__line">SEO Strategy</span>
              <span className="blog-title__line">
                <span className="blog-badge">In-Depth</span> Analysis.
              </span>
            </h2>
          </div>

          <div className="blog-header__right">
            <p className="blog-desc">
              A closer look at the SEO framework used across on-page SEO, local search, technical optimization, and content strategy. Click any card to preview it in detail.
            </p>
          </div>
        </div>

        {/* ============================================================
            ARTICLES GRID (LEFT FEATURED, RIGHT STACKED)
            ============================================================ */}
        <div className="blog-grid">
          {/* Left Column: Featured Big Article */}
          <article className="blog-featured-card">
            {/* Image Container with Floating Reads Tag */}
            <div className="blog-featured-card__media">
              <AnimatePresence mode="wait">
                <motion.img
                  key={articles.featured.img}
                  src={articles.featured.img}
                  alt={articles.featured.title}
                  className="blog-featured-card__img"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                />
              </AnimatePresence>
              <div className="blog-reads-pill">
                <span className="blog-reads-pill__arrow">▲</span>
                <span className="blog-reads-pill__text">
                  {articles.featured.readsBadge}
                </span>
                <span className="blog-reads-pill__dot" />
              </div>
            </div>

            {/* Meta Row */}
            <div className="blog-meta-row">
              <div className="blog-meta-row__tags">
                <span className="blog-cat-pill">{articles.featured.category}</span>
                <span className="blog-date">{articles.featured.date}</span>
                <span className="blog-read-time">{articles.featured.readTime}</span>
              </div>
              <div className="blog-arrow-btn blog-arrow-btn--active" title="Featured View">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </div>
            </div>

            {/* Article Headline & Excerpt */}
            <h3 className="blog-featured-title">
              <span>{articles.featured.title}</span>
            </h3>
            <p className="blog-featured-excerpt">{articles.featured.excerpt}</p>
          </article>

          {/* Right Column: Two Stacked Articles */}
          <div className="blog-stacked-list">
            {articles.stacked.map((art, idx) => (
              <article
                key={art.id + idx}
                className="blog-stacked-card blog-stacked-card--clickable"
                onClick={() => handleSwapCard(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSwapCard(idx);
                  }
                }}
                title="Click to view this image on the main card"
              >
                <div className="blog-stacked-card__thumb">
                  <img src={art.img} alt={art.title} />
                  <div className="blog-stacked-card__thumb-badge">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                      <polyline points="9 21 3 21 3 15" />
                      <line x1="14" y1="10" x2="3" y2="21" />
                    </svg>
                    <span>Click to View</span>
                  </div>
                </div>

                <div className="blog-stacked-card__content">
                  <div className="blog-meta-row">
                    <div className="blog-meta-row__tags">
                      <span className="blog-cat-pill">{art.category}</span>
                      <span className="blog-date">{art.date}</span>
                      <span className="blog-read-time">{art.readTime}</span>
                    </div>
                    <div
                      className="blog-arrow-btn"
                      aria-label="Swap into main card"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                    </div>
                  </div>

                  <h4 className="blog-stacked-title">
                    <span>{art.title}</span>
                  </h4>
                  <p className="blog-stacked-excerpt">{art.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
