import React, { useState } from 'react';
import { 
  Palette, 
  Video, 
  TrendingUp, 
  Plus, 
  ExternalLink, 
  Eye, 
  Heart, 
  Globe, 
  Award,
  Sparkles,
  Search,
  CheckCircle2,
  Trash2,
  Edit3
} from 'lucide-react';
import './PortfolioView.css';

export default function PortfolioView({ 
  viewType, 
  graphicsData, 
  videosData, 
  seoData, 
  onOpenModalWithMode,
  onEditItem,
  onDeleteItem
}) {
  const [searchTerm, setSearchTerm] = useState('');

  // 1. GRAPHIC STUDIO VIEW
  if (viewType === 'labs' || viewType === 'graphic') {
    const filtered = graphicsData.filter(g => 
      g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="portfolio-manager-wrap">
        <div className="manager-toolbar">
          <div className="toolbar-left">
            <div className="toolbar-badge-icon palette-bg">
              <Palette size={16} />
            </div>
            <div>
              <h2 className="toolbar-title">Graphic Design & Creative Assets</h2>
              <p className="toolbar-desc">Update posters, brand identities, packaging and social media images</p>
            </div>
          </div>

          <div className="toolbar-right">
            <div className="toolbar-search">
              <Search size={14} />
              <input 
                type="text" 
                placeholder="Search graphic works..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button 
              className="btn-create-action btn-palette"
              onClick={() => onOpenModalWithMode('graphic')}
            >
              <Plus size={16} strokeWidth={2.4} />
              <span>Upload Graphic Image</span>
            </button>

            <a 
              href="http://localhost:5174/" 
              target="_blank" 
              rel="noreferrer" 
              className="btn-live-preview"
              title="Preview Live Graphic Portfolio"
            >
              <span>Live Port: 5174</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Graphics Grid */}
        <div className="graphics-grid">
          {filtered.map((item) => (
            <div key={item.id} className="graphic-card">
              <div className="graphic-card__img-wrap">
                <img src={item.image} alt={item.title} className="graphic-card__img" />
                <span className="graphic-card__format-tag">{item.format || 'Creative'}</span>
                
                {/* Action buttons (Edit & Delete) */}
                <div className="card-top-actions">
                  <button 
                    className="card-action-btn edit-btn" 
                    onClick={() => onEditItem('graphic', item)}
                    title="Edit & update graphic details"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button 
                    className="card-action-btn delete-btn" 
                    onClick={() => onDeleteItem('graphic', item.id)}
                    title="Remove asset"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <div className="graphic-card__info">
                <div className="graphic-card__meta">
                  <span className="card-category">{item.category}</span>
                  <span className="card-date">{item.date}</span>
                </div>
                <h4 className="card-title">{item.title}</h4>
                <div className="card-client-row">
                  <span className="client-label">Client:</span>
                  <span className="client-name">{item.client}</span>
                </div>
                <div className="card-tags-row">
                  {item.tags?.map((t, idx) => (
                    <span key={idx} className="tag-chip">{t}</span>
                  ))}
                </div>

                <button 
                  className="card-quick-edit-link"
                  onClick={() => onEditItem('graphic', item)}
                >
                  <Edit3 size={12} />
                  <span>Update Graphic</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. VIDEO REELS STUDIO VIEW
  if (viewType === 'visits' || viewType === 'video') {
    const filtered = videosData.filter(v => 
      v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="portfolio-manager-wrap">
        <div className="manager-toolbar">
          <div className="toolbar-left">
            <div className="toolbar-badge-icon video-bg">
              <Video size={16} />
            </div>
            <div>
              <h2 className="toolbar-title">Video Cinema & Reels Production</h2>
              <p className="toolbar-desc">Update video reels, client campaigns, categories and engagement statistics</p>
            </div>
          </div>

          <div className="toolbar-right">
            <div className="toolbar-search">
              <Search size={14} />
              <input 
                type="text" 
                placeholder="Search reels..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button 
              className="btn-create-action btn-video"
              onClick={() => onOpenModalWithMode('video')}
            >
              <Plus size={16} strokeWidth={2.4} />
              <span>Add Video Reel</span>
            </button>

            <a 
              href="http://localhost:5175/" 
              target="_blank" 
              rel="noreferrer" 
              className="btn-live-preview"
              title="Preview Live Video Portfolio"
            >
              <span>Live Port: 5175</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Video Reels Grid */}
        <div className="videos-grid">
          {filtered.map((item) => (
            <div key={item.id} className="video-card">
              <div className="video-card__player-wrap">
                {item.video?.endsWith('.mp4') ? (
                  <video 
                    src={item.video} 
                    className="video-card__video" 
                    controls 
                    muted 
                    preload="metadata"
                  />
                ) : (
                  <div className="video-placeholder">
                    <Video size={32} />
                  </div>
                )}
                <span className="video-card__duration-tag">{item.duration || '0:45'}</span>
                
                {/* Actions on Video Card */}
                <div className="card-top-actions">
                  <button 
                    className="card-action-btn edit-btn" 
                    onClick={() => onEditItem('video', item)}
                    title="Edit & update reel details"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button 
                    className="card-action-btn delete-btn" 
                    onClick={() => onDeleteItem('video', item.id)}
                    title="Remove reel"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <div className="video-card__info">
                <span className="video-category-tag">{item.category}</span>
                <h4 className="card-title">{item.title}</h4>
                <span className="client-name">{item.client}</span>
                <div className="video-metrics-bar">
                  <div className="metric-badge">
                    <Eye size={12} />
                    <span>{item.views || '160K'}</span>
                  </div>
                  <div className="metric-badge">
                    <Heart size={12} />
                    <span>{item.likes || '12.4K'}</span>
                  </div>
                </div>

                <button 
                  className="card-quick-edit-link"
                  onClick={() => onEditItem('video', item)}
                >
                  <Edit3 size={12} />
                  <span>Update Reel Content</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3. SEO GROWTH STUDIO VIEW
  if (viewType === 'medications' || viewType === 'seo') {
    const filtered = seoData.filter(s => 
      s.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.topKeyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.website.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="portfolio-manager-wrap">
        <div className="manager-toolbar">
          <div className="toolbar-left">
            <div className="toolbar-badge-icon seo-bg">
              <TrendingUp size={16} />
            </div>
            <div>
              <h2 className="toolbar-title">SEO Rank Growth & Organic Client Dominance</h2>
              <p className="toolbar-desc">Update Google SERP #1 keywords, organic traffic surges, and case study metrics</p>
            </div>
          </div>

          <div className="toolbar-right">
            <div className="toolbar-search">
              <Search size={14} />
              <input 
                type="text" 
                placeholder="Search SEO accounts..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button 
              className="btn-create-action btn-seo"
              onClick={() => onOpenModalWithMode('seo')}
            >
              <Plus size={16} strokeWidth={2.4} />
              <span>Update SEO Content</span>
            </button>

            <a 
              href="http://localhost:5173/" 
              target="_blank" 
              rel="noreferrer" 
              className="btn-live-preview"
              title="Preview Live SEO Portfolio"
            >
              <span>Live Port: 5173</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* SEO Cases Table / Cards Grid */}
        <div className="seo-grid">
          {filtered.map((item) => (
            <div key={item.id} className="seo-card">
              <div className="seo-card__top">
                <div className="seo-client-block">
                  <div className="seo-icon-box">
                    <Globe size={18} />
                  </div>
                  <div>
                    <h3 className="seo-client-name">{item.client}</h3>
                    <span className="seo-website">{item.website}</span>
                  </div>
                </div>

                <div className="seo-card-top-right">
                  <div className="seo-status-pill">
                    <CheckCircle2 size={13} />
                    <span>{item.status || 'Active #1'}</span>
                  </div>
                  <button 
                    className="card-action-btn edit-btn" 
                    onClick={() => onEditItem('seo', item)}
                    title="Update SEO metrics & keywords"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button 
                    className="card-action-btn delete-btn" 
                    onClick={() => onDeleteItem('seo', item.id)}
                    title="Remove SEO partner"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <div className="seo-card__keyword-banner">
                <span className="keyword-label">Dominating Keyword:</span>
                <span className="keyword-text">{item.topKeyword}</span>
                <span className="keyword-badge">{item.googleRank || '#1 Position'}</span>
              </div>

              <div className="seo-card__metrics-row">
                <div className="seo-stat">
                  <span className="seo-stat__val positive-val">{item.organicGrowth}</span>
                  <span className="seo-stat__label">Organic Traffic Lift</span>
                </div>
                <div className="seo-stat">
                  <span className="seo-stat__val">{item.healthScore}</span>
                  <span className="seo-stat__label">SEO Audit Score</span>
                </div>
                <div className="seo-stat">
                  <span className="seo-stat__val">{item.leadsPerMonth}</span>
                  <span className="seo-stat__label">Monthly Conversions</span>
                </div>
              </div>

              <button 
                className="card-quick-edit-link"
                onClick={() => onEditItem('seo', item)}
              >
                <Edit3 size={12} />
                <span>Update SEO Keywords & Metrics</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default: returns null when in overview / timeline view
  return null;
}
