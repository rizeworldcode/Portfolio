import React from 'react';
import { 
  Plus, 
  ChevronUp, 
  ChevronDown, 
  Scale, 
  Video, 
  TrendingUp, 
  Palette, 
  Zap, 
  Award,
  ArrowUpRight,
  Sparkles,
  BarChart2
} from 'lucide-react';
import './TimelineCanvas.css';

export default function TimelineCanvas({ 
  timelineData, 
  onCardClick, 
  onAddClick 
}) {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Video': return Video;
      case 'TrendingUp': return TrendingUp;
      case 'Palette': return Palette;
      case 'Zap': return Zap;
      case 'Award': return Award;
      default: return Sparkles;
    }
  };

  return (
    <div className="timeline-canvas">
      {/* Horizontal timeline axis line with SVG connection curves */}
      <div className="timeline-canvas__axis-line" />

      {/* Timeline groups */}
      <div className="timeline-canvas__flow">
        {timelineData.map((group, groupIdx) => (
          <div key={group.id} className="timeline-group">
            {/* Top Anchor & Month Header */}
            <div className="timeline-group__anchor">
              <div className="timeline-node-pin">
                <span className="timeline-node-pin__num">{group.badgeNumber}</span>
              </div>
              <div className="timeline-month-badge">
                <span className="month-name">{group.month}</span>
                <span className="month-sub">{group.subtitle}</span>
              </div>
            </div>

            {/* Content Container (Pills + Cards connected) */}
            <div className="timeline-group__body">
              {/* Stepper Chevron Pill */}
              <div className="timeline-stepper-pill">
                <button className="stepper-arrow"><ChevronUp size={12} /></button>
                <span className="stepper-dot" />
                <button className="stepper-arrow"><ChevronDown size={12} /></button>
              </div>

              {/* Connected Floating Pills Column */}
              <div className="timeline-pills-col">
                {group.pills.map((pill) => {
                  const Icon = getIcon(pill.icon);
                  return (
                    <div 
                      key={pill.id} 
                      className={`connected-pill pill--${pill.type}`}
                      onClick={() => onCardClick(pill)}
                    >
                      <div className="connected-pill__icon-circle">
                        <Icon size={12} strokeWidth={2.4} />
                      </div>
                      <span className="connected-pill__label">{pill.label}</span>
                      <span className="connected-pill__badge">{pill.value}</span>
                    </div>
                  );
                })}
              </div>

              {/* Connected Detailed Cards Column */}
              <div className="timeline-cards-col">
                {group.cards.map((card) => (
                  <div 
                    key={card.id} 
                    className={`dynamic-card dynamic-card--${card.type}`}
                    onClick={() => onCardClick(card)}
                  >
                    <div className="dynamic-card__header">
                      <span className="dynamic-card__title">{card.title}</span>
                      <div className="dynamic-card__scale-icon">
                        <Scale size={13} />
                      </div>
                    </div>

                    {/* Chart / Visual Body */}
                    {card.type === 'metric-chart' && (
                      <div className="dynamic-card__chart-wrap">
                        {/* Smooth Wave SVG */}
                        <svg className="wave-svg" viewBox="0 0 160 50" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id={`grad-${card.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor={card.chartType === 'wave-orange' ? '#ff6b35' : '#22c55e'} stopOpacity="0.45" />
                              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          <path 
                            d="M0,35 C30,15 50,42 80,24 C110,6 130,30 160,18 L160,50 L0,50 Z" 
                            fill={`url(#grad-${card.id})`}
                          />
                          <path 
                            d="M0,35 C30,15 50,42 80,24 C110,6 130,30 160,18" 
                            fill="none" 
                            stroke={card.chartType === 'wave-orange' ? '#ff6b35' : '#22c55e'} 
                            strokeWidth="2.5"
                          />
                        </svg>

                        {/* Peak Floating Pill */}
                        <div className="chart-floating-pill">
                          <span>{card.peakTag}</span>
                        </div>

                        {/* Card Footer Metric */}
                        <div className="dynamic-card__footer">
                          <div className="metric-meta">
                            <span className="meta-label">{card.metricName}: </span>
                            <span className="meta-val">{card.metricValue}</span>
                            <span className="meta-sub">{card.subMetric}</span>
                          </div>
                          <div className={`delta-pill ${card.deltaPositive ? 'delta-positive' : 'delta-negative'}`}>
                            {card.delta}
                          </div>
                        </div>
                      </div>
                    )}

                    {card.type === 'status-widget' && (
                      <div className="dynamic-card__status-wrap">
                        <div className="gauge-circle-container">
                          <svg className="gauge-svg" viewBox="0 0 36 36">
                            <path
                              className="gauge-bg"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className="gauge-fill"
                              strokeDasharray="92, 100"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                          </svg>
                          <div className="gauge-center-text">92%</div>
                        </div>
                        <div className="status-widget-info">
                          <span className="status-main-text">{card.statusText}</span>
                          <span className="status-sub-text">{card.subtitle}</span>
                        </div>
                      </div>
                    )}

                    {card.type === 'ecg-widget' && (
                      <div className="dynamic-card__ecg-wrap">
                        {/* Real ECG style line */}
                        <svg className="ecg-svg" viewBox="0 0 160 40" preserveAspectRatio="none">
                          <path
                            d="M0,20 L30,20 L35,16 L40,24 L45,6 L50,34 L55,18 L60,20 L100,20 L105,15 L110,25 L115,4 L120,36 L125,18 L130,20 L160,20"
                            fill="none"
                            stroke="#1f2327"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="ecg-footer">
                          <span className="ecg-pulse-indicator" />
                          <span className="ecg-label">Realtime Traffic Stream</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Big Floating Action Plus Button */}
        <div className="timeline-fab-wrap">
          <button 
            className="timeline-fab"
            onClick={onAddClick}
            title="Add Reel or Project"
          >
            <Plus size={22} strokeWidth={2.8} />
          </button>
        </div>
      </div>
    </div>
  );
}
