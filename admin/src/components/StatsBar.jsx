import React from 'react';
import { 
  Sliders, 
  Activity, 
  Eye, 
  Flame, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2 
} from 'lucide-react';
import './StatsBar.css';

export default function StatsBar({ 
  filterSub, 
  setFilterSub, 
  selectedPortfolio 
}) {
  const subFilters = [
    { id: 'all-works', label: 'All Portfolios' },
    { id: 'video-reels', label: 'Video Reels (28)' },
    { id: 'seo-audits', label: 'SEO Audits (14)' },
    { id: 'brand-kits', label: 'Brand Kits (42)' },
    { id: 'client-roster', label: 'Client Roster' },
    { id: 'live-stream', label: 'Live Stream' },
  ];

  return (
    <section className="stats-bar">
      <div className="stats-bar__top">
        {/* Profile Card */}
        <div className="stats-bar__profile-card">
          <div className="profile-card__avatar-wrap">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
              alt="Creative Director" 
              className="profile-card__avatar"
            />
            <span className="profile-card__online-dot" />
          </div>
          <div className="profile-card__info">
            <span className="profile-card__role">Portfolio Director</span>
            <span className="profile-card__name">Rize Studio Admin</span>
          </div>
        </div>

        {/* Diagnosis / Primary Status Title */}
        <div className="stats-bar__status-block">
          <span className="status-block__label">Current Production Cycle</span>
          <h2 className="status-block__title">
            {selectedPortfolio === 'all' && 'Multi-Portfolio Production'}
            {selectedPortfolio === 'video' && 'Video Cinema & Reels Hub'}
            {selectedPortfolio === 'seo' && 'SEO Organic Domination'}
            {selectedPortfolio === 'graphic' && 'Brand Identity & Visuals'}
            {selectedPortfolio === 'analytics' && 'Growth Intelligence Labs'}
          </h2>
        </div>

        {/* Dynamic Metric Columns */}
        <div className="stats-bar__metrics-row">
          <div className="metric-col">
            <span className="metric-col__label">Total Reach</span>
            <div className="metric-col__value-row">
              <span className="metric-col__number">2.4M</span>
              <span className="metric-col__unit">views</span>
            </div>
          </div>

          <div className="metric-col">
            <span className="metric-col__label">Audience CTR</span>
            <div className="metric-col__value-row">
              <span className="metric-col__number">14.8</span>
              <span className="metric-col__unit">/20</span>
            </div>
          </div>

          <div className="metric-col">
            <span className="metric-col__label">SEO Health</span>
            <div className="metric-col__value-row">
              <span className="metric-col__number">98</span>
              <span className="metric-col__unit">%</span>
            </div>
          </div>

          <div className="metric-col">
            <span className="metric-col__label">System Uptime</span>
            <div className="metric-col__value-row">
              <span className="metric-col__number">99.9</span>
              <span className="metric-col__unit">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-pill filters row */}
      <div className="stats-bar__bottom">
        <button className="sub-filter-icon-btn" title="Filter Controls">
          <Sliders size={14} strokeWidth={2.4} />
        </button>

        <div className="stats-bar__sub-pills">
          {subFilters.map((sub) => {
            const isActive = filterSub === sub.id;
            return (
              <button
                key={sub.id}
                className={`sub-pill ${isActive ? 'sub-pill--active' : ''}`}
                onClick={() => setFilterSub(sub.id)}
              >
                {sub.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
