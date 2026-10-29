import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Palette, 
  Video, 
  TrendingUp, 
  Upload, 
  Image as ImageIcon,
  Sparkles,
  Globe,
  Edit3
} from 'lucide-react';
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
  const [organicGrowth, setOrganicGrowth] = useState('+350%');
  const [healthScore, setHealthScore] = useState('98/100');
  const [leadsPerMonth, setLeadsPerMonth] = useState('450+ Inquiries');

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
      onSave('seo', {
        id: editItem ? editItem.id : `s-${Date.now()}`,
        client: client || 'SEO Partner',
        website: website || 'clientdomain.com',
        topKeyword: topKeyword || 'Target #1 Industry Keyword',
        googleRank: editItem?.googleRank || '#1 Position',
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
          <div className="modal-title-group">
            <span className="modal-badge">
              {editItem ? 'Edit & Update Asset' : 'Add New Portfolio Asset'}
            </span>
            <h3 className="modal-heading">
              {editItem ? `Update ${activeMode.toUpperCase()}: ${title || client}` : 'Portfolio Asset & Content Manager'}
            </h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* 3 Main Choice Options at Top (Disabled when editing to prevent mismatched id) */}
        {!editItem && (
          <div className="modal-mode-tabs">
            <button
              type="button"
              className={`mode-tab-btn ${activeMode === 'graphic' ? 'mode-tab-btn--graphic' : ''}`}
              onClick={() => setActiveMode('graphic')}
            >
              <div className="mode-tab-icon">
                <Palette size={16} />
              </div>
              <div className="mode-tab-text">
                <span className="mode-tab-title">Graphic Image</span>
                <span className="mode-tab-sub">Poster, Social, Branding</span>
              </div>
            </button>

            <button
              type="button"
              className={`mode-tab-btn ${activeMode === 'video' ? 'mode-tab-btn--video' : ''}`}
              onClick={() => setActiveMode('video')}
            >
              <div className="mode-tab-icon">
                <Video size={16} />
              </div>
              <div className="mode-tab-text">
                <span className="mode-tab-title">Video Reel</span>
                <span className="mode-tab-sub">Cafe, Hospital, Infra</span>
              </div>
            </button>

            <button
              type="button"
              className={`mode-tab-btn ${activeMode === 'seo' ? 'mode-tab-btn--seo' : ''}`}
              onClick={() => setActiveMode('seo')}
            >
              <div className="mode-tab-icon">
                <TrendingUp size={16} />
              </div>
              <div className="mode-tab-text">
                <span className="mode-tab-title">SEO Content</span>
                <span className="mode-tab-sub">Keywords, Rank, Lift %</span>
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
                <label className="form-label">Image URL / Path</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="https://images.unsplash.com/... or /assets/poster.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                {imageUrl && (
                  <div className="preview-image-box">
                    <img src={imageUrl} alt="Live Preview" onError={(e) => e.target.style.display='none'} />
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

          {/* OPTION 3: SEO CONTENT UPDATE */}
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
            <button type="submit" className="btn-submit">
              <Check size={16} strokeWidth={2.4} />
              <span>
                {editItem ? 'Save & Update Changes' : (
                  activeMode === 'graphic' ? 'Publish Graphic Image' :
                  activeMode === 'video' ? 'Publish Video Reel' : 'Update SEO Rankings'
                )}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
