import { motion } from "framer-motion";
import "./BlogInsights.css";

export default function BlogInsights() {
  const articles = {
    featured: {
      id: "featured",
      category: "SEO",
      date: "SEP 18, 2026",
      readTime: "7 MIN READ",
      readsBadge: "2.4k reads this week",
      title: "Local SEO in 2026: what still moves the map pack",
      excerpt:
        "Reviews, pages and links: the three things that still decide who shows up first near you.",
      img: "/city-intersection.jpg",
    },
    stacked: [
      {
        id: "article-2",
        category: "SOCIAL MEDIA",
        date: "SEP 04, 2026",
        readTime: "5 MIN READ",
        title: "Reels that sell: the 3-second rule we use for every client",
        excerpt:
          "Why the first three seconds decide whether anyone sees the other twenty-seven.",
        img: "/barista-reels.jpg",
      },
      {
        id: "article-3",
        category: "PAID ADS",
        date: "AUG 21, 2026",
        readTime: "8 MIN READ",
        title: "ROAS is not profit: how we report paid ads",
        excerpt:
          "A 6× return can still lose money. Here is the number we report instead.",
        img: "/laptop-analytics.jpg",
      },
    ],
  };

  return (
    <section className="blog-section" id="blog">
      <div className="blog-container">
        {/* ============================================================
            HEADER AREA
            ============================================================ */}
        <div className="blog-header">
          <div className="blog-header__left">
            <h2 className="blog-title">
              <span className="blog-title__line">Ideas we</span>
              <span className="blog-title__line">
                <span className="blog-badge">test</span> first.
              </span>
            </h2>
          </div>

          <div className="blog-header__right">
            <p className="blog-desc">
              What we learn running campaigns every week, written up so you can
              use it too.
            </p>
            <a href="#all-articles" className="blog-btn-all">
              <span>All articles</span>
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
            </a>
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
              <img
                src={articles.featured.img}
                alt={articles.featured.title}
                className="blog-featured-card__img"
              />
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
              <a
                href="#read-featured"
                className="blog-arrow-btn"
                aria-label="Read article"
              >
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
              </a>
            </div>

            {/* Article Headline & Excerpt */}
            <h3 className="blog-featured-title">
              <a href="#read-featured">{articles.featured.title}</a>
            </h3>
            <p className="blog-featured-excerpt">{articles.featured.excerpt}</p>
          </article>

          {/* Right Column: Two Stacked Articles */}
          <div className="blog-stacked-list">
            {articles.stacked.map((art, idx) => (
              <article key={art.id} className="blog-stacked-card">
                <div className="blog-stacked-card__thumb">
                  <img src={art.img} alt={art.title} />
                </div>

                <div className="blog-stacked-card__content">
                  <div className="blog-meta-row">
                    <div className="blog-meta-row__tags">
                      <span className="blog-cat-pill">{art.category}</span>
                      <span className="blog-date">{art.date}</span>
                      <span className="blog-read-time">{art.readTime}</span>
                    </div>
                    <a
                      href={`#read-${art.id}`}
                      className="blog-arrow-btn"
                      aria-label="Read article"
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
                    </a>
                  </div>

                  <h4 className="blog-stacked-title">
                    <a href={`#read-${art.id}`}>{art.title}</a>
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
