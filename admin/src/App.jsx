import React, { useState } from 'react';
import HeaderNav from './components/HeaderNav';
import StatsBar from './components/StatsBar';
import TimelineCanvas from './components/TimelineCanvas';
import BottomDock from './components/BottomDock';
import NewProjectModal from './components/NewProjectModal';
import { TIMELINE_GROUPS } from './data/mockData';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('all');
  const [filterSub, setFilterSub] = useState('all-works');
  const [timelineData, setTimelineData] = useState(TIMELINE_GROUPS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleResetView = () => {
    setActiveTab('all');
    setFilterSub('all-works');
    showToast('Reset to Studio Dynamics View');
  };

  const handleCardClick = (item) => {
    showToast(`Inspecting: ${item.title || item.label}`);
  };

  const handleSaveNewProject = (newEntry) => {
    // Add to timeline group as a new pill
    setTimelineData((prev) => {
      const updated = [...prev];
      const targetGroup = updated[0]; // add to newest group
      if (targetGroup) {
        targetGroup.pills = [
          {
            id: newEntry.id,
            icon: newEntry.targetPortfolio === 'video' ? 'Video' : newEntry.targetPortfolio === 'seo' ? 'TrendingUp' : 'Palette',
            label: newEntry.title,
            value: newEntry.categoryTag || 'New',
            type: newEntry.targetPortfolio,
          },
          ...targetGroup.pills,
        ];
      }
      return updated;
    });

    showToast(`Published "${newEntry.title}" to ${newEntry.targetPortfolio.toUpperCase()} Portfolio!`);
  };

  return (
    <div className="studio-canvas">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="studio-toast">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Futuristic Tablet / Device Frame matching target design */}
      <div className="device-frame">
        {/* Device Inner Screen */}
        <div className="device-screen">
          {/* Header Navigation */}
          <HeaderNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenNewModal={() => setIsModalOpen(true)}
            onResetView={handleResetView}
          />

          {/* Stats & Profile Bar */}
          <StatsBar
            filterSub={filterSub}
            setFilterSub={setFilterSub}
            selectedPortfolio={activeTab}
          />

          {/* Timeline & Flow Canvas */}
          <TimelineCanvas
            timelineData={timelineData}
            onCardClick={handleCardClick}
            onAddClick={() => setIsModalOpen(true)}
          />

          {/* Floating Bottom Dock */}
          <BottomDock
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      </div>

      {/* New Project / Reel Modal */}
      <NewProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNewProject}
      />
    </div>
  );
}

export default App;
