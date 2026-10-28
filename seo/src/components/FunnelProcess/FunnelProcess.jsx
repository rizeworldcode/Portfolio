import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./FunnelProcess.css";

export default function FunnelProcess() {
  const [activeStep, setActiveStep] = useState(0);
  const [funnelCounts, setFunnelCounts] = useState({
    reach: 0,
    clicks: 0,
    leads: 0,
    clients: 0,
  });

  const steps = [
    {
      num: "01",
      title: "Audit",
      time: "WEEK 1",
      desc: "We study your site, ads and competitors and find the fastest wins.",
      funnelIdx: 0,
    },
    {
      num: "02",
      title: "Launch",
      time: "WEEK 2-3",
      desc: "Campaigns, content and fixes go live.",
      funnelIdx: 1,
    },
    {
      num: "03",
      title: "Optimise",
      time: "MONTH 2",
      desc: "We test creatives, keywords and pages every week.",
      funnelIdx: 2,
    },
    {
      num: "04",
      title: "Scale",
      time: "MONTH 3+",
      desc: "We put more budget and content behind what works.",
      funnelIdx: 3,
    },
  ];

  const targetFunnel = {
    reach: 124800,
    clicks: 14250,
    leads: 1580,
    clients: 174,
  };

  // Animate funnel filling when in view
  useEffect(() => {
    let frameId;
    const duration = 2200;
    const startTime = performance.now();

    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      setFunnelCounts({
        reach: Math.floor(targetFunnel.reach * ease),
        clicks: Math.floor(targetFunnel.clicks * ease),
        leads: Math.floor(targetFunnel.leads * ease),
        clients: Math.floor(targetFunnel.clients * ease),
      });

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <section className="funnel-section" id="how-it-works">
      <div className="funnel-container">
        {/* ============================================================
            LEFT COLUMN: TYPOGRAPHY & TIMELINE STEPS
            ============================================================ */}
        <div className="funnel-left">
          {/* Pill Badge */}
          <div className="funnel-pill">
            <span className="funnel-pill__dot" />
            <span className="funnel-pill__text">(04) How we work</span>
          </div>

          {/* Headline */}
          <h2 className="funnel-title">
            <span className="funnel-title__line">From attention</span>
            <span className="funnel-title__line">
              to <span className="funnel-badge">clients.</span>
            </span>
          </h2>

          {/* Subtitle */}
          <p className="funnel-desc">
            Every retainer runs the same four steps. You see the funnel fill in
            your report every week.
          </p>

          {/* 4 Steps Timeline */}
          <div className="funnel-steps-list">
            {steps.map((st, idx) => (
              <div
                key={st.num}
                className={`funnel-step-item ${
                  activeStep === idx ? "funnel-step-item--active" : ""
                }`}
                onClick={() => setActiveStep(idx)}
                onMouseEnter={() => setActiveStep(idx)}
              >
                <div className="funnel-step-item__num">{st.num}</div>
                <div className="funnel-step-item__content">
                  <div className="funnel-step-item__header">
                    <h3 className="funnel-step-item__title">{st.title}</h3>
                    <span className="funnel-step-item__badge">{st.time}</span>
                  </div>
                  <p className="funnel-step-item__desc">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================
            RIGHT COLUMN: 4-STAGE TRAPEZOID CONVERSION FUNNEL
            ============================================================ */}
        <div className="funnel-right">
          <div className="funnel-visual">
            {/* Stage 1: REACH */}
            <div
              className={`funnel-tier funnel-tier--1 ${
                activeStep === 0 ? "funnel-tier--active" : ""
              }`}
            >
              {/* Floating ambient crowd particles */}
              <div className="funnel-particles-layer" aria-hidden="true">
                {[...Array(24)].map((_, i) => (
                  <span
                    key={i}
                    className="funnel-particle"
                    style={{
                      left: `${15 + ((i * 3.2) % 70)}%`,
                      top: `${15 + ((i * 7) % 65)}%`,
                      animationDelay: `${(i % 5) * 0.4}s`,
                    }}
                  />
                ))}
              </div>

              <div className="funnel-tier__content">
                <div className="funnel-tier__tag">
                  <span className="funnel-tier__num">01</span>
                  <span className="funnel-tier__label">REACH</span>
                </div>
                <div className="funnel-tier__number">
                  {funnelCounts.reach > 0
                    ? funnelCounts.reach.toLocaleString()
                    : "0"}
                </div>
              </div>
            </div>

            {/* Stage 2: CLICKS */}
            <div
              className={`funnel-tier funnel-tier--2 ${
                activeStep === 1 ? "funnel-tier--active" : ""
              }`}
            >
              <div className="funnel-tier__content">
                <div className="funnel-tier__tag">
                  <span className="funnel-tier__num">02</span>
                  <span className="funnel-tier__label">CLICKS</span>
                </div>
                <div className="funnel-tier__number">
                  {funnelCounts.clicks > 0
                    ? funnelCounts.clicks.toLocaleString()
                    : "0"}
                </div>
              </div>
            </div>

            {/* Stage 3: LEADS */}
            <div
              className={`funnel-tier funnel-tier--3 ${
                activeStep === 2 ? "funnel-tier--active" : ""
              }`}
            >
              <div className="funnel-tier__content">
                <div className="funnel-tier__tag">
                  <span className="funnel-tier__num">03</span>
                  <span className="funnel-tier__label">LEADS</span>
                </div>
                <div className="funnel-tier__number">
                  {funnelCounts.leads > 0
                    ? funnelCounts.leads.toLocaleString()
                    : "0"}
                </div>

                {/* Conversion Pill Badge */}
                <div className="funnel-conversion-badge">
                  <span className="funnel-conversion-badge__dot" />
                  <span className="funnel-conversion-badge__text">
                    11% become clients
                  </span>
                </div>
              </div>
            </div>

            {/* Stage 4: CLIENTS */}
            <div
              className={`funnel-tier funnel-tier--4 ${
                activeStep === 3 ? "funnel-tier--active" : ""
              }`}
            >
              <div className="funnel-tier__content">
                <div className="funnel-tier__tag">
                  <span className="funnel-tier__num">04</span>
                  <span className="funnel-tier__label">CLIENTS</span>
                </div>
                <div className="funnel-tier__number">
                  {funnelCounts.clients > 0
                    ? funnelCounts.clients.toLocaleString()
                    : "0"}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Caption */}
          <div className="funnel-footer-caption">
            <span className="funnel-footer-caption__dot" />
            <span className="funnel-footer-caption__text">
              A TYPICAL CLIENT FUNNEL · LAST 90 DAYS
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
