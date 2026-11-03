import React from 'react';
import { 
  Calendar, 
  Video, 
  TrendingUp, 
  Palette, 
  Layers, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import './BottomDock.css';

export default function BottomDock({ 
  activeTab, 
  setActiveTab,
  graphicsCount = 4,
  videosCount = 5,
  seoCount = 4
}) {
  const dockItems = [
    { id: 'all', icon: Layers, badge: graphicsCount + videosCount + seoCount, label: 'All Portfolios', color: 'all' },
    { id: 'graphic', icon: Palette, badge: graphicsCount, label: 'Graphic (Port 5174)', color: 'graphic' },
    { id: 'video', icon: Video, badge: videosCount, label: 'Video (Port 5175)', color: 'video' },
    { id: 'seo', icon: TrendingUp, badge: seoCount, label: 'SEO (Port 5173)', color: 'seo' },
  ];

  return (
    <div className="luxury-dock-container">
      <div className="luxury-dock">
        {/* Calendar / Version Pill */}
        <div className="dock-meta-capsule">
          <Calendar size={13} strokeWidth={2.4} />
          <span>2026 Studio</span>
        </div>

        {/* Center Icons with Color Badges */}
        <div className="dock-nav-group">
          {dockItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`dock-nav-btn ${isActive ? 'dock-nav-btn--active' : ''} dock-nav-btn--${item.color}`}
                onClick={() => setActiveTab(item.id)}
                title={item.label}
              >
                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                {item.badge !== undefined && (
                  <span className={`dock-count-badge badge-${item.color}`}>{item.badge}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Live Port Quick-Launcher */}
        <div className="dock-live-ports-capsule">
          <a 
            href="http://localhost:5174/" 
            target="_blank" 
            rel="noreferrer"
            className="dock-port-link port-graphic"
            title="Launch Graphic Studio Live (Port 5174)"
          >
            <span>Graphic :5174</span>
            <ExternalLink size={9} />
          </a>
          <span className="dock-divider" />
          <a 
            href="http://localhost:5175/" 
            target="_blank" 
            rel="noreferrer"
            className="dock-port-link port-video"
            title="Launch Video Reels Studio Live (Port 5175)"
          >
            <span>Video :5175</span>
            <ExternalLink size={9} />
          </a>
          <span className="dock-divider" />
          <a 
            href="http://localhost:5173/" 
            target="_blank" 
            rel="noreferrer"
            className="dock-port-link port-seo"
            title="Launch SEO Rankings Live (Port 5173)"
          >
            <span>SEO :5173</span>
            <ExternalLink size={9} />
          </a>
        </div>
      </div>
    </div>
  );
}

