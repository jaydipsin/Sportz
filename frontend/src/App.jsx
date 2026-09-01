import React, { useState, useEffect, useRef, useCallback } from 'react';
import AdminDashboard from './components/AdminDashboard';
import UserScreen from './components/UserScreen';
import { Shield, Users, Radio, Sparkles } from 'lucide-react';

export default function App() {
  // Determine current screen from URL hash or query, default to 'admin'
  const getInitialMode = () => {
    const hash = window.location.hash.toLowerCase();
    const path = window.location.pathname.toLowerCase();
    if (hash.includes('user') || path.includes('/user')) return 'user';
    return 'admin';
  };

  const [currentMode, setCurrentMode] = useState(getInitialMode); // 'admin' | 'user'
  const [wsUrl, setWsUrl] = useState('ws://localhost:8000/ws');
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);

  // Shared Match State
  const [matchData, setMatchData] = useState({
    id: 101,
    homeTeam: 'Thunder FC ⚡',
    awayTeam: 'Blaze United 🔥',
    homeScore: 2,
    awayScore: 1,
    period: '2nd Half',
    status: 'live',
    minute: 74,
    stoppage: 2,
  });

  // Shared Broadcast & On-Air State
  const [isOnAir, setIsOnAir] = useState(true);

  // Shared Broadcast Commentary Feed
  const [broadcastFeed, setBroadcastFeed] = useState([
    {
      id: 'init-1',
      minute: 71,
      eventType: 'goal',
      title: 'GOAL!',
      actor: 'Marcus Rashford',
      team: 'Thunder FC ⚡',
      message: '⚡ UNBELIEVABLE STRIKE! The ball thunders into the top corner from 25 yards out!',
      tags: ['💥 #BOOM', '🚀 #ROCKET_SHOT'],
      timestamp: new Date(Date.now() - 1000 * 180).toLocaleTimeString(),
      score: '2 - 1'
    },
    {
      id: 'init-2',
      minute: 58,
      eventType: 'yellow_card',
      title: 'YELLOW CARD',
      actor: 'Bruno Silva',
      team: 'Blaze United 🔥',
      message: '🟨 Heavy sliding tackle halts the counter-attack right on the edge of the center circle.',
      tags: ['⚠️ #DRAMA'],
      timestamp: new Date(Date.now() - 1000 * 600).toLocaleTimeString(),
      score: '1 - 1'
    },
    {
      id: 'init-3',
      minute: 34,
      eventType: 'goal',
      title: 'GOAL!',
      actor: 'Victor Osimhen',
      team: 'Blaze United 🔥',
      message: '💥 Clinical header from the corner kick beats the keeper at the near post!',
      tags: ['🎯 #TOP_CORNER'],
      timestamp: new Date(Date.now() - 1000 * 1200).toLocaleTimeString(),
      score: '1 - 1'
    }
  ]);

  // Sync hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('user')) {
        setCurrentMode('user');
      } else if (hash.includes('admin')) {
        setCurrentMode('admin');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const switchMode = (mode) => {
    setCurrentMode(mode);
    window.location.hash = `#/${mode}`;
  };

  // Initialize WebSocket connection
  const connectWebSocket = useCallback(() => {
    try {
      if (wsRef.current) {
        wsRef.current.close();
      }

      const socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onopen = () => {
        setIsConnected(true);
        console.log('[WS] Connected to live sportz server at', wsUrl);
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          console.log('[WS Message Received]', payload);

          // Handle incoming live broadcast events
          if (payload.type === 'COMMENTARY_BROADCAST' && payload.data) {
            setBroadcastFeed((prev) => [payload.data, ...prev]);
          } else if (payload.type === 'SCORE_UPDATE') {
            setMatchData((prev) => ({ ...prev, ...payload }));
          } else if (payload.type === 'BROADCAST_STATUS_CHANGE') {
            setIsOnAir(payload.isOnAir);
          }
        } catch (e) {
          console.log('[WS Text Received]', event.data);
        }
      };

      socket.onerror = (err) => {
        console.warn('[WS Error - Local Deck Active]', err);
        setIsConnected(false);
      };

      socket.onclose = () => {
        setIsConnected(false);
        console.log('[WS] Socket closed');
      };
    } catch (err) {
      console.warn('[WS Connection Failed]', err);
      setIsConnected(false);
    }
  }, [wsUrl]);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connectWebSocket]);

  // Handler to dispatch broadcast events from Admin
  const handleBroadcastMessage = (payload) => {
    console.log('⚡ [Broadcast Dispatched]:', payload);

    // If it's a commentary event or score update, immediately sync locally
    if (payload.type === 'COMMENTARY_BROADCAST' && payload.data) {
      setBroadcastFeed((prev) => [payload.data, ...prev]);
    } else if (payload.type === 'SCORE_UPDATE') {
      setMatchData((prev) => ({
        ...prev,
        homeScore: payload.homeScore,
        awayScore: payload.awayScore,
        homeTeam: payload.homeTeam || prev.homeTeam,
        awayTeam: payload.awayTeam || prev.awayTeam,
        minute: payload.minute ?? prev.minute,
        period: payload.period ?? prev.period,
      }));
    } else if (payload.type === 'BROADCAST_STATUS_CHANGE') {
      setIsOnAir(payload.isOnAir);
    }

    // Send over WebSocket if live
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    }
  };

  // Handler for fan reactions
  const handleFanReaction = (reactionData) => {
    console.log('👏 Fan Reaction:', reactionData);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'FAN_REACTION', data: reactionData }));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* 🚀 TOP MODE SWITCHER BAR */}
      <div
        style={{
          background: '#0f172a',
          color: '#ffffff',
          padding: '0.45rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '2.5px solid #000',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span style={{ fontFamily: 'var(--font-comic)', fontSize: '1.05rem', color: 'var(--soft-yellow)' }}>
            ⚡ SPORTZ VIEW CONTROLLER:
          </span>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Toggle between Studio Admin & Live Fan screen
          </span>
        </div>

        {/* MODE SWITCH BUTTONS */}
        <div style={{ display: 'flex', gap: '0.4rem', background: '#1e293b', padding: '0.2rem', borderRadius: '8px', border: '1.5px solid #334155' }}>
          <button
            onClick={() => switchMode('admin')}
            style={{
              fontFamily: 'var(--font-comic)',
              fontSize: '0.95rem',
              letterSpacing: '0.04em',
              padding: '0.25rem 0.85rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: currentMode === 'admin' ? 'var(--soft-yellow)' : 'transparent',
              color: currentMode === 'admin' ? '#0f172a' : '#cbd5e1',
              fontWeight: '700',
              transition: 'all 0.15s'
            }}
          >
            <Shield size={14} />
            <span>🎙️ ADMIN STUDIO (APP/ADMIN)</span>
          </button>

          <button
            onClick={() => switchMode('user')}
            style={{
              fontFamily: 'var(--font-comic)',
              fontSize: '0.95rem',
              letterSpacing: '0.04em',
              padding: '0.25rem 0.85rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: currentMode === 'user' ? 'var(--soft-mint)' : 'transparent',
              color: currentMode === 'user' ? '#0f172a' : '#cbd5e1',
              fontWeight: '700',
              transition: 'all 0.15s'
            }}
          >
            <Users size={14} />
            <span>⚡ FAN ARENA (APP/USER)</span>
          </button>
        </div>
      </div>

      {/* RENDER CURRENT VIEW */}
      {currentMode === 'admin' ? (
        <AdminDashboard
          onBroadcastMessage={handleBroadcastMessage}
          onGoOnAirChange={(val) => setIsOnAir(val)}
          wsConnected={isConnected}
          wsUrl={wsUrl}
        />
      ) : (
        <UserScreen
          matchData={matchData}
          broadcastFeed={broadcastFeed}
          isOnAir={isOnAir}
          wsConnected={isConnected}
          onSendFanReaction={handleFanReaction}
        />
      )}
    </div>
  );
}
