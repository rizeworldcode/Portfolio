import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./FunnelProcess.css";

export default function FunnelProcess() {
  const [activeStep, setActiveStep] = useState(-1);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [counts, setCounts] = useState({
    reach: 0,
    clicks: 0,
    leads: 0,
    clients: 0,
  });
  const sectionRef = useRef(null);

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

  const targets = {
    reach: 1284300,
    clicks: 48120,
    leads: 2940,
    clients: 312,
  };

  // Helper to animate count of a specific metric
  const animateMetric = (key, targetVal, duration = 800) => {
    const startTime = performance.now();
    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCounts((prev) => ({
        ...prev,
        [key]: Math.floor(targetVal * ease),
      }));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  };

  // Sequential progression matching video 00:12 -> 00:17
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasTriggered) {
          setHasTriggered(true);

          // Step 1: Audit (00:13)
          setTimeout(() => {
            setActiveStep(0);
            animateMetric("reach", targets.reach, 800);
          }, 400);

          // Step 2: Launch (00:14)
          setTimeout(() => {
            setActiveStep(1);
            animateMetric("clicks", targets.clicks, 800);
          }, 1400);

          // Step 3: Optimise (00:15)
          setTimeout(() => {
            setActiveStep(2);
            animateMetric("leads", targets.leads, 700);
          }, 2400);

          // Step 4: Scale (00:16-00:17)
          setTimeout(() => {
            setActiveStep(3);
            animateMetric("clients", targets.clients, 600);
          }, 3300);
        }
      },
      { threshold: 0.35 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasTriggered]);

  const handleStepClick = (idx) => {
    setActiveStep(idx);
    if (idx >= 0 && counts.reach === 0) animateMetric("reach", targets.reach, 600);
    if (idx >= 1 && counts.clicks === 0) animateMetric("clicks", targets.clicks, 600);
    if (idx >= 2 && counts.leads === 0) animateMetric("leads", targets.leads, 600);
    if (idx >= 3 && counts.clients === 0) animateMetric("clients", targets.clients, 600);
  };

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
            {steps.map((st, idx) => (
              <div
                key={st.num}
                className={`funnel-step-item ${
                  activeStep === idx ? "funnel-step-item--active" : ""
                }`}
                onClick={() => handleStepClick(idx)}
                onMouseEnter={() => handleStepClick(idx)}
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
                activeStep >= 0 ? "funnel-tier--filled-lime" : ""
              }`}
              onClick={() => handleStepClick(0)}
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
                  {counts.reach > 0 ? counts.reach.toLocaleString() : "0"}
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
              <div className="funnel-tier__content">
                <div className="funnel-tier__tag">
                  <span className="funnel-tier__num">02</span>
                  <span className="funnel-tier__label">CLICKS</span>
                </div>
                <div className="funnel-tier__number">
                  {counts.clicks > 0 ? counts.clicks.toLocaleString() : "0"}
                </div>

                {/* Video 00:13 badge */}
                {activeStep >= 1 && (
                  <motion.div
                    className="funnel-conversion-badge funnel-conversion-badge--clicks"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <span className="funnel-conversion-badge__dot" />
                    <span className="funnel-conversion-badge__text">
                      ~0.2% become leads
                    </span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Stage 3: LEADS */}
            <div
              className={`funnel-tier funnel-tier--3 ${
                activeStep >= 2 ? "funnel-tier--filled-lime" : ""
              }`}
              onClick={() => handleStepClick(2)}
            >
              <div className="funnel-tier__content">
                <div className="funnel-tier__tag">
                  <span className="funnel-tier__num">03</span>
                  <span className="funnel-tier__label">LEADS</span>
                </div>
                <div className="funnel-tier__number">
                  {counts.leads > 0 ? counts.leads.toLocaleString() : "0"}
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
              <div className="funnel-tier__content">
                <div className="funnel-tier__tag">
                  <span className="funnel-tier__num">04</span>
                  <span className="funnel-tier__label">CLIENTS</span>
                </div>
                <div className="funnel-tier__number">
                  {counts.clients > 0 ? counts.clients.toLocaleString() : "0"}
                </div>

                {/* Conversion Pill Badge - Pops in at step 4 (video 00:17) */}
                {activeStep >= 3 && (
                  <motion.div
                    className="funnel-conversion-badge"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 22 }}
                  >
                    <span className="funnel-conversion-badge__dot" />
                    <span className="funnel-conversion-badge__text">
                      11% become clients
                    </span>
                  </motion.div>
                )}
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
