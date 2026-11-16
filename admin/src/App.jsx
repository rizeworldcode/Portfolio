import React, { useState, useEffect } from 'react';
import GlassStudioDashboard from './components/GlassStudioDashboard';
import PortfolioView from './components/PortfolioView';
import NewProjectModal from './components/NewProjectModal';
import { 
  INITIAL_GRAPHICS, 
  INITIAL_VIDEOS, 
  INITIAL_SEO 
} from './data/mockData';
import { 
  getGraphics, createGraphic, updateGraphic, deleteGraphic,
  getVideos, createVideo, updateVideo, deleteVideo,
  getSeo, createSeo, updateSeo, deleteSeo,
  checkBackendHealth 
} from './services/api';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('all');
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  
  // Dedicated Portfolio Data States with LocalStorage Persistence
  const [graphicsData, setGraphicsData] = useState(() => {
    try {
      const saved = localStorage.getItem('rw_graphics');
      const parsed = saved ? JSON.parse(saved) : null;
      // Upgrade stale 4-item dummy cache to the full 233 real client artworks
      if (Array.isArray(parsed) && parsed.length >= 50) {
        return parsed;
      }
      return INITIAL_GRAPHICS;
    } catch {
      return INITIAL_GRAPHICS;
    }
  });

  const [videosData, setVideosData] = useState(() => {
    try {
      const saved = localStorage.getItem('rw_videos');
      const parsed = saved ? JSON.parse(saved) : null;
      // Upgrade to all 55 authentic reels from the user's video portfolio
      if (Array.isArray(parsed) && parsed.length >= 50 && parsed[0]?.title?.includes('Chappan Bhog')) {
        return parsed;
      }
      localStorage.setItem('rw_videos', JSON.stringify(INITIAL_VIDEOS));
      return INITIAL_VIDEOS;
    } catch {
      return INITIAL_VIDEOS;
    }
  });

  const [seoData, setSeoData] = useState(() => {
    try {
      const saved = localStorage.getItem('rw_seo');
      const parsed = saved ? JSON.parse(saved) : null;
      if (Array.isArray(parsed) && parsed.length >= 6) {
        return parsed;
      }
      return INITIAL_SEO;
    } catch {
      return INITIAL_SEO;
    }
  });

  // Load from MongoDB Atlas Cloud API on mount (Safe sequential check)
  useEffect(() => {
    let isMounted = true;

    async function loadBackendData() {
      try {
        const health = await checkBackendHealth();
        if (!health?.online) {
          if (isMounted) setIsBackendConnected(false);
          return; // Backend is offline, cleanly use local 233 items without firing failing requests
        }

        if (isMounted) setIsBackendConnected(true);
        const [graphics, videos, seo] = await Promise.all([
          getGraphics().catch(() => null),
          getVideos().catch(() => null),
          getSeo().catch(() => null),
        ]);

        if (isMounted) {
          if (Array.isArray(graphics) && graphics.length > 0) {
            setGraphicsData(graphics);
          }
          if (Array.isArray(videos) && (videos.length >= 50 || videos[0]?.title?.includes('Chappan Bhog'))) {
            setVideosData(videos);
          }
          if (Array.isArray(seo) && seo.length > 0) {
            setSeoData(seo);
          }
        }
      } catch {
        if (isMounted) setIsBackendConnected(false);
      }
    }

    loadBackendData();
    return () => { isMounted = false; };
  }, []);

  // LocalStorage auto-sync backup
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

  // Save / Update items (Graphic Image, Video Reel, or SEO Content) with MongoDB Atlas Sync
  const handleSaveItem = async (mode, itemData, isEdit) => {
    try {
      if (mode === 'graphic') {
        let savedItem = itemData;
        const targetId = itemData._id || itemData.id;
        if (isEdit && targetId && !targetId.toString().startsWith('g-')) {
          savedItem = await updateGraphic(targetId, itemData).catch(() => itemData);
        } else {
          savedItem = await createGraphic(itemData).catch(() => itemData);
        }
        setGraphicsData(prev => isEdit 
          ? prev.map(item => (item.id === itemData.id || item._id === itemData._id) ? (savedItem || itemData) : item)
          : [savedItem || itemData, ...prev]
        );
        showToast(isEdit ? `Updated Graphic: "${itemData.title}"` : `Uploaded Graphic Image: "${itemData.title}"`);
      } else if (mode === 'video') {
        let savedItem = itemData;
        const targetId = itemData._id || itemData.id;
        if (isEdit && targetId && !targetId.toString().startsWith('v-')) {
          savedItem = await updateVideo(targetId, itemData).catch(() => itemData);
        } else {
          savedItem = await createVideo(itemData).catch(() => itemData);
        }
        setVideosData(prev => isEdit
          ? prev.map(item => (item.id === itemData.id || item._id === itemData._id) ? (savedItem || itemData) : item)
          : [savedItem || itemData, ...prev]
        );
        showToast(isEdit ? `Updated Reel: "${itemData.title}"` : `Added Video Reel: "${itemData.title}"`);
      } else if (mode === 'seo') {
        let savedItem = itemData;
        const targetId = itemData._id || itemData.id;
        if (isEdit && targetId && !targetId.toString().startsWith('s-')) {
          savedItem = await updateSeo(targetId, itemData).catch(() => itemData);
        } else {
          savedItem = await createSeo(itemData).catch(() => itemData);
        }
        setSeoData(prev => isEdit
          ? prev.map(item => (item.id === itemData.id || item._id === itemData._id) ? (savedItem || itemData) : item)
          : [savedItem || itemData, ...prev]
        );
        showToast(isEdit ? `Updated SEO: "${itemData.client}"` : `Added SEO Partner: "${itemData.client}"`);
      }
    } catch (err) {
      console.error('Error saving item:', err);
      showToast('⚠️ Saved locally');
    }

    setEditingItem(null);
  };

  // Delete item handler with MongoDB Atlas Sync
  const handleDeleteItem = async (type, id) => {
    try {
      if (type === 'graphic') {
        await deleteGraphic(id).catch(() => {});
        setGraphicsData(prev => prev.filter(item => item.id !== id && item._id !== id));
        showToast('Graphic item removed');
      } else if (type === 'video') {
        await deleteVideo(id).catch(() => {});
        setVideosData(prev => prev.filter(item => item.id !== id && item._id !== id));
        showToast('Video reel removed');
      } else if (type === 'seo') {
        await deleteSeo(id).catch(() => {});
        setSeoData(prev => prev.filter(item => item.id !== id && item._id !== id));
        showToast('SEO record removed');
      }
    } catch {
      showToast('Item removed');
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
          isBackendConnected={isBackendConnected}
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
              {activeTab === 'graphic' && 'Graphic Portfolio Studio'}
              {activeTab === 'video' && 'Video Reels Studio'}
              {activeTab === 'seo' && 'SEO & Rankings Domination'}
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

