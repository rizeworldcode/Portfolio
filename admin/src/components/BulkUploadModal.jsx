import React, { useState, useRef, useMemo } from 'react';
import { 
  LuX, 
  LuCloudUpload, 
  LuPlus, 
  LuCheck, 
  LuTrash2, 
  LuImage, 
  LuSparkles,
  LuLayers,
  LuFolderCheck,
  LuCircleCheck
} from 'react-icons/lu';
import { AUTHENTIC_GRAPHIC_CATEGORIES } from './NewProjectModal';
import './BulkUploadModal.css';

export default function BulkUploadModal({ 
  isOpen, 
  onClose, 
  onBulkSave, 
  graphicsData = [],
  showToast 
}) {
  const [stagedFiles, setStagedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Global Batch Settings
  const [globalCategory, setGlobalCategory] = useState(AUTHENTIC_GRAPHIC_CATEGORIES[0] || 'Healthcare');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [globalClient, setGlobalClient] = useState('Rize Client');
  const [globalFormat, setGlobalFormat] = useState('Poster (4:5)');

  const fileInputRef = useRef(null);

  // Merge authentic categories with any existing in dataset
  const availableCategories = useMemo(() => {
    const set = new Set(AUTHENTIC_GRAPHIC_CATEGORIES);
    graphicsData?.forEach(g => { if (g.category) set.add(g.category); });
    return Array.from(set);
  }, [graphicsData]);

  if (!isOpen) return null;

  // Clean filename into readable title: e.g. "Hospital_Post_2026-v2.png" -> "Hospital Post 2026 v2"
  const cleanTitleFromFilename = (fileName) => {
    const baseName = fileName.replace(/\.[^/.]+$/, '');
    return baseName
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Format bytes to KB/MB
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Process incoming File objects into staged cards
  const processFiles = (files) => {
    const validImageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (validImageFiles.length === 0) return;

    const effectiveCategory = isCustomCategory && customCategoryInput.trim() 
      ? customCategoryInput.trim() 
      : globalCategory;

    validImageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newStagedItem = {
          id: `staged-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          fileName: file.name,
          sizeFormatted: formatBytes(file.size),
          dataUrl: e.target.result,
          title: cleanTitleFromFilename(file.name),
          category: effectiveCategory,
          client: globalClient || 'Rize Client',
          format: globalFormat || 'Poster (4:5)',
          tags: [effectiveCategory, 'Branding', 'Design'],
          date: 'Nov 2026',
        };

        setStagedFiles(prev => [...prev, newStagedItem]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Drag & drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer?.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  // Apply global category to all staged cards
  const applyCategoryToAll = (catName) => {
    setGlobalCategory(catName);
    setStagedFiles(prev => prev.map(item => ({ ...item, category: catName })));
  };

  // Apply global client to all staged cards
  const applyClientToAll = (clientName) => {
    setGlobalClient(clientName);
    setStagedFiles(prev => prev.map(item => ({ ...item, client: clientName })));
  };

  // Apply format to all
  const applyFormatToAll = (fmt) => {
    setGlobalFormat(fmt);
    setStagedFiles(prev => prev.map(item => ({ ...item, format: fmt })));
  };

  // Update specific card field
  const updateCardField = (id, field, value) => {
    setStagedFiles(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  // Remove individual card
  const removeCard = (id) => {
    setStagedFiles(prev => prev.filter(item => item.id !== id));
  };

  // Submit all staged files to backend
  const handleUploadAll = async () => {
    if (stagedFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(20);

    try {
      const itemsToUpload = stagedFiles.map((item, idx) => ({
        id: `g-${Date.now()}-${idx}`,
        title: item.title || `Artwork ${idx + 1}`,
        client: item.client || 'Rize Client',
        category: item.category || 'Healthcare',
        format: item.format || 'Poster (4:5)',
        image: item.dataUrl, // Vite endpoint writes to physical disk file and returns clean path
        dataUrl: item.dataUrl,
        fileName: item.fileName,
        tags: item.tags || [item.category, 'Design'],
        date: 'Nov 2026',
      }));

      setUploadProgress(50);

      // Call Vite disk sync endpoint
      const response = await fetch('/api/live-sync/bulk-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsToUpload })
      });

      const resData = await response.json();
      setUploadProgress(90);

      const finalSavedItems = resData?.items && resData.items.length > 0 
        ? resData.items 
        : itemsToUpload.map(({ dataUrl, ...rest }) => rest);

      if (onBulkSave) {
        onBulkSave(finalSavedItems);
      }

      setUploadProgress(100);

      if (showToast) {
        const catName = stagedFiles[0]?.category || 'Selected';
        showToast(`🎉 Successfully uploaded ${stagedFiles.length} artworks to "${catName}"!`);
      }

      // Reset and close
      setStagedFiles([]);
      onClose();
    } catch (err) {
      console.error('Bulk upload error:', err);
      if (showToast) {
        showToast('⚠️ Bulk upload saved locally with data previews');
      }
      if (onBulkSave) {
        onBulkSave(stagedFiles.map(({ dataUrl, ...rest }) => ({ ...rest, image: dataUrl })));
      }
      setStagedFiles([]);
      onClose();
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const effectiveCategory = isCustomCategory && customCategoryInput.trim() 
    ? customCategoryInput.trim() 
    : globalCategory;

  return (
    <div className="bulk-modal-backdrop" onClick={onClose}>
      <div className="bulk-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="bulk-modal-header">
          <div className="bulk-modal-header__left">
            <div className="bulk-modal-pill">
              <span className="bulk-modal-pill__dot" />
              <span>Multi-Asset Rapid Ingestion</span>
            </div>
            <h2 className="bulk-modal-title">
              <span>⚡ Bulk Image Upload</span> & Ingestion
            </h2>
            <p className="bulk-modal-subtitle">
              Select or drag & drop 5, 10, or 20+ creative posters at once. Categorize them in one click and publish live to portfolio!
            </p>
          </div>

          <button 
            type="button" 
            className="bulk-modal-close-btn" 
            onClick={onClose}
            title="Close modal"
          >
            <LuX size={18} />
          </button>
        </div>

        {/* Global Batch Controls Bar */}
        <div className="bulk-batch-controls-bar">
          <div className="bulk-batch-control-item">
            <span className="bulk-control-label">
              <LuLayers size={13} />
              <span>Target Category:</span>
            </span>

            {isCustomCategory ? (
              <div className="bulk-custom-cat-wrap">
                <input
                  type="text"
                  className="bulk-custom-cat-input"
                  placeholder="New Category Name..."
                  value={customCategoryInput}
                  onChange={(e) => {
                    setCustomCategoryInput(e.target.value);
                    if (e.target.value.trim()) {
                      applyCategoryToAll(e.target.value.trim());
                    }
                  }}
                  autoFocus
                />
                <button
                  type="button"
                  className="bulk-cat-toggle-btn"
                  onClick={() => setIsCustomCategory(false)}
                >
                  Pick Existing
                </button>
              </div>
            ) : (
              <div className="bulk-select-wrap">
                <select
                  className="bulk-select"
                  value={globalCategory}
                  onChange={(e) => {
                    if (e.target.value === '__NEW__') {
                      setIsCustomCategory(true);
                      setCustomCategoryInput('');
                    } else {
                      applyCategoryToAll(e.target.value);
                    }
                  }}
                >
                  {availableCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="__NEW__">+ Add New Category...</option>
                </select>
              </div>
            )}
          </div>

          <div className="bulk-batch-control-item">
            <span className="bulk-control-label">Client Name:</span>
            <input
              type="text"
              className="bulk-client-input"
              value={globalClient}
              onChange={(e) => applyClientToAll(e.target.value)}
              placeholder="e.g. Apex Hospital"
            />
          </div>

          <div className="bulk-batch-control-item">
            <span className="bulk-control-label">Format:</span>
            <select
              className="bulk-select bulk-select--sm"
              value={globalFormat}
              onChange={(e) => applyFormatToAll(e.target.value)}
            >
              <option value="Poster (4:5)">Poster (4:5)</option>
              <option value="Square (1:1)">Square (1:1)</option>
              <option value="Landscape (16:9)">Landscape (16:9)</option>
            </select>
          </div>
        </div>

        {/* Drag & Drop Dropzone */}
        <div 
          className={`bulk-dropzone ${isDragging ? 'bulk-dropzone--active' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileInputChange}
          />
          <div className="bulk-dropzone-icon-ring">
            <LuCloudUpload size={32} />
          </div>
          <div className="bulk-dropzone-text-block">
            <h4 className="bulk-dropzone-title">
              Drag & Drop 10, 15 or 20+ Posters Here
            </h4>
            <p className="bulk-dropzone-desc">
              or <span className="bulk-dropzone-highlight">Browse from your Computer</span> • Multiple image selection enabled
            </p>
            <span className="bulk-dropzone-badge">
              Supports: PNG, JPG, WEBP, SVG
            </span>
          </div>
        </div>

        {/* Staged Cards List Header */}
        <div className="bulk-staged-header-row">
          <div className="bulk-staged-count-pill">
            <LuImage size={14} />
            <span>
              {stagedFiles.length === 0 
                ? 'No images selected yet' 
                : `${stagedFiles.length} Artworks Ready to Upload`}
            </span>
          </div>

          {stagedFiles.length > 0 && (
            <div className="bulk-staged-actions-right">
              <button
                type="button"
                className="bulk-btn-add-more"
                onClick={() => fileInputRef.current?.click()}
              >
                <LuPlus size={13} />
                <span>+ Add More Images</span>
              </button>
              <button
                type="button"
                className="bulk-btn-clear-all"
                onClick={() => setStagedFiles([])}
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Staged Cards Grid */}
        <div className="bulk-staged-grid-area">
          {stagedFiles.length === 0 ? (
            <div className="bulk-empty-state">
              <div className="bulk-empty-icon">📁</div>
              <p>Your uploaded poster previews will appear here.</p>
              <span>Titles will be auto-generated from image filenames, ready for editing!</span>
            </div>
          ) : (
            <div className="bulk-cards-grid">
              {stagedFiles.map((item, idx) => (
                <div key={item.id} className="bulk-preview-card">
                  {/* Thumbnail Stage */}
                  <div className="bulk-card-thumb-wrap">
                    <img 
                      src={item.dataUrl} 
                      alt={item.title} 
                      className="bulk-card-thumb-img" 
                    />
                    <span className="bulk-card-num-badge">#{idx + 1}</span>
                    <span className="bulk-card-size-badge">{item.sizeFormatted}</span>
                    <button
                      type="button"
                      className="bulk-card-remove-btn"
                      onClick={() => removeCard(item.id)}
                      title="Remove this image"
                    >
                      <LuX size={13} />
                    </button>
                  </div>

                  {/* Card Fields */}
                  <div className="bulk-card-body">
                    <div className="bulk-card-field">
                      <label>Artwork Title</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateCardField(item.id, 'title', e.target.value)}
                        placeholder="Artwork title..."
                      />
                    </div>

                    <div className="bulk-card-meta-row">
                      <span className="bulk-card-cat-tag">{item.category}</span>
                      <span className="bulk-card-format-tag">{item.format}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="bulk-modal-footer">
          <div className="bulk-footer-info">
            {stagedFiles.length > 0 && (
              <span>Target Category: <strong>{effectiveCategory}</strong></span>
            )}
          </div>

          <div className="bulk-footer-actions">
            <button
              type="button"
              className="bulk-btn-cancel"
              onClick={onClose}
              disabled={isUploading}
            >
              Cancel
            </button>

            <button
              type="button"
              className={`bulk-btn-submit ${stagedFiles.length > 0 ? 'bulk-btn-submit--ready' : ''}`}
              onClick={handleUploadAll}
              disabled={stagedFiles.length === 0 || isUploading}
            >
              {isUploading ? (
                <>
                  <span className="bulk-spinner" />
                  <span>Uploading to Portfolio... ({uploadProgress}%)</span>
                </>
              ) : (
                <>
                  <LuSparkles size={16} />
                  <span>
                    {stagedFiles.length === 0 
                      ? 'Select Images First' 
                      : `⚡ Upload All (${stagedFiles.length} Artworks)`}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
