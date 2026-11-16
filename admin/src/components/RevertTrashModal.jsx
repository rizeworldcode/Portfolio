import React, { useState } from 'react';
import { 
  LuX, 
  LuRotateCcw, 
  LuTrash2, 
  LuImage, 
  LuFilm, 
  LuTrendingUp, 
  LuCircleCheck,
  LuSparkles
} from 'react-icons/lu';
import './RevertTrashModal.css';

export default function RevertTrashModal({
  isOpen,
  onClose,
  deletedHistory = [],
  onRestoreItem,
  onRestoreAll,
  onPermanentDelete,
  onClearAllTrash
}) {
  const [activeFilter, setActiveFilter] = useState('all');

  if (!isOpen) return null;

  const filteredItems = deletedHistory.filter(item => {
    if (activeFilter === 'all') return true;
    return item.deletedType === activeFilter;
  });

  const graphicCount = deletedHistory.filter(i => i.deletedType === 'graphic').length;
  const videoCount = deletedHistory.filter(i => i.deletedType === 'video').length;
  const seoCount = deletedHistory.filter(i => i.deletedType === 'seo').length;

  return (
    <div className="revert-modal-overlay" onClick={onClose}>
      <div className="revert-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="revert-modal-header">
          <div className="revert-header-meta">
            <div className="revert-icon-badge">
              <LuRotateCcw size={22} color="#059669" />
            </div>
            <div>
              <div className="revert-badge-row">
                <span className="revert-chip-badge">Recovery Center</span>
                <span className="revert-count-pill">{deletedHistory.length} Deleted Items</span>
              </div>
              <h3 className="revert-title">Revert & Restore Deleted Assets</h3>
            </div>
          </div>
          <button className="revert-close-btn" onClick={onClose} title="Close Recovery Center">
            <LuX size={18} />
          </button>
        </div>

        {/* Filter Tabs & Bulk Actions */}
        <div className="revert-toolbar-bar">
          <div className="revert-filter-tabs">
            <button 
              type="button" 
              className={`revert-tab-btn ${activeFilter === 'all' ? 'revert-tab-btn--active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All ({deletedHistory.length})
            </button>
            <button 
              type="button" 
              className={`revert-tab-btn ${activeFilter === 'graphic' ? 'revert-tab-btn--active' : ''}`}
              onClick={() => setActiveFilter('graphic')}
            >
              <LuImage size={13} />
              <span>Graphics ({graphicCount})</span>
            </button>
            <button 
              type="button" 
              className={`revert-tab-btn ${activeFilter === 'video' ? 'revert-tab-btn--active' : ''}`}
              onClick={() => setActiveFilter('video')}
            >
              <LuFilm size={13} />
              <span>Videos ({videoCount})</span>
            </button>
            <button 
              type="button" 
              className={`revert-tab-btn ${activeFilter === 'seo' ? 'revert-tab-btn--active' : ''}`}
              onClick={() => setActiveFilter('seo')}
            >
              <LuTrendingUp size={13} />
              <span>SEO ({seoCount})</span>
            </button>
          </div>

          {deletedHistory.length > 0 && (
            <div className="revert-bulk-actions">
              <button 
                type="button" 
                className="revert-restore-all-btn"
                onClick={() => {
                  onRestoreAll();
                  onClose();
                }}
                title="Restore all deleted items back to your portfolios"
              >
                <LuRotateCcw size={14} />
                <span>Restore All ({deletedHistory.length})</span>
              </button>
              <button 
                type="button" 
                className="revert-clear-trash-btn"
                onClick={onClearAllTrash}
                title="Permanently empty trash"
              >
                <LuTrash2 size={13} />
                <span>Empty Trash</span>
              </button>
            </div>
          )}
        </div>

        {/* Deleted Items List */}
        <div className="revert-items-container">
          {filteredItems.length === 0 ? (
            <div className="revert-empty-state">
              <div className="revert-empty-icon-wrap">
                <LuCircleCheck size={36} color="#10b981" />
              </div>
              <h4 className="revert-empty-title">No Deleted Items Found</h4>
              <p className="revert-empty-desc">
                Your portfolio is clean! Whenever you delete any graphic artwork, video reel, or SEO case study, it safely appears here so you can revert it with 1-click.
              </p>
            </div>
          ) : (
            <div className="revert-items-grid">
              {filteredItems.map((item) => (
                <div key={item.id || item._id} className="revert-card">
                  {/* Thumbnail */}
                  <div className="revert-card-thumb">
                    {item.deletedType === 'video' ? (
                      <video 
                        src={item.video || item.videoUrl} 
                        className="revert-thumb-media" 
                        muted 
                        preload="metadata"
                      />
                    ) : (
                      <img 
                        src={item.image || item.rankingImage || item.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80'} 
                        alt={item.title || item.client} 
                        className="revert-thumb-media"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80";
                        }}
                      />
                    )}
                    <span className={`revert-type-tag tag--${item.deletedType}`}>
                      {item.deletedType === 'graphic' && 'Graphic'}
                      {item.deletedType === 'video' && 'Video Reel'}
                      {item.deletedType === 'seo' && 'SEO Case'}
                    </span>
                  </div>

                  {/* Meta info */}
                  <div className="revert-card-details">
                    <span className="revert-card-category">{item.category || 'General'}</span>
                    <h4 className="revert-card-title">{item.title || item.client}</h4>
                    <span className="revert-card-client">
                      {item.client} • {item.format || item.duration || item.googleRank || 'Asset'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="revert-card-actions">
                    <button 
                      type="button" 
                      className="btn-restore-single"
                      onClick={() => onRestoreItem(item)}
                      title="Revert and restore this item back to your active portfolio"
                    >
                      <LuRotateCcw size={14} />
                      <span>Restore Item</span>
                    </button>
                    <button 
                      type="button" 
                      className="btn-perm-delete"
                      onClick={() => onPermanentDelete(item)}
                      title="Permanently remove from trash"
                    >
                      <LuTrash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
