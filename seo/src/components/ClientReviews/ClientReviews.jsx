import { motion } from "framer-motion";
import "./ClientReviews.css";

export default function ClientReviews() {
  const notifications = [
    {
      id: 1,
      sender: "Tom Alvarez",
      company: "Haven Realty",
      time: "1m ago",
      badge: "Leads +34%",
      text: "Better leads every week from our own site. We stopped buying leads from portals.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
    {
      id: 2,
      sender: "Priya Nair",
      company: "Lumen Skin",
      time: "14m ago",
      badge: "ROAS 6.2x",
      text: "The first agency that talks about our margins, not just clicks. Net profit doubled in eleven days.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    },
    {
      id: 3,
      sender: "Marcus Vance",
      company: "Kettlebrook Coffee",
      time: "1h ago",
      badge: "Traffic +210%",
      text: "Line out the door on Tuesday morning. What did you change?",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    },
  ];

  return (
    <section className="reviews-section" id="reviews">
      <div className="reviews-container">
        {/* Left Column: Proof & Description */}
        <div className="reviews-left">
          <div className="reviews-pill">
            <span className="reviews-pill__dot" />
            <span className="reviews-pill__text">(08) Client reviews</span>
          </div>

          <div className="reviews-rating-bar">
            <span className="reviews-score">4.9</span>
            <span className="reviews-stars">★★★★★</span>
            <span className="reviews-count">126 CLIENT REVIEWS</span>
          </div>

          <div className="reviews-badges-row">
            <span className="reviews-badge-item">
              <span className="reviews-badge-dot" /> GOOGLE 4.9
            </span>
            <span className="reviews-badge-item">
              <span className="reviews-badge-dot" /> CLUTCH 5.0
            </span>
            <span className="reviews-badge-item">
              <span className="reviews-badge-dot" /> G2 4.9
            </span>
          </div>

          <h2 className="reviews-title">Clients who stayed.</h2>

          <p className="reviews-desc">
            Our average client has been with us for 3.4 years. These are the
            messages that land in our inbox when the numbers move.
          </p>

          <a href="#case-studies" className="reviews-btn-all">
            <span>Read case studies</span>
            <span className="reviews-btn-all__arrow">↗</span>
          </a>
        </div>

        {/* Right Column: Realistic iPhone Notification Chat UI */}
        <div className="reviews-right">
          <motion.div
            className="iphone-mockup"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Dynamic Island / Notch */}
            <div className="iphone-notch">
              <span className="iphone-camera" />
              <span className="iphone-sensor" />
            </div>

            {/* Status Bar */}
            <div className="iphone-status-bar">
              <span className="iphone-time">09:41</span>
              <div className="iphone-icons">
                <span>📶</span>
                <span>5G</span>
                <span>🔋</span>
              </div>
            </div>

            {/* Lock Screen Date & Notification Badge */}
            <div className="iphone-header">
              <span className="iphone-date">Tuesday, 28 September</span>
              <div className="iphone-badge">
                <span className="iphone-badge__dot" />
                <span>3 NEW NOTIFICATIONS</span>
              </div>
            </div>

            {/* Incoming Message Notification Cards */}
            <motion.div
              className="iphone-messages-list"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.25, delayChildren: 0.2 },
                },
              }}
            >
              {notifications.map((n) => (
                <motion.div
                  key={n.id}
                  className="iphone-notif-card"
                  variants={{
                    hidden: { opacity: 0, y: 24, scale: 0.94 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: { type: "spring", stiffness: 320, damping: 24 },
                    },
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="iphone-notif-card__top">
                    <img
                      src={n.avatar}
                      alt={n.sender}
                      className="iphone-notif-avatar"
                    />
                    <div className="iphone-notif-sender-info">
                      <span className="iphone-notif-name">{n.sender}</span>
                      <span className="iphone-notif-company">· {n.company}</span>
                    </div>
                    <span className="iphone-notif-pill">{n.badge}</span>
                    <span className="iphone-notif-time">{n.time}</span>
                  </div>
                  <p className="iphone-notif-text">{n.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
