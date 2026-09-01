import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import ConnectionControl from './components/ConnectionControl';
import MessageFeed from './components/MessageFeed';
import MatchList from './components/MatchList';
import CreateMatchModal from './components/CreateMatchModal';

export default function App() {
  const [wsUrl, setWsUrl] = useState('ws://localhost:8000/ws');
  const [status, setStatus] = useState('DISCONNECTED'); // 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED'
  const [messages, setMessages] = useState([]);
  const [matches, setMatches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFetchingMatches, setIsFetchingMatches] = useState(false);

  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  // Add message to feed
  const logMessage = useCallback((rawPayload, direction = 'IN') => {
    let parsedData = rawPayload;
    if (typeof rawPayload === 'string') {
      try {
        parsedData = JSON.parse(rawPayload);
      } catch (e) {
        parsedData = { text: rawPayload };
      }
    }

    const newMessage = {
      id: Date.now() + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toLocaleTimeString(),
      direction,
      type: parsedData?.type || parsedData?.message || 'RAW',
      raw: parsedData,
    };

    setMessages((prev) => [newMessage, ...prev]);

    // Check if message contains match data
    if (parsedData?.data && typeof parsedData.data === 'object') {
      const matchItem = parsedData.data;
      if (matchItem.sport || matchItem.homeTeam || matchItem.id) {
        setMatches((prev) => {
          const existsIndex = prev.findIndex((m) => m.id === matchItem.id);
          if (existsIndex >= 0) {
            const updated = [...prev];
            updated[existsIndex] = { ...updated[existsIndex], ...matchItem };
            return updated;
          }
          return [matchItem, ...prev];
        });
      }
    }
  }, []);

  // Connect WebSocket
  const connect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    setStatus('CONNECTING');

    try {
      const socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onopen = () => {
        setStatus('CONNECTED');
        console.log(`[WS] Connected to ${wsUrl}`);
      };

      socket.onmessage = (event) => {
        logMessage(event.data, 'IN');
      };

      socket.onerror = (err) => {
        console.error('[WS Error]', err);
      };

      socket.onclose = () => {
        setStatus('DISCONNECTED');
        console.log('[WS] Disconnected');
      };
    } catch (err) {
      console.error('[WS Init Exception]', err);
      setStatus('DISCONNECTED');
    }
  }, [wsUrl, logMessage]);

  // Disconnect WebSocket
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setStatus('DISCONNECTED');
  }, []);

  // Send WS message
  const sendMessage = useCallback((msgString) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(msgString);
      logMessage({ sent: msgString }, 'OUT');
    } else {
      alert('WebSocket is not connected');
    }
  }, [logMessage]);

  // Fetch matches from REST API
  const fetchMatches = useCallback(async () => {
    setIsFetchingMatches(true);
    try {
      const res = await fetch('http://localhost:8000/matches');
      const data = await res.json();
      if (data.success && Array.isArray(data.matches)) {
        setMatches(data.matches);
      }
    } catch (err) {
      console.error('Failed to fetch matches', err);
    } finally {
      setIsFetchingMatches(false);
    }
  }, []);

  // Initial connect & initial match fetch
  useEffect(() => {
    connect();
    fetchMatches();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  const handleClearMessages = () => {
    setMessages([]);
  };

  const handleMatchCreated = (newMatch) => {
    if (newMatch) {
      setMatches((prev) => {
        const exists = prev.some((m) => m.id === newMatch.id);
        return exists ? prev : [newMatch, ...prev];
      });
    }
  };

  return (
    <div className="app-container">
      <Navbar
        status={status}
        messageCount={messages.length}
        matchCount={matches.length}
      />

      <main className="main-content">
        <div className="dashboard-grid">
          {/* Left Column: Connection & Test Controls */}
          <div>
            <ConnectionControl
              url={wsUrl}
              setUrl={setWsUrl}
              status={status}
              onConnect={connect}
              onDisconnect={disconnect}
              onSendMessage={sendMessage}
              onOpenCreateMatch={() => setIsModalOpen(true)}
            />
          </div>

          {/* Right Column: Message Feed & Match Cards */}
          <div>
            <MessageFeed
              messages={messages}
              onClear={handleClearMessages}
            />

            <MatchList
              matches={matches}
              onRefresh={fetchMatches}
              isLoading={isFetchingMatches}
            />
          </div>
        </div>
      </main>

      <CreateMatchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleMatchCreated}
      />
    </div>
  );
}
