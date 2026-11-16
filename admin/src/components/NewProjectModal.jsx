import React, { useState, useEffect } from 'react';
import { 
  LuX, 
  LuCheck,
  LuImage, 
  LuFilm, 
  LuTrendingUp,
  LuUpload
} from 'react-icons/lu';
import './NewProjectModal.css';

export default function NewProjectModal({ 
  isOpen, 
  onClose, 
  onSave,
  initialMode = 'graphic',
  editItem = null
}) {
  const [activeMode, setActiveMode] = useState(initialMode);

  // Common Fields
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [category, setCategory] = useState('');

  // Graphic Specific
  const [imageUrl, setImageUrl] = useState('');
  const [format, setFormat] = useState('Poster (4:5)');
  const [tags, setTags] = useState('');

  // Video Specific
  const [videoUrl, setVideoUrl] = useState('');
  const [duration, setDuration] = useState('0:45');
  const [views, setViews] = useState('180K');

  // SEO Specific
  const [website, setWebsite] = useState('');
  const [topKeyword, setTopKeyword] = useState('');
  const [googleRank, setGoogleRank] = useState('#1 Position');
  const [rankingImage, setRankingImage] = useState('');
  const [organicGrowth, setOrganicGrowth] = useState('+350%');
  const [healthScore, setHealthScore] = useState('98/100');
  const [leadsPerMonth, setLeadsPerMonth] = useState('450+ Inquiries');

  // Local File Upload Handlers (Converts selected screenshot/image to DataURL)
  const handleGraphicImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRankingImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setRankingImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Load edit item data or reset
  useEffect(() => {
    if (editItem) {
      if (editItem.itemType) setActiveMode(editItem.itemType);
      setTitle(editItem.title || '');
      setClient(editItem.client || '');
      setCategory(editItem.category || '');
      setImageUrl(editItem.image || '');
      setFormat(editItem.format || 'Poster (4:5)');
      setTags(editItem.tags ? editItem.tags.join(', ') : '');
      setVideoUrl(editItem.video || '');
      setDuration(editItem.duration || '0:45');
      setViews(editItem.views || '180K');
      setWebsite(editItem.website || '');
      setTopKeyword(editItem.topKeyword || '');
      setGoogleRank(editItem.googleRank || '#1 Position');
      setRankingImage(editItem.rankingImage || editItem.thumbnail || editItem.image || '');
      setOrganicGrowth(editItem.organicGrowth || '+350%');
      setHealthScore(editItem.healthScore || '98/100');
      setLeadsPerMonth(editItem.leadsPerMonth || '450+ Inquiries');
    } else {
      if (initialMode) setActiveMode(initialMode);
      setTitle('');
      setClient('');
      setCategory('');
      setImageUrl('');
      setVideoUrl('');
      setWebsite('');
      setTopKeyword('');
      setGoogleRank('#1 Position');
      setRankingImage('');
      setOrganicGrowth('+350%');
      setHealthScore('98/100');
      setLeadsPerMonth('450+ Inquiries');
    }
  }, [editItem, initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (activeMode === 'graphic') {
      onSave('graphic', {
        id: editItem ? editItem.id : `g-${Date.now()}`,
        title: title || 'New Creative Artwork',
        client: client || 'Rize Client',
        category: category || 'Brand Identity',
        format,
        image: imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
        tags: tags ? tags.split(',').map(t => t.trim()) : ['Design', 'Creative'],
        date: editItem?.date || 'Oct 2026',
      }, !!editItem);
    } else if (activeMode === 'video') {
      onSave('video', {
        id: editItem ? editItem.id : `v-${Date.now()}`,
        title: title || 'New 4K Video Reel',
        client: client || 'Rize Client',
        category: category || 'Cafe & Restaurant',
        video: videoUrl || '/videos-compressed/avan-spring.mp4',
        views: views || '150K',
        likes: editItem?.likes || '12K',
        duration: duration || '0:45',
        tags: editItem?.tags || ['Video Reel', 'Cinema', '4K'],
      }, !!editItem);
    } else if (activeMode === 'seo') {
      const finalImage = rankingImage || editItem?.rankingImage || editItem?.thumbnail || editItem?.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80';
      onSave('seo', {
        id: editItem ? editItem.id : `s-${Date.now()}`,
        client: client || 'SEO Partner',
        website: website || 'clientdomain.com',
        topKeyword: topKeyword || 'Target #1 Industry Keyword',
        googleRank: googleRank || '#1 Position',
        rankingImage: finalImage,
        thumbnail: finalImage,
        image: finalImage,
        organicGrowth: organicGrowth || '+320%',
        trafficMonthly: editItem?.trafficMonthly || '42,000 visits',
        healthScore: healthScore || '97/100',
        leadsPerMonth: leadsPerMonth || '380+ Inquiries',
        status: editItem?.status || 'Top 3 Secured',
      }, !!editItem);
    }

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content--wide" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <div className={`modal-header-icon-aura mode-${activeMode}`}>
              {activeMode === 'graphic' && <LuImage size={22} />}
              {activeMode === 'video' && <LuFilm size={22} />}
              {activeMode === 'seo' && <LuTrendingUp size={22} />}
            </div>
            <div className="modal-title-group">
              <div className="modal-badge-row">
                <span className={`modal-badge badge--${activeMode}`}>
                  {editItem ? 'Edit Asset' : 'New Asset'}
                </span>
                <span className="modal-mode-indicator">
                  {activeMode === 'graphic' && 'Graphic Design Studio'}
                  {activeMode === 'video' && 'Video Production'}
                  {activeMode === 'seo' && 'SEO Dominance'}
                </span>
              </div>
              <h3 className="modal-heading">
                {editItem 
                  ? `Edit: ${title || client || 'Asset'}`
                  : (activeMode === 'graphic' ? 'Upload Graphic Artwork' :
                     activeMode === 'video' ? 'Add Video Reel' : 'Add SEO Case Study')
                }
              </h3>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Close Modal">
            <LuX size={18} />
          </button>
        </div>

        {/* 3 Main Choice Options at Top (Disabled when editing to prevent mismatched id) */}
        {!editItem && (
          <div className="modal-mode-tabs">
            <button
              type="button"
              className={`mode-tab-btn ${activeMode === 'graphic' ? 'mode-tab-btn--active mode-tab-btn--graphic' : ''}`}
              onClick={() => setActiveMode('graphic')}
            >
              <div className="mode-tab-icon">
                <LuImage size={17} />
              </div>
              <div className="mode-tab-text">
                <span className="mode-tab-title">Graphic Image</span>
                <span className="mode-tab-sub">Poster, Branding</span>
              </div>
            </button>

            <button
              type="button"
              className={`mode-tab-btn ${activeMode === 'video' ? 'mode-tab-btn--active mode-tab-btn--video' : ''}`}
              onClick={() => setActiveMode('video')}
            >
              <div className="mode-tab-icon">
                <LuFilm size={17} />
              </div>
              <div className="mode-tab-text">
                <span className="mode-tab-title">Video Reel</span>
                <span className="mode-tab-sub">Reel, Commercial</span>
              </div>
            </button>

            <button
              type="button"
              className={`mode-tab-btn ${activeMode === 'seo' ? 'mode-tab-btn--active mode-tab-btn--seo' : ''}`}
              onClick={() => setActiveMode('seo')}
            >
              <div className="mode-tab-icon">
                <LuTrendingUp size={17} />
              </div>
              <div className="mode-tab-text">
                <span className="mode-tab-title">SEO Content</span>
                <span className="mode-tab-sub">Keywords, Rank</span>
              </div>
            </button>
          </div>
        )}

        {/* Dynamic Form per Option */}
        <form onSubmit={handleSubmit} className="modal-form">
          {/* OPTION 1: GRAPHIC IMAGE */}
          {activeMode === 'graphic' && (
            <div className="form-section-body">
              <div className="form-group">
                <label className="form-label">Graphic Title / Creative Artwork Name *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Shivaura Luxury Diamond Festive Poster"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Client / Brand</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Shivaura Jewels, Zoniraz"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select 
                    className="form-input form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Brand Identity">Brand Identity</option>
                    <option value="Social Media Campaign">Social Media Campaign</option>
                    <option value="Print & Packaging">Print & Packaging</option>
                    <option value="3D Product Render">3D Product Render</option>
                    <option value="Creative Poster">Creative Poster</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Format / Dimensions</label>
                  <select 
                    className="form-input form-select"
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                  >
                    <option value="Poster (4:5)">Poster (4:5)</option>
                    <option value="Square (1:1)">Square (1:1)</option>
                    <option value="Packaging (16:9)">Packaging (16:9)</option>
                    <option value="Brochure (A4)">Brochure (A4)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Tags (comma-separated)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Luxury, Jewelry, Diamond"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="form-label-row">
                  <label className="form-label">Image URL / Path</label>
                  <label className="file-upload-btn-chip" title="Choose image from PC">
                    <LuUpload size={12} />
                    <span>Upload from PC</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                      onChange={handleGraphicImageUpload} 
                    />
                  </label>
                </div>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="https://images.unsplash.com/... or /assets/poster.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                {imageUrl && (
                  <div className="modal-asset-showcase">
                    <div className="showcase-header-bar">
                      <div className="showcase-left-meta">
                        <span className="showcase-status-indicator"></span>
                        <span className="showcase-label">Live Artwork Preview Stage</span>
                      </div>
                      <span className="showcase-format-pill">{format || 'Poster Preview'}</span>
                    </div>
                    <div className="showcase-media-stage">
                      <img src={imageUrl} alt="Live Preview" className="showcase-img" onError={(e) => e.target.style.display='none'} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* OPTION 2: VIDEO REEL */}
          {activeMode === 'video' && (
            <div className="form-section-body">
              <div className="form-group">
                <label className="form-label">Video Reel Title *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Avantika Gourmet Crunch Logs Reel"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Client Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Avantika Restaurant, Saniya Hospital"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Reel Category</label>
                  <select 
                    className="form-input form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Cafe & Restaurant">Cafe & Restaurant</option>
                    <option value="Real Estate & Infra">Real Estate & Infra</option>
                    <option value="Hospital & Healthcare">Hospital & Healthcare</option>
                    <option value="School & Education">School & Education</option>
                    <option value="Commercial & 3D">Commercial & 3D</option>
                    <option value="Lifestyle & Wellness">Lifestyle & Wellness</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Video File Path</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="/videos-compressed/avan-spring.mp4"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="0:45"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Views & Impressions</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. 210K"
                  value={views}
                  onChange={(e) => setViews(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* OPTION 3: SEO CONTENT UPDATE WITH RANKING IMAGE */}
          {activeMode === 'seo' && (
            <div className="form-section-body">
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Client / Business Name *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Saniya Hospital Alwar"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Website Domain</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. saniyahospital.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Target Google #1 Ranking Keyword *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Best Orthopedic Surgeon in Alwar"
                    value={topKeyword}
                    onChange={(e) => setTopKeyword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Google Ranking Position *</label>
                  <select 
                    className="form-input form-select"
                    value={googleRank}
                    onChange={(e) => setGoogleRank(e.target.value)}
                  >
                    <option value="#1 Position">#1 Position (Top Ranked)</option>
                    <option value="#2 Position">#2 Position (Top 3)</option>
                    <option value="#3 Position">#3 Position (Top 3)</option>
                    <option value="Page 1 Featured">Page 1 Featured Snippet</option>
                    <option value="Top 5 Dominant">Top 5 Dominant</option>
                  </select>
                </div>
              </div>

              {/* SERP Ranking Proof Screenshot / Image Upload Option */}
              <div className="form-group">
                <div className="form-label-row">
                  <label className="form-label">SERP Ranking Screenshot / Proof Image</label>
                  <label className="file-upload-btn-chip" title="Choose screenshot from PC">
                    <LuUpload size={12} />
                    <span>Upload Screenshot</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                      onChange={handleRankingImageUpload} 
                    />
                  </label>
                </div>

                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Paste URL (https://...) or choose screenshot from computer above"
                  value={rankingImage}
                  onChange={(e) => setRankingImage(e.target.value)}
                />

                {/* Quick Presets */}
                <div className="seo-presets-row">
                  <span className="seo-presets-label">Quick Presets:</span>
                  <button 
                    type="button" 
                    className="preset-chip"
                    onClick={() => setRankingImage('/seo_gsc_performance.jpg')}
                  >
                    🔍 Google Search Console (zoniraz.com)
                  </button>
                  <button 
                    type="button" 
                    className="preset-chip"
                    onClick={() => setRankingImage('/seo_gsc_card.jpg')}
                  >
                    📈 GSC Stat Metric Card
                  </button>
                  <button 
                    type="button" 
                    className="preset-chip"
                    onClick={() => setRankingImage('https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80')}
                  >
                    📊 Google Analytics #1
                  </button>
                  <button 
                    type="button" 
                    className="preset-chip"
                    onClick={() => setRankingImage('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80')}
                  >
                    🏥 Hospital Case Proof
                  </button>
                  <button 
                    type="button" 
                    className="preset-chip"
                    onClick={() => setRankingImage('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80')}
                  >
                    🎓 School Case Proof
                  </button>
                </div>

                {rankingImage && (
                  <div className="modal-asset-showcase">
                    <div className="showcase-header-bar">
                      <div className="showcase-left-meta">
                        <span className="showcase-status-indicator"></span>
                        <span className="showcase-label">Live Google Ranking Proof Stage</span>
                      </div>
                      <span className="showcase-format-pill" style={{ background: '#0284c7', color: '#ffffff', border: 'none' }}>
                        {googleRank || '#1 Position'}
                      </span>
                    </div>
                    <div className="showcase-media-stage">
                      <img 
                        src={rankingImage} 
                        alt="Ranking Proof Preview" 
                        className="showcase-img" 
                        onError={(e) => e.target.style.display='none'} 
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Organic Traffic Growth %</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. +480%"
                    value={organicGrowth}
                    onChange={(e) => setOrganicGrowth(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">SEO Audit Score</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. 98/100"
                    value={healthScore}
                    onChange={(e) => setHealthScore(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Monthly Conversions / Inquiries</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. 750+ Appointments Booked"
                  value={leadsPerMonth}
                  onChange={(e) => setLeadsPerMonth(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={`btn-submit btn-submit--${activeMode}`}>
              <LuCheck size={16} />
              <span>
                {editItem ? 'Save & Update Changes' : (
                  activeMode === 'graphic' ? 'Publish Graphic Artwork' :
                  activeMode === 'video' ? 'Publish Video Reel' : 'Save SEO Partner'
                )}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
