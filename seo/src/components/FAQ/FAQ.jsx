import { useState } from "react";
import "./FAQ.css";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      num: "01",
      tag: "GENERAL",
      q: "How long until we see results?",
      a: "Paid ads show results in the first two weeks. Social grows month by month. SEO usually moves in 3 to 5 months, and we show progress in every report.",
    },
    {
      num: "02",
      tag: "PROCESS",
      q: "Do we have to sign a long contract?",
      a: "No long contracts. Everything runs on simple 30-day rolling retainers. You can scale, pause, or cancel with 30 days notice anytime.",
    },
    {
      num: "03",
      tag: "PRICING",
      q: "Is ad spend included in the price?",
      a: "No, ad spend is paid directly to the platforms (Google, Meta, TikTok) from your own credit card, ensuring you retain 100% ownership of your accounts and pixel data.",
    },
    {
      num: "04",
      tag: "GENERAL",
      q: "Which industries do you work with?",
      a: "We work with local clinics, specialty medical practices, luxury real estate, high-ticket legal services, modern e-commerce brands, and local cafés looking to dominate their market.",
    },
    {
      num: "05",
      tag: "PROCESS",
      q: "How do you report results?",
      a: "Every month you get a plain-number video walkthrough and live dashboard report. We report pipeline revenue, leads generated, and cost per acquisition—not just vanity impressions.",
    },
    {
      num: "06",
      tag: "TEAM",
      q: "Can you work with our in-house team?",
      a: "Yes. Many of our clients have an in-house designer or marketing coordinator. We plug in directly as the senior growth strategists, handling execution and technical heavy-lifting.",
    },
    {
      num: "07",
      tag: "GENERAL",
      q: "What happens on the first call?",
      a: "A 30-minute strategic review of your site, competitor rankings, and paid ads history. We map the fastest growth opportunities, and you keep the action plan whether we partner or not.",
    },
  ];

  return (
    <section className="faq-section" id="faq">
      <div className="faq-container">
        {/* Left Column: Heading & Still Curious Card */}
        <div className="faq-left">
          <div className="faq-pill">
            <span className="faq-pill__dot" />
            <span className="faq-pill__text">(10) FAQ</span>
          </div>

          <h2 className="faq-title">Questions, answered.</h2>

          {/* Still Curious Card */}
          <div className="faq-card-box">
            <div className="faq-card-box__tag">STILL CURIOUS?</div>
            <h3 className="faq-card-box__title">
              Ask us on a free 30-minute call.
            </h3>
            <p className="faq-card-box__desc">
              We look at your site, ads and socials, and you keep the plan either
              way.
            </p>
            <a href="#audit" className="faq-card-box__btn">
              <span>Book a call</span>
              <span>↗</span>
            </a>
            <div className="faq-card-box__footer">
              Or write to <strong>hello@reachwisestudio.com</strong>.
              <span> WE REPLY WITHIN 2 HOURS</span>
            </div>
          </div>
        </div>

        {/* Right Column: Accordion Items */}
        <div className="faq-right">
          <div className="faq-list">
            {faqs.map((f, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={f.num}
                  className={`faq-item ${isOpen ? "faq-item--open" : ""}`}
                >
                  <button
                    type="button"
                    className="faq-item__header"
                    onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  >
                    <div className="faq-item__meta">
                      <span className="faq-item__num">{f.num}</span>
                      <h4 className="faq-item__question">{f.q}</h4>
                    </div>
                    <div className="faq-item__actions">
                      <span className="faq-item__tag">{f.tag}</span>
                      <span className="faq-item__icon">{isOpen ? "−" : "+"}</span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="faq-item__body">
                      <p className="faq-item__answer">{f.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
