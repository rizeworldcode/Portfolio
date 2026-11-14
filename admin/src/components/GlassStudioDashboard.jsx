import React, { useState } from 'react';
import {
  LuHouse,
  LuImage,
  LuFilm,
  LuTrendingUp,
  LuActivity,
  LuGem,
  LuPlus,
  LuSearch,
  LuBell,
  LuExternalLink,
  LuPencil,
  LuTrash2,
  LuPlay,
  LuArrowRight,
  LuArrowLeft,
  LuLayoutGrid,
  LuEye,
  LuKey,
  LuGlobe,
  LuStar
} from 'react-icons/lu';
import './GlassStudioDashboard.css';

export default function GlassStudioDashboard({ 
  graphicsData = [], 
  videosData = [], 
  seoData = [], 
  onOpenModalWithMode, 
  onEditItem, 
  onDeleteItem,
  activeTab,
  setActiveTab,
  showToast,
  onSaveItem
}) {
  // Navigation & Filter state
  const [activeNav, setActiveNav] = useState('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFileFilter, setSelectedFileFilter] = useState('all');

  // Map ALL items dynamically into a unified catalog
  const allDynamicFiles = [
    ...graphicsData.map((g) => ({
      id: g.id,
      title: g.title,
      client: g.client || 'Graphic Client',
      category: g.category || 'Brand Identity',
      subtitle: `${g.client || 'Graphic'} • ${g.category || 'Artwork'}`,
      type: 'graphic',
      format: g.format || 'Poster (4:5)',
      tagColor: '#3b82f6',
      badgeIcon: '🎨',
      badgeText: 'Graphic',
      image: g.image || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80',
      author: g.client || 'Creative Team',
      filesize: g.format || 'Artwork',
      rawItem: g
    })),
    ...videosData.map((v) => ({
      id: v.id,
      title: v.title,
      client: v.client || 'Video Client',
      category: v.category || 'Commercial Reel',
      subtitle: `${v.client || 'Video'} • ${v.duration || '0:45'} (${v.views || '180K'})`,
      type: 'video',
      format: 'Reel (MP4)',
      tagColor: '#8b5cf6',
      badgeIcon: '🎬',
      badgeText: 'Reel',
      video: v.video || '/videos-compressed/avan-spring.mp4',
      author: v.client || 'Production Team',
      filesize: `${v.duration || '0:45'} • ${v.views || '180K'}`,
      rawItem: v
    })),
    ...seoData.map((s) => ({
      id: s.id,
      title: s.client || 'SEO Client Partner',
      client: s.client || 'SEO Partner',
      category: s.topKeyword || 'SERP Rank #1',
      subtitle: `${s.googleRank || '#1 Position'} • ${s.organicGrowth || '+350%'} Growth`,
      type: 'seo',
      format: 'Google Rank',
      tagColor: '#ea580c',
      badgeIcon: '🚀',
      badgeText: 'SEO',
      website: s.website || 'client.com',
      author: s.client || 'SEO Dominance',
      filesize: `${s.googleRank || '#1'} • ${s.trafficMonthly || '50K visits'}`,
      rawItem: s
    }))
  ];

  // Active selected item for preview (defaults to first available item)
  const [selectedPreview, setSelectedPreview] = useState(null);
  const currentPreview = selectedPreview || allDynamicFiles[0] || {
    id: 'default',
    title: 'Select an Asset to Inspect',
    type: 'graphic',
    filesize: 'Ready for Review',
    author: 'RizeWorld Studio',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80',
    rawItem: {}
  };

  // Filter dynamic files by tab and search
  const filteredFiles = allDynamicFiles.filter(f => {
    const matchesTab = selectedFileFilter === 'all' || f.type === selectedFileFilter;
    const matchesSearch = !searchQuery.trim() || 
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.client && f.client.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (f.category && f.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  return (
    <div className="management-glass-page">
      {/* Master Center Floating Glass Frame */}
      <div className="management-master-canvas">

        {/* ------------------------------------------------------------
            LEFT SIDEBAR DOCK (Claymorphic Navigation matching Reference)
            ------------------------------------------------------------ */}
        <aside className="management-sidebar clay-sidebar">
          {/* Top User Greeting Block (Matching Reference 'Hi, Aryan!') */}
          <div className="sidebar-top-user-block">
            <div className="sidebar-avatar-3d-wrap">
              <img 
                src="/rize.png" 
                alt="Director" 
                className="sidebar-avatar-3d-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80";
                }}
              />
            </div>
            <div className="sidebar-user-greeting">
              <span className="sidebar-greet-name">Hi, Director!</span>
              <span className="sidebar-greet-sub">RizeWorld Hub</span>
            </div>
          </div>

          {/* Navigation Links: Dedicated to the 3 Core Portfolios */}
          <nav className="sidebar-nav-menu">
            <button 
              className={`sidebar-nav-item ${activeNav === 'projects' || activeNav === 'home' ? 'sidebar-nav-item--active' : ''}`}
              onClick={() => {
                setActiveNav('projects');
                setSelectedFileFilter('all');
              }}
              title="Overview Dashboard"
            >
              <LuHouse size={18} />
              <span>Dashboard</span>
            </button>

            <button 
              className={`sidebar-nav-item ${activeNav === 'graphic' ? 'sidebar-nav-item--active' : ''}`}
              onClick={() => setActiveNav('graphic')}
              title="Manage Graphic Artworks & Posters"
            >
              <LuImage size={18} />
              <span>Graphics ({graphicsData.length})</span>
            </button>

            <button 
              className={`sidebar-nav-item ${activeNav === 'video' ? 'sidebar-nav-item--active' : ''}`}
              onClick={() => setActiveNav('video')}
              title="Manage Video Reels"
            >
              <LuFilm size={18} />
              <span>Videos ({videosData.length})</span>
            </button>

            <button 
              className={`sidebar-nav-item ${activeNav === 'seo' ? 'sidebar-nav-item--active' : ''}`}
              onClick={() => setActiveNav('seo')}
              title="Manage SEO Clients & SERP Rankings"
            >
              <LuTrendingUp size={18} />
              <span>SEO ({seoData.length})</span>
            </button>
          </nav>

          {/* Bottom 'Go Pro' Clay Card (Matching Reference Bottom Card) */}
          <div className="sidebar-pro-clay-card">
            <div className="pro-card-crown">
              <LuGem size={22} color="#38bdf8" />
            </div>
            <span className="pro-card-title">Studio Pro</span>
            <span className="pro-card-sub">3 Portfolios Live</span>
            <button 
              className="pro-card-btn"
              onClick={() => onOpenModalWithMode('graphic')}
            >
              + Quick Add
            </button>
          </div>
        </aside>


        {/* ------------------------------------------------------------
            MAIN WORKSPACE AREA
            ------------------------------------------------------------ */}
        <div className="management-main-workspace">

          {/* ============================================================
              TOPBAR: Real Agency Actions & Port Links
              ============================================================ */}
          <header className="management-topbar">
            {/* Title with Active Section Info */}
            <div className="topbar-title-cluster">
              <h1 className="topbar-main-title">
                {activeNav === 'graphic' && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <LuPalette size={20} color="#0284c7" /> Graphic Design Assets
                  </span>
                )}
                {activeNav === 'video' && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <LuClapperboard size={20} color="#6366f1" /> Video Reels Production
                  </span>
                )}
                {activeNav === 'seo' && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <LuRocket size={20} color="#0891b2" /> SEO & SERP Dominance
                  </span>
                )}
                {(activeNav === 'home' || activeNav === 'projects') && 'Agency Operations Studio'}
              </h1>
              {activeNav !== 'projects' && activeNav !== 'home' && (
                <button 
                  className="topbar-back-pill"
                  onClick={() => setActiveNav('projects')}
                >
                  <LuArrowLeft size={13} />
                  <span>Back to Overview</span>
                </button>
              )}
            </div>

            {/* Right Interactive Controls */}
            <div className="topbar-right-cluster">
              {/* 3 Quick Direct Add Buttons */}
              <div className="quick-crud-pill-group">
                <button 
                  className="quick-add-pill-btn"
                  onClick={() => onOpenModalWithMode('graphic')}
                  title="Upload New Graphic Artwork or Poster"
                >
                  <LuPlus size={15} />
                  <span>Graphic</span>
                </button>

                <button 
                  className="quick-add-pill-btn"
                  onClick={() => onOpenModalWithMode('video')}
                  title="Add New Video Reel"
                >
                  <LuPlus size={15} />
                  <span>Reel</span>
                </button>

                <button 
                  className="quick-add-pill-btn"
                  onClick={() => onOpenModalWithMode('seo')}
                  title="Add New SEO Case Study / Partner"
                >
                  <LuPlus size={15} />
                  <span>SEO</span>
                </button>
              </div>

              {/* 3 Direct Live Portfolio Launchers */}
              <div className="topbar-live-ports-cluster">
                <a 
                  href="http://localhost:5174/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="port-live-link-pill port-graphic"
                  title="Open Live Graphic Portfolio"
                >
                  <span>:5174</span>
                  <LuExternalLink size={12} />
                </a>

                <a 
                  href="http://localhost:5175/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="port-live-link-pill port-video"
                  title="Open Live Video Reels Portfolio"
                >
                  <span>:5175</span>
                  <LuExternalLink size={12} />
                </a>

                <a 
                  href="http://localhost:5173/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="port-live-link-pill port-seo"
                  title="Open Live SEO Portfolio"
                >
                  <span>:5173</span>
                  <LuExternalLink size={12} />
                </a>
              </div>

              {/* Search Capsule Input */}
              <div className="topbar-search-box">
                <div className="search-circle-btn">
                  <LuSearch size={15} />
                </div>
                <input 
                  type="text" 
                  placeholder="Search agency assets..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-inner-input"
                />
              </div>

              {/* Notification Bell */}
              <button 
                className="topbar-round-icon-btn"
                onClick={() => showToast && showToast(`⚡ Studio Synced: ${graphicsData.length} Graphics, ${videosData.length} Reels, ${seoData.length} SEO`)}
                title="System Status"
              >
                <LuBell size={17} />
              </button>
            </div>
          </header>


          {/* ============================================================
              VIEW 1: DEDICATED GRAPHIC / VIDEO / SEO MANAGEMENT PANEL
              ============================================================ */}
          {activeNav === 'graphic' || activeNav === 'video' || activeNav === 'seo' ? (
            <div className="dedicated-crud-panel glass-white-card">
              <div className="crud-panel-header">
                <div className="crud-header-meta">
                  <h2 className="crud-main-heading">
                    {activeNav === 'graphic' && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <LuPalette size={20} color="#0284c7" /> Graphic Design Artworks & Posters ({graphicsData.length})
                      </span>
                    )}
                    {activeNav === 'video' && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <LuClapperboard size={20} color="#6366f1" /> Video Reels Production ({videosData.length})
                      </span>
                    )}
                    {activeNav === 'seo' && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <LuRocket size={20} color="#0891b2" /> SEO Client Partners & Rankings ({seoData.length})
                      </span>
                    )}
                  </h2>
                  <p className="crud-sub-text">
                    Add new items, update existing details, or delete records. All changes save to real-time storage.
                  </p>
                </div>
                <button 
                  className="crud-add-main-btn"
                  onClick={() => onOpenModalWithMode(activeNav)}
                >
                  <LuPlus size={16} />
                  <span>+ Add New {activeNav.toUpperCase()}</span>
                </button>
              </div>

              {/* Items Grid */}
              <div className="crud-cards-grid">
                {activeNav === 'graphic' && graphicsData.map((item) => (
                  <div key={item.id} className="crud-item-card crud-item-card--graphic">
                    <div className="crud-card-thumb">
                      <img src={item.image} alt={item.title} className="crud-thumb-img" />
                      <span className="crud-card-tag">{item.category}</span>
                    </div>
                    <div className="crud-card-body">
                      <div className="crud-body-header">
                        <div className="crud-icon-tile">
                          <LuPalette size={18} />
                        </div>
                        <div className="crud-header-text-block">
                          <span className="crud-eyebrow-label">{item.category}</span>
                          <h4 className="crud-card-title">{item.title}</h4>
                        </div>
                      </div>
                      <span className="crud-card-client">{item.client} • {item.format}</span>
                      <div className="crud-card-actions">
                        <button 
                          className="crud-btn crud-btn--edit"
                          onClick={() => onEditItem('graphic', item)}
                          title="Edit this graphic"
                        >
                          <LuPencil size={14} />
                          <span>Edit</span>
                        </button>
                        <button 
                          className="crud-btn crud-btn--delete"
                          onClick={() => onDeleteItem('graphic', item.id)}
                          title="Delete this graphic"
                        >
                          <LuTrash2 size={14} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {activeNav === 'video' && videosData.map((item) => (
                  <div key={item.id} className="crud-item-card crud-item-card--video">
                    <div className="crud-card-thumb crud-card-thumb--video">
                      <div className="video-thumb-overlay">
                        <div className="clay-video-play-btn">
                          <LuPlay size={26} color="#ffffff" />
                        </div>
                      </div>
                      <span className="crud-card-tag">{item.category}</span>
                      <span className="crud-video-badge">{item.duration}</span>
                    </div>
                    <div className="crud-card-body">
                      <div className="crud-body-header">
                        <div className="crud-icon-tile">
                          <LuClapperboard size={18} />
                        </div>
                        <div className="crud-header-text-block">
                          <span className="crud-eyebrow-label">Commercial Reel</span>
                          <h4 className="crud-card-title">{item.title}</h4>
                        </div>
                      </div>
                      <span className="crud-card-client">{item.client} • {item.views} Views</span>
                      <div className="crud-card-actions">
                        <button 
                          className="crud-btn crud-btn--edit"
                          onClick={() => onEditItem('video', item)}
                          title="Edit this reel"
                        >
                          <LuPencil size={14} />
                          <span>Edit</span>
                        </button>
                        <button 
                          className="crud-btn crud-btn--delete"
                          onClick={() => onDeleteItem('video', item.id)}
                          title="Delete this reel"
                        >
                          <LuTrash2 size={14} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {activeNav === 'seo' && seoData.map((item) => (
                  <div key={item.id} className="crud-item-card crud-item-card--seo">
                    <div className="crud-card-header-seo">
                      <div className="seo-header-title-wrap">
                        <div className="crud-icon-tile">
                          <LuRocket size={18} />
                        </div>
                        <div className="seo-rank-text-block">
                          <span className="seo-eyebrow-label">Google Ranking</span>
                          <span className="seo-rank-badge">{item.googleRank}</span>
                        </div>
                      </div>
                      <span className="seo-growth-tag">{item.organicGrowth}</span>
                    </div>
                    <div className="crud-card-body">
                      <h4 className="crud-card-title">{item.client}</h4>
                      <span className="crud-card-keyword">
                        <LuKey size={13} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                        {item.topKeyword}
                      </span>
                      <span className="crud-card-website">
                        <LuGlobe size={13} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                        {item.website} • {item.trafficMonthly}
                      </span>
                      <div className="crud-card-actions">
                        <button 
                          className="crud-btn crud-btn--edit"
                          onClick={() => onEditItem('seo', item)}
                          title="Edit this SEO record"
                        >
                          <LuPencil size={14} />
                          <span>Edit</span>
                        </button>
                        <button 
                          className="crud-btn crud-btn--delete"
                          onClick={() => onDeleteItem('seo', item.id)}
                          title="Delete this SEO record"
                        >
                          <LuTrash2 size={14} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (

            /* ============================================================
                VIEW 2: REAL AGENCY OVERVIEW DASHBOARD
                ============================================================ */
            <>
              {/* ============================================================
                  0. CLAY SHELF WELCOME BANNER (Matching Reference Top Banner)
                  ============================================================ */}
              <div className="clay-shelf-banner">
                <div className="shelf-character-col">
                  <div className="shelf-avatar-pill">
                    <img 
                      src="/rize.png" 
                      alt="Studio Director" 
                      className="shelf-character-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";
                      }}
                    />
                  </div>
                </div>

                <div className="shelf-content-col">
                  <div className="shelf-greeting-row">
                    <span className="shelf-music-note">
                      <LuMusic size={18} color="#38bdf8" />
                    </span>
                    <h2 className="shelf-main-greeting">Good Evening, Director!</h2>
                  </div>
                  <p className="shelf-sub-greeting">
                    Time for your next track! Manage Graphic Arts, Video Reels & SEO Domination.
                  </p>
                  <div className="shelf-actions-row">
                    <button 
                      className="shelf-clay-btn shelf-clay-btn--primary"
                      onClick={() => onOpenModalWithMode('graphic')}
                    >
                      <LuPlay size={15} />
                      <span>Create Something</span>
                    </button>

                    <div className="shelf-ports-quick">
                      <a href="http://localhost:5174/" target="_blank" rel="noreferrer" className="shelf-port-chip" title="Graphic Portfolio :5174">
                        <LuPalette size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                        <span>:5174</span>
                        <LuExternalLink size={10} />
                      </a>
                      <a href="http://localhost:5175/" target="_blank" rel="noreferrer" className="shelf-port-chip" title="Video Portfolio :5175">
                        <LuClapperboard size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                        <span>:5175</span>
                        <LuExternalLink size={10} />
                      </a>
                      <a href="http://localhost:5173/" target="_blank" rel="noreferrer" className="shelf-port-chip" title="SEO Portfolio :5173">
                        <LuRocket size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                        <span>:5173</span>
                        <LuExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="shelf-decor-col">
                  <div className="shelf-potted-plant" title="RizeWorld Studio">
                    <img 
                      src="/rw_logo.png" 
                      alt="RizeWorld Logo" 
                      className="shelf-rw-logo-img" 
                    />
                  </div>
                </div>
              </div>

              {/* ============================================================
                  1. THE 4 CLAY STAT CARDS (Exact match to Reference 4 Cards)
                  ============================================================ */}
              <div className="clay-stat-cards-grid">
                {/* Card 1: Graphic Artworks (Soft Cyan Clay Card) */}
                <div 
                  className="clay-stat-card clay-stat-card--cyan"
                  onClick={() => setActiveNav('graphic')}
                  title="Click to manage Graphic Artworks"
                >
                  <div className="clay-stat-icon-tile tile-cyan">
                    <LuPalette size={20} />
                  </div>
                  <span className="clay-stat-label">Graphic Assets</span>
                  <span className="clay-stat-number">{graphicsData.length}</span>
                  <span className="clay-stat-trend trend-teal">+18% this month</span>
                </div>

                {/* Card 2: Video Reels (Soft Sky Blue Clay Card) */}
                <div 
                  className="clay-stat-card clay-stat-card--blue"
                  onClick={() => setActiveNav('video')}
                  title="Click to manage Video Reels"
                >
                  <div className="clay-stat-icon-tile tile-blue">
                    <LuClapperboard size={20} />
                  </div>
                  <span className="clay-stat-label">Reels Active</span>
                  <span className="clay-stat-number">{videosData.length}</span>
                  <span className="clay-stat-trend trend-teal">+28% views</span>
                </div>

                {/* Card 3: SEO Top Rank (Frosted Ice Clay Card) */}
                <div 
                  className="clay-stat-card clay-stat-card--ice"
                  onClick={() => setActiveNav('seo')}
                  title="Click to manage SEO Rankings"
                >
                  <div className="clay-stat-icon-tile tile-ice">
                    <LuRocket size={20} />
                  </div>
                  <span className="clay-stat-label">SERP Ranking</span>
                  <span className="clay-stat-number">{seoData[0]?.googleRank || '#1'}</span>
                  <span className="clay-stat-trend trend-teal">+420% traffic</span>
                </div>

                {/* Card 4: Studio Synced (Soft Lavender Clay Card) */}
                <div 
                  className="clay-stat-card clay-stat-card--lavender"
                  onClick={() => showToast && showToast('⚡ Studio Synced: All 3 Portfolios Active & Live')}
                  title="Studio Synced & Active"
                >
                  <div className="clay-stat-icon-tile tile-lavender">
                    <LuFlame size={20} />
                  </div>
                  <span className="clay-stat-label">Studio Health</span>
                  <span className="clay-stat-number">100%</span>
                  <span className="clay-stat-subtext">3 ports active</span>
                </div>
              </div>

              {/* ============================================================
                  2. CORE PORTFOLIO ACTION HUBS (Upper Grid)
                  ============================================================ */}
              <div className="management-upper-grid">

                {/* CARD 1: 🎨 GRAPHIC DESIGN STUDIO HUB */}
                <section className="glass-white-card card-portfolio-hub hub-graphic">
                  <div className="hub-header-row">
                    <div className="hub-title-block">
                      <span className="hub-tag-badge tag-graphic">
                        <LuPalette size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                        Graphic Studio
                      </span>
                      <h3 className="hub-main-title">{graphicsData.length} Artworks Live</h3>
                    </div>
                    <a 
                      href="http://localhost:5174/" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="hub-port-link"
                      title="Launch Graphic Portfolio"
                    >
                      <span>:5174</span>
                      <LuExternalLink size={12} />
                    </a>
                  </div>

                  {/* Latest Graphic Artwork Preview */}
                  <div 
                    className="hub-preview-banner"
                    onClick={() => {
                      if (graphicsData[0]) setSelectedPreview(allDynamicFiles.find(f => f.id === graphicsData[0].id));
                    }}
                  >
                    <img 
                      src={graphicsData[0]?.image || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80"} 
                      alt="Latest Graphic" 
                      className="hub-banner-img"
                    />
                    <div className="hub-banner-overlay">
                      <span className="hub-banner-title">{graphicsData[0]?.title || "Latest Poster & Artwork"}</span>
                      <span className="hub-banner-sub">{graphicsData[0]?.client || "Brand Identity"}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="hub-action-row">
                    <button 
                      className="hub-btn hub-btn--add"
                      onClick={() => onOpenModalWithMode('graphic')}
                    >
                      <LuPlus size={14} />
                      <span>Upload Graphic</span>
                    </button>
                    <button 
                      className="hub-btn hub-btn--manage"
                      onClick={() => setActiveNav('graphic')}
                    >
                      <span>Manage All ({graphicsData.length})</span>
                      <LuArrowRight size={13} />
                    </button>
                  </div>
                </section>


                {/* CARD 2: 🎬 VIDEO REELS PRODUCTION HUB */}
                <section className="glass-white-card card-portfolio-hub hub-video">
                  <div className="hub-header-row">
                    <div className="hub-title-block">
                      <span className="hub-tag-badge tag-video">
                        <LuClapperboard size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                        Video Production
                      </span>
                      <h3 className="hub-main-title">{videosData.length} Reels Active</h3>
                    </div>
                    <a 
                      href="http://localhost:5175/" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="hub-port-link"
                      title="Launch Video Reels Portfolio"
                    >
                      <span>:5175</span>
                      <LuExternalLink size={12} />
                    </a>
                  </div>

                  {/* Latest Video Reel Banner */}
                  <div 
                    className="hub-preview-banner video-banner"
                    onClick={() => {
                      if (videosData[0]) setSelectedPreview(allDynamicFiles.find(f => f.id === videosData[0].id));
                    }}
                  >
                    <div className="video-thumb-play-circle">
                      <LuPlay size={26} color="#ffffff" />
                    </div>
                    <div className="hub-banner-overlay">
                      <span className="hub-banner-title">{videosData[0]?.title || "4K Commercial Reel"}</span>
                      <span className="hub-banner-sub">{videosData[0]?.client || "Client Commercial"} • {videosData[0]?.views || "240K"} Views</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="hub-action-row">
                    <button 
                      className="hub-btn hub-btn--add"
                      onClick={() => onOpenModalWithMode('video')}
                    >
                      <LuPlus size={14} />
                      <span>Add Video Reel</span>
                    </button>
                    <button 
                      className="hub-btn hub-btn--manage"
                      onClick={() => setActiveNav('video')}
                    >
                      <span>Manage All ({videosData.length})</span>
                      <LuArrowRight size={13} />
                    </button>
                  </div>
                </section>


                {/* CARD 3: 🚀 SEO & RANKINGS DOMINATION HUB */}
                <section className="glass-white-card card-portfolio-hub hub-seo">
                  <div className="hub-header-row">
                    <div className="hub-title-block">
                      <span className="hub-tag-badge tag-seo">
                        <LuRocket size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                        SEO Dominance
                      </span>
                      <h3 className="hub-main-title">{seoData.length} Ranked Partners</h3>
                    </div>
                    <a 
                      href="http://localhost:5173/" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="hub-port-link"
                      title="Launch SEO Portfolio"
                    >
                      <span>:5173</span>
                      <LuExternalLink size={12} />
                    </a>
                  </div>

                  {/* Latest SEO Performance Metric Card */}
                  <div 
                    className="hub-seo-spotlight"
                    onClick={() => {
                      if (seoData[0]) setSelectedPreview(allDynamicFiles.find(f => f.id === seoData[0].id));
                    }}
                  >
                    <div className="seo-spotlight-top">
                      <span className="spotlight-rank">{seoData[0]?.googleRank || '#1 Position'}</span>
                      <span className="spotlight-growth">{seoData[0]?.organicGrowth || '+420%'}</span>
                    </div>
                    <span className="spotlight-client">{seoData[0]?.client || "Top Ranked Partner"}</span>
                    <span className="spotlight-kw">
                      <LuKey size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                      {seoData[0]?.topKeyword || "Industry Top Keyword"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="hub-action-row">
                    <button 
                      className="hub-btn hub-btn--add"
                      onClick={() => onOpenModalWithMode('seo')}
                    >
                      <LuPlus size={14} />
                      <span>Add SEO Partner</span>
                    </button>
                    <button 
                      className="hub-btn hub-btn--manage"
                      onClick={() => setActiveNav('seo')}
                    >
                      <span>Manage All ({seoData.length})</span>
                      <LuArrowRight size={13} />
                    </button>
                  </div>
                </section>

              </div>


              {/* ============================================================
                  LOWER SECTION: ALL AGENCY ASSETS & ASSET INSPECTOR
                  ============================================================ */}
              <div className="management-lower-grid">

                {/* CARD 4: ALL ASSETS & CONTENT CATALOG (Full CRUD With Edit & Delete) */}
                <section className="glass-white-card card-all-files">
                  <div className="files-card-header">
                    {/* Category Filter Switcher */}
                    <div className="files-filter-pills-row">
                      <button 
                        className={`files-filter-pill ${selectedFileFilter === 'all' ? 'files-filter-pill--active' : ''}`}
                        onClick={() => setSelectedFileFilter('all')}
                      >
                        <LuLayoutGrid size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                        All Portfolios ({allDynamicFiles.length})
                      </button>
                      <button 
                        className={`files-filter-pill ${selectedFileFilter === 'graphic' ? 'files-filter-pill--active' : ''}`}
                        onClick={() => setSelectedFileFilter('graphic')}
                      >
                        <LuPalette size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                        Graphic ({graphicsData.length})
                      </button>
                      <button 
                        className={`files-filter-pill ${selectedFileFilter === 'video' ? 'files-filter-pill--active' : ''}`}
                        onClick={() => setSelectedFileFilter('video')}
                      >
                        <LuClapperboard size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                        Reel ({videosData.length})
                      </button>
                      <button 
                        className={`files-filter-pill ${selectedFileFilter === 'seo' ? 'files-filter-pill--active' : ''}`}
                        onClick={() => setSelectedFileFilter('seo')}
                      >
                        <LuRocket size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                        SEO ({seoData.length})
                      </button>
                    </div>

                    {/* Quick Add Button */}
                    <button 
                      className="files-quick-add-btn"
                      onClick={() => onOpenModalWithMode(selectedFileFilter === 'all' ? 'graphic' : selectedFileFilter)}
                      title="Add New Asset"
                    >
                      <LuPlus size={14} />
                      <span>Add</span>
                    </button>
                  </div>

                  {/* Dynamic Asset Rows with Real Edit & Delete Action Buttons */}
                  <div className="files-capsules-column custom-files-scroll">
                    {filteredFiles.map((f) => (
                      <div 
                        key={f.id}
                        className={`file-item-capsule file-item-capsule--${f.type} ${currentPreview.id === f.id ? 'file-item-capsule--selected' : ''}`}
                        onClick={() => setSelectedPreview(f)}
                        title="Click to inspect in Preview Panel"
                      >
                        <span className="file-badge-sq" style={{ backgroundColor: f.tagColor }}>
                          {f.type === 'graphic' && <LuPalette size={10} color="#ffffff" />}
                          {f.type === 'video' && <LuClapperboard size={10} color="#ffffff" />}
                          {f.type === 'seo' && <LuRocket size={10} color="#ffffff" />}
                        </span>

                        <div className="file-info-text-col">
                          <span className="file-capsule-name">{f.title}</span>
                          <span className="file-capsule-meta">{f.subtitle}</span>
                        </div>

                        {/* Circular 3D Cyan Play/Inspect Button (Matching Reference Play Circle) */}
                        <button 
                          className="clay-row-circle-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPreview(f);
                          }}
                          title="Preview in Asset Inspector"
                        >
                          <LuPlay size={13} />
                        </button>

                        {/* Direct Edit & Delete Buttons on every row */}
                        <div className="file-actions-cluster" onClick={(e) => e.stopPropagation()}>
                          <button 
                            className="row-action-btn row-action-edit"
                            onClick={() => onEditItem(f.type, f.rawItem)}
                            title={`Edit ${f.title}`}
                          >
                            <LuPencil size={14} />
                          </button>
                          <button 
                            className="row-action-btn row-action-delete"
                            onClick={() => {
                              onDeleteItem(f.type, f.id);
                              if (currentPreview.id === f.id) setSelectedPreview(null);
                            }}
                            title={`Delete ${f.title}`}
                          >
                            <LuTrash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {filteredFiles.length === 0 && (
                      <div className="empty-files-hint">
                        <span>No assets in this category. Click "+ Add" to create one!</span>
                      </div>
                    )}
                  </div>
                </section>


                {/* CARD 5: ACTIVE ASSET INSPECTOR & PREVIEW (Electric Sapphire Blue Card) */}
                <section className="card-file-preview-dark inspector-panel">
                  {/* Header with Quick Actions */}
                  <div className="preview-dark-header">
                    <div className="preview-header-left">
                      <span className="preview-header-title">
                        <LuEye size={15} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                        Asset Inspector
                      </span>
                    </div>

                    {/* Quick Edit & Delete Buttons on Preview Card */}
                    {currentPreview.rawItem?.id && (
                      <div className="preview-header-actions">
                        <button 
                          className="preview-action-btn"
                          onClick={() => onEditItem(currentPreview.type, currentPreview.rawItem)}
                          title="Edit this item"
                        >
                          <LuPencil size={14} />
                        </button>
                        <button 
                          className="preview-action-btn delete-action"
                          onClick={() => {
                            onDeleteItem(currentPreview.type, currentPreview.id);
                            setSelectedPreview(null);
                          }}
                          title="Delete this item"
                        >
                          <LuTrash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Artwork / Video / SEO Stage */}
                  <div 
                    className="preview-media-stage"
                    onClick={() => {
                      if (currentPreview.rawItem?.id) onEditItem(currentPreview.type, currentPreview.rawItem);
                    }}
                    title="Click to edit or inspect item"
                  >
                    {currentPreview.type === 'graphic' && (
                      <img 
                        src={currentPreview.image} 
                        alt={currentPreview.title} 
                        className="preview-fluid-img" 
                      />
                    )}

                    {currentPreview.type === 'video' && (
                      <div className="inspector-video-box">
                        <LuPlay size={36} color="#ffffff" />
                        <span className="inspector-video-tag">{currentPreview.filesize}</span>
                      </div>
                    )}

                    {currentPreview.type === 'seo' && (
                      <div className="inspector-seo-box">
                        <span className="inspector-rank-badge">{currentPreview.rawItem?.googleRank || '#1 Position'}</span>
                        <span className="inspector-growth-badge">{currentPreview.rawItem?.organicGrowth || '+350%'}</span>
                        <span className="inspector-leads">{currentPreview.rawItem?.leadsPerMonth || '500+ Leads'}</span>
                      </div>
                    )}
                  </div>

                  {/* File Meta Details */}
                  <div className="preview-meta-block">
                    <span className="preview-filename">{currentPreview.title}</span>
                    <span className="preview-filesize">{currentPreview.subtitle || currentPreview.filesize}</span>
                  </div>

                  {/* Footer Action Pill */}
                  <div className="inspector-footer-row">
                    <div className="preview-author-pill">
                      <span className="author-name-text">Client: {currentPreview.author || 'RizeWorld Studio'}</span>
                    </div>

                    <button 
                      className="inspector-edit-direct-btn"
                      onClick={() => {
                        if (currentPreview.rawItem?.id) {
                          onEditItem(currentPreview.type, currentPreview.rawItem);
                        } else {
                          onOpenModalWithMode('graphic');
                        }
                      }}
                    >
                      <LuPencil size={13} />
                      <span>Edit Asset</span>
                    </button>
                  </div>
                </section>

              </div>

              {/* ============================================================
                  3. BOTTOM CLAY BANNER (Matching Reference Bottom Bar)
                  ============================================================ */}
              <div className="clay-bottom-banner">
                <div className="bottom-banner-left">
                  <div className="bottom-banner-star">
                    <LuStar size={24} color="#f59e0b" fill="#f59e0b" />
                  </div>
                  <div className="bottom-banner-text-block">
                    <span className="bottom-banner-title">Craft new visual excellence</span>
                    <span className="bottom-banner-sub">Portfolios sync live on ports 5174, 5175 & 5173</span>
                  </div>
                </div>

                <div className="bottom-banner-right">
                  <button 
                    className="clay-explore-btn"
                    onClick={() => onOpenModalWithMode('graphic')}
                  >
                    <span>Upload New</span>
                  </button>
                </div>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
}
