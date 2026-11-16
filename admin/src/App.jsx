import React, { useState, useEffect } from 'react';
import GlassStudioDashboard from './components/GlassStudioDashboard';
import PortfolioView from './components/PortfolioView';
import NewProjectModal from './components/NewProjectModal';
import RevertTrashModal from './components/RevertTrashModal';
import BulkUploadModal from './components/BulkUploadModal';
import AuthModal from './components/AuthModal';
import { LuRotateCcw, LuLogOut } from 'react-icons/lu';
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

  // Automatically strip '#hero' or any hash from address bar on load
  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  // Authentication State with Session Persistence
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('rw_admin_session') || sessionStorage.getItem('rw_admin_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.user) {
          if (parsed.user.name && (parsed.user.name.includes('Aryan') || parsed.user.name.includes('Director'))) {
            parsed.user.name = 'Admin';
            localStorage.setItem('rw_admin_session', JSON.stringify(parsed));
          }
          return parsed.user;
        }
      }
    } catch {}
    return null;
  });

  const handleLogout = () => {
    localStorage.removeItem('rw_admin_session');
    sessionStorage.removeItem('rw_admin_session');
    setCurrentUser(null);
    showToast('👋 Signed out of RizeWorld Studio.');
  };
  
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
      // Upgrade to all 55 authentic reels with the 7 clean video portfolio categories
      const hasOldFragmentedCats = Array.isArray(parsed) && parsed.some(v => 
        v.category === 'Ambient Stream' || v.category === 'AI Gourmet' || v.category === 'Specialized OPD' || v.category === 'Interiors'
      );
      if (Array.isArray(parsed) && parsed.length >= 50 && !hasOldFragmentedCats) {
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
            const hasOldCats = videos.some(v => 
              v.category === 'Ambient Stream' || v.category === 'AI Gourmet' || v.category === 'Specialized OPD' || v.category === 'Interiors'
            );
            if (!hasOldCats) {
              setVideosData(videos);
            }
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
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [modalMode, setModalMode] = useState('graphic');
  const [editingItem, setEditingItem] = useState(null);

  // Bulk Upload Handler
  const handleBulkSaveItems = (newItems) => {
    if (!Array.isArray(newItems) || newItems.length === 0) return;
    setGraphicsData(prev => [...newItems, ...prev]);
    try {
      const current = JSON.parse(localStorage.getItem('rw_graphics') || '[]');
      localStorage.setItem('rw_graphics', JSON.stringify([...newItems, ...current]));
    } catch {}
  };

  // Deleted Items History & Recovery Trash Bin
  const [deletedHistory, setDeletedHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('rw_deleted_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [lastDeleted, setLastDeleted] = useState(null);
  const [isRevertModalOpen, setIsRevertModalOpen] = useState(false);

  // Sync deletedHistory to localStorage
  useEffect(() => {
    localStorage.setItem('rw_deleted_history', JSON.stringify(deletedHistory));
  }, [deletedHistory]);

  // Interactive Toast Notification with Undo Action
  const [toastData, setToastData] = useState(null);

  const showToast = (msg, undoCallback = null, undoLabel = '↩ Revert / Undo') => {
    if (typeof msg === 'string') {
      setToastData({ message: msg, onUndo: undoCallback, undoLabel });
    } else {
      setToastData(msg);
    }
    setTimeout(() => {
      setToastData(current => (current?.message === (typeof msg === 'string' ? msg : msg?.message) ? null : current));
    }, 6500);
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

      // 🔄 Real-time Live Disk Synchronization to :5174 & :5175 Portfolio Sites
      fetch('/api/live-sync/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: mode, item: itemData, isEdit })
      }).catch(() => {});
    } catch (err) {
      console.error('Error saving item:', err);
      showToast('⚠️ Saved locally');
    }

    setEditingItem(null);
  };

  // Helper: Inserts an item back at its exact original index to prevent grid displacement
  const insertAtIndex = (arr, item, targetIndex) => {
    const filtered = arr.filter(x => (x.id !== item.id || !item.id) && (x._id !== item._id || !item._id));
    const validIndex = (typeof targetIndex === 'number' && targetIndex >= 0)
      ? Math.min(filtered.length, targetIndex)
      : 0;
    filtered.splice(validIndex, 0, item);
    return filtered;
  };

  // Delete item handler with Revert Tracking & MongoDB Atlas Sync
  const handleDeleteItem = async (type, id) => {
    try {
      let deletedItem = null;
      let originalIndex = -1;

      if (type === 'graphic') {
        originalIndex = graphicsData.findIndex(item => item.id === id || item._id === id);
        deletedItem = graphicsData[originalIndex];
        await deleteGraphic(id).catch(() => {});
        setGraphicsData(prev => prev.filter(item => item.id !== id && item._id !== id));
      } else if (type === 'video') {
        originalIndex = videosData.findIndex(item => item.id === id || item._id === id);
        deletedItem = videosData[originalIndex];
        await deleteVideo(id).catch(() => {});
        setVideosData(prev => prev.filter(item => item.id !== id && item._id !== id));
      } else if (type === 'seo') {
        originalIndex = seoData.findIndex(item => item.id === id || item._id === id);
        deletedItem = seoData[originalIndex];
        await deleteSeo(id).catch(() => {});
        setSeoData(prev => prev.filter(item => item.id !== id && item._id !== id));
      }

      if (deletedItem) {
        const historyEntry = { 
          ...deletedItem, 
          deletedType: type, 
          deletedAt: Date.now(),
          originalIndex: originalIndex >= 0 ? originalIndex : 0
        };
        setDeletedHistory(prev => [historyEntry, ...prev.filter(x => (x.id !== historyEntry.id || !historyEntry.id) && (x._id !== historyEntry._id || !historyEntry._id))]);
        setLastDeleted(historyEntry);

        const itemLabel = deletedItem.title || deletedItem.client || 'Item';
        showToast(
          `🗑️ Deleted: "${itemLabel}"`,
          () => handleRestoreItem(historyEntry),
          '↩ Revert / Undo'
        );

        // 🔄 Real-time Live Disk Synchronization to :5174 & :5175 Portfolio Sites
        fetch('/api/live-sync/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, id, item: historyEntry, originalIndex })
        })
        .then(res => res.json())
        .then(data => {
          if (data && data.deletedMeta) {
            setDeletedHistory(prev => prev.map(entry => 
              (entry.id === historyEntry.id || entry._id === historyEntry._id)
                ? { ...entry, ...data.deletedMeta }
                : entry
            ));
            if (lastDeleted && (lastDeleted.id === historyEntry.id || lastDeleted._id === historyEntry._id)) {
              setLastDeleted(current => ({ ...current, ...data.deletedMeta }));
            }
          }
        })
        .catch(() => {});
      }
    } catch {
      showToast('Item removed');
    }
  };

  // Revert / Restore single deleted item back to its EXACT original position
  const handleRestoreItem = async (itemToRestore) => {
    if (!itemToRestore) return;
    const type = itemToRestore.deletedType || 'graphic';
    const targetIndex = typeof itemToRestore.originalIndex === 'number' ? itemToRestore.originalIndex : 0;
    const { deletedType, deletedAt, originalIndex, catId, imgIndex, ...cleanItem } = itemToRestore;

    try {
      if (type === 'graphic') {
        await createGraphic(cleanItem).catch(() => {});
        setGraphicsData(prev => insertAtIndex(prev, cleanItem, targetIndex));
      } else if (type === 'video') {
        await createVideo(cleanItem).catch(() => {});
        setVideosData(prev => insertAtIndex(prev, cleanItem, targetIndex));
      } else if (type === 'seo') {
        await createSeo(cleanItem).catch(() => {});
        setSeoData(prev => insertAtIndex(prev, cleanItem, targetIndex));
      }

      setDeletedHistory(prev => prev.filter(item => (item.id !== itemToRestore.id || !itemToRestore.id) && (item._id !== itemToRestore._id || !itemToRestore._id)));
      if (lastDeleted && (lastDeleted.id === itemToRestore.id || lastDeleted._id === itemToRestore._id)) {
        setLastDeleted(null);
      }
      showToast(`✅ Successfully Reverted: "${cleanItem.title || cleanItem.client}" restored to exact original position!`);

      // 🔄 Real-time Live Disk Synchronization to :5174 & :5175 Portfolio Sites (Exact index restore)
      fetch('/api/live-sync/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type, 
          item: cleanItem, 
          originalIndex: targetIndex,
          catId: itemToRestore.catId,
          imgIndex: itemToRestore.imgIndex
        })
      }).catch(() => {});
    } catch (err) {
      console.error('Error restoring item:', err);
      showToast('Failed to revert item');
    }
  };

  // Revert last deleted item of a specific category/type
  const handleRevertLast = (type) => {
    const item = deletedHistory.find(i => !type || i.deletedType === type);
    if (item) {
      handleRestoreItem(item);
    } else {
      showToast('No deleted items found to revert');
    }
  };

  // Restore all items
  const handleRestoreAll = async () => {
    if (deletedHistory.length === 0) return;
    const items = [...deletedHistory];
    for (const item of items) {
      await handleRestoreItem(item);
    }
    setDeletedHistory([]);
    setLastDeleted(null);
    showToast(`🎉 Restored all ${items.length} items back to portfolios!`);
  };

  // Permanent Delete & Clear
  const handlePermanentDelete = (itemToDelete) => {
    setDeletedHistory(prev => prev.filter(item => (item.id !== itemToDelete.id || !itemToDelete.id) && (item._id !== itemToDelete._id || !itemToDelete._id)));
    if (lastDeleted && (lastDeleted.id === itemToDelete.id || lastDeleted._id === itemToDelete._id)) {
      setLastDeleted(null);
    }
    showToast('Item permanently deleted from trash');
  };

  const handleClearAllTrash = () => {
    setDeletedHistory([]);
    setLastDeleted(null);
    showToast('Trash bin emptied');
  };

  // Authentication Gate: Render Auth Portal if not logged in
  if (!currentUser) {
    return (
      <div className="vision-glass-app">
        {toastData && (
          <div className="vision-toast">
            <span className="vision-toast-msg">{toastData.message}</span>
            <button
              type="button"
              className="vision-toast-close"
              onClick={() => setToastData(null)}
            >
              ✕
            </button>
          </div>
        )}
        <AuthModal 
          onLoginSuccess={(userData) => {
            setCurrentUser(userData);
          }} 
        />
      </div>
    );
  }

  return (
    <div className="vision-glass-app">
      {/* Toast Notification with Instant Undo Revert Action */}
      {toastData && (
        <div className="vision-toast">
          <span className="vision-toast-msg">{toastData.message}</span>
          {toastData.onUndo && (
            <button
              type="button"
              className="vision-toast-undo-btn"
              onClick={() => {
                toastData.onUndo();
                setToastData(null);
              }}
            >
              <LuRotateCcw size={12} />
              <span>{toastData.undoLabel || '↩ Revert'}</span>
            </button>
          )}
          <button
            type="button"
            className="vision-toast-close"
            onClick={() => setToastData(null)}
          >
            ✕
          </button>
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
          deletedHistory={deletedHistory}
          lastDeleted={lastDeleted}
          onRestoreItem={handleRestoreItem}
          onRevertLast={handleRevertLast}
          onOpenRevertModal={() => setIsRevertModalOpen(true)}
          onOpenBulkUploadModal={() => setIsBulkUploadOpen(true)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          showToast={showToast}
          onSaveItem={handleSaveItem}
          currentUser={currentUser}
          onLogout={handleLogout}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button 
                className="glass-add-direct-btn"
                onClick={() => handleOpenModalWithMode(activeTab)}
              >
                + Add New {activeTab.toUpperCase()}
              </button>
            </div>
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
        graphicsData={graphicsData}
        videosData={videosData}
        seoData={seoData}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        onOpenBulkUpload={() => setIsBulkUploadOpen(true)}
      />

      {/* ⚡ Bulk Image Upload Modal */}
      <BulkUploadModal
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        onBulkSave={handleBulkSaveItems}
        graphicsData={graphicsData}
        showToast={showToast}
      />

      {/* Deleted Assets Recovery & Revert Center Modal */}
      <RevertTrashModal
        isOpen={isRevertModalOpen}
        onClose={() => setIsRevertModalOpen(false)}
        deletedHistory={deletedHistory}
        onRestoreItem={handleRestoreItem}
        onRestoreAll={handleRestoreAll}
        onPermanentDelete={handlePermanentDelete}
        onClearAllTrash={handleClearAllTrash}
      />
    </div>
  );
}

export default App;

