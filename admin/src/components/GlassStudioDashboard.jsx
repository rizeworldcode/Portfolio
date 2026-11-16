import React, { useState, useMemo } from 'react';
import {
  LuHouse,
  LuImage,
  LuFilm,
  LuTrendingUp,
  LuGem,
  LuLayers,
  LuPlus,
  LuSearch,
  LuBell,
  LuExternalLink,
  LuPencil,
  LuTrash2,
  LuRotateCcw,
  LuPlay,
  LuPause,
  LuMaximize2,
  LuArrowRight,
  LuArrowLeft,
  LuLayoutGrid,
  LuEye,
  LuKey,
  LuGlobe,
  LuX,
  LuFileText,
  LuCloudUpload,
  LuLogOut
} from 'react-icons/lu';
import SeoContentEditor from './SeoContentEditor';
import './GlassStudioDashboard.css';

export default function GlassStudioDashboard({ 
  graphicsData = [], 
  videosData = [], 
  seoData = [], 
  isBackendConnected = false,
  onOpenModalWithMode, 
  onEditItem, 
  onDeleteItem,
  deletedHistory = [],
  lastDeleted = null,
  onRestoreItem,
  onRevertLast,
  onOpenRevertModal,
  onOpenBulkUploadModal,
  activeTab,
  setActiveTab,
  showToast,
  onSaveItem,
  currentUser = null,
  onLogout = null
}) {
  // Navigation & Filter state
  const [activeNav, setActiveNav] = useState('projects');
  const [seoSubTab, setSeoSubTab] = useState('partners'); // 'partners' | 'content'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilterTab, setSearchFilterTab] = useState('all'); // 'all' | 'graphic' | 'video' | 'seo'
  const [activeGraphicCategory, setActiveGraphicCategory] = useState('All');
  const [activeVideoCategory, setActiveVideoCategory] = useState('All');
  const [activeSeoCategory, setActiveSeoCategory] = useState('All');
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [playingVideoId, setPlayingVideoId] = useState(null);

  // Dynamic Graphic Categories extracted from live portfolio
  const graphicCategories = useMemo(() => {
    const set = new Set();
    graphicsData.forEach(g => {
      if (g.category) set.add(g.category);
    });
    return ['All', ...Array.from(set)];
  }, [graphicsData]);

  // Dynamic Video Categories extracted from live portfolio
  const videoCategories = useMemo(() => {
    const set = new Set();
    videosData.forEach(v => {
      if (v.category) set.add(v.category);
    });
    return ['All', ...Array.from(set)];
  }, [videosData]);

  // Dynamic SEO Categories extracted from live portfolio
  const seoCategories = useMemo(() => {
    const set = new Set();
    seoData.forEach(s => {
      if (s.category) set.add(s.category);
    });
    return ['All', ...Array.from(set)];
  }, [seoData]);

  const cleanQuery = searchQuery.trim().toLowerCase();

  // Comprehensive Cross-portfolio Search: Matches title, client, category, tags, keywords, or type keywords ('graphic', 'video', 'seo')
  const matchedGraphics = useMemo(() => {
    if (!cleanQuery) return [];
    return graphicsData.filter(g => {
      if (cleanQuery === 'graphic' || cleanQuery === 'graphics' || cleanQuery === 'poster' || cleanQuery === 'posters') return true;
      const title = (g.title || '').toLowerCase();
      const client = (g.client || '').toLowerCase();
      const category = (g.category || '').toLowerCase();
      const format = (g.format || '').toLowerCase();
      const tags = Array.isArray(g.tags) ? g.tags.join(' ').toLowerCase() : '';
      return title.includes(cleanQuery) || client.includes(cleanQuery) || category.includes(cleanQuery) || format.includes(cleanQuery) || tags.includes(cleanQuery);
    });
  }, [graphicsData, cleanQuery]);

  const matchedVideos = useMemo(() => {
    if (!cleanQuery) return [];
    return videosData.filter(v => {
      if (cleanQuery === 'video' || cleanQuery === 'videos' || cleanQuery === 'reel' || cleanQuery === 'reels') return true;
      const title = (v.title || '').toLowerCase();
      const client = (v.client || '').toLowerCase();
      const category = (v.category || '').toLowerCase();
      const tags = Array.isArray(v.tags) ? v.tags.join(' ').toLowerCase() : '';
      return title.includes(cleanQuery) || client.includes(cleanQuery) || category.includes(cleanQuery) || tags.includes(cleanQuery);
    });
  }, [videosData, cleanQuery]);

  const matchedSeo = useMemo(() => {
    if (!cleanQuery) return [];
    return seoData.filter(s => {
      if (cleanQuery === 'seo' || cleanQuery === 'rank' || cleanQuery === 'ranking' || cleanQuery === 'rankings') return true;
      const client = (s.client || '').toLowerCase();
      const category = (s.category || '').toLowerCase();
      const topKeyword = (s.topKeyword || '').toLowerCase();
      const website = (s.website || '').toLowerCase();
      const notes = (s.notes || '').toLowerCase();
      return client.includes(cleanQuery) || category.includes(cleanQuery) || topKeyword.includes(cleanQuery) || website.includes(cleanQuery) || notes.includes(cleanQuery);
    });
  }, [seoData, cleanQuery]);

  const totalMatches = matchedGraphics.length + matchedVideos.length + matchedSeo.length;

  // Filtered Graphics for fast category exploration & real-time search inside Graphic Tab
  const filteredGraphics = useMemo(() => {
    return graphicsData.filter(g => {
      const matchesCategory = activeGraphicCategory === 'All' || g.category === activeGraphicCategory;
      if (!matchesCategory) return false;
      if (!cleanQuery) return true;
      if (cleanQuery === 'graphic' || cleanQuery === 'graphics') return true;
      const title = (g.title || '').toLowerCase();
      const client = (g.client || '').toLowerCase();
      const category = (g.category || '').toLowerCase();
      const format = (g.format || '').toLowerCase();
      const tags = Array.isArray(g.tags) ? g.tags.join(' ').toLowerCase() : '';
      return title.includes(cleanQuery) || client.includes(cleanQuery) || category.includes(cleanQuery) || format.includes(cleanQuery) || tags.includes(cleanQuery);
    });
  }, [graphicsData, activeGraphicCategory, cleanQuery]);

  // Filtered Videos for fast category exploration & real-time search inside Video Tab
  const filteredVideos = useMemo(() => {
    return videosData.filter(v => {
      const matchesCategory = activeVideoCategory === 'All' || v.category === activeVideoCategory;
      if (!matchesCategory) return false;
      if (!cleanQuery) return true;
      if (cleanQuery === 'video' || cleanQuery === 'videos' || cleanQuery === 'reel' || cleanQuery === 'reels') return true;
      const title = (v.title || '').toLowerCase();
      const client = (v.client || '').toLowerCase();
      const category = (v.category || '').toLowerCase();
      const tags = Array.isArray(v.tags) ? v.tags.join(' ').toLowerCase() : '';
      return title.includes(cleanQuery) || client.includes(cleanQuery) || category.includes(cleanQuery) || tags.includes(cleanQuery);
    });
  }, [videosData, activeVideoCategory, cleanQuery]);

  // Filtered SEO for fast category exploration & real-time search inside SEO Tab
  const filteredSeo = useMemo(() => {
    return seoData.filter(s => {
      const matchesCategory = activeSeoCategory === 'All' || s.category === activeSeoCategory;
      if (!matchesCategory) return false;
      if (!cleanQuery) return true;
      if (cleanQuery === 'seo' || cleanQuery === 'rank' || cleanQuery === 'ranking' || cleanQuery === 'rankings') return true;
      const client = (s.client || '').toLowerCase();
      const category = (s.category || '').toLowerCase();
      const topKeyword = (s.topKeyword || '').toLowerCase();
      const website = (s.website || '').toLowerCase();
      const notes = (s.notes || '').toLowerCase();
      return client.includes(cleanQuery) || category.includes(cleanQuery) || topKeyword.includes(cleanQuery) || website.includes(cleanQuery) || notes.includes(cleanQuery);
    });
  }, [seoData, activeSeoCategory, cleanQuery]);

  // Real-time dynamic greeting based on client time
  const dynamicGreeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good Morning, Admin!';
    if (hour >= 12 && hour < 17) return 'Good Afternoon, Admin!';
    if (hour >= 17 && hour < 22) return 'Good Evening, Admin!';
    return 'Welcome Back, Admin!';
  }, []);

  // Authentic SEO Proof Helper
  const getSeoThumb = (s) => {
    if (s?.rankingImage) return s.rankingImage;
    if (s?.proofImage) return s.proofImage;
    if (s?.image) return s.image;
    if (s?.thumbnail) return s.thumbnail;
    const client = (s?.client || '').toLowerCase();
    const website = (s?.website || '').toLowerCase();
    if (client.includes('zoniraz') || website.includes('zoniraz')) {
      return '/seo_gsc_performance.jpg';
    }
    if (client.includes('hospital') || client.includes('saniya')) {
      return 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80';
    }
    if (client.includes('dwps') || client.includes('school')) {
      return 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80';
    }
    if (client.includes('medicompares')) {
      return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80';
    }
    return '/seo_gsc_performance.jpg';
  };

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
            <div className="sidebar-avatar-3d-wrap" title="RizeWorld Studio">
              <img 
                src="/RW.png" 
                alt="RizeWorld Logo" 
                className="sidebar-avatar-3d-img"
              />
            </div>
            <div className="sidebar-user-greeting">
              <span className="sidebar-greet-name">
                {currentUser?.name ? `Hi, ${currentUser.name.split(' ')[0]}!` : 'Hi, Admin!'}
              </span>
              <span className="sidebar-greet-sub">RizeWorld Hub</span>
            </div>
          </div>

          {/* Navigation Links: Dedicated to the 3 Core Portfolios */}
          <nav className="sidebar-nav-menu">
            <button 
              className={`sidebar-nav-item ${activeNav === 'projects' || activeNav === 'home' ? 'sidebar-nav-item--active' : ''}`}
              onClick={() => {
                setActiveNav('projects');
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

            {onLogout && (
              <button 
                className="sidebar-nav-item sidebar-nav-item--logout"
                onClick={onLogout}
                title="Sign out of RizeWorld Admin"
              >
                <LuLogOut size={18} />
                <span>Logout</span>
              </button>
            )}
          </nav>

          {/* Bottom 'Go Pro' Clay Card (Matching Reference Bottom Card) */}
          <div className="sidebar-pro-clay-card">
            <div className="pro-card-visual-header">
              <img 
                src="/user_character_card.png" 
                alt="Studio Character" 
                className="pro-card-thumb-img" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/RW.png";
                }}
              />
            </div>
            <div className="pro-card-content">
              <div className="pro-card-crown">
                <LuGem size={18} color="#38bdf8" />
              </div>
              <span className="pro-card-title">Studio Pro</span>
              <span className="pro-card-sub">3 Portfolios Live</span>
            </div>
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
                    <LuImage size={20} color="#0284c7" /> Graphic Design Assets
                  </span>
                )}
                {activeNav === 'video' && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <LuFilm size={20} color="#6366f1" /> Video Reels Production
                  </span>
                )}
                {activeNav === 'seo' && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <LuTrendingUp size={20} color="#0891b2" /> SEO & SERP Dominance
                  </span>
                )}
                {(activeNav === 'home' || activeNav === 'projects') && 'Rizeworld Digital Marketing Pvt Ltd Company'}
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
              {/* 3 Quick Direct Add Buttons + Revert Recovery Center */}
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

                {/* Revert / Recovery Pill */}
                <button 
                  className={`quick-add-pill-btn quick-revert-pill-btn ${deletedHistory.length > 0 ? 'quick-revert-pill-btn--active' : ''}`}
                  onClick={onOpenRevertModal}
                  title={deletedHistory.length > 0 ? `Revert / Restore ${deletedHistory.length} deleted assets` : "Trash is empty"}
                >
                  <LuRotateCcw size={14} />
                  <span>Revert ({deletedHistory.length})</span>
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
                  placeholder="Search graphics, videos, SEO, clients, categories..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-inner-input"
                />
                {searchQuery && (
                  <button 
                    type="button" 
                    className="search-clear-mini-btn"
                    onClick={() => setSearchQuery('')}
                    title="Clear search"
                  >
                    <LuX size={13} />
                  </button>
                )}
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
              {/* Dedicated Sub-View Switcher for SEO: Ranked Partner Cards vs Page Content Editor */}
              {activeNav === 'seo' && (
                <div className="seo-mode-switch-bar">
                  <button
                    type="button"
                    className={`seo-mode-btn ${seoSubTab === 'partners' ? 'seo-mode-btn--active' : ''}`}
                    onClick={() => setSeoSubTab('partners')}
                  >
                    <LuTrendingUp size={16} />
                    <span>👥 SEO Ranked Partners ({seoData.length})</span>
                  </button>
                  <button
                    type="button"
                    className={`seo-mode-btn ${seoSubTab === 'content' ? 'seo-mode-btn--active' : ''}`}
                    onClick={() => setSeoSubTab('content')}
                  >
                    <LuFileText size={16} />
                    <span>📝 Edit SEO Portfolio Content (All 8 Sections)</span>
                  </button>
                </div>
              )}



              {activeNav === 'seo' && seoSubTab === 'content' ? (
                <SeoContentEditor showToast={showToast} />
              ) : (
                <>
                  <div className="crud-panel-header">
                    <div className="crud-header-meta">
                      <h2 className="crud-main-heading">
                        {activeNav === 'graphic' && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <LuImage size={20} color="#0284c7" /> Graphic Design Artworks & Posters ({graphicsData.length})
                          </span>
                        )}
                        {activeNav === 'video' && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <LuFilm size={20} color="#6366f1" /> Video Reels Production ({videosData.length})
                          </span>
                        )}
                        {activeNav === 'seo' && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <LuTrendingUp size={20} color="#0891b2" /> SEO Client Partners & Rankings ({seoData.length})
                          </span>
                        )}
                      </h2>
                      <p className="crud-sub-text">
                        Add new items, update existing details, or delete records. All changes save to real-time storage.
                      </p>
                    </div>
                    <div className="crud-header-actions-group">
                      {activeNav === 'graphic' && (
                        <button 
                          type="button"
                          className="crud-bulk-upload-header-btn"
                          onClick={onOpenBulkUploadModal}
                          title="Upload multiple posters (10, 15, 20+) at once with drag & drop"
                        >
                          <LuCloudUpload size={16} />
                          <span>⚡ Bulk Upload Images</span>
                        </button>
                      )}
                      {activeNav === 'seo' && (
                        <button 
                          type="button"
                          className="crud-edit-content-header-btn"
                          onClick={() => setSeoSubTab('content')}
                          title="Edit text, headlines, descriptions and sections of the SEO Portfolio"
                        >
                          <LuFileText size={15} />
                          <span>📝 Edit Site Content</span>
                        </button>
                      )}
                      {deletedHistory.some(i => i.deletedType === activeNav) && (
                        <button 
                          type="button"
                          className="crud-revert-header-btn"
                          onClick={() => onRevertLast(activeNav)}
                          title={`Revert and restore last deleted ${activeNav} item`}
                        >
                          <LuRotateCcw size={15} />
                          <span>↩ Revert Last Deleted</span>
                        </button>
                      )}
                      <button 
                        className="crud-add-main-btn"
                        onClick={() => onOpenModalWithMode(activeNav)}
                      >
                        <LuPlus size={16} />
                        <span>+ Add New {activeNav.toUpperCase()}</span>
                      </button>
                    </div>
                  </div>

              {/* Graphic Category Filter Pills */}
              {activeNav === 'graphic' && graphicCategories.length > 1 && (
                <div className="crud-category-filter-bar">
                  {graphicCategories.map(cat => {
                    const count = cat === 'All' ? graphicsData.length : graphicsData.filter(g => g.category === cat).length;
                    return (
                      <button
                        key={cat}
                        type="button"
                        className={`crud-cat-pill ${activeGraphicCategory === cat ? 'crud-cat-pill--active' : ''}`}
                        onClick={() => setActiveGraphicCategory(cat)}
                      >
                        {cat} ({count})
                      </button>
                    );
                  })}
                </div>
              )}



              {/* Video Category Filter Pills */}
              {activeNav === 'video' && videoCategories.length > 1 && (
                <div className="crud-category-filter-bar">
                  {videoCategories.map(cat => {
                    const count = cat === 'All' ? videosData.length : videosData.filter(v => v.category === cat).length;
                    return (
                      <button
                        key={cat}
                        type="button"
                        className={`crud-cat-pill ${activeVideoCategory === cat ? 'crud-cat-pill--active' : ''}`}
                        onClick={() => setActiveVideoCategory(cat)}
                      >
                        {cat} ({count})
                      </button>
                    );
                  })}
                </div>
              )}



              {/* SEO Category Filter Pills */}
              {activeNav === 'seo' && seoCategories.length > 1 && (
                <div className="crud-category-filter-bar">
                  {seoCategories.map(cat => {
                    const count = cat === 'All' ? seoData.length : seoData.filter(s => s.category === cat).length;
                    return (
                      <button
                        key={cat}
                        type="button"
                        className={`crud-cat-pill ${activeSeoCategory === cat ? 'crud-cat-pill--active' : ''}`}
                        onClick={() => setActiveSeoCategory(cat)}
                      >
                        {cat} ({count})
                      </button>
                    );
                  })}
                </div>
              )}



              {/* Smart Cross-Domain Search Notification in Dedicated Panel */}
              {cleanQuery && (
                <div className="search-context-summary-bar">
                  <div className="context-summary-left">
                    <LuSearch size={15} color="#0284c7" />
                    <span>
                      Filtering <strong>{activeNav.toUpperCase()}</strong> for "<strong>{searchQuery}</strong>" (
                      {activeNav === 'graphic' && `${filteredGraphics.length} artworks`}
                      {activeNav === 'video' && `${filteredVideos.length} reels`}
                      {activeNav === 'seo' && `${filteredSeo.length} clients`} found)
                    </span>
                  </div>
                  <div className="context-summary-right">
                    {activeNav !== 'graphic' && matchedGraphics.length > 0 && (
                      <button 
                        type="button" 
                        className="switch-search-domain-btn domain-graphic"
                        onClick={() => setActiveNav('graphic')}
                      >
                        🎨 View {matchedGraphics.length} Graphics
                      </button>
                    )}
                    {activeNav !== 'video' && matchedVideos.length > 0 && (
                      <button 
                        type="button" 
                        className="switch-search-domain-btn domain-video"
                        onClick={() => setActiveNav('video')}
                      >
                        🎬 View {matchedVideos.length} Videos
                      </button>
                    )}
                    {activeNav !== 'seo' && matchedSeo.length > 0 && (
                      <button 
                        type="button" 
                        className="switch-search-domain-btn domain-seo"
                        onClick={() => { setActiveNav('seo'); setSeoSubTab('partners'); }}
                      >
                        📈 View {matchedSeo.length} SEO
                      </button>
                    )}
                    <button 
                      type="button" 
                      className="clear-search-domain-btn"
                      onClick={() => setSearchQuery('')}
                      title="Clear search"
                    >
                      <LuX size={13} />
                      <span>Clear</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Recently Deleted In-Place Banner for Immediate Revert */}
              {lastDeleted && lastDeleted.deletedType === activeNav && (
                <div className="recent-deleted-banner">
                  <div className="deleted-banner-info">
                    <span className="deleted-banner-icon">🗑️</span>
                    <span>
                      Recently deleted: <strong>"{lastDeleted.title || lastDeleted.client}"</strong>
                    </span>
                  </div>
                  <div className="deleted-banner-actions">
                    <button 
                      type="button" 
                      className="btn-banner-revert"
                      onClick={() => onRestoreItem(lastDeleted)}
                      title="Undo delete and put this card back immediately"
                    >
                      <LuRotateCcw size={14} />
                      <span>↩ Revert & Restore Card</span>
                    </button>
                    <button
                      type="button"
                      className="btn-banner-open-trash"
                      onClick={onOpenRevertModal}
                      title="Open full trash recovery center"
                    >
                      View Trash ({deletedHistory.length})
                    </button>
                  </div>
                </div>
              )}



              {/* Items Grid */}
              <div className="crud-cards-grid">
                {activeNav === 'graphic' && filteredGraphics.map((item) => (
                  <div key={item.id} className="crud-item-card crud-item-card--graphic">
                    <div className="crud-card-thumb">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="crud-thumb-img" 
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80";
                        }}
                      />
                      <span className="crud-card-tag">{item.category}</span>
                    </div>
                    <div className="crud-card-body">
                      <div className="crud-body-header">
                        <div className="crud-icon-tile">
                          <LuImage size={18} />
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

                {activeNav === 'graphic' && filteredGraphics.length === 0 && (
                  <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#64748b' }}>
                    <p style={{ fontSize: '15px', fontWeight: 600 }}>No graphic artworks found in "{activeGraphicCategory}" category.</p>
                    <button 
                      className="crud-cat-pill crud-cat-pill--active"
                      style={{ marginTop: '12px' }}
                      onClick={() => { setActiveGraphicCategory('All'); setSearchQuery(''); }}
                    >
                      Reset Filter & View All ({graphicsData.length})
                    </button>
                  </div>
                )}

                {activeNav === 'video' && filteredVideos.map((item) => (
                  <div key={item.id} className="crud-item-card crud-item-card--video">
                    <div className={`crud-card-thumb crud-card-thumb--video ${playingVideoId === item.id ? 'playing-active' : ''}`}>
                      {playingVideoId === item.id ? (
                        <video 
                          src={item.video || item.videoUrl}
                          controls
                          autoPlay
                          playsInline
                          className="crud-active-video-player"
                        />
                      ) : (
                        <div 
                          className="crud-video-preview-trigger"
                          onClick={() => setPlayingVideoId(item.id)}
                          style={{ width: '100%', height: '100%', position: 'relative', cursor: 'pointer' }}
                          title="Click to play reel with sound"
                        >
                          <video 
                            src={item.video || item.videoUrl}
                            className="crud-thumb-img video-poster-img"
                            preload="metadata"
                            muted
                            playsInline
                            onMouseEnter={(e) => {
                              try { e.target.play().catch(() => {}); } catch {}
                            }}
                            onMouseLeave={(e) => {
                              try { e.target.pause(); e.target.currentTime = 0; } catch {}
                            }}
                          />
                          <div className="video-thumb-overlay">
                            <div className="clay-video-play-btn">
                              <LuPlay size={26} color="#ffffff" />
                            </div>
                          </div>
                          <span className="crud-card-tag">{item.category}</span>
                          <span className="crud-video-badge">{item.duration}</span>
                        </div>
                      )}
                    </div>
                    <div className="crud-card-body">
                      <div className="crud-body-header">
                        <div className="crud-icon-tile tile-blue">
                          <LuFilm size={18} />
                        </div>
                        <div className="crud-header-text-block">
                          <span className="crud-eyebrow-label">Commercial Reel</span>
                          <h4 className="crud-card-title">{item.title}</h4>
                        </div>
                      </div>
                      <span className="crud-card-client">{item.client} • {item.views} Views</span>
                      <div className="crud-card-actions">
                        <button 
                          className={`crud-btn ${playingVideoId === item.id ? 'crud-btn--playing' : 'crud-btn--play'}`}
                          style={{ 
                            background: playingVideoId === item.id ? '#10b981' : '#6366f1', 
                            color: '#ffffff',
                            fontWeight: 700 
                          }}
                          onClick={() => {
                            if (playingVideoId === item.id) {
                              setPlayingVideoId(null);
                            } else {
                              setPlayingVideoId(item.id);
                            }
                          }}
                        >
                          {playingVideoId === item.id ? <LuPause size={14} /> : <LuPlay size={14} />}
                          <span>{playingVideoId === item.id ? 'Stop' : 'Play Reel'}</span>
                        </button>
                        <button 
                          className="crud-btn crud-btn--fullscreen"
                          onClick={() => setActiveVideoModal(item)}
                          title="Open HD Cinema modal player"
                          style={{ background: 'rgba(255, 255, 255, 0.85)', color: '#1e293b' }}
                        >
                          <LuMaximize2 size={13} />
                          <span>Cinema</span>
                        </button>
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
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {activeNav === 'video' && filteredVideos.length === 0 && (
                  <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#64748b' }}>
                    <p style={{ fontSize: '15px', fontWeight: 600 }}>No video reels found in "{activeVideoCategory}" category.</p>
                    <button 
                      className="crud-cat-pill crud-cat-pill--active"
                      style={{ marginTop: '12px' }}
                      onClick={() => { setActiveVideoCategory('All'); setSearchQuery(''); }}
                    >
                      Reset Filter & View All ({videosData.length})
                    </button>
                  </div>
                )}

                {activeNav === 'seo' && filteredSeo.map((item) => (
                  <div key={item.id} className="crud-item-card crud-item-card--seo">
                    <div 
                      className="crud-card-thumb crud-card-thumb--seo"
                      onClick={() => onEditItem('seo', item)}
                      title="Click to update ranking image or details"
                      style={{ cursor: 'pointer' }}
                    >
                      <img 
                        src={getSeoThumb(item)} 
                        alt={item.client} 
                        className="crud-thumb-img seo-poster-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/seo_gsc_performance.jpg";
                        }}
                      />
                      <div className="crud-thumb-seo-overlay">
                        <span className="crud-card-tag">{item.category || item.googleRank || '#1 Position'}</span>
                        <span className="seo-growth-tag">{item.organicGrowth}</span>
                      </div>
                      <div className="seo-thumb-rank-pill-bottom">
                        <LuImage size={11} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                        <span>SERP Ranking Proof</span>
                      </div>
                    </div>
                    <div className="crud-card-body">
                      <div className="crud-body-header">
                        <div className="crud-icon-tile tile-ice">
                          <LuTrendingUp size={18} />
                        </div>
                        <div className="crud-header-text-block">
                          <span className="crud-eyebrow-label">SEO Partner</span>
                          <h4 className="crud-card-title">{item.client}</h4>
                        </div>
                      </div>
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

                {activeNav === 'seo' && filteredSeo.length === 0 && (
                  <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#64748b' }}>
                    <p style={{ fontSize: '15px', fontWeight: 600 }}>No SEO records found in "{activeSeoCategory}" category.</p>
                    <button 
                      className="crud-cat-pill crud-cat-pill--active"
                      style={{ marginTop: '12px' }}
                      onClick={() => { setActiveSeoCategory('All'); setSearchQuery(''); }}
                    >
                      Reset Filter & View All ({seoData.length})
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
          ) : (

            /* ============================================================
                VIEW 2: REAL AGENCY OVERVIEW DASHBOARD
                ============================================================ */
            <>
              {cleanQuery ? (
                <div className="global-search-results-panel glass-white-card">
                  <div className="search-results-header">
                    <div className="search-header-titles">
                      <div className="search-badge-row">
                        <span className="search-live-tag">
                          <LuSearch size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                          Live Portfolio Search
                        </span>
                        <span className="search-count-pill">{totalMatches} Matches Found</span>
                      </div>
                      <h2 className="search-main-heading">
                        Results for "<span className="search-term-highlight">{searchQuery}</span>"
                      </h2>
                    </div>

                    <div className="search-header-right">
                      {/* Filter Tabs */}
                      <div className="search-tabs-cluster">
                        <button
                          type="button"
                          className={`search-tab-pill ${searchFilterTab === 'all' ? 'active' : ''}`}
                          onClick={() => setSearchFilterTab('all')}
                        >
                          All ({totalMatches})
                        </button>
                        <button
                          type="button"
                          className={`search-tab-pill ${searchFilterTab === 'graphic' ? 'active' : ''}`}
                          onClick={() => setSearchFilterTab('graphic')}
                        >
                          🎨 Graphics ({matchedGraphics.length})
                        </button>
                        <button
                          type="button"
                          className={`search-tab-pill ${searchFilterTab === 'video' ? 'active' : ''}`}
                          onClick={() => setSearchFilterTab('video')}
                        >
                          🎬 Videos ({matchedVideos.length})
                        </button>
                        <button
                          type="button"
                          className={`search-tab-pill ${searchFilterTab === 'seo' ? 'active' : ''}`}
                          onClick={() => setSearchFilterTab('seo')}
                        >
                          📈 SEO ({matchedSeo.length})
                        </button>
                      </div>

                      <button
                        type="button"
                        className="btn-clear-global-search"
                        onClick={() => { setSearchQuery(''); setSearchFilterTab('all'); }}
                        title="Clear search and return to dashboard"
                      >
                        <LuX size={14} />
                        <span>Clear Search</span>
                      </button>
                    </div>
                  </div>

                  {/* Empty State */}
                  {totalMatches === 0 && (
                    <div className="search-empty-state">
                      <div className="search-empty-icon-wrap">
                        <LuSearch size={36} color="#94a3b8" />
                      </div>
                      <h3>No results found for "{searchQuery}"</h3>
                      <p>
                        Try searching by type (e.g. <code>graphic</code>, <code>video</code>, <code>seo</code>), 
                        category (e.g. <code>jewelry</code>, <code>fashion</code>, <code>restaurant</code>), or client name.
                      </p>
                      <button
                        type="button"
                        className="btn-empty-clear"
                        onClick={() => setSearchQuery('')}
                      >
                        Reset Search & View Overview
                      </button>
                    </div>
                  )}

                  {/* Search Cards Grid */}
                  {totalMatches > 0 && (
                    <div className="search-cards-grid">
                      {/* 1. Graphic Matches */}
                      {(searchFilterTab === 'all' || searchFilterTab === 'graphic') && matchedGraphics.map(item => (
                        <div key={`search-g-${item._id || item.id}`} className="search-item-card card-domain-graphic">
                          <div className="search-card-thumb-wrap">
                            <img 
                              src={item.image || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80"} 
                              alt={item.title} 
                              className="search-card-thumb"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/RW.png";
                              }}
                            />
                            <span className="search-domain-badge badge-graphic">🎨 Graphic</span>
                            <span className="search-category-badge">{item.category}</span>
                          </div>
                          <div className="search-card-body">
                            <h4 className="search-card-title">{item.title}</h4>
                            <div className="search-card-meta">
                              <span><strong>Client:</strong> {item.client || 'Creative Client'}</span>
                              {item.format && <span><strong>Format:</strong> {item.format}</span>}
                            </div>
                            {item.tags && item.tags.length > 0 && (
                              <div className="search-card-tags">
                                {(Array.isArray(item.tags) ? item.tags : [item.tags]).slice(0, 3).map((tag, idx) => (
                                  <span key={idx} className="search-tag-chip">#{tag}</span>
                                ))}
                              </div>
                            )}
                            <div className="search-card-actions">
                              <button
                                type="button"
                                className="search-btn-view"
                                onClick={() => setActiveNav('graphic')}
                                title="Open in Graphic Manager"
                              >
                                View Graphic
                              </button>
                              <button
                                type="button"
                                className="search-btn-icon"
                                onClick={() => onEditItem(item, 'graphic')}
                                title="Edit Artwork"
                              >
                                <LuPencil size={13} />
                              </button>
                              <button
                                type="button"
                                className="search-btn-icon search-btn-delete"
                                onClick={() => onDeleteItem(item._id, 'graphic')}
                                title="Delete Artwork"
                              >
                                <LuTrash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* 2. Video Matches */}
                      {(searchFilterTab === 'all' || searchFilterTab === 'video') && matchedVideos.map(item => (
                        <div key={`search-v-${item._id || item.id}`} className="search-item-card card-domain-video">
                          <div 
                            className="search-card-thumb-wrap video-thumb-interactive"
                            onClick={() => (item.video || item.videoUrl) && setActiveVideoModal(item)}
                            title="Click to play Reel"
                          >
                            <img 
                              src={item.thumbnail || "/rw_camera_card.jpg"} 
                              alt={item.title} 
                              className="search-card-thumb"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/rw_shoot_poster.jpg";
                              }}
                            />
                            <div className="search-video-play-btn">
                              <LuPlay size={18} fill="#ffffff" color="#ffffff" />
                            </div>
                            <span className="search-domain-badge badge-video">🎬 Video Reel</span>
                            <span className="search-category-badge">{item.category}</span>
                            {item.duration && <span className="search-duration-badge">{item.duration}</span>}
                          </div>
                          <div className="search-card-body">
                            <h4 className="search-card-title">{item.title}</h4>
                            <div className="search-card-meta">
                              <span><strong>Client:</strong> {item.client || 'Agency Partner'}</span>
                              {item.views && <span><strong>Views:</strong> {item.views}</span>}
                            </div>
                            {item.tags && item.tags.length > 0 && (
                              <div className="search-card-tags">
                                {(Array.isArray(item.tags) ? item.tags : [item.tags]).slice(0, 3).map((tag, idx) => (
                                  <span key={idx} className="search-tag-chip">#{tag}</span>
                                ))}
                              </div>
                            )}
                            <div className="search-card-actions">
                              <button
                                type="button"
                                className="search-btn-view"
                                onClick={() => setActiveNav('video')}
                                title="Open in Video Manager"
                              >
                                View Reel
                              </button>
                              <button
                                type="button"
                                className="search-btn-icon"
                                onClick={() => onEditItem(item, 'video')}
                                title="Edit Reel"
                              >
                                <LuPencil size={13} />
                              </button>
                              <button
                                type="button"
                                className="search-btn-icon search-btn-delete"
                                onClick={() => onDeleteItem(item._id, 'video')}
                                title="Delete Reel"
                              >
                                <LuTrash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* 3. SEO Matches */}
                      {(searchFilterTab === 'all' || searchFilterTab === 'seo') && matchedSeo.map(item => (
                        <div key={`search-s-${item._id || item.id}`} className="search-item-card card-domain-seo">
                          <div className="search-card-thumb-wrap">
                            <img 
                              src={getSeoThumb(item)} 
                              alt={item.client} 
                              className="search-card-thumb"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/seo_gsc_performance.jpg";
                              }}
                            />
                            <span className="search-domain-badge badge-seo">📈 SEO Rank</span>
                            <span className="search-rank-pill">{item.googleRank || 'Ranked'}</span>
                          </div>
                          <div className="search-card-body">
                            <h4 className="search-card-title">{item.client}</h4>
                            <div className="search-card-meta">
                              <span><strong>Keyword:</strong> {item.topKeyword || 'Target Keyword'}</span>
                              {item.organicGrowth && <span><strong>Growth:</strong> {item.organicGrowth}</span>}
                              {item.category && <span><strong>Category:</strong> {item.category}</span>}
                            </div>
                            <div className="search-card-actions">
                              <button
                                type="button"
                                className="search-btn-view"
                                onClick={() => { setActiveNav('seo'); setSeoSubTab('partners'); }}
                                title="Open in SEO Manager"
                              >
                                View Partner
                              </button>
                              <button
                                type="button"
                                className="search-btn-icon"
                                onClick={() => onEditItem(item, 'seo')}
                                title="Edit SEO Client"
                              >
                                <LuPencil size={13} />
                              </button>
                              <button
                                type="button"
                                className="search-btn-icon search-btn-delete"
                                onClick={() => onDeleteItem(item._id, 'seo')}
                                title="Delete SEO Client"
                              >
                                <LuTrash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <>
              {/* ============================================================
                  0. CLAY SHELF WELCOME BANNER (Matching Reference Top Banner)
                  ============================================================ */}
              <div className="clay-shelf-banner">
                <div className="shelf-character-col">
                  <div className="shelf-avatar-pill" title="RizeWorld Studio">
                    <img 
                      src="/RW.png" 
                      alt="RizeWorld Studio" 
                      className="shelf-character-img"
                    />
                  </div>
                </div>

                <div className="shelf-content-col">
                  <div className="shelf-greeting-row">
                    <span className="shelf-music-note">
                      <LuLayers size={18} color="#38bdf8" />
                    </span>
                    <h2 className="shelf-main-greeting">{dynamicGreeting}</h2>
                  </div>
                  <p className="shelf-sub-greeting">
                    Central Creative Command • Manage Graphic Artworks, 4K Cinema Reels & Google #1 SEO Domination in real-time.
                  </p>
                  <div className="shelf-actions-row">
                    <button 
                      className="shelf-clay-btn shelf-clay-btn--primary"
                      onClick={() => onOpenModalWithMode('graphic')}
                    >
                      <LuPlus size={15} />
                      <span>+ Create New Asset</span>
                    </button>

                    <div className="shelf-ports-quick">
                      <a href="http://localhost:5174/" target="_blank" rel="noreferrer" className="shelf-port-chip" title="Graphic Portfolio :5174">
                        <LuImage size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                        <span>:5174</span>
                        <LuExternalLink size={10} />
                      </a>
                      <a href="http://localhost:5175/" target="_blank" rel="noreferrer" className="shelf-port-chip" title="Video Portfolio :5175">
                        <LuFilm size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                        <span>:5175</span>
                        <LuExternalLink size={10} />
                      </a>
                      <a href="http://localhost:5173/" target="_blank" rel="noreferrer" className="shelf-port-chip" title="SEO Portfolio :5173">
                        <LuTrendingUp size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                        <span>:5173</span>
                        <LuExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="shelf-decor-col">
                  <div 
                    className="shelf-graphic-badge" 
                    title="RizeWorld Studio Central Command"
                    onClick={() => setActiveNav('graphic')}
                  >
                    <img 
                      src="/RW.png" 
                      alt="RizeWorld Official Studio" 
                      className="shelf-graphic-img" 
                    />
                  </div>
                </div>
              </div>

              {/* ============================================================
                  1. THE 4 CLAY STAT CARDS (With Large 3D Visual Illustrations)
                  ============================================================ */}
              <div className="clay-stat-cards-grid">
                {/* Card 1: Graphic Artworks (Soft Cyan Clay Card) - Features 3D Designer Character (User Reference Image 2!) */}
                <div 
                  className="clay-stat-card clay-stat-card--cyan"
                  onClick={() => setActiveNav('graphic')}
                  title="Click to manage Graphic Artworks"
                >
                  <div className="clay-stat-card-left">
                    <div className="clay-stat-icon-tile tile-cyan">
                      <LuImage size={20} />
                    </div>
                    <div className="clay-stat-info-group">
                      <span className="clay-stat-label">Graphic Assets</span>
                      <span className="clay-stat-number">{graphicsData.length || 42}</span>
                    </div>
                    <div className="clay-stat-bottom-row">
                      <span className="clay-stat-trend trend-teal">+18% this month</span>
                      <span className="clay-stat-asset-hint">Brand Artwork</span>
                    </div>
                  </div>
                  <div className="clay-stat-card-visual-box" title="3D Creative Creator">
                    <img 
                      src="/user_character_card.png" 
                      alt="3D Creative Character" 
                      className="clay-stat-big-illustration" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/RW.png';
                      }}
                    />
                    <div className="stat-studio-live-badge">
                      <span className="studio-live-dot"></span>
                      <span>Studio Live</span>
                    </div>
                  </div>
                </div>

                {/* Card 2: Video Reels (Soft Sky Blue Clay Card) - Real Agency Cinema Shoot Poster */}
                <div 
                  className="clay-stat-card clay-stat-card--blue"
                  onClick={() => setActiveNav('video')}
                  title="Click to manage Video Reels"
                >
                  <div className="clay-stat-card-left">
                    <div className="clay-stat-icon-tile tile-blue">
                      <LuFilm size={20} />
                    </div>
                    <div className="clay-stat-info-group">
                      <span className="clay-stat-label">Reels Active</span>
                      <span className="clay-stat-number">{videosData.length || 28}</span>
                    </div>
                    <div className="clay-stat-bottom-row">
                      <span className="clay-stat-trend trend-teal">+28% views</span>
                      <span className="clay-stat-asset-hint">4K Cinema Cut</span>
                    </div>
                  </div>
                  <div className="clay-stat-card-visual-box" title="4K Cinema Reels Shoot">
                    <img 
                      src="/rw_camera_card.jpg" 
                      alt="Video Reel Shoot Visual" 
                      className="clay-stat-big-illustration" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/rw_shoot_poster.jpg';
                      }}
                    />
                    <div className="stat-visual-play-chip">
                      <LuPlay size={18} color="#ffffff" />
                    </div>
                  </div>
                </div>

                {/* Card 3: SEO Top Rank (Frosted Ice Clay Card) - Real Google Search Console Performance Proof */}
                <div 
                  className="clay-stat-card clay-stat-card--ice"
                  onClick={() => setActiveNav('seo')}
                  title="Click to manage SEO Rankings"
                >
                  <div className="clay-stat-card-left">
                    <div className="clay-stat-icon-tile tile-ice">
                      <LuTrendingUp size={20} />
                    </div>
                    <div className="clay-stat-info-group">
                      <span className="clay-stat-label">SERP Ranking</span>
                      <span className="clay-stat-number">{seoData[0]?.googleRank || 'Avg Pos 8.5'}</span>
                    </div>
                    <div className="clay-stat-bottom-row">
                      <span className="clay-stat-trend trend-teal">+480% impr.</span>
                      <span className="clay-stat-asset-hint">GSC Verified</span>
                    </div>
                  </div>
                  <div className="clay-stat-card-visual-box" title="Google Search Console Ranking Proof">
                    <img 
                      src="/seo_gsc_card.jpg" 
                      alt="Google Search Console Performance" 
                      className="clay-stat-big-illustration" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/seo_gsc_performance.jpg';
                      }}
                    />
                    <span className="stat-visual-rank-pill">GSC Verified</span>
                  </div>
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
                        <LuImage size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
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
                    onClick={() => setActiveNav('graphic')}
                    style={{ cursor: 'pointer' }}
                    title="Click to view all Graphic Artworks"
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
                      onClick={() => onOpenBulkUploadModal && onOpenBulkUploadModal()}
                      title="Bulk drag & drop upload multiple posters at once"
                      style={{ background: '#f0f9ff', border: '1px solid #bae6fd', color: '#0284c7', fontWeight: 600 }}
                    >
                      <LuCloudUpload size={14} />
                      <span>⚡ Bulk Upload</span>
                    </button>
                    <button 
                      className="hub-btn hub-btn--add"
                      onClick={() => onOpenModalWithMode('graphic')}
                    >
                      <LuPlus size={14} />
                      <span>Upload</span>
                    </button>
                    <button 
                      className="hub-btn hub-btn--manage"
                      onClick={() => setActiveNav('graphic')}
                    >
                      <span>Manage ({graphicsData.length})</span>
                      <LuArrowRight size={13} />
                    </button>
                  </div>
                </section>


                {/* CARD 2: 🎬 VIDEO REELS PRODUCTION HUB */}
                <section className="glass-white-card card-portfolio-hub hub-video">
                  <div className="hub-header-row">
                    <div className="hub-title-block">
                      <span className="hub-tag-badge tag-video">
                        <LuFilm size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
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
                    onClick={() => setActiveNav('video')}
                    style={{ cursor: 'pointer' }}
                    title="Click to view all Video Reels"
                  >
                    <video 
                      src={videosData[0]?.video || videosData[0]?.videoUrl} 
                      className="hub-banner-img video-banner-img"
                      preload="metadata"
                      muted
                      playsInline
                    />
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
                        <LuTrendingUp size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
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
                    className="hub-preview-banner hub-seo-banner"
                    onClick={() => setActiveNav('seo')}
                    style={{ cursor: 'pointer' }}
                    title="Click to view all SEO records"
                  >
                    <img 
                      src={getSeoThumb(seoData[0]) || "/seo_gsc_performance.jpg"} 
                      alt={seoData[0]?.client || "Zoniraz Apparel - Google Search Console"} 
                      className="hub-banner-img seo-banner-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/seo_gsc_performance.jpg";
                      }}
                    />
                    <div className="hub-banner-overlay seo-banner-overlay">
                      <div className="seo-spotlight-top">
                        <span className="spotlight-rank">{seoData[0]?.googleRank || 'Avg Pos 8.5'}</span>
                        <span className="spotlight-growth">{seoData[0]?.organicGrowth || '+480%'}</span>
                      </div>
                      <span className="hub-banner-title">{seoData[0]?.client || "Zoniraz Apparel"}</span>
                      <span className="hub-banner-sub">
                        <LuKey size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                        {seoData[0]?.topKeyword || "Urban Streetwear & Fashion India"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="hub-action-row">
                    <button 
                      className="hub-btn hub-btn--add"
                      onClick={() => { setActiveNav('seo'); setSeoSubTab('content'); }}
                      title="Edit SEO site text, headlines, pillars & footer"
                      style={{ background: '#f0fdfa', border: '1px solid #ccfbf1', color: '#0f766e', fontWeight: 600 }}
                    >
                      <LuFileText size={14} />
                      <span>Edit Content</span>
                    </button>
                    <button 
                      className="hub-btn hub-btn--add"
                      onClick={() => onOpenModalWithMode('seo')}
                    >
                      <LuPlus size={14} />
                      <span>Add Partner</span>
                    </button>
                    <button 
                      className="hub-btn hub-btn--manage"
                      onClick={() => { setActiveNav('seo'); setSeoSubTab('partners'); }}
                    >
                      <span>Manage ({seoData.length})</span>
                      <LuArrowRight size={13} />
                    </button>
                  </div>
                </section>

              </div>

                </>
              )}

            </>
          )}

        </div>

      </div>

      {/* Fullscreen Video Player Modal */}
      {activeVideoModal && (
        <div className="glass-video-modal-backdrop" onClick={() => setActiveVideoModal(null)}>
          <div className="glass-video-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="glass-video-modal-header">
              <div className="modal-title-wrap">
                <span className="modal-eyebrow">{activeVideoModal.category}</span>
                <h3 className="modal-video-title">{activeVideoModal.title}</h3>
                <span className="modal-client-meta">{activeVideoModal.client} • {activeVideoModal.views} Views • {activeVideoModal.duration}</span>
              </div>
              <button 
                className="modal-close-round-btn"
                onClick={() => setActiveVideoModal(null)}
                title="Close player"
              >
                <LuX size={20} />
              </button>
            </div>
            <div className="glass-video-modal-player-box">
              <video 
                src={activeVideoModal.video || activeVideoModal.videoUrl}
                controls
                autoPlay
                playsInline
                className="modal-active-video-element"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
