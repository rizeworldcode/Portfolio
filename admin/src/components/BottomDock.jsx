import React from 'react';
import { 
  Calendar, 
  Video, 
  TrendingUp, 
  Palette, 
  Layers, 
  Activity, 
  BarChart3, 
  ExternalLink,
  ShieldAlert,
  Sliders
} from 'lucide-react';
import './BottomDock.css';

export default function BottomDock({ 
  activeTab, 
  setActiveTab 
}) {
  const dockItems = [
    { id: 'all', icon: Layers, badge: 84, label: 'All Items' },
    { id: 'video', icon: Video, badge: 28, label: 'Video (5175)' },
    { id: 'seo', icon: TrendingUp, badge: 14, label: 'SEO (5173)' },
    { id: 'graphic', icon: Palette, badge: 42, label: 'Graphic (5174)' },
    { id: 'analytics', icon: Activity, badge: 3, label: 'Live Metrics' },
  ];

  return (
    <div className="bottom-dock-wrapper">
      <div className="bottom-dock">
        {/* Calendar Year Pill */}
        <div className="bottom-dock__year-pill">
          <Calendar size={14} strokeWidth={2.4} />
          <span>2026</span>
        </div>

        {/* Center Icons with Yellow Badge Counters */}
        <div className="bottom-dock__items">
          {dockItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`dock-btn ${isActive ? 'dock-btn--active' : ''}`}
                onClick={() => setActiveTab(item.id)}
                title={item.label}
              >
                <Icon size={16} strokeWidth={2.2} />
                {item.badge && (
                  <span className="dock-btn__badge">{item.badge}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Dark Capsule for Quick Launch to Ports */}
        <div className="bottom-dock__dark-capsule">
          <a 
            href="http://localhost:5175/" 
            target="_blank" 
            rel="noreferrer"
            className="dock-launch-link"
            title="Launch Video Portfolio (5175)"
          >
            <span>Video</span>
            <ExternalLink size={10} />
          </a>
          <span className="capsule-divider" />
          <a 
            href="http://localhost:5173/" 
            target="_blank" 
            rel="noreferrer"
            className="dock-launch-link"
            title="Launch SEO Portfolio (5173)"
          >
            <span>SEO</span>
            <ExternalLink size={10} />
          </a>
          <span className="capsule-divider" />
          <a 
            href="http://localhost:5174/" 
            target="_blank" 
            rel="noreferrer"
            className="dock-launch-link"
            title="Launch Graphic Portfolio (5174)"
          >
            <span>Graphic</span>
            <ExternalLink size={10} />
          </a>
        </div>
      </div>
    </div>
  );
}
