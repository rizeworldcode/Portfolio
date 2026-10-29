import { useState } from "react";
import "./FreeAudit.css";

export default function FreeAudit() {
  const [email, setEmail] = useState("");
  const [budget, setBudget] = useState("$2,500 - $5,000");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  return (
    <section className="audit-section" id="audit">
      {/* Background Concentric Radar Ripple Waves */}
      <div className="audit-radar-waves" aria-hidden="true">
        <span className="audit-wave audit-wave--1" />
        <span className="audit-wave audit-wave--2" />
        <span className="audit-wave audit-wave--3" />
        <span className="audit-wave audit-wave--4" />
      </div>

      <div className="audit-container">
        {/* ============================================================
            MAIN COLUMN: TYPOGRAPHY & FORM
            ============================================================ */}
        <div className="audit-left">
          {/* Pill Badge */}
          <div className="audit-pill">
            <span className="audit-pill__dot" />
            <span className="audit-pill__text">(06) Free audit</span>
          </div>

          {/* Headline */}
          <h2 className="audit-title">
            <span className="audit-title__row">Ready to be</span>
            <span className="audit-title__highlight">seen?</span>
          </h2>

          {/* Paragraph */}
          <p className="audit-desc">
            Get a free 30-minute audit of your site, socials and ads. You keep
            the plan, whether we work together or not.
          </p>

          {/* Inline Form Bar */}
          <form className="audit-form" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="audit-input-wrap">
              <span className="audit-input-icon">✉</span>
              <input
                type="email"
                placeholder="Work email"
                className="audit-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <span className="audit-input-end-badge">📅</span>
            </div>

            {/* Budget Selector */}
            <div className="audit-select-wrap">
              <select
                className="audit-select"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              >
                <option value="$1,500 - $2,500">Monthly budget: $1.5k–$2.5k</option>
                <option value="$2,500 - $5,000">Monthly budget: $2.5k–$5k</option>
                <option value="$5,000 - $10,000">Monthly budget: $5k–$10k</option>
                <option value="$10,000+">Monthly budget: $10k+</option>
              </select>
              <span className="audit-select-arrow">⌄</span>
            </div>

            {/* Submit Button */}
            <button type="submit" className="audit-btn-submit">
              <span>{submitted ? "Audit Requested!" : "Get my free audit"}</span>
              <span className="audit-btn-submit__icon">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </span>
            </button>
          </form>

          {/* Micro Footer Note */}
          <div className="audit-note">
            NO SPAM. WE REPLY WITHIN 2 HOURS.
          </div>
        </div>
      </div>
    </section>
  );
}
