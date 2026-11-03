import React, { useState } from 'react';
import { 
  HiPlus, 
  HiEye, 
  HiHeart, 
  HiGlobeAlt, 
  HiMagnifyingGlass, 
  HiCheckCircle, 
  HiPencilSquare 
} from 'react-icons/hi2';
import { 
  RiBrush3Fill, 
  RiMovie2Fill, 
  RiRocket2Fill, 
  RiDeleteBin6Line 
} from 'react-icons/ri';
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
              <RiBrush3Fill size={18} />
            </div>
            <div>
              <h2 className="toolbar-title">Graphic Design & Creative Assets</h2>
              <p className="toolbar-desc">Update posters, brand identities, packaging and social media images</p>
            </div>
          </div>

          <div className="toolbar-right">
            <div className="toolbar-search">
              <HiMagnifyingGlass size={16} />
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
              <HiPlus size={16} />
              <span>Upload Graphic Image</span>
            </button>
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
                    <HiPencilSquare size={14} />
                  </button>
                  <button 
                    className="card-action-btn delete-btn" 
                    onClick={() => onDeleteItem('graphic', item.id)}
                    title="Remove asset"
                  >
                    <RiDeleteBin6Line size={14} />
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
                  <HiPencilSquare size={13} />
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
              <RiMovie2Fill size={18} />
            </div>
            <div>
              <h2 className="toolbar-title">Video Cinema & Reels Production</h2>
              <p className="toolbar-desc">Update video reels, client campaigns, categories and engagement statistics</p>
            </div>
          </div>

          <div className="toolbar-right">
            <div className="toolbar-search">
              <HiMagnifyingGlass size={16} />
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
              <HiPlus size={16} />
              <span>Add Video Reel</span>
            </button>
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
                    <RiMovie2Fill size={36} />
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
                    <HiPencilSquare size={14} />
                  </button>
                  <button 
                    className="card-action-btn delete-btn" 
                    onClick={() => onDeleteItem('video', item.id)}
                    title="Remove reel"
                  >
                    <RiDeleteBin6Line size={14} />
                  </button>
                </div>
              </div>

              <div className="video-card__info">
                <span className="video-category-tag">{item.category}</span>
                <h4 className="card-title">{item.title}</h4>
                <span className="client-name">{item.client}</span>
                <div className="video-metrics-bar">
                  <div className="metric-badge">
                    <HiEye size={13} />
                    <span>{item.views || '160K'}</span>
                  </div>
                  <div className="metric-badge">
                    <HiHeart size={13} />
                    <span>{item.likes || '12.4K'}</span>
                  </div>
                </div>

                <button 
                  className="card-quick-edit-link"
                  onClick={() => onEditItem('video', item)}
                >
                  <HiPencilSquare size={13} />
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
              <RiRocket2Fill size={18} />
            </div>
            <div>
              <h2 className="toolbar-title">SEO Rank Growth & Organic Client Dominance</h2>
              <p className="toolbar-desc">Update Google SERP #1 keywords, organic traffic surges, and case study metrics</p>
            </div>
          </div>

          <div className="toolbar-right">
            <div className="toolbar-search">
              <HiMagnifyingGlass size={16} />
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
              <HiPlus size={16} />
              <span>Update SEO Content</span>
            </button>
          </div>
        </div>

        {/* SEO Cases Table / Cards Grid */}
        <div className="seo-grid">
          {filtered.map((item) => (
            <div key={item.id} className="seo-card">
              <div className="seo-card__top">
                <div className="seo-client-block">
                  <div className="seo-icon-box">
                    <HiGlobeAlt size={19} />
                  </div>
                  <div>
                    <h3 className="seo-client-name">{item.client}</h3>
                    <span className="seo-website">{item.website}</span>
                  </div>
                </div>

                <div className="seo-card-top-right">
                  <div className="seo-status-pill">
                    <HiCheckCircle size={14} />
                    <span>{item.status || 'Active #1'}</span>
                  </div>
                  <button 
                    className="card-action-btn edit-btn" 
                    onClick={() => onEditItem('seo', item)}
                    title="Update SEO metrics & keywords"
                  >
                    <HiPencilSquare size={14} />
                  </button>
                  <button 
                    className="card-action-btn delete-btn" 
                    onClick={() => onDeleteItem('seo', item.id)}
                    title="Remove SEO partner"
                  >
                    <RiDeleteBin6Line size={14} />
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
                <HiPencilSquare size={13} />
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
