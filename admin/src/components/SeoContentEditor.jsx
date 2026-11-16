import React, { useState, useEffect } from 'react';
import { 
  LuSave, 
  LuRotateCcw, 
  LuExternalLink, 
  LuSparkles, 
  LuFileText, 
  LuLayers, 
  LuGlobe, 
  LuTrendingUp, 
  LuPhone, 
  LuMail, 
  LuMapPin,
  LuCircleCheck,
  LuChevronRight
} from 'react-icons/lu';
import defaultSeoContent from '../data/seoContent.json';
import './SeoContentEditor.css';

const SECTIONS = [
  { id: 'hero', label: 'Hero Spotlight', icon: LuSparkles, desc: 'Tagline, Main Title, Badges & CTAs' },
  { id: 'projectOverview', label: '01. Project Overview', icon: LuGlobe, desc: 'SEO Objectives, Copy & Reviews' },
  { id: 'localSeo', label: '02. Local SEO', icon: LuMapPin, desc: 'Alwar Dominance & Strategy Cards' },
  { id: 'pillars', label: '03. Six Core Pillars', icon: LuLayers, desc: 'Technical, On-Page, Keywords & Features' },
  { id: 'funnel', label: '04. Search Funnel', icon: LuTrendingUp, desc: 'Intent Metrics & 4 Phase Steps' },
  { id: 'caseStudies', label: '05. Results & Proofs', icon: LuFileText, desc: 'Before/After Metrics & Client Cases' },
  { id: 'deepDive', label: '06. Strategy Deep-Dive', icon: LuFileText, desc: 'Featured & Stacked Case Studies' },
  { id: 'process', label: '07. 5-Step Process', icon: LuLayers, desc: 'Research to Expansion Methodology' },
  { id: 'footer', label: '08. Footer & Contact', icon: LuPhone, desc: 'Tagline, Email, Phone & Address' },
];

export default function SeoContentEditor({ showToast }) {
  const [activeSection, setActiveSection] = useState('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Initialize with saved localStorage or defaultSeoContent
  const [content, setContent] = useState(() => {
    try {
      const saved = localStorage.getItem('rw_seo_content');
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultSeoContent;
  });

  // Fetch freshest from Vite sync endpoint on mount
  useEffect(() => {
    fetch('/api/live-sync/seo-content')
      .then(res => res.json())
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setContent(data);
          try {
            localStorage.setItem('rw_seo_content', JSON.stringify(data));
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  // Generic shallow/deep updater
  const updateField = (section, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setIsDirty(true);
  };

  // Array item updater for nested arrays (e.g. pillars.items, funnel.steps)
  const updateArrayItem = (section, arrayKey, index, field, value) => {
    setContent(prev => {
      const arr = [...(prev[section]?.[arrayKey] || [])];
      arr[index] = { ...arr[index], [field]: value };
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [arrayKey]: arr
        }
      };
    });
    setIsDirty(true);
  };

  // Save changes to disk and localStorage
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 1. Save to localStorage
      localStorage.setItem('rw_seo_content', JSON.stringify(content));

      // 2. Save to disk via Vite sync endpoint
      const res = await fetch('/api/live-sync/seo-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      const data = await res.json();

      setIsDirty(false);
      if (showToast) {
        showToast('✅ SEO Portfolio Content Updated Live! (Port :5173)');
      }
    } catch (err) {
      console.error('Failed to save SEO content:', err);
      if (showToast) {
        showToast('⚠️ Saved locally, but disk sync failed');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default templates
  const handleResetToDefault = () => {
    if (window.confirm('Are you sure you want to reset all SEO content to original defaults?')) {
      setContent(defaultSeoContent);
      setIsDirty(true);
      if (showToast) {
        showToast('Reset to original SEO content. Click Save to persist.');
      }
    }
  };

  return (
    <div className="seo-editor-container">
      {/* Top Header Card */}
      <div className="seo-editor-header">
        <div className="seo-editor-header__left">
          <div className="seo-editor-pill">
            <span className="seo-editor-pill__dot" />
            <span>Live Content Management Engine</span>
          </div>
          <h2 className="seo-editor-title">
            <span>SEO Portfolio</span> Content Editor
          </h2>
          <p className="seo-editor-subtitle">
            Update headlines, descriptions, metrics, keywords & sections for the live SEO portfolio. All changes sync directly to disk and reload live on <code>localhost:5173</code>.
          </p>
        </div>

        <div className="seo-editor-header__right">
          <a
            href="http://localhost:5173/"
            target="_blank"
            rel="noreferrer"
            className="seo-btn-preview"
            title="Open live SEO Portfolio in a new tab"
          >
            <LuExternalLink size={15} />
            <span>Open SEO Site (:5173)</span>
          </a>

          <button
            type="button"
            className="seo-btn-reset"
            onClick={handleResetToDefault}
            title="Reset to default text templates"
          >
            <LuRotateCcw size={14} />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            className={`seo-btn-save ${isDirty ? 'seo-btn-save--dirty' : ''}`}
            onClick={handleSave}
            disabled={isSaving}
          >
            <LuSave size={16} />
            <span>{isSaving ? 'Saving to Disk...' : isDirty ? '💾 Save Changes (Unsaved)' : '✓ Changes Saved'}</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout: Left Nav Pills, Right Form Fields */}
      <div className="seo-editor-workspace">
        {/* Left Section Navigation */}
        <aside className="seo-editor-sidebar">
          <span className="seo-sidebar-label">PORTFOLIO SECTIONS</span>
          <div className="seo-sidebar-nav">
            {SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  type="button"
                  className={`seo-nav-card ${isActive ? 'seo-nav-card--active' : ''}`}
                  onClick={() => setActiveSection(sec.id)}
                >
                  <div className="seo-nav-card__icon">
                    <Icon size={18} />
                  </div>
                  <div className="seo-nav-card__info">
                    <span className="seo-nav-card__title">{sec.label}</span>
                    <span className="seo-nav-card__desc">{sec.desc}</span>
                  </div>
                  <LuChevronRight size={14} className="seo-nav-card__arrow" />
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Editor Form Area */}
        <main className="seo-editor-main">
          {/* SECTION: HERO */}
          {activeSection === 'hero' && (
            <div className="seo-form-card">
              <div className="seo-form-card__head">
                <h3>🌟 Hero Spotlight Section</h3>
                <p>Edit the top-fold headline, spotlight status pill, description, and primary CTA buttons.</p>
              </div>

              <div className="seo-form-grid">
                <div className="seo-form-field full-width">
                  <label>Status Pill Badge Text</label>
                  <input
                    type="text"
                    value={content.hero?.statusPill || ''}
                    onChange={(e) => updateField('hero', 'statusPill', e.target.value)}
                    placeholder="e.g. RizeWorld · Ranked #1 in Alwar & Local Pack"
                  />
                </div>

                <div className="seo-form-field half-width">
                  <label>Headline Row 1</label>
                  <input
                    type="text"
                    value={content.hero?.titleRow1 || ''}
                    onChange={(e) => updateField('hero', 'titleRow1', e.target.value)}
                    placeholder="e.g. Get seen by"
                  />
                </div>

                <div className="seo-form-field quarter-width">
                  <label>Highlight Badge 1 (Orange)</label>
                  <input
                    type="text"
                    value={content.hero?.titleBadge1 || ''}
                    onChange={(e) => updateField('hero', 'titleBadge1', e.target.value)}
                    placeholder="e.g. right"
                  />
                </div>

                <div className="seo-form-field quarter-width">
                  <label>Highlight Badge 2 (Green)</label>
                  <input
                    type="text"
                    value={content.hero?.titleBadge2 || ''}
                    onChange={(e) => updateField('hero', 'titleBadge2', e.target.value)}
                    placeholder="e.g. crowd."
                  />
                </div>

                <div className="seo-form-field full-width">
                  <label>Hero Subtitle / Description</label>
                  <textarea
                    rows={3}
                    value={content.hero?.subtitle || ''}
                    onChange={(e) => updateField('hero', 'subtitle', e.target.value)}
                    placeholder="Description paragraph below main headline..."
                  />
                </div>

                <div className="seo-form-field half-width">
                  <label>Primary Button Text</label>
                  <input
                    type="text"
                    value={content.hero?.primaryBtnText || ''}
                    onChange={(e) => updateField('hero', 'primaryBtnText', e.target.value)}
                    placeholder="e.g. Explore SEO Strategy"
                  />
                </div>

                <div className="seo-form-field half-width">
                  <label>Secondary Button Text</label>
                  <input
                    type="text"
                    value={content.hero?.secondaryBtnText || ''}
                    onChange={(e) => updateField('hero', 'secondaryBtnText', e.target.value)}
                    placeholder="e.g. See Results"
                  />
                </div>

                <div className="seo-form-field full-width">
                  <label>Radar Tracker Header Text</label>
                  <input
                    type="text"
                    value={content.hero?.radarPillText || ''}
                    onChange={(e) => updateField('hero', 'radarPillText', e.target.value)}
                    placeholder="e.g. MOVE TO REACH · CLICK TO LAUNCH A CAMPAIGN"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION: PROJECT OVERVIEW */}
          {activeSection === 'projectOverview' && (
            <div className="seo-form-card">
              <div className="seo-form-card__head">
                <h3>📍 (01) Project Overview & SEO Objective</h3>
                <p>Edit section pills, headline, long-form overview copy, and live radar status.</p>
              </div>

              <div className="seo-form-grid">
                <div className="seo-form-field half-width">
                  <label>Section Pill</label>
                  <input
                    type="text"
                    value={content.projectOverview?.sectionPill || ''}
                    onChange={(e) => updateField('projectOverview', 'sectionPill', e.target.value)}
                  />
                </div>

                <div className="seo-form-field half-width">
                  <label>Reviews Badge Text</label>
                  <input
                    type="text"
                    value={content.projectOverview?.reviewsRating || ''}
                    onChange={(e) => updateField('projectOverview', 'reviewsRating', e.target.value)}
                  />
                </div>

                <div className="seo-form-field half-width">
                  <label>Title Main</label>
                  <input
                    type="text"
                    value={content.projectOverview?.titleMain || ''}
                    onChange={(e) => updateField('projectOverview', 'titleMain', e.target.value)}
                  />
                </div>

                <div className="seo-form-field quarter-width">
                  <label>Title Badge 1 (Orange)</label>
                  <input
                    type="text"
                    value={content.projectOverview?.titleBadge1 || ''}
                    onChange={(e) => updateField('projectOverview', 'titleBadge1', e.target.value)}
                  />
                </div>

                <div className="seo-form-field quarter-width">
                  <label>Title Badge 2 (Green)</label>
                  <input
                    type="text"
                    value={content.projectOverview?.titleBadge2 || ''}
                    onChange={(e) => updateField('projectOverview', 'titleBadge2', e.target.value)}
                  />
                </div>

                <div className="seo-form-field full-width">
                  <label>Paragraph 1 (Main Objective)</label>
                  <textarea
                    rows={3}
                    value={content.projectOverview?.descParagraph1 || ''}
                    onChange={(e) => updateField('projectOverview', 'descParagraph1', e.target.value)}
                  />
                </div>

                <div className="seo-form-field full-width">
                  <label>Paragraph 2 (Approach & Execution)</label>
                  <textarea
                    rows={3}
                    value={content.projectOverview?.descParagraph2 || ''}
                    onChange={(e) => updateField('projectOverview', 'descParagraph2', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION: LOCAL SEO */}
          {activeSection === 'localSeo' && (
            <div className="seo-form-card">
              <div className="seo-form-card__head">
                <h3>🗺️ (02) Local SEO Strategy (Alwar)</h3>
                <p>Edit local pack headlines, location signals, and the 3 strategy cards (GBP, Citations, On-Page).</p>
              </div>

              <div className="seo-form-grid">
                <div className="seo-form-field half-width">
                  <label>Section Pill</label>
                  <input
                    type="text"
                    value={content.localSeo?.sectionPill || ''}
                    onChange={(e) => updateField('localSeo', 'sectionPill', e.target.value)}
                  />
                </div>

                <div className="seo-form-field half-width">
                  <label>Title Line 1</label>
                  <input
                    type="text"
                    value={content.localSeo?.titleLine1 || ''}
                    onChange={(e) => updateField('localSeo', 'titleLine1', e.target.value)}
                  />
                </div>

                <div className="seo-form-field full-width">
                  <label>Title Badge Highlight</label>
                  <input
                    type="text"
                    value={content.localSeo?.titleBadge || ''}
                    onChange={(e) => updateField('localSeo', 'titleBadge', e.target.value)}
                  />
                </div>

                <div className="seo-form-field full-width">
                  <label>Main Strategy Description</label>
                  <textarea
                    rows={3}
                    value={content.localSeo?.description || ''}
                    onChange={(e) => updateField('localSeo', 'description', e.target.value)}
                  />
                </div>
              </div>

              {/* 3 Local SEO Cards */}
              <h4 className="seo-sub-heading">Three Local SEO Execution Cards</h4>
              <div className="seo-cards-editor-grid">
                {(content.localSeo?.cards || []).map((card, idx) => (
                  <div key={card.id || idx} className="seo-sub-card">
                    <span className="seo-sub-card__badge">Card {idx + 1}</span>
                    <div className="seo-form-field full-width">
                      <label>Title</label>
                      <input
                        type="text"
                        value={card.title || ''}
                        onChange={(e) => updateArrayItem('localSeo', 'cards', idx, 'title', e.target.value)}
                      />
                    </div>
                    <div className="seo-form-field full-width">
                      <label>Description</label>
                      <textarea
                        rows={2}
                        value={card.desc || ''}
                        onChange={(e) => updateArrayItem('localSeo', 'cards', idx, 'desc', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: SIX CORE PILLARS */}
          {activeSection === 'pillars' && (
            <div className="seo-form-card">
              <div className="seo-form-card__head">
                <h3>🏛️ (03) Six Core SEO Strategy Pillars</h3>
                <p>Customize the 6 core pillars displayed in the interactive accordion.</p>
              </div>

              <div className="seo-form-grid">
                <div className="seo-form-field half-width">
                  <label>Section Pill</label>
                  <input
                    type="text"
                    value={content.pillars?.sectionPill || ''}
                    onChange={(e) => updateField('pillars', 'sectionPill', e.target.value)}
                  />
                </div>

                <div className="seo-form-field half-width">
                  <label>Section Title</label>
                  <input
                    type="text"
                    value={content.pillars?.title || ''}
                    onChange={(e) => updateField('pillars', 'title', e.target.value)}
                  />
                </div>

                <div className="seo-form-field full-width">
                  <label>Section Subtitle / Description</label>
                  <textarea
                    rows={2}
                    value={content.pillars?.subtitle || ''}
                    onChange={(e) => updateField('pillars', 'subtitle', e.target.value)}
                  />
                </div>
              </div>

              {/* Pillars Items */}
              <h4 className="seo-sub-heading">6 Pillar Accordion Cards</h4>
              <div className="seo-cards-editor-grid">
                {(content.pillars?.items || []).map((pillar, idx) => (
                  <div key={pillar.id || idx} className="seo-sub-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="seo-sub-card__badge">Pillar 0{idx + 1}</span>
                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>ID: {pillar.id}</span>
                    </div>

                    <div className="seo-form-field full-width" style={{ marginTop: '8px' }}>
                      <label>Pillar Name</label>
                      <input
                        type="text"
                        value={pillar.name || ''}
                        onChange={(e) => updateArrayItem('pillars', 'items', idx, 'name', e.target.value)}
                      />
                    </div>

                    <div className="seo-form-field full-width">
                      <label>Badge Label</label>
                      <input
                        type="text"
                        value={pillar.badge || ''}
                        onChange={(e) => updateArrayItem('pillars', 'items', idx, 'badge', e.target.value)}
                      />
                    </div>

                    <div className="seo-form-field full-width">
                      <label>Description</label>
                      <textarea
                        rows={2}
                        value={pillar.desc || ''}
                        onChange={(e) => updateArrayItem('pillars', 'items', idx, 'desc', e.target.value)}
                      />
                    </div>

                    <div className="seo-form-field full-width">
                      <label>Features (Comma or newline separated)</label>
                      <textarea
                        rows={3}
                        value={Array.isArray(pillar.features) ? pillar.features.join('\n') : (pillar.features || '')}
                        onChange={(e) => {
                          const lines = e.target.value.split('\n').filter(Boolean);
                          updateArrayItem('pillars', 'items', idx, 'features', lines);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: SEARCH FUNNEL */}
          {activeSection === 'funnel' && (
            <div className="seo-form-card">
              <div className="seo-form-card__head">
                <h3>⏳ (04) Search Intent Funnel Implementation</h3>
                <p>Edit counter target numbers (Reach, Clicks, Leads, Clients) and the 4 execution phases.</p>
              </div>

              <div className="seo-form-grid">
                <div className="seo-form-field half-width">
                  <label>Section Pill</label>
                  <input
                    type="text"
                    value={content.funnel?.sectionPill || ''}
                    onChange={(e) => updateField('funnel', 'sectionPill', e.target.value)}
                  />
                </div>

                <div className="seo-form-field half-width">
                  <label>Title Line 1</label>
                  <input
                    type="text"
                    value={content.funnel?.titleLine1 || ''}
                    onChange={(e) => updateField('funnel', 'titleLine1', e.target.value)}
                  />
                </div>

                <div className="seo-form-field full-width">
                  <label>Title Highlight Badge</label>
                  <input
                    type="text"
                    value={content.funnel?.titleBadge || ''}
                    onChange={(e) => updateField('funnel', 'titleBadge', e.target.value)}
                  />
                </div>

                <div className="seo-form-field full-width">
                  <label>Description</label>
                  <textarea
                    rows={2}
                    value={content.funnel?.desc || ''}
                    onChange={(e) => updateField('funnel', 'desc', e.target.value)}
                  />
                </div>
              </div>

              {/* 4 Counter Metrics */}
              <h4 className="seo-sub-heading">Dynamic Counter Metrics (Animated in Funnel)</h4>
              <div className="seo-metrics-grid">
                <div className="seo-metric-box">
                  <span className="seo-metric-box__tag">01 REACH</span>
                  <input
                    type="number"
                    value={content.funnel?.targets?.reach || 1284300}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10) || 0;
                      setContent(prev => ({
                        ...prev,
                        funnel: {
                          ...prev.funnel,
                          targets: { ...prev.funnel?.targets, reach: val }
                        }
                      }));
                      setIsDirty(true);
                    }}
                  />
                </div>

                <div className="seo-metric-box">
                  <span className="seo-metric-box__tag">02 CLICKS</span>
                  <input
                    type="number"
                    value={content.funnel?.targets?.clicks || 48120}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10) || 0;
                      setContent(prev => ({
                        ...prev,
                        funnel: {
                          ...prev.funnel,
                          targets: { ...prev.funnel?.targets, clicks: val }
                        }
                      }));
                      setIsDirty(true);
                    }}
                  />
                </div>

                <div className="seo-metric-box">
                  <span className="seo-metric-box__tag">03 LEADS</span>
                  <input
                    type="number"
                    value={content.funnel?.targets?.leads || 2940}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10) || 0;
                      setContent(prev => ({
                        ...prev,
                        funnel: {
                          ...prev.funnel,
                          targets: { ...prev.funnel?.targets, leads: val }
                        }
                      }));
                      setIsDirty(true);
                    }}
                  />
                </div>

                <div className="seo-metric-box">
                  <span className="seo-metric-box__tag">04 CLIENTS</span>
                  <input
                    type="number"
                    value={content.funnel?.targets?.clients || 312}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10) || 0;
                      setContent(prev => ({
                        ...prev,
                        funnel: {
                          ...prev.funnel,
                          targets: { ...prev.funnel?.targets, clients: val }
                        }
                      }));
                      setIsDirty(true);
                    }}
                  />
                </div>
              </div>

              {/* 4 Phases Timeline */}
              <h4 className="seo-sub-heading" style={{ marginTop: '24px' }}>4 Timeline Steps</h4>
              <div className="seo-cards-editor-grid">
                {(content.funnel?.steps || []).map((step, idx) => (
                  <div key={step.num || idx} className="seo-sub-card">
                    <span className="seo-sub-card__badge">Phase 0{idx + 1}</span>
                    <div className="seo-form-field full-width" style={{ marginTop: '8px' }}>
                      <label>Title</label>
                      <input
                        type="text"
                        value={step.title || ''}
                        onChange={(e) => updateArrayItem('funnel', 'steps', idx, 'title', e.target.value)}
                      />
                    </div>
                    <div className="seo-form-field full-width">
                      <label>Description</label>
                      <textarea
                        rows={2}
                        value={step.desc || ''}
                        onChange={(e) => updateArrayItem('funnel', 'steps', idx, 'desc', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: RESULTS & CASE STUDIES */}
          {activeSection === 'caseStudies' && (
            <div className="seo-form-card">
              <div className="seo-form-card__head">
                <h3>📈 (05) SEO Results & Case Studies</h3>
                <p>Update measurable before/after metrics, rank proofs, and project case study summaries.</p>
              </div>

              <div className="seo-form-grid">
                <div className="seo-form-field half-width">
                  <label>Section Pill</label>
                  <input
                    type="text"
                    value={content.caseStudies?.sectionPill || ''}
                    onChange={(e) => updateField('caseStudies', 'sectionPill', e.target.value)}
                  />
                </div>

                <div className="seo-form-field half-width">
                  <label>Title Main</label>
                  <input
                    type="text"
                    value={content.caseStudies?.titleMain || ''}
                    onChange={(e) => updateField('caseStudies', 'titleMain', e.target.value)}
                  />
                </div>

                <div className="seo-form-field full-width">
                  <label>Section Subtitle</label>
                  <textarea
                    rows={2}
                    value={content.caseStudies?.subtitle || ''}
                    onChange={(e) => updateField('caseStudies', 'subtitle', e.target.value)}
                  />
                </div>
              </div>

              {/* 4 Case Studies */}
              <h4 className="seo-sub-heading">4 Interactive Split-Slider Case Studies</h4>
              <div className="seo-cards-editor-grid">
                {(content.caseStudies?.studies || []).map((cs, idx) => (
                  <div key={cs.id || idx} className="seo-sub-card">
                    <span className="seo-sub-card__badge">Case Study 0{idx + 1}</span>

                    <div className="seo-form-field full-width" style={{ marginTop: '8px' }}>
                      <label>Case Study Name</label>
                      <input
                        type="text"
                        value={cs.name || ''}
                        onChange={(e) => updateArrayItem('caseStudies', 'studies', idx, 'name', e.target.value)}
                      />
                    </div>

                    <div className="seo-form-field full-width">
                      <label>Metric Label</label>
                      <input
                        type="text"
                        value={cs.metricLabel || ''}
                        onChange={(e) => updateArrayItem('caseStudies', 'studies', idx, 'metricLabel', e.target.value)}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div className="seo-form-field">
                        <label>Before Value</label>
                        <input
                          type="text"
                          value={cs.beforeVal || ''}
                          onChange={(e) => updateArrayItem('caseStudies', 'studies', idx, 'beforeVal', e.target.value)}
                        />
                      </div>
                      <div className="seo-form-field">
                        <label>After Value</label>
                        <input
                          type="text"
                          value={cs.afterVal || ''}
                          onChange={(e) => updateArrayItem('caseStudies', 'studies', idx, 'afterVal', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="seo-form-field full-width">
                      <label>Highlight Summary</label>
                      <input
                        type="text"
                        value={cs.summary || ''}
                        onChange={(e) => updateArrayItem('caseStudies', 'studies', idx, 'summary', e.target.value)}
                      />
                    </div>

                    <div className="seo-form-field full-width">
                      <label>Description</label>
                      <textarea
                        rows={2}
                        value={cs.desc || ''}
                        onChange={(e) => updateArrayItem('caseStudies', 'studies', idx, 'desc', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: STRATEGY DEEP DIVE */}
          {activeSection === 'deepDive' && (
            <div className="seo-form-card">
              <div className="seo-form-card__head">
                <h3>📚 (06) SEO Strategy Deep-Dive</h3>
                <p>Edit the interactive 3-card stack (Featured main article and stacked secondary case studies).</p>
              </div>

              <div className="seo-form-grid">
                <div className="seo-form-field half-width">
                  <label>Section Pill</label>
                  <input
                    type="text"
                    value={content.deepDive?.sectionPill || ''}
                    onChange={(e) => updateField('deepDive', 'sectionPill', e.target.value)}
                  />
                </div>

                <div className="seo-form-field half-width">
                  <label>Title Main</label>
                  <input
                    type="text"
                    value={content.deepDive?.title || ''}
                    onChange={(e) => updateField('deepDive', 'title', e.target.value)}
                  />
                </div>
              </div>

              {/* Featured Article */}
              <h4 className="seo-sub-heading">Featured Large Article</h4>
              <div className="seo-sub-card" style={{ marginBottom: '20px' }}>
                <div className="seo-form-grid">
                  <div className="seo-form-field half-width">
                    <label>Category Label</label>
                    <input
                      type="text"
                      value={content.deepDive?.featured?.category || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setContent(prev => ({
                          ...prev,
                          deepDive: {
                            ...prev.deepDive,
                            featured: { ...prev.deepDive?.featured, category: val }
                          }
                        }));
                        setIsDirty(true);
                      }}
                    />
                  </div>

                  <div className="seo-form-field half-width">
                    <label>Reads Badge</label>
                    <input
                      type="text"
                      value={content.deepDive?.featured?.readsBadge || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setContent(prev => ({
                          ...prev,
                          deepDive: {
                            ...prev.deepDive,
                            featured: { ...prev.deepDive?.featured, readsBadge: val }
                          }
                        }));
                        setIsDirty(true);
                      }}
                    />
                  </div>

                  <div className="seo-form-field full-width">
                    <label>Article Title</label>
                    <input
                      type="text"
                      value={content.deepDive?.featured?.title || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setContent(prev => ({
                          ...prev,
                          deepDive: {
                            ...prev.deepDive,
                            featured: { ...prev.deepDive?.featured, title: val }
                          }
                        }));
                        setIsDirty(true);
                      }}
                    />
                  </div>

                  <div className="seo-form-field full-width">
                    <label>Article Excerpt / Summary</label>
                    <textarea
                      rows={3}
                      value={content.deepDive?.featured?.excerpt || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setContent(prev => ({
                          ...prev,
                          deepDive: {
                            ...prev.deepDive,
                            featured: { ...prev.deepDive?.featured, excerpt: val }
                          }
                        }));
                        setIsDirty(true);
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Stacked Articles */}
              <h4 className="seo-sub-heading">Stacked Supporting Articles (2 Cards)</h4>
              <div className="seo-cards-editor-grid">
                {(content.deepDive?.stacked || []).map((art, idx) => (
                  <div key={art.id || idx} className="seo-sub-card">
                    <span className="seo-sub-card__badge">Stacked #{idx + 1}</span>

                    <div className="seo-form-field full-width" style={{ marginTop: '8px' }}>
                      <label>Title</label>
                      <input
                        type="text"
                        value={art.title || ''}
                        onChange={(e) => updateArrayItem('deepDive', 'stacked', idx, 'title', e.target.value)}
                      />
                    </div>

                    <div className="seo-form-field full-width">
                      <label>Badge</label>
                      <input
                        type="text"
                        value={art.readsBadge || ''}
                        onChange={(e) => updateArrayItem('deepDive', 'stacked', idx, 'readsBadge', e.target.value)}
                      />
                    </div>

                    <div className="seo-form-field full-width">
                      <label>Excerpt</label>
                      <textarea
                        rows={2}
                        value={art.excerpt || ''}
                        onChange={(e) => updateArrayItem('deepDive', 'stacked', idx, 'excerpt', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: STEP-BY-STEP PROCESS */}
          {activeSection === 'process' && (
            <div className="seo-form-card">
              <div className="seo-form-card__head">
                <h3>🔄 (07) 5-Step Process Methodology</h3>
                <p>Customize the 5 steps from Research to Continuous Improvement.</p>
              </div>

              <div className="seo-form-grid">
                <div className="seo-form-field half-width">
                  <label>Section Pill</label>
                  <input
                    type="text"
                    value={content.process?.sectionPill || ''}
                    onChange={(e) => updateField('process', 'sectionPill', e.target.value)}
                  />
                </div>

                <div className="seo-form-field half-width">
                  <label>Section Title</label>
                  <input
                    type="text"
                    value={content.process?.title || ''}
                    onChange={(e) => updateField('process', 'title', e.target.value)}
                  />
                </div>
              </div>

              {/* 5 Steps */}
              <h4 className="seo-sub-heading">5 Structured Steps</h4>
              <div className="seo-cards-editor-grid">
                {(content.process?.steps || []).map((st, idx) => (
                  <div key={st.num || idx} className="seo-sub-card">
                    <span className="seo-sub-card__badge">Step 0{idx + 1}</span>

                    <div className="seo-form-field full-width" style={{ marginTop: '8px' }}>
                      <label>Step Title</label>
                      <input
                        type="text"
                        value={st.title || ''}
                        onChange={(e) => updateArrayItem('process', 'steps', idx, 'title', e.target.value)}
                      />
                    </div>

                    <div className="seo-form-field full-width">
                      <label>Tagline</label>
                      <input
                        type="text"
                        value={st.tagline || ''}
                        onChange={(e) => updateArrayItem('process', 'steps', idx, 'tagline', e.target.value)}
                      />
                    </div>

                    <div className="seo-form-field full-width">
                      <label>Description</label>
                      <textarea
                        rows={2}
                        value={st.desc || ''}
                        onChange={(e) => updateArrayItem('process', 'steps', idx, 'desc', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: FOOTER & CONTACT */}
          {activeSection === 'footer' && (
            <div className="seo-form-card">
              <div className="seo-form-card__head">
                <h3>📞 (08) Footer & Final CTA Contact Information</h3>
                <p>Update company brand summary, status pill, official contact details, address, and copyright.</p>
              </div>

              <div className="seo-form-grid">
                <div className="seo-form-field full-width">
                  <label>Footer Brand Tagline</label>
                  <textarea
                    rows={3}
                    value={content.footer?.tagline || ''}
                    onChange={(e) => updateField('footer', 'tagline', e.target.value)}
                  />
                </div>

                <div className="seo-form-field full-width">
                  <label>Availability / Ranking Status Pill</label>
                  <input
                    type="text"
                    value={content.footer?.statusPill || ''}
                    onChange={(e) => updateField('footer', 'statusPill', e.target.value)}
                  />
                </div>

                <div className="seo-form-field half-width">
                  <label>Official Email</label>
                  <input
                    type="email"
                    value={content.footer?.email || ''}
                    onChange={(e) => updateField('footer', 'email', e.target.value)}
                  />
                </div>

                <div className="seo-form-field half-width">
                  <label>Official Phone Number</label>
                  <input
                    type="text"
                    value={content.footer?.phone || ''}
                    onChange={(e) => updateField('footer', 'phone', e.target.value)}
                  />
                </div>

                <div className="seo-form-field full-width">
                  <label>Office Address</label>
                  <textarea
                    rows={2}
                    value={content.footer?.address || ''}
                    onChange={(e) => updateField('footer', 'address', e.target.value)}
                  />
                </div>

                <div className="seo-form-field full-width">
                  <label>Copyright Notice</label>
                  <input
                    type="text"
                    value={content.footer?.copyright || ''}
                    onChange={(e) => updateField('footer', 'copyright', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Floating Bottom Sticky Bar if Dirty */}
      {isDirty && (
        <div className="seo-floating-bar">
          <div className="seo-floating-bar__left">
            <span className="seo-floating-pulse" />
            <span>You have unsaved changes in section: <strong>{SECTIONS.find(s => s.id === activeSection)?.label}</strong></span>
          </div>
          <div className="seo-floating-bar__right">
            <button
              type="button"
              className="seo-floating-btn-cancel"
              onClick={handleResetToDefault}
            >
              Reset
            </button>
            <button
              type="button"
              className="seo-floating-btn-save"
              onClick={handleSave}
              disabled={isSaving}
            >
              <LuSave size={15} />
              <span>{isSaving ? 'Saving...' : 'Save to Portfolio (:5173)'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}