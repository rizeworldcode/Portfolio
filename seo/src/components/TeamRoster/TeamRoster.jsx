import { useState } from "react";
import "./TeamRoster.css";

export default function TeamRoster() {
  const [activeMember, setActiveMember] = useState(3);

  const team = [
    {
      id: 1,
      name: "Maya Chen",
      role: "STRATEGIST",
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=750&fit=crop",
    },
    {
      id: 2,
      name: "Jordan Reyes",
      role: "SEO",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=750&fit=crop",
    },
    {
      id: 3,
      name: "Amara Okafor",
      role: "SOCIAL",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=750&fit=crop",
    },
    {
      id: 4,
      name: "Liam Novak",
      role: "PAID ADS",
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=750&fit=crop",
    },
    {
      id: 5,
      name: "Sofia Marin",
      role: "CONTENT",
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=750&fit=crop",
    },
    {
      id: 6,
      name: "Theo Park",
      role: "DESIGN LEAD",
      img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=750&fit=crop",
    },
  ];

  return (
    <section className="team-section" id="team">
      <div className="team-container">
        {/* Header */}
        <div className="team-header">
          <div className="team-header__left">
            <div className="team-pill">
              <span className="team-pill__dot" />
              <span className="team-pill__text">(07) Team</span>
            </div>
            <h2 className="team-title">Specialists, not generalists.</h2>
          </div>

          <div className="team-header__right">
            <p className="team-desc">
              Every account gets a senior lead for each channel you choose. No
              juniors learning on your budget. No hand-offs.
            </p>
            <div className="team-meta-row">
              <a href="#meet-team" className="team-btn-all">
                <span>Meet the team</span>
                <span className="team-btn-all__arrow">↗</span>
              </a>
              <span className="team-roster-count">
                SPECIALISTS ROSTER: 04 / 38
              </span>
            </div>
          </div>
        </div>

        {/* Team Cards Carousel / Rail */}
        <div className="team-rail">
          {team.map((m, idx) => (
            <div
              key={m.id}
              className={`team-card ${
                idx === activeMember ? "team-card--active" : ""
              }`}
              onClick={() => setActiveMember(idx)}
            >
              <div className="team-card__image-wrap">
                <img src={m.img} alt={m.name} className="team-card__img" />
                <span className="team-card__role-tag">{m.role}</span>
              </div>
              <div className="team-card__info">
                <h4 className="team-card__name">{m.name}</h4>
                <span className="team-card__role-text">{m.role} specialist</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
