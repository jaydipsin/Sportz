import React from 'react';
import { Activity, Radio, Wifi, WifiOff } from 'lucide-react';

export default function Navbar({ status, messageCount, matchCount }) {
  const getStatusClass = () => {
    switch (status) {
      case 'CONNECTED':
        return 'status-connected';
      case 'CONNECTING':
        return 'status-connecting';
      default:
        return 'status-disconnected';
    }
  };

  return (
    <header className="navbar">
      <div className="brand">
        <div className="brand-icon">
          <Activity size={20} color="#fff" />
        </div>
        <div>
          <span className="brand-title">Sportz Live</span>
          <span className="brand-badge">WebSocket Hub</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="stat-pill">
          <Radio size={14} color="#818cf8" />
          <span>Messages: <strong>{messageCount}</strong></span>
        </div>

        <div className={`status-pill ${getStatusClass()}`}>
          <div className="status-dot"></div>
          {status === 'CONNECTED' ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Wifi size={14} /> Connected
            </span>
          ) : status === 'CONNECTING' ? (
            <span>Connecting...</span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <WifiOff size={14} /> Disconnected
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
