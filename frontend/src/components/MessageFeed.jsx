import React, { useState } from 'react';
import { Terminal, Trash2, Copy, Check, Filter, Pause, Play } from 'lucide-react';

export default function MessageFeed({ messages, onClear }) {
  const [filterType, setFilterType] = useState('ALL');
  const [copiedId, setCopiedId] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  const handleCopy = (id, data) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const filteredMessages = messages.filter((msg) => {
    if (filterType === 'ALL') return true;
    return msg.type?.toLowerCase() === filterType.toLowerCase() ||
           msg.raw?.message?.toLowerCase() === filterType.toLowerCase();
  });

  const displayMessages = isPaused ? messages : filteredMessages;

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <Terminal size={18} color="#22d3ee" />
          Live WebSocket Message Feed
          <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)' }}>
            ({messages.length} received)
          </span>
        </h3>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {/* Pause / Resume */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? "Resume Live Feed" : "Pause Live Feed"}
          >
            {isPaused ? <Play size={14} color="#10b981" /> : <Pause size={14} />}
            {isPaused ? 'Resume' : 'Pause'}
          </button>

          {/* Clear Logs */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={onClear}
            disabled={messages.length === 0}
            title="Clear all messages"
          >
            <Trash2 size={14} /> Clear
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {['ALL', 'WELCOME', 'BROASCAST'].map((tag) => (
          <button
            key={tag}
            className={`btn btn-sm ${filterType === tag ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.7rem', padding: '0.25rem 0.55rem' }}
            onClick={() => setFilterType(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Messages List */}
      <div className="message-feed-container">
        {displayMessages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-dim)' }}>
            <Terminal size={32} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
            <p>No WebSocket frames received yet.</p>
            <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
              Connect to <code>ws://localhost:8000/ws</code> to see incoming messages.
            </p>
          </div>
        ) : (
          displayMessages.map((msg) => {
            const isWelcome = msg.raw?.type === 'Welcome' || msg.type === 'Welcome';
            const isBroadcast = msg.raw?.message === 'Broascast' || msg.type === 'Broascast';

            return (
              <div key={msg.id} className="message-item">
                <div className="message-item-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      className={`message-badge ${
                        isWelcome
                          ? 'badge-welcome'
                          : isBroadcast
                          ? 'badge-broadcast'
                          : 'badge-custom'
                      }`}
                    >
                      {msg.raw?.type || msg.raw?.message || 'FRAME'}
                    </span>
                    <span className="message-time">{msg.timestamp}</span>
                  </div>

                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '0.2rem 0.4rem', fontSize: '0.7rem' }}
                    onClick={() => handleCopy(msg.id, msg.raw)}
                    title="Copy JSON"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check size={12} color="#10b981" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={12} /> Copy
                      </>
                    )}
                  </button>
                </div>

                <pre className="json-viewer">
                  {JSON.stringify(msg.raw, null, 2)}
                </pre>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
