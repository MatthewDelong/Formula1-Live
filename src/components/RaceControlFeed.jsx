import React from 'react';
import { formatTime } from '../utils/f1Utils.js';

export default function RaceControlFeed({ messages }) {
  if (!messages || messages.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📡</div>
        <div className="empty-title">No Race Control Messages</div>
        <div className="empty-desc">Race control messages will appear here during the session.</div>
      </div>
    );
  }

  // Show most recent messages first, limit to 50
  const recent = [...messages].reverse().slice(0, 50);

  function getFlagClass(msg) {
    const flag = msg.flag || '';
    const cat = msg.category || '';

    if (flag === 'GREEN' || cat === 'Flag' && msg.message?.includes('GREEN')) return 'rc-flag-green';
    if (flag === 'YELLOW' || flag === 'DOUBLE YELLOW') return 'rc-flag-yellow';
    if (flag === 'RED') return 'rc-flag-red';
    if (flag === 'BLUE') return 'rc-flag-blue';
    if (flag === 'CHEQUERED') return 'rc-flag-chequered';
    if (cat === 'SafetyCar' || msg.message?.includes('SAFETY CAR')) return 'rc-flag-yellow';
    if (cat === 'Drs') return 'rc-flag-green';
    return '';
  }

  function getMessageIcon(msg) {
    const cat = msg.category || '';
    if (cat === 'Flag') return '🏴';
    if (cat === 'SafetyCar') return '🚗';
    if (cat === 'Drs') return '📶';
    if (cat === 'CarEvent') return '🏎️';
    if (cat === 'Other') return '📋';
    return '📋';
  }

  return (
    <div className="race-control-feed">
      {recent.map((msg, idx) => {
        const flagClass = getFlagClass(msg);
        return (
          <div className="race-control-msg fade-in" key={idx} style={{ animationDelay: `${idx * 30}ms` }}>
            <span className="rc-time">{formatTime(msg.date)}</span>
            {flagClass && <div className={`rc-flag ${flagClass}`} />}
            <span className="rc-message">
              {msg.message || `${msg.category}: ${msg.flag || ''}`}
            </span>
          </div>
        );
      })}
    </div>
  );
}
