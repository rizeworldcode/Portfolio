import { useState } from "react";
import "./PricingPlans.css";

export default function PricingPlans() {
  const [isQuarterly, setIsQuarterly] = useState(false);

  const discount = isQuarterly ? 0.9 : 1;

  const plans = [
    {
      id: "01",
      name: "Starter",
      tagline: "One channel, done properly.",
      price: Math.round(1900 * discount),
      badge: null,
      isPopular: false,
      features: [
        "One channel (SEO, social or ads)",
        "Monthly strategy call",
        "Live dashboard",
        "Email support",
      ],
      cta: "Start with Starter",
    },
    {
      id: "02",
      name: "Growth",
      tagline: "Two channels working together.",
      price: Math.round(3900 * discount),
      badge: "MOST POPULAR",
      isPopular: true,
      features: [
        "Two channels",
        "Weekly check-ins",
        "Live dashboard",
        "Slack support",
      ],
      cta: "Choose Growth",
    },
    {
      id: "03",
      name: "Scale",
      tagline: "The full team on your brand.",
      price: Math.round(7500 * discount),
      badge: null,
      isPopular: false,
      features: [
        "SEO + social + paid ads",
        "Dedicated strategist",
        "Creative team",
        "Landing pages",
        "Priority support",
      ],
      cta: "Talk to us",
    },
  ];

  return (
    <section className="pricing-section" id="pricing">
      <div className="pricing-container">
        {/* Header */}
        <div className="pricing-header">
          <div className="pricing-header__left">
            <div className="pricing-pill">
              <span className="pricing-pill__dot" />
              <span className="pricing-pill__text">(09) Pricing</span>
            </div>
            <h2 className="pricing-title">Simple monthly retainers.</h2>
            <p className="pricing-desc">
              Pick the channels you need. Every plan comes with a strategist, a
              live dashboard and plain-number reports.
            </p>
          </div>

          {/* Monthly / Quarterly Toggle Switch */}
          <div className="pricing-toggle">
            <button
              type="button"
              className={`pricing-toggle__btn ${
                !isQuarterly ? "pricing-toggle__btn--active" : ""
              }`}
              onClick={() => setIsQuarterly(false)}
            >
              MONTHLY
            </button>
            <button
              type="button"
              className={`pricing-toggle__btn ${
                isQuarterly ? "pricing-toggle__btn--active" : ""
              }`}
              onClick={() => setIsQuarterly(true)}
            >
              QUARTERLY <span className="pricing-discount-tag">-10%</span>
            </button>
          </div>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="pricing-grid">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`pricing-card ${
                p.isPopular ? "pricing-card--popular" : ""
              }`}
            >
              <div className="pricing-card__header">
                <span className="pricing-card__num">{p.id}</span>
                {p.badge && (
                  <span className="pricing-popular-pill">
                    <span className="pricing-popular-dot" />
                    <span>{p.badge}</span>
                  </span>
                )}
              </div>

              <div className="pricing-card__title-row">
                <h3 className="pricing-card__name">{p.name}</h3>
                <p className="pricing-card__tagline">{p.tagline}</p>
              </div>

              <div className="pricing-card__price-row">
                <span className="pricing-card__curr">$</span>
                <span className="pricing-card__amount">
                  {p.price.toLocaleString()}
                </span>
                <span className="pricing-card__period">
                  • BILLED {isQuarterly ? "QUARTERLY" : "MONTHLY"} · CANCEL ANYTIME
                </span>
              </div>

              <div className="pricing-card__divider" />

              <ul className="pricing-card__features">
                {p.features.map((feat, i) => (
                  <li key={i} className="pricing-card__feature-item">
                    <span className="pricing-check">✔</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#audit"
                className={`pricing-card__btn ${
                  p.isPopular ? "pricing-card__btn--lime" : ""
                }`}
              >
                <span>{p.cta}</span>
                <span className="pricing-card__btn-arrow">↗</span>
              </a>
            </div>
          ))}
        </div>

        {/* Bottom Terms Bar */}
        <div className="pricing-bottom-bar">
          <div className="pricing-guarantees">
            <span>NO LONG CONTRACTS</span>
            <span>•</span>
            <span>30 DAYS NOTICE</span>
            <span>•</span>
            <span>AD SPEND PAID TO THE PLATFORMS DIRECTLY</span>
          </div>
          <a href="#compare" className="pricing-compare-btn">
            <span>Compare plans</span>
            <span>↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
