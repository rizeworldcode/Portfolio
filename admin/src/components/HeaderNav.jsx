import React from 'react';
import { 
  Sparkles, 
  Layers, 
  Palette, 
  Video, 
  TrendingUp, 
  Plus, 
  ExternalLink,
  RotateCcw,
  Zap
} from 'lucide-react';
import './HeaderNav.css';

export default function HeaderNav({ 
  activeTab, 
  setActiveTab, 
  onResetView,
  onOpenModalWithMode
}) {
  const navTabs = [
    { id: 'all', label: 'All Portfolios', icon: Layers, portUrl: null },
    { id: 'graphic', label: 'Graphic Studio', icon: Palette, portUrl: 'http://localhost:5174/', port: '5174' },
    { id: 'video', label: 'Video Reels', icon: Video, portUrl: 'http://localhost:5175/', port: '5175' },
    { id: 'seo', label: 'SEO & Rankings', icon: TrendingUp, portUrl: 'http://localhost:5173/', port: '5173' },
  ];

  return (
    <header className="luxury-navbar">
      {/* Left side: Brand Mark & Identity */}
      <div className="navbar__brand-area">
        <button 
          className="navbar__logo-btn" 
          onClick={onResetView}
          title="Reset to All Portfolios View"
        >
          <div className="logo-badge-icon">
            <Sparkles size={16} strokeWidth={2.4} />
          </div>
          <div className="brand-text-block">
            <span className="brand-title">
              <span className="brand-title__rize">Rize</span>
              <span className="brand-title__world">World</span>
            </span>
            <span className="brand-suite-tag">Studio Pro</span>
          </div>
        </button>

        <div className="navbar__divider" />

        <div className="live-status-pill" title="All 3 micro-portfolios are online">
          <span className="live-dot" />
          <span className="live-text">3 Live Ports</span>
        </div>
      </div>

      {/* Center: Segmented Navigation Pills */}
      <nav className="navbar__segmented-tabs">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`segmented-tab ${isActive ? 'segmented-tab--active' : ''} segmented-tab--${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={14} strokeWidth={isActive ? 2.4 : 2} className="tab-icon" />
              <span className="tab-label">{tab.label}</span>
              {tab.portUrl && (
                <a
                  href={tab.portUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="tab-port-badge"
                  title={`Launch live port at ${tab.portUrl}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>:{tab.port}</span>
                  <ExternalLink size={9} strokeWidth={2.5} />
                </a>
              )}
            </button>
          );
        })}
      </nav>

      {/* Right side: Quick Action Buttons */}
      <div className="navbar__actions-area">
        <button 
          className="action-btn action-btn--graphic"
          onClick={() => onOpenModalWithMode('graphic')}
          title="Upload new graphic poster or artwork"
        >
          <Plus size={14} strokeWidth={2.6} />
          <span>+ Graphic</span>
        </button>
        <button 
          className="action-btn action-btn--video"
          onClick={() => onOpenModalWithMode('video')}
          title="Add new video reel"
        >
          <Plus size={14} strokeWidth={2.6} />
          <span>+ Reel</span>
        </button>
        <button 
          className="action-btn action-btn--seo"
          onClick={() => onOpenModalWithMode('seo')}
          title="Add or update SEO keyword performance"
        >
          <Plus size={14} strokeWidth={2.6} />
          <span>+ SEO</span>
        </button>

        <button 
          className="navbar-icon-btn"
          onClick={onResetView}
          title="Refresh / Reset Layout"
        >
          <RotateCcw size={14} strokeWidth={2.2} />
        </button>
      </div>
    </header>
  );
}

