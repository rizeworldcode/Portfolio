import React from 'react';
import { 
  Palette, 
  Video, 
  TrendingUp, 
  Plus, 
  ExternalLink, 
  Eye, 
  Heart, 
  Globe, 
  CheckCircle2, 
  Edit3, 
  Trash2,
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';
import './MasterOverview.css';

export default function MasterOverview({ 
  graphicsData, 
  videosData, 
  seoData, 
  onOpenModalWithMode,
  onEditItem,
  onDeleteItem,
  onSelectPortfolio
}) {
  return (
    <div className="master-overview-container">
      {/* 3 Major Portfolios Action Hub Cards */}
      <div className="portfolio-hub-cards">
        
        {/* CARD 1: GRAPHIC PORTFOLIO */}
        <div className="hub-card hub-card--graphic">
          <div className="hub-card__top">
            <div className="hub-card__badge-icon palette-icon">
              <Palette size={18} />
            </div>
            <div className="hub-card__header-text">
              <span className="hub-card__tag">Graphic Studio (Port 5174)</span>
              <h3 className="hub-card__title">Graphic Images & Posters</h3>
            </div>
            <a 
              href="http://localhost:5174/" 
              target="_blank" 
              rel="noreferrer" 
              className="hub-live-link" 
              title="Launch Live Graphic Portfolio"
            >
              <span>5174</span>
              <ExternalLink size={10} />
            </a>
          </div>

          <div className="hub-card__preview-banner">
            <img 
              src={graphicsData[0]?.image || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80"} 
              alt="Latest Graphic" 
              className="hub-preview-img"
            />
            <div className="hub-preview-overlay">
              <span className="hub-preview-title">{graphicsData[0]?.title || "Latest Artwork"}</span>
              <span className="hub-preview-sub">{graphicsData.length} Creatives Live</span>
            </div>
          </div>

          <div className="hub-card__action-row">
            <button 
              className="hub-btn hub-btn--palette"
              onClick={() => onOpenModalWithMode('graphic')}
            >
              <Plus size={15} strokeWidth={2.4} />
              <span>Upload Graphic Image</span>
            </button>
            <button 
              className="hub-btn-secondary"
              onClick={() => onSelectPortfolio('graphic')}
            >
              <span>Manage ({graphicsData.length})</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* CARD 2: VIDEO REELS PORTFOLIO */}
        <div className="hub-card hub-card--video">
          <div className="hub-card__top">
            <div className="hub-card__badge-icon video-icon">
              <Video size={18} />
            </div>
            <div className="hub-card__header-text">
              <span className="hub-card__tag">Video Studio (Port 5175)</span>
              <h3 className="hub-card__title">Video Reels Production</h3>
            </div>
            <a 
              href="http://localhost:5175/" 
              target="_blank" 
              rel="noreferrer" 
              className="hub-live-link" 
              title="Launch Live Video Portfolio"
            >
              <span>5175</span>
              <ExternalLink size={10} />
            </a>
          </div>

          <div className="hub-card__preview-banner video-banner">
            {videosData[0]?.video ? (
              <video 
                src={videosData[0].video} 
                className="hub-preview-video" 
                muted 
                playsInline 
                preload="metadata"
              />
            ) : (
              <div className="hub-video-placeholder">
                <Video size={36} />
              </div>
            )}
            <div className="hub-preview-overlay">
              <span className="hub-preview-title">{videosData[0]?.title || "Featured Reel"}</span>
              <span className="hub-preview-sub">{videosData.length} Reels Published (2.4M Views)</span>
            </div>
          </div>

          <div className="hub-card__action-row">
            <button 
              className="hub-btn hub-btn--video"
              onClick={() => onOpenModalWithMode('video')}
            >
              <Plus size={15} strokeWidth={2.4} />
              <span>Add Video Reel</span>
            </button>
            <button 
              className="hub-btn-secondary"
              onClick={() => onSelectPortfolio('video')}
            >
              <span>Manage ({videosData.length})</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* CARD 3: SEO CONTENT PORTFOLIO */}
        <div className="hub-card hub-card--seo">
          <div className="hub-card__top">
            <div className="hub-card__badge-icon seo-icon">
              <TrendingUp size={18} />
            </div>
            <div className="hub-card__header-text">
              <span className="hub-card__tag">SEO Studio (Port 5173)</span>
              <h3 className="hub-card__title">SEO Keywords & Ranks</h3>
            </div>
            <a 
              href="http://localhost:5173/" 
              target="_blank" 
              rel="noreferrer" 
              className="hub-live-link" 
              title="Launch Live SEO Portfolio"
            >
              <span>5173</span>
              <ExternalLink size={10} />
            </a>
          </div>

          <div className="hub-card__preview-banner seo-banner">
            <div className="seo-banner-content">
              <div className="seo-banner-badge">
                <CheckCircle2 size={13} />
                <span>#1 Google Positions</span>
              </div>
              <h4 className="seo-banner-headline">{seoData[0]?.topKeyword || "Top Ranking Keywords"}</h4>
              <div className="seo-banner-growth">
                <span className="growth-number">{seoData[0]?.organicGrowth || "+420%"}</span>
                <span className="growth-label">Average Traffic Growth</span>
              </div>
            </div>
          </div>

          <div className="hub-card__action-row">
            <button 
              className="hub-btn hub-btn--seo"
              onClick={() => onOpenModalWithMode('seo')}
            >
              <Plus size={15} strokeWidth={2.4} />
              <span>Update SEO Content</span>
            </button>
            <button 
              className="hub-btn-secondary"
              onClick={() => onSelectPortfolio('seo')}
            >
              <span>Manage ({seoData.length})</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

      </div>

      {/* Live Items Quick Update & Edit Section */}
      <div className="recent-assets-section">
        <div className="recent-header">
          <div className="recent-header-left">
            <Layers size={16} className="recent-icon" />
            <h3 className="recent-title">Live Portfolio Assets (Click to Update)</h3>
          </div>
          <span className="recent-counter">{graphicsData.length + videosData.length + seoData.length} Total Items</span>
        </div>

        <div className="quick-items-grid">
          {/* Top Graphic Items */}
          {graphicsData.slice(0, 2).map((item) => (
            <div key={item.id} className="quick-item-card" onClick={() => onEditItem('graphic', item)}>
              <span className="quick-tag graphic-tag">🎨 Graphic</span>
              <h4 className="quick-item-title">{item.title}</h4>
              <span className="quick-client">{item.client} • {item.format}</span>
              <div className="quick-card-footer">
                <button className="quick-update-btn">
                  <Edit3 size={11} />
                  <span>Update Graphic</span>
                </button>
              </div>
            </div>
          ))}

          {/* Top Video Reels */}
          {videosData.slice(0, 2).map((item) => (
            <div key={item.id} className="quick-item-card" onClick={() => onEditItem('video', item)}>
              <span className="quick-tag video-tag">🎬 Video Reel</span>
              <h4 className="quick-item-title">{item.title}</h4>
              <span className="quick-client">{item.client} • {item.category}</span>
              <div className="quick-card-footer">
                <button className="quick-update-btn">
                  <Edit3 size={11} />
                  <span>Update Reel</span>
                </button>
              </div>
            </div>
          ))}

          {/* Top SEO Accounts */}
          {seoData.slice(0, 2).map((item) => (
            <div key={item.id} className="quick-item-card" onClick={() => onEditItem('seo', item)}>
              <span className="quick-tag seo-tag">🚀 SEO Account</span>
              <h4 className="quick-item-title">{item.client}</h4>
              <span className="quick-client">{item.topKeyword} ({item.organicGrowth})</span>
              <div className="quick-card-footer">
                <button className="quick-update-btn">
                  <Edit3 size={11} />
                  <span>Update SEO</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
