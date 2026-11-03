import React, { useState } from 'react';
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Video, 
  TrendingUp, 
  Palette, 
  Sparkles, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  Play, 
  Activity, 
  ArrowUpRight,
  Eye,
  CheckCircle2,
  Layers
} from 'lucide-react';
import './CreativeStudioCanvas.css';

export default function CreativeStudioCanvas({ 
  graphicsData, 
  videosData, 
  seoData, 
  onOpenModalWithMode,
  onEditItem,
  onDeleteItem,
  onSelectPortfolio
}) {
  const [graphicIdx, setGraphicIdx] = useState(0);
  const [videoIdx, setVideoIdx] = useState(0);
  const [seoIdx, setSeoIdx] = useState(0);

  const activeGraphic = graphicsData[graphicIdx] || graphicsData[0] || {};
  const activeVideo = videosData[videoIdx] || videosData[0] || {};
  const activeSeo = seoData[seoIdx] || seoData[0] || {};

  const nextGraphic = () => setGraphicIdx(prev => (prev + 1) % Math.max(1, graphicsData.length));
  const prevGraphic = () => setGraphicIdx(prev => (prev - 1 + graphicsData.length) % Math.max(1, graphicsData.length));

  const nextVideo = () => setVideoIdx(prev => (prev + 1) % Math.max(1, videosData.length));
  const prevVideo = () => setVideoIdx(prev => (prev - 1 + videosData.length) % Math.max(1, videosData.length));

  const nextSeo = () => setSeoIdx(prev => (prev + 1) % Math.max(1, seoData.length));
  const prevSeo = () => setSeoIdx(prev => (prev - 1 + seoData.length) % Math.max(1, seoData.length));

  return (
    <div className="luxury-canvas-wrapper">
      <div className="luxury-studio-grid">

        {/* ============================================================
            COLUMN 1: 🎨 GRAPHIC STUDIO (Port 5174)
            ============================================================ */}
        <section className="studio-column studio-column--graphic">
          {/* Column Header */}
          <div className="studio-col-header">
            <div className="col-header-left">
              <div className="col-badge-squircle badge-graphic">
                <span>01</span>
              </div>
              <div className="col-header-meta">
                <div className="col-title-row">
                  <h2 className="col-title" onClick={() => onSelectPortfolio && onSelectPortfolio('graphic')}>
                    Graphic Studio
                  </h2>
                  <span className="col-count-pill">{graphicsData.length} Artworks</span>
                </div>
                <span className="col-subtext">Posters, Brand Identity & Social Creatives</span>
              </div>
            </div>

            <div className="col-header-actions">
              <div className="stepper-controls">
                <button className="stepper-btn" onClick={prevGraphic} title="Previous Graphic">
                  <ChevronLeft size={14} />
                </button>
                <span className="stepper-indicator">{graphicIdx + 1}/{graphicsData.length}</span>
                <button className="stepper-btn" onClick={nextGraphic} title="Next Graphic">
                  <ChevronRight size={14} />
                </button>
              </div>

              <a 
                href="http://localhost:5174/" 
                target="_blank" 
                rel="noreferrer" 
                className="col-port-link"
                title="Launch Live Graphic Portfolio on Port 5174"
              >
                <span>:5174</span>
                <ExternalLink size={10} />
              </a>
            </div>
          </div>

          {/* Quick Item Selection Strip */}
          <div className="item-selection-strip">
            {graphicsData.map((item, idx) => (
              <button
                key={item.id}
                className={`item-selector-pill ${idx === graphicIdx ? 'item-selector-pill--active graphic-active' : ''}`}
                onClick={() => setGraphicIdx(idx)}
              >
                <div className="selector-dot graphic-dot" />
                <span className="selector-title">{item.title}</span>
                <span className="selector-tag">{item.format || 'Art'}</span>
              </button>
            ))}
          </div>

          {/* Spotlight Showcase Card */}
          <div className="spotlight-card spotlight-card--graphic">
            {/* Visual Media Banner */}
            <div className="spotlight-banner-wrap">
              <img 
                src={activeGraphic.image || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80"} 
                alt={activeGraphic.title} 
                className="spotlight-img"
              />
              <div className="banner-top-badges">
                <span className="badge-pill badge-pill--category">🎨 {activeGraphic.category || "Graphic Art"}</span>
                <span className="badge-pill badge-pill--format">{activeGraphic.format || "Poster 4:5"}</span>
              </div>
              <div className="banner-hover-overlay">
                <button 
                  className="banner-action-btn edit-btn"
                  onClick={() => onEditItem('graphic', activeGraphic)}
                  title="Edit Graphic Details"
                >
                  <Edit3 size={13} />
                  <span>Edit Details</span>
                </button>
                {onDeleteItem && (
                  <button 
                    className="banner-action-btn delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Delete "${activeGraphic.title}"?`)) {
                        onDeleteItem('graphic', activeGraphic.id);
                      }
                    }}
                    title="Delete Graphic"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Content & Metadata */}
            <div className="spotlight-content">
              <div className="spotlight-header-meta">
                <span className="spotlight-client">{activeGraphic.client || "Shivaura Jewels"}</span>
                <h3 className="spotlight-title">{activeGraphic.title}</h3>
              </div>

              {/* Engagement Wave Sparkline */}
              <div className="chart-module">
                <div className="chart-module-header">
                  <span className="chart-label">Live Creative Reach</span>
                  <span className="chart-val">4 Creatives Live</span>
                </div>
                <div className="chart-svg-container">
                  <svg className="wave-svg" viewBox="0 0 240 45" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="wave-grad-graphic" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d="M0,32 C40,10 80,36 120,18 C160,2 200,24 240,12 L240,45 L0,45 Z" fill="url(#wave-grad-graphic)" />
                    <path d="M0,32 C40,10 80,36 120,18 C160,2 200,24 240,12" fill="none" stroke="#6366f1" strokeWidth="2.4" />
                  </svg>
                </div>
              </div>

              {/* Footer Meta Row */}
              <div className="spotlight-footer">
                <div className="footer-tag-chip">
                  <CheckCircle2 size={12} className="verified-icon" />
                  <span>Verified Asset</span>
                </div>
                <button 
                  className="quick-edit-link"
                  onClick={() => onEditItem('graphic', activeGraphic)}
                >
                  <Edit3 size={11} />
                  <span>Update</span>
                </button>
              </div>
            </div>
          </div>

          {/* Primary Column Action */}
          <button 
            className="col-primary-btn col-primary-btn--graphic"
            onClick={() => onOpenModalWithMode('graphic')}
          >
            <Plus size={15} strokeWidth={2.8} />
            <span>Upload Graphic Artwork</span>
          </button>
        </section>


        {/* ============================================================
            COLUMN 2: 🎬 VIDEO REELS STUDIO (Port 5175)
            ============================================================ */}
        <section className="studio-column studio-column--video">
          {/* Column Header */}
          <div className="studio-col-header">
            <div className="col-header-left">
              <div className="col-badge-squircle badge-video">
                <span>02</span>
              </div>
              <div className="col-header-meta">
                <div className="col-title-row">
                  <h2 className="col-title" onClick={() => onSelectPortfolio && onSelectPortfolio('video')}>
                    Video Reels Studio
                  </h2>
                  <span className="col-count-pill">{videosData.length} Reels</span>
                </div>
                <span className="col-subtext">Commercial Cinema, Reels & High-Energy Shorts</span>
              </div>
            </div>

            <div className="col-header-actions">
              <div className="stepper-controls">
                <button className="stepper-btn" onClick={prevVideo} title="Previous Reel">
                  <ChevronLeft size={14} />
                </button>
                <span className="stepper-indicator">{videoIdx + 1}/{videosData.length}</span>
                <button className="stepper-btn" onClick={nextVideo} title="Next Reel">
                  <ChevronRight size={14} />
                </button>
              </div>

              <a 
                href="http://localhost:5175/" 
                target="_blank" 
                rel="noreferrer" 
                className="col-port-link"
                title="Launch Live Video Reels Portfolio on Port 5175"
              >
                <span>:5175</span>
                <ExternalLink size={10} />
              </a>
            </div>
          </div>

          {/* Quick Item Selection Strip */}
          <div className="item-selection-strip">
            {videosData.map((item, idx) => (
              <button
                key={item.id}
                className={`item-selector-pill ${idx === videoIdx ? 'item-selector-pill--active video-active' : ''}`}
                onClick={() => setVideoIdx(idx)}
              >
                <div className="selector-dot video-dot" />
                <span className="selector-title">{item.title}</span>
                <span className="selector-tag">{item.views || 'Reel'}</span>
              </button>
            ))}
          </div>

          {/* Spotlight Showcase Card */}
          <div className="spotlight-card spotlight-card--video">
            {/* Visual Media Player Banner */}
            <div className="spotlight-banner-wrap video-banner-wrap">
              {activeVideo.video ? (
                <video 
                  key={activeVideo.video}
                  src={activeVideo.video} 
                  className="spotlight-video"
                  controls 
                  muted 
                  playsInline
                />
              ) : (
                <div className="video-empty-player">
                  <Video size={32} />
                  <span>No video stream loaded</span>
                </div>
              )}
              <div className="banner-top-badges">
                <span className="badge-pill badge-pill--category">🎬 {activeVideo.category || "Reel"}</span>
                <span className="badge-pill badge-pill--views">🔥 {activeVideo.views || "185K"}</span>
              </div>
              <div className="banner-hover-overlay">
                <button 
                  className="banner-action-btn edit-btn"
                  onClick={() => onEditItem('video', activeVideo)}
                  title="Edit Video Details"
                >
                  <Edit3 size={13} />
                  <span>Edit Reel</span>
                </button>
                {onDeleteItem && (
                  <button 
                    className="banner-action-btn delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Delete "${activeVideo.title}"?`)) {
                        onDeleteItem('video', activeVideo.id);
                      }
                    }}
                    title="Delete Reel"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Content & Metadata */}
            <div className="spotlight-content">
              <div className="spotlight-header-meta">
                <span className="spotlight-client">{activeVideo.client || "Avantika Cafe"}</span>
                <h3 className="spotlight-title">{activeVideo.title}</h3>
              </div>

              {/* Engagement Wave Sparkline */}
              <div className="chart-module">
                <div className="chart-module-header">
                  <span className="chart-label">Viral Stream Impressions</span>
                  <span className="chart-val">{activeVideo.views || "185K Views"}</span>
                </div>
                <div className="chart-svg-container">
                  <svg className="wave-svg" viewBox="0 0 240 45" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="wave-grad-video" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d="M0,28 C35,12 70,38 110,16 C150,4 190,26 240,14 L240,45 L0,45 Z" fill="url(#wave-grad-video)" />
                    <path d="M0,28 C35,12 70,38 110,16 C150,4 190,26 240,14" fill="none" stroke="#f97316" strokeWidth="2.4" />
                  </svg>
                </div>
              </div>

              {/* Footer Meta Row */}
              <div className="spotlight-footer">
                <div className="footer-tag-chip">
                  <Play size={11} className="play-mini-icon" />
                  <span>High-Retention Reel</span>
                </div>
                <button 
                  className="quick-edit-link"
                  onClick={() => onEditItem('video', activeVideo)}
                >
                  <Edit3 size={11} />
                  <span>Update</span>
                </button>
              </div>
            </div>
          </div>

          {/* Primary Column Action */}
          <button 
            className="col-primary-btn col-primary-btn--video"
            onClick={() => onOpenModalWithMode('video')}
          >
            <Plus size={15} strokeWidth={2.8} />
            <span>Add Video Reel</span>
          </button>
        </section>


        {/* ============================================================
            COLUMN 3: 🚀 SEO RANKINGS & DOMINATION (Port 5173)
            ============================================================ */}
        <section className="studio-column studio-column--seo">
          {/* Column Header */}
          <div className="studio-col-header">
            <div className="col-header-left">
              <div className="col-badge-squircle badge-seo">
                <span>03</span>
              </div>
              <div className="col-header-meta">
                <div className="col-title-row">
                  <h2 className="col-title" onClick={() => onSelectPortfolio && onSelectPortfolio('seo')}>
                    SEO & Rankings
                  </h2>
                  <span className="col-count-pill">{seoData.length} Partners</span>
                </div>
                <span className="col-subtext">Google #1 SERP Dominance & High Organic Traffic</span>
              </div>
            </div>

            <div className="col-header-actions">
              <div className="stepper-controls">
                <button className="stepper-btn" onClick={prevSeo} title="Previous SEO Partner">
                  <ChevronLeft size={14} />
                </button>
                <span className="stepper-indicator">{seoIdx + 1}/{seoData.length}</span>
                <button className="stepper-btn" onClick={nextSeo} title="Next SEO Partner">
                  <ChevronRight size={14} />
                </button>
              </div>

              <a 
                href="http://localhost:5173/" 
                target="_blank" 
                rel="noreferrer" 
                className="col-port-link"
                title="Launch Live SEO Portfolio on Port 5173"
              >
                <span>:5173</span>
                <ExternalLink size={10} />
              </a>
            </div>
          </div>

          {/* Quick Item Selection Strip */}
          <div className="item-selection-strip">
            {seoData.map((item, idx) => (
              <button
                key={item.id}
                className={`item-selector-pill ${idx === seoIdx ? 'item-selector-pill--active seo-active' : ''}`}
                onClick={() => setSeoIdx(idx)}
              >
                <div className="selector-dot seo-dot" />
                <span className="selector-title">{item.client}</span>
                <span className="selector-tag">{item.organicGrowth}</span>
              </button>
            ))}
          </div>

          {/* Spotlight Showcase Card */}
          <div className="spotlight-card spotlight-card--seo">
            {/* Visual Rank Pulse Banner */}
            <div className="spotlight-banner-wrap seo-banner-wrap">
              <div className="seo-banner-inner">
                <div className="seo-rank-highlight">
                  <span className="rank-crown">🏆</span>
                  <div className="rank-info">
                    <span className="rank-badge">Google Rank #1</span>
                    <span className="rank-keyword">{activeSeo.topKeyword || "Best Hospital in Alwar"}</span>
                  </div>
                </div>
                <div className="seo-growth-tag">
                  <ArrowUpRight size={13} strokeWidth={2.8} />
                  <span>{activeSeo.organicGrowth || "+420%"} Growth</span>
                </div>
              </div>
              <div className="banner-top-badges">
                <span className="badge-pill badge-pill--category">🚀 {activeSeo.industry || "Healthcare"}</span>
                <span className="badge-pill badge-pill--leads">⚡ {activeSeo.leadsPerMonth || "850+ Leads"}</span>
              </div>
              <div className="banner-hover-overlay">
                <button 
                  className="banner-action-btn edit-btn"
                  onClick={() => onEditItem('seo', activeSeo)}
                  title="Edit SEO Keyword Details"
                >
                  <Edit3 size={13} />
                  <span>Edit Record</span>
                </button>
                {onDeleteItem && (
                  <button 
                    className="banner-action-btn delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Delete "${activeSeo.client}"?`)) {
                        onDeleteItem('seo', activeSeo.id);
                      }
                    }}
                    title="Delete SEO Record"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Content & Metadata */}
            <div className="spotlight-content">
              <div className="spotlight-header-meta">
                <span className="spotlight-client">{activeSeo.client}</span>
                <h3 className="spotlight-title">{activeSeo.topKeyword}</h3>
              </div>

              {/* Animated ECG Pulse Monitor Card */}
              <div className="ecg-module">
                <div className="ecg-module-header">
                  <div className="ecg-label-row">
                    <span className="ecg-pulse-dot" />
                    <span className="ecg-label">Live Traffic Conversion Pulse</span>
                  </div>
                  <span className="ecg-health-score">{activeSeo.healthScore || "98/100"} Score</span>
                </div>
                <div className="ecg-svg-container">
                  <svg className="ecg-line-svg" viewBox="0 0 240 36" preserveAspectRatio="none">
                    <path
                      d="M0,18 L40,18 L46,14 L52,22 L58,4 L64,32 L70,16 L76,18 L130,18 L136,13 L142,23 L148,3 L154,33 L160,16 L166,18 L240,18"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Footer Meta Row */}
              <div className="spotlight-footer">
                <div className="footer-tag-chip">
                  <Activity size={11} className="pulse-mini-icon" />
                  <span>{activeSeo.leadsPerMonth || "850+ Leads / mo"}</span>
                </div>
                <button 
                  className="quick-edit-link"
                  onClick={() => onEditItem('seo', activeSeo)}
                >
                  <Edit3 size={11} />
                  <span>Update</span>
                </button>
              </div>
            </div>
          </div>

          {/* Primary Column Action */}
          <button 
            className="col-primary-btn col-primary-btn--seo"
            onClick={() => onOpenModalWithMode('seo')}
          >
            <Plus size={15} strokeWidth={2.8} />
            <span>Update SEO Content</span>
          </button>
        </section>

      </div>

      {/* Floating Action Button (+) */}
      <div className="luxury-fab-container">
        <button 
          className="luxury-fab-btn"
          onClick={() => onOpenModalWithMode('graphic')}
          title="Create New Creative Asset"
        >
          <Plus size={22} strokeWidth={2.8} />
        </button>
      </div>
    </div>
  );
}

