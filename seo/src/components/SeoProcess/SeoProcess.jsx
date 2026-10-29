import { useState } from "react";
import "./SeoProcess.css";

export default function SeoProcess() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: "01",
      phase: "STEP 01",
      title: "Research",
      tagline: "Market & Intent Discovery",
      desc: "Identify relevant keywords, competitors, search intent, and local opportunities.",
      deliverables: [
        "Commercial & local keyword research",
        "Competitor search gap audit",
        "Search-intent mapping for Alwar",
        "Opportunity & volume validation",
      ],
    },
    {
      num: "02",
      phase: "STEP 02",
      title: "Optimize",
      tagline: "On-Page & Structural Alignment",
      desc: "Improve page titles, descriptions, headings, content, images, URLs, and internal links.",
      deliverables: [
        "SEO-friendly title tags & meta descriptions",
        "Semantic heading hierarchy (H1-H4)",
        "Search-intent aligned body copy",
        "Image alt text & internal linking mesh",
      ],
    },
    {
      num: "03",
      phase: "STEP 03",
      title: "Strengthen",
      tagline: "Technical Health & Local Pack",
      desc: "Work on technical SEO, crawlability, indexability, mobile usability, and local search signals.",
      deliverables: [
        "Crawlability & indexation diagnostics",
        "Mobile usability & speed optimization",
        "Schema markup & structured data",
        "Google Business Profile & NAP signals",
      ],
    },
    {
      num: "04",
      phase: "STEP 04",
      title: "Measure",
      tagline: "Performance & Console Tracking",
      desc: "Use Search Console and other performance data to identify opportunities and refine the strategy.",
      deliverables: [
        "Search Console visibility analysis",
        "Local map pack rank monitoring",
        "CTR & impression trend evaluations",
        "Conversion inquiry tracking",
      ],
    },
    {
      num: "05",
      phase: "STEP 05",
      title: "Improve",
      tagline: "Iterative Refinement & Expansion",
      desc: "Update content, fix technical issues, strengthen internal linking, and expand relevant search coverage.",
      deliverables: [
        "Content freshening & depth expansion",
        "Technical resolution sprints",
        "Internal link equity distribution",
        "Broader regional keyword expansion",
      ],
    },
  ];

  return (
    <section className="process-section" id="process">
      <div className="process-container">
        {/* Header */}
        <div className="process-header">
          <div className="process-header__left">
            <div className="process-pill">
              <span className="process-pill__dot" />
              <span className="process-pill__text">(07) Implementation Process</span>
            </div>

            <h2 className="process-title">
              <span className="process-title__row">Building SEO</span>
              <span className="process-title__row">
                <span className="process-badge">Step</span> by Step.
              </span>
            </h2>
          </div>

          <div className="process-header__right">
            <p className="process-desc">
              A clear, repeatable 5-step methodology engineered to ensure each stage of RizeWorld’s SEO strategy builds momentum and drives sustainable organic rank dominance.
            </p>
          </div>
        </div>

        {/* 5-Step Process Cards Rail */}
        <div className="process-grid">
          {steps.map((st, idx) => {
            const isActive = activeStep === idx;
            return (
              <div
                key={st.num}
                className={`process-card ${isActive ? "process-card--active" : ""}`}
                onClick={() => setActiveStep(idx)}
                onMouseEnter={() => setActiveStep(idx)}
              >
                <div className="process-card__top">
                  <span className="process-card__num">{st.num}</span>
                  <span className="process-card__phase">{st.phase}</span>
                </div>

                <div className="process-card__body">
                  <h3 className="process-card__title">{st.title}</h3>
                  <div className="process-card__tagline">{st.tagline}</div>
                  <p className="process-card__desc">{st.desc}</p>
                </div>

                <div className="process-card__divider" />

                <ul className="process-card__list">
                  {st.deliverables.map((d, dIdx) => (
                    <li key={dIdx} className="process-card__item">
                      <span className="process-card__check">✔</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>

                <div className="process-card__indicator" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
