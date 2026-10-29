import React, { useState, useEffect, useRef, useCallback } from "react";
import "./FunnelProcess.css";

export default function FunnelProcess() {
  const [activeStep, setActiveStep] = useState(-1);
  const [counts, setCounts] = useState({
    reach: 0,
    clicks: 0,
    leads: 0,
    clients: 0,
  });

  const sectionRef = useRef(null);
  const prevStepRef = useRef(-1);
  const animFrameRefs = useRef({});

  const steps = [
    {
      num: "01",
      title: "Audit",
      time: "WEEK 1",
      desc: "We study your site, ads and competitors and find the fastest wins.",
    },
    {
      num: "02",
      title: "Launch",
      time: "WEEK 2-3",
      desc: "Campaigns, content and fixes go live.",
    },
    {
      num: "03",
      title: "Optimise",
      time: "MONTH 2",
      desc: "We test creatives, keywords and pages every week.",
    },
    {
      num: "04",
      title: "Scale",
      time: "MONTH 3+",
      desc: "We put more budget and content behind what works.",
    },
  ];

  const targets = {
    reach: 1284300,
    clicks: 48120,
    leads: 2940,
    clients: 312,
  };

  // Animate count up from 0 to targetVal
  const animateCount = useCallback((key, targetVal, duration = 600) => {
    if (animFrameRefs.current[key]) {
      cancelAnimationFrame(animFrameRefs.current[key]);
    }

    const startTime = performance.now();
    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo curve for energetic acceleration and smooth deceleration
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(targetVal * ease);

      setCounts((prev) => ({
        ...prev,
        [key]: current,
      }));

      if (progress < 1) {
        animFrameRefs.current[key] = requestAnimationFrame(tick);
      }
    };
    animFrameRefs.current[key] = requestAnimationFrame(tick);
  }, []);

  // Set step state and trigger animations accordingly
  const applyStepState = useCallback(
    (targetStep) => {
      const prevStep = prevStepRef.current;
      if (targetStep === prevStep) return;

      setActiveStep(targetStep);

      // Scrolling downwards: animate newly activated steps
      if (targetStep > prevStep) {
        if (targetStep >= 0 && prevStep < 0) animateCount("reach", targets.reach, 650);
        if (targetStep >= 1 && prevStep < 1) animateCount("clicks", targets.clicks, 550);
        if (targetStep >= 2 && prevStep < 2) animateCount("leads", targets.leads, 500);
        if (targetStep >= 3 && prevStep < 3) animateCount("clients", targets.clients, 450);
      } else {
        // Scrolling upwards: reset deactivated steps back to 0
        setCounts((prev) => ({
          reach: targetStep >= 0 ? prev.reach || targets.reach : 0,
          clicks: targetStep >= 1 ? prev.clicks || targets.clicks : 0,
          leads: targetStep >= 2 ? prev.leads || targets.leads : 0,
          clients: targetStep >= 3 ? prev.clients || targets.clients : 0,
        }));
      }

      prevStepRef.current = targetStep;
    },
    [animateCount]
  );

  // Scroll listener: dynamically drives the funnel based on scroll position through the section
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;

      // Scroll progress tracking:
      // Starts as section approaches center (rect.top <= vh * 0.70)
      // Completes when section is centered/scrolled through (rect.top <= -vh * 0.10)
      const start = vh * 0.72;
      const end = -vh * 0.12;
      const totalDist = start - end;
      const rawProgress = (start - rect.top) / totalDist;
      const progress = Math.max(0, Math.min(1, rawProgress));

      let step = -1;
      if (progress < 0.14) {
        step = -1;
      } else if (progress < 0.38) {
        step = 0; // Stage 1: Audit -> Reach
      } else if (progress < 0.62) {
        step = 1; // Stage 2: Launch -> Clicks
      } else if (progress < 0.82) {
        step = 2; // Stage 3: Optimise -> Leads
      } else {
        step = 3; // Stage 4: Scale -> Clients
      }

      applyStepState(step);
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    handleScroll(); // run once on mount

    return () => {
      window.removeEventListener("scroll", onScroll);
      Object.values(animFrameRefs.current).forEach((id) => cancelAnimationFrame(id));
    };
  }, [applyStepState]);

  // Click handler if user wants to click a step directly
  const handleStepClick = (idx) => {
    applyStepState(idx);
  };

  // Ambient drifting particle dots across each tier
  const renderParticles = (count = 16) => (
    <div className="funnel-particles-layer" aria-hidden="true">
      {[...Array(count)].map((_, i) => (
        <span
          key={i}
          className="funnel-particle"
          style={{
            left: `${10 + ((i * 19) % 78)}%`,
            top: `${14 + ((i * 29) % 72)}%`,
            animationDelay: `${(i % 5) * 0.4}s`,
            animationDuration: `${2.8 + (i % 3) * 0.7}s`,
          }}
        />
      ))}
    </div>
  );

  return (
    <section ref={sectionRef} className="funnel-section" id="how-it-works">
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
            {steps.map((st, idx) => {
              const isActive = activeStep === idx;
              return (
                <div
                  key={st.num}
                  className={`funnel-step-item ${
                    isActive ? "funnel-step-item--active" : ""
                  }`}
                  onClick={() => handleStepClick(idx)}
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
              );
            })}
          </div>
        </div>

        {/* ============================================================
            RIGHT COLUMN: 4-STAGE INVERTED TRAPEZOID FUNNEL
            ============================================================ */}
        <div className="funnel-right">
          <div className="funnel-visual">
            {/* Stage 1: REACH */}
            <div
              className={`funnel-tier funnel-tier--1 ${
                activeStep >= 0 ? "funnel-tier--filled-lime" : ""
              }`}
              onClick={() => handleStepClick(0)}
            >
              {renderParticles(22)}
              <div className="funnel-tier__content">
                <div className="funnel-tier__tag">
                  <span className="funnel-tier__num">01</span>
                  <span className="funnel-tier__label">REACH</span>
                </div>
                <div className="funnel-tier__number">
                  {counts.reach.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Stage 2: CLICKS */}
            <div
              className={`funnel-tier funnel-tier--2 ${
                activeStep >= 1 ? "funnel-tier--filled-lime" : ""
              }`}
              onClick={() => handleStepClick(1)}
            >
              {renderParticles(18)}
              <div className="funnel-tier__content">
                <div className="funnel-tier__tag">
                  <span className="funnel-tier__num">02</span>
                  <span className="funnel-tier__label">CLICKS</span>
                </div>
                <div className="funnel-tier__number-wrap">
                  <span className="funnel-tier__number">
                    {counts.clicks.toLocaleString()}
                  </span>

                  {/* Conversion Callout Badge */}
                  {activeStep >= 1 && (
                    <div className="funnel-conversion-badge">
                      <span className="funnel-conversion-badge__dot" />
                      <span className="funnel-conversion-badge__text">
                        ~0.2% become leads
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stage 3: LEADS */}
            <div
              className={`funnel-tier funnel-tier--3 ${
                activeStep >= 2 ? "funnel-tier--filled-lime" : ""
              }`}
              onClick={() => handleStepClick(2)}
            >
              {renderParticles(14)}
              <div className="funnel-tier__content">
                <div className="funnel-tier__tag">
                  <span className="funnel-tier__num">03</span>
                  <span className="funnel-tier__label">LEADS</span>
                </div>
                <div className="funnel-tier__number">
                  {counts.leads.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Stage 4: CLIENTS */}
            <div
              className={`funnel-tier funnel-tier--4 ${
                activeStep >= 3 ? "funnel-tier--filled-lime" : ""
              }`}
              onClick={() => handleStepClick(3)}
            >
              {renderParticles(10)}
              <div className="funnel-tier__content">
                <div className="funnel-tier__tag">
                  <span className="funnel-tier__num">04</span>
                  <span className="funnel-tier__label">CLIENTS</span>
                </div>
                <div className="funnel-tier__number">
                  {counts.clients.toLocaleString()}
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
