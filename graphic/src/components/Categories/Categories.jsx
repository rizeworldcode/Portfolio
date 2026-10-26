import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PORTFOLIO_CATEGORIES } from "../../data/portfolioData";
import CategoryDetail from "./CategoryDetail";
import "./Categories.css";

function ProjectCard({ category, onClick }) {
  const cardRef = useRef(null);
  const glossRef = useRef(null);
  const isHovering = useRef(false);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const rX = ((y - cy) / cy) * -14;
    const rY = ((x - cx) / cx) * 14;

    const xPct = (x / rect.width) * 100;
    const yPct = (y / rect.height) * 100;

    card.style.transform = `perspective(900px) rotateX(${rX}deg) rotateY(${rY}deg) scale3d(1.04,1.04,1.04)`;
    card.style.transition = "transform 80ms linear";

    if (glossRef.current) {
      glossRef.current.style.background = `radial-gradient(circle at ${xPct}% ${yPct}%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.06) 40%, transparent 70%)`;
      glossRef.current.style.opacity = "1";
    }
  };

  const handleMouseEnter = () => {
    isHovering.current = true;
    if (cardRef.current) cardRef.current.classList.add("is-hovered");
  };

  const handleMouseLeave = () => {
    isHovering.current = false;
    if (cardRef.current) {
      cardRef.current.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
      cardRef.current.style.transition = "transform 550ms cubic-bezier(0.23,1,0.32,1)";
      cardRef.current.classList.remove("is-hovered");
    }
    if (glossRef.current) glossRef.current.style.opacity = "0";
  };

  return (
    <div className="project-card-scene" onClick={onClick}>
      <div
        ref={cardRef}
        className="project-card"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="button"
        tabIndex={0}
        aria-label={`Open ${category.title} Gallery (${category.itemCount} designs)`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
          }
        }}
      >
        <div className="project-card__img-wrap">
          <img
            src={encodeURI(category.coverImage)}
            alt={category.title}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="project-card__img"
          />
        </div>

        <div className="project-card__overlay" />
        <div ref={glossRef} className="project-card__gloss" />
        <div className="project-card__ring" />

        <div className="project-card__badges">
          <div className="project-card__tag">{category.tag}</div>
          <div className="project-card__count">{category.itemCount} Designs</div>
        </div>

        <div className="project-card__pill" aria-hidden="true">
          <span>View Projects</span>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path
              d="M5 3L11 8L5 13"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="project-card__content">
          <h3 className="project-card__title">{category.title}</h3>
          <p className="project-card__category">{category.category}</p>
        </div>
      </div>
    </div>
  );
}

const sectionVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", bounce: 0.15, duration: 1.1 },
  },
};

const headingVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", bounce: 0, duration: 1.0 },
  },
};

export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#category-", "");
      if (hash) {
        const found = PORTFOLIO_CATEGORIES.find((c) => c.id === hash);
        if (found) {
          setSelectedCategory(found);
          return;
        }
      }
      setSelectedCategory(null);
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const openCategory = (cat) => {
    window.location.hash = `category-${cat.id}`;
    setSelectedCategory(cat);
  };

  const closeCategory = () => {
    window.history.pushState(
      "",
      document.title,
      window.location.pathname + window.location.search
    );
    setSelectedCategory(null);
  };

  return (
    <>
      <section className="categories" id="categories" aria-label="Project Categories">
        <motion.div
          className="categories__header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={headingVariants}
        >
          <span className="categories__eyebrow">Portfolio Works</span>
          <h2 className="categories__title">Industries We Design For</h2>
          <p className="categories__subtitle">
            Explore 200+ selected graphic designs, brand identities, and social creatives.
            Click any category to view full showcase.
          </p>
        </motion.div>

        <motion.div
          className="categories__grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariants}
        >
          {PORTFOLIO_CATEGORIES.map((item) => (
            <motion.div key={item.id} id={`card-${item.id}`} variants={cardVariants}>
              <ProjectCard
                category={item}
                onClick={() => openCategory(item)}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      <AnimatePresence>
        {selectedCategory && (
          <CategoryDetail
            category={selectedCategory}
            onClose={closeCategory}
          />
        )}
      </AnimatePresence>
    </>
  );
}