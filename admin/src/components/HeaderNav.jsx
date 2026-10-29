import React from 'react';
import { 
  X, 
  Layers, 
  Palette, 
  Video, 
  TrendingUp, 
  Plus, 
  ExternalLink 
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
    { id: 'graphic', label: 'Graphic Design', icon: Palette, portUrl: 'http://localhost:5174/' },
    { id: 'video', label: 'Video Reels', icon: Video, portUrl: 'http://localhost:5175/' },
    { id: 'seo', label: 'SEO & Rankings', icon: TrendingUp, portUrl: 'http://localhost:5173/' },
  ];

  return (
    <header className="dark-navbar-bar">
      {/* Left side: [X] button + Organic Curved "RizeWorld" Cutout Tab */}
      <div className="dark-navbar__left">
        <button 
          className="dark-navbar__close-btn" 
          onClick={onResetView}
          title="Reset View / Home"
        >
          <X size={15} strokeWidth={2.4} />
        </button>

        {/* Organic curved tab rising up into the dark bar */}
        <div className="organic-tab-container">
          <svg 
            className="organic-tab-svg" 
            viewBox="0 0 240 56" 
            preserveAspectRatio="none"
          >
            <path 
              d="M 0,56 L 0,18 C 0,8 8,0 18,0 L 175,0 C 190,0 200,8 208,22 C 216,36 224,56 240,56 Z" 
              fill="#e9e9e4" 
            />
          </svg>

          {/* RizeWorld Title with brand accent colors */}
          <span className="organic-tab-title">
            <span style={{ color: '#ff6b35' }}>Rize</span>
            <span style={{ color: '#22c55e' }}>World</span>
          </span>
        </div>
      </div>

      {/* Right side: RizeWorld Portfolio Pills & Quick Action Buttons */}
      <div className="dark-navbar__right">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`dark-nav-pill ${isActive ? 'dark-nav-pill--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={14} strokeWidth={2.2} className="dark-nav-pill__icon" />
              <span>{tab.label}</span>
              {tab.portUrl && (
                <a
                  href={tab.portUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="dark-nav-pill__link"
                  title={`Open live portfolio at ${tab.portUrl}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={9} />
                </a>
              )}
            </button>
          );
        })}

        {/* Quick Add Buttons on Navbar */}
        <div className="navbar-quick-actions">
          <button 
            className="quick-action-btn quick-action-btn--graphic"
            onClick={() => onOpenModalWithMode('graphic')}
            title="Upload new graphic image or poster"
          >
            <Plus size={13} strokeWidth={2.6} />
            <span>+ Graphic</span>
          </button>
          <button 
            className="quick-action-btn quick-action-btn--video"
            onClick={() => onOpenModalWithMode('video')}
            title="Add new video reel"
          >
            <Plus size={13} strokeWidth={2.6} />
            <span>+ Reel</span>
          </button>
          <button 
            className="quick-action-btn quick-action-btn--seo"
            onClick={() => onOpenModalWithMode('seo')}
            title="Update SEO keywords and ranking content"
          >
            <Plus size={13} strokeWidth={2.6} />
            <span>+ SEO</span>
          </button>
        </div>
      </div>
    </header>
  );
}
