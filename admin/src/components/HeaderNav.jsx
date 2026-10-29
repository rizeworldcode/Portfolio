import React from 'react';
import { 
  X, 
  Search, 
  Video, 
  TrendingUp, 
  Palette, 
  ExternalLink,
  SlidersHorizontal,
  Plus
} from 'lucide-react';
import './HeaderNav.css';

export default function HeaderNav({ 
  activeTab, 
  setActiveTab, 
  onOpenNewModal,
  onResetView 
}) {
  const navTabs = [
    { id: 'all', label: 'Studio Dynamics', icon: Search },
    { id: 'video', label: 'Video (5175)', icon: Video, url: 'http://localhost:5175/' },
    { id: 'seo', label: 'SEO (5173)', icon: TrendingUp, url: 'http://localhost:5173/' },
    { id: 'graphic', label: 'Graphic (5174)', icon: Palette, url: 'http://localhost:5174/' },
    { id: 'analytics', label: 'Growth Labs', icon: SlidersHorizontal },
  ];

  return (
    <header className="admin-header">
      {/* Left organic title cutout section */}
      <div className="admin-header__left">
        <button 
          className="admin-header__circle-btn" 
          onClick={onResetView}
          title="Reset View / Home"
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        <div className="admin-header__title-capsule">
          <span className="admin-header__title-text">
            <span className="title-orange">Rize</span>
            <span className="title-green">World</span>
            <span className="title-sub"> Studio</span>
          </span>
        </div>
      </div>

      {/* Right pill tabs */}
      <div className="admin-header__right">
        <div className="admin-header__nav-pills">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`nav-pill ${isActive ? 'nav-pill--active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={14} strokeWidth={2.2} className="nav-pill__icon" />
                <span>{tab.label}</span>
                {tab.url && (
                  <a
                    href={tab.url}
                    target="_blank"
                    rel="noreferrer"
                    className="nav-pill__external-link"
                    title={`Open ${tab.label} site`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={11} />
                  </a>
                )}
              </button>
            );
          })}
        </div>

        <button 
          className="admin-header__action-btn"
          onClick={onOpenNewModal}
          title="Add New Project/Reel"
        >
          <Plus size={16} strokeWidth={2.6} />
          <span>New Entry</span>
        </button>
      </div>
    </header>
  );
}
