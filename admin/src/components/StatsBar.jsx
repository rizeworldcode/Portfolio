import React from 'react';
import { 
  Sliders, 
  Palette, 
  Video, 
  TrendingUp, 
  Layers,
  ArrowUpRight,
  Activity,
  Globe2
} from 'lucide-react';
import './StatsBar.css';

export default function StatsBar({ 
  selectedPortfolio,
  onSelectPortfolio,
  graphicsCount = 4,
  videosCount = 5,
  seoCount = 4
}) {
  const subFilters = [
    { id: 'all', label: `All Portfolios (${graphicsCount + videosCount + seoCount})`, icon: Layers },
    { id: 'graphic', label: `🎨 Graphic Design (${graphicsCount})`, icon: Palette },
    { id: 'video', label: `🎬 Video Reels (${videosCount})`, icon: Video },
    { id: 'seo', label: `🚀 SEO & Rankings (${seoCount})`, icon: TrendingUp },
  ];

  return (
    <section className="luxury-stats-bar">
      {/* Top Row: User & Studio Header */}
      <div className="stats-header-row">
        <div className="stats-user-card">
          <div className="stats-avatar-wrap">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
              alt="Studio Director" 
              className="stats-avatar"
            />
            <span className="stats-online-ring" />
          </div>
          <div className="stats-user-text">
            <span className="stats-user-title">Studio Director</span>
            <span className="stats-user-name">RizeWorld Admin</span>
          </div>
        </div>

        <div className="stats-headline-block">
          <div className="stats-headline-badge">
            <Activity size={12} className="pulse-icon" />
            <span>Creative Operations Hub</span>
          </div>
          <h1 className="stats-headline-title">
            {selectedPortfolio === 'all' && 'RizeWorld Multi-Portfolio Studio'}
            {selectedPortfolio === 'graphic' && 'Graphic Design, Posters & Branding'}
            {selectedPortfolio === 'video' && 'Video Cinema & Reels Production'}
            {selectedPortfolio === 'seo' && 'SEO Rank Dominance & Keywords'}
          </h1>
        </div>

        <div className="stats-quick-filters">
          <div className="sub-filters-pills">
            {subFilters.map((sub) => {
              const isActive = selectedPortfolio === sub.id;
              return (
                <button
                  key={sub.id}
                  className={`sub-filter-pill ${isActive ? 'sub-filter-pill--active' : ''}`}
                  onClick={() => onSelectPortfolio(sub.id)}
                >
                  {sub.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Metric Cards 4-Column Grid (Apple / Stripe KPI cards) */}
      <div className="stats-kpi-grid">
        {/* KPI 1: Graphic Design */}
        <div 
          className={`kpi-card kpi-card--graphic ${selectedPortfolio === 'graphic' ? 'kpi-card--selected' : ''}`}
          onClick={() => onSelectPortfolio('graphic')}
          title="Click to focus Graphic Studio"
        >
          <div className="kpi-card__top">
            <span className="kpi-card__label">Graphic Assets</span>
            <span className="kpi-card__trend trend-green">
              <ArrowUpRight size={11} strokeWidth={2.6} />
              <span>+18%</span>
            </span>
          </div>
          <div className="kpi-card__main">
            <span className="kpi-card__number">{graphicsCount}</span>
            <span className="kpi-card__unit">creatives live</span>
          </div>
          <div className="kpi-card__footer">
            <span className="kpi-card__subtext">Posters, square art & identity</span>
            <div className="kpi-mini-bar graphic-bar">
              <div className="kpi-bar-fill" style={{ width: '78%' }} />
            </div>
          </div>
        </div>

        {/* KPI 2: Video Reels */}
        <div 
          className={`kpi-card kpi-card--video ${selectedPortfolio === 'video' ? 'kpi-card--selected' : ''}`}
          onClick={() => onSelectPortfolio('video')}
          title="Click to focus Video Reels Studio"
        >
          <div className="kpi-card__top">
            <span className="kpi-card__label">Reels Impressions</span>
            <span className="kpi-card__trend trend-orange">
              <ArrowUpRight size={11} strokeWidth={2.6} />
              <span>+34%</span>
            </span>
          </div>
          <div className="kpi-card__main">
            <span className="kpi-card__number">2.4M</span>
            <span className="kpi-card__unit">views streamed</span>
          </div>
          <div className="kpi-card__footer">
            <span className="kpi-card__subtext">{videosCount} active reels cataloged</span>
            <div className="kpi-mini-bar video-bar">
              <div className="kpi-bar-fill" style={{ width: '92%' }} />
            </div>
          </div>
        </div>

        {/* KPI 3: SEO Dominance */}
        <div 
          className={`kpi-card kpi-card--seo ${selectedPortfolio === 'seo' ? 'kpi-card--selected' : ''}`}
          onClick={() => onSelectPortfolio('seo')}
          title="Click to focus SEO Dominance"
        >
          <div className="kpi-card__top">
            <span className="kpi-card__label">Keyword Dominance</span>
            <span className="kpi-card__trend trend-green">
              <ArrowUpRight size={11} strokeWidth={2.6} />
              <span>98.4%</span>
            </span>
          </div>
          <div className="kpi-card__main">
            <span className="kpi-card__number">85+</span>
            <span className="kpi-card__unit">#1 Google ranks</span>
          </div>
          <div className="kpi-card__footer">
            <span className="kpi-card__subtext">{seoCount} key client partners</span>
            <div className="kpi-mini-bar seo-bar">
              <div className="kpi-bar-fill" style={{ width: '85%' }} />
            </div>
          </div>
        </div>

        {/* KPI 4: Studio Health & Active Ports */}
        <div 
          className="kpi-card kpi-card--status"
          onClick={() => onSelectPortfolio('all')}
          title="Click for All Portfolios"
        >
          <div className="kpi-card__top">
            <span className="kpi-card__label">Studio Ecosystem</span>
            <span className="kpi-card__trend trend-blue">
              <Globe2 size={11} />
              <span>100% Up</span>
            </span>
          </div>
          <div className="kpi-card__main">
            <span className="kpi-card__number">3</span>
            <span className="kpi-card__unit">micro-ports live</span>
          </div>
          <div className="kpi-card__footer">
            <div className="port-chips-row">
              <span className="port-chip">:5174 Graphic</span>
              <span className="port-chip">:5175 Reel</span>
              <span className="port-chip">:5173 SEO</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

