import React, { useState, useEffect } from 'react';
import GlassStudioDashboard from './components/GlassStudioDashboard';
import PortfolioView from './components/PortfolioView';
import NewProjectModal from './components/NewProjectModal';
import { 
  INITIAL_GRAPHICS, 
  INITIAL_VIDEOS, 
  INITIAL_SEO 
} from './data/mockData';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('all');
  
  // Dedicated Portfolio Data States with LocalStorage Persistence
  const [graphicsData, setGraphicsData] = useState(() => {
    try {
      const saved = localStorage.getItem('rw_graphics');
      return saved ? JSON.parse(saved) : INITIAL_GRAPHICS;
    } catch {
      return INITIAL_GRAPHICS;
    }
  });

  const [videosData, setVideosData] = useState(() => {
    try {
      const saved = localStorage.getItem('rw_videos');
      return saved ? JSON.parse(saved) : INITIAL_VIDEOS;
    } catch {
      return INITIAL_VIDEOS;
    }
  });

  const [seoData, setSeoData] = useState(() => {
    try {
      const saved = localStorage.getItem('rw_seo');
      return saved ? JSON.parse(saved) : INITIAL_SEO;
    } catch {
      return INITIAL_SEO;
    }
  });

  // LocalStorage auto-sync
  useEffect(() => {
    localStorage.setItem('rw_graphics', JSON.stringify(graphicsData));
  }, [graphicsData]);

  useEffect(() => {
    localStorage.setItem('rw_videos', JSON.stringify(videosData));
  }, [videosData]);

  useEffect(() => {
    localStorage.setItem('rw_seo', JSON.stringify(seoData));
  }, [seoData]);

  // Modal & Edit Control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('graphic');
  const [editingItem, setEditingItem] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleOpenModalWithMode = (mode) => {
    setEditingItem(null);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const handleEditItem = (type, item) => {
    setEditingItem({ ...item, itemType: type });
    setModalMode(type);
    setIsModalOpen(true);
  };

  // Save / Update items (Graphic Image, Video Reel, or SEO Content)
  const handleSaveItem = (mode, itemData, isEdit) => {
    if (mode === 'graphic') {
      setGraphicsData(prev => isEdit 
        ? prev.map(item => item.id === itemData.id ? itemData : item)
        : [itemData, ...prev]
      );
      showToast(isEdit ? `🎨 Updated Graphic: "${itemData.title}"` : `🎨 Uploaded Graphic Image: "${itemData.title}"`);
    } else if (mode === 'video') {
      setVideosData(prev => isEdit
        ? prev.map(item => item.id === itemData.id ? itemData : item)
        : [itemData, ...prev]
      );
      showToast(isEdit ? `🎬 Updated Reel: "${itemData.title}"` : `🎬 Added Video Reel: "${itemData.title}"`);
    } else if (mode === 'seo') {
      setSeoData(prev => isEdit
        ? prev.map(item => item.id === itemData.id ? itemData : item)
        : [itemData, ...prev]
      );
      showToast(isEdit ? `🚀 Updated SEO: "${itemData.client}"` : `🚀 Added SEO Partner: "${itemData.client}"`);
    }

    setEditingItem(null);
  };

  // Delete item handler
  const handleDeleteItem = (type, id) => {
    if (type === 'graphic') {
      setGraphicsData(prev => prev.filter(item => item.id !== id));
      showToast('Graphic item removed');
    } else if (type === 'video') {
      setVideosData(prev => prev.filter(item => item.id !== id));
      showToast('Video reel removed');
    } else if (type === 'seo') {
      setSeoData(prev => prev.filter(item => item.id !== id));
      showToast('SEO record removed');
    }
  };

  return (
    <div className="vision-glass-app">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="vision-toast">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Primary VisionOS Frosted Glass Workspace */}
      {activeTab === 'all' ? (
        <GlassStudioDashboard
          graphicsData={graphicsData}
          videosData={videosData}
          seoData={seoData}
          onOpenModalWithMode={handleOpenModalWithMode}
          onEditItem={handleEditItem}
          onDeleteItem={handleDeleteItem}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          showToast={showToast}
          onSaveItem={handleSaveItem}
        />
      ) : (
        <div className="glass-dedicated-view-wrap">
          {/* Header to return back to Glass Living Studio */}
          <div className="glass-back-bar">
            <button 
              className="glass-back-btn" 
              onClick={() => setActiveTab('all')}
            >
              ← Back to Living Studio
            </button>
            <span className="glass-view-title">
              {activeTab === 'graphic' && '🎨 Graphic Portfolio Studio'}
              {activeTab === 'video' && '🎬 Video Reels Studio'}
              {activeTab === 'seo' && '🚀 SEO & Rankings Domination'}
            </span>
            <button 
              className="glass-add-direct-btn"
              onClick={() => handleOpenModalWithMode(activeTab)}
            >
              + Add New {activeTab.toUpperCase()}
            </button>
          </div>

          <PortfolioView
            viewType={activeTab}
            graphicsData={graphicsData}
            videosData={videosData}
            seoData={seoData}
            onOpenModalWithMode={handleOpenModalWithMode}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
          />
        </div>
      )}

      {/* Multi-Portfolio Action Modal (Graphic Image, Video Reel, or SEO Content) */}
      <NewProjectModal
        isOpen={isModalOpen}
        initialMode={modalMode}
        editItem={editingItem}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
      />
    </div>
  );
}

export default App;

