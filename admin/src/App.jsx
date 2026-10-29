import React, { useState, useEffect } from 'react';
import HeaderNav from './components/HeaderNav';
import StatsBar from './components/StatsBar';
import MasterOverview from './components/MasterOverview';
import PortfolioView from './components/PortfolioView';
import BottomDock from './components/BottomDock';
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

  const handleResetView = () => {
    setActiveTab('all');
    showToast('Switched to RizeWorld All Portfolios View');
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
    <div className="studio-canvas">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="studio-toast">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Futuristic Device Frame matching target design */}
      <div className="device-frame">
        {/* Device Inner Screen */}
        <div className="device-screen">
          {/* Header Navigation with exact organic tab & Graphic/Video/SEO pills */}
          <HeaderNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onResetView={handleResetView}
            onOpenModalWithMode={handleOpenModalWithMode}
          />

          {/* Stats & Profile Bar with Real Graphic, Video, and SEO metrics */}
          <StatsBar
            selectedPortfolio={activeTab}
            onSelectPortfolio={setActiveTab}
            graphicsCount={graphicsData.length}
            videosCount={videosData.length}
            seoCount={seoData.length}
          />

          {/* Main Content Area: Master Overview Hub OR Specific Portfolio View */}
          {activeTab === 'all' ? (
            <MasterOverview
              graphicsData={graphicsData}
              videosData={videosData}
              seoData={seoData}
              onOpenModalWithMode={handleOpenModalWithMode}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
              onSelectPortfolio={setActiveTab}
            />
          ) : (
            <PortfolioView
              viewType={activeTab}
              graphicsData={graphicsData}
              videosData={videosData}
              seoData={seoData}
              onOpenModalWithMode={handleOpenModalWithMode}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
            />
          )}

          {/* Floating Bottom Dock */}
          <BottomDock
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            graphicsCount={graphicsData.length}
            videosCount={videosData.length}
            seoCount={seoData.length}
          />
        </div>
      </div>

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
