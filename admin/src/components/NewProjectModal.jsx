import React, { useState } from 'react';
import { X, Check, Upload, Video, TrendingUp, Palette, Sparkles } from 'lucide-react';
import './NewProjectModal.css';

export default function NewProjectModal({ 
  isOpen, 
  onClose, 
  onSave,
  initialData 
}) {
  const [targetPortfolio, setTargetPortfolio] = useState('video');
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [categoryTag, setCategoryTag] = useState('');
  const [metric, setMetric] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: `entry-${Date.now()}`,
      targetPortfolio,
      title,
      client: client || 'Rize Client',
      categoryTag: categoryTag || 'Featured Work',
      metric: metric || '+15% Lift',
      videoUrl,
      timestamp: new Date().toLocaleDateString(),
    });

    // Reset and close
    setTitle('');
    setClient('');
    setCategoryTag('');
    setMetric('');
    setVideoUrl('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-badge">Rize Studio Editor</span>
            <h3 className="modal-heading">Add Portfolio Asset</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Target Portfolio Selector */}
          <div className="form-group">
            <label className="form-label">Target Portfolio</label>
            <div className="portfolio-select-row">
              <button
                type="button"
                className={`portfolio-radio-btn ${targetPortfolio === 'video' ? 'portfolio-radio-btn--active' : ''}`}
                onClick={() => setTargetPortfolio('video')}
              >
                <Video size={14} />
                <span>Video Reel (5175)</span>
              </button>
              <button
                type="button"
                className={`portfolio-radio-btn ${targetPortfolio === 'seo' ? 'portfolio-radio-btn--active' : ''}`}
                onClick={() => setTargetPortfolio('seo')}
              >
                <TrendingUp size={14} />
                <span>SEO Case (5173)</span>
              </button>
              <button
                type="button"
                className={`portfolio-radio-btn ${targetPortfolio === 'graphic' ? 'portfolio-radio-btn--active' : ''}`}
                onClick={() => setTargetPortfolio('graphic')}
              >
                <Palette size={14} />
                <span>Graphic (5174)</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="form-group">
            <label className="form-label">Project / Reel Title *</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Avantika Luxury Dining 4K Reel"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-row-2">
            {/* Client Name */}
            <div className="form-group">
              <label className="form-label">Client / Brand</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Avantika Group / DWPS"
                value={client}
                onChange={(e) => setClient(e.target.value)}
              />
            </div>

            {/* Category Tag */}
            <div className="form-group">
              <label className="form-label">Category / Tag</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Cafe & Restaurant, Healthcare"
                value={categoryTag}
                onChange={(e) => setCategoryTag(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row-2">
            {/* Performance Metric */}
            <div className="form-group">
              <label className="form-label">Metric / Reach Impact</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. 240K Views / #1 Rank"
                value={metric}
                onChange={(e) => setMetric(e.target.value)}
              />
            </div>

            {/* Media / Video path */}
            <div className="form-group">
              <label className="form-label">Media File / Path</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="/videos-compressed/sample.mp4"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              <Check size={16} strokeWidth={2.4} />
              <span>Save & Publish</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
