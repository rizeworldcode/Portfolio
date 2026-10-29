import React from 'react';
import { 
  Sliders, 
  Palette, 
  Video, 
  TrendingUp, 
  Layers 
} from 'lucide-react';
import './StatsBar.css';

export default function StatsBar({ 
  selectedPortfolio,
  onSelectPortfolio,
  graphicsCount = 42,
  videosCount = 28,
  seoCount = 14
}) {
  const subFilters = [
    { id: 'all', label: `All Portfolios (${graphicsCount + videosCount + seoCount})`, icon: Layers },
    { id: 'graphic', label: `🎨 Graphic Design (${graphicsCount})`, icon: Palette },
    { id: 'video', label: `🎬 Video Reels (${videosCount})`, icon: Video },
    { id: 'seo', label: `🚀 SEO & Rankings (${seoCount})`, icon: TrendingUp },
  ];

  return (
    <section className="stats-bar">
      <div className="stats-bar__top">
        {/* Profile Card */}
        <div className="stats-bar__profile-card">
          <div className="profile-card__avatar-wrap">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
              alt="Rize Director" 
              className="profile-card__avatar"
            />
            <span className="profile-card__online-dot" />
          </div>
          <div className="profile-card__info">
            <span className="profile-card__role">Rize Admin</span>
            <span className="profile-card__name">Studio Director</span>
          </div>
        </div>

        {/* Primary Status Title */}
        <div className="stats-bar__status-block">
          <span className="status-block__label">Active Portfolio Manager</span>
          <h2 className="status-block__title">
            {selectedPortfolio === 'all' && 'RizeWorld Multi-Portfolio Studio'}
            {selectedPortfolio === 'graphic' && 'Graphic Design, Posters & Branding'}
            {selectedPortfolio === 'video' && 'Video Cinema & Reels Production'}
            {selectedPortfolio === 'seo' && 'SEO Rank Dominance & Keywords'}
          </h2>
        </div>

        {/* 4 Dynamic Metrics Columns for RizeWorld */}
        <div className="stats-bar__metrics-row">
          <div className="metric-col">
            <span className="metric-col__label">Graphic Assets</span>
            <div className="metric-col__value-row">
              <span className="metric-col__number">{graphicsCount}</span>
              <span className="metric-col__unit">designs</span>
            </div>
          </div>

          <div className="metric-col">
            <span className="metric-col__label">Video Views</span>
            <div className="metric-col__value-row">
              <span className="metric-col__number">2.4M</span>
              <span className="metric-col__unit">views</span>
            </div>
          </div>

          <div className="metric-col">
            <span className="metric-col__label">SEO Rankings</span>
            <div className="metric-col__value-row">
              <span className="metric-col__number">85+</span>
              <span className="metric-col__unit">#1 ranks</span>
            </div>
          </div>

          <div className="metric-col">
            <span className="metric-col__label">Active Portfolios</span>
            <div className="metric-col__value-row">
              <span className="metric-col__number">3</span>
              <span className="metric-col__unit">live ports</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-pill filters row */}
      <div className="stats-bar__bottom">
        <button className="sub-filter-icon-btn" title="Portfolio Selector">
          <Sliders size={14} strokeWidth={2.4} />
        </button>

        <div className="stats-bar__sub-pills">
          {subFilters.map((sub) => {
            const isActive = selectedPortfolio === sub.id;
            return (
              <button
                key={sub.id}
                className={`sub-pill ${isActive ? 'sub-pill--active' : ''}`}
                onClick={() => onSelectPortfolio(sub.id)}
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
