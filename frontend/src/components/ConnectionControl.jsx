import React, { useState } from 'react';
import { Play, Square, RefreshCw, Send, Terminal, Sparkles } from 'lucide-react';

export default function ConnectionControl({
  url,
  setUrl,
  status,
  onConnect,
  onDisconnect,
  onSendMessage,
  onOpenCreateMatch,
}) {
  const [customMsg, setCustomMsg] = useState('{"type": "ping"}');

  const handleSend = (e) => {
    e.preventDefault();
    if (!customMsg.trim()) return;
    onSendMessage(customMsg);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <Terminal size={18} color="#818cf8" />
          WS Connection
        </h3>
      </div>

      <div className="form-group">
        <label className="form-label">WebSocket URL</label>
        <input
          type="text"
          className="input-field"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={status === 'CONNECTED' || status === 'CONNECTING'}
          placeholder="ws://localhost:8000/ws"
        />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {status === 'CONNECTED' ? (
          <button className="btn btn-danger btn-block" onClick={onDisconnect}>
            <Square size={16} /> Disconnect
          </button>
        ) : (
          <button
            className="btn btn-primary btn-block"
            onClick={onConnect}
            disabled={status === 'CONNECTING'}
          >
            {status === 'CONNECTING' ? (
              <>
                <RefreshCw size={16} className="spin-icon" /> Connecting...
              </>
            ) : (
              <>
                <Play size={16} /> Connect to WS
              </>
            )}
          </button>
        )}
      </div>

      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem' }}>
        <label className="form-label">Send Message over WS</label>
        <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <textarea
            className="input-field"
            rows={2}
            value={customMsg}
            onChange={(e) => setCustomMsg(e.target.value)}
            disabled={status !== 'CONNECTED'}
            placeholder='{"action": "subscribe"}'
          />
          <button
            type="submit"
            className="btn btn-secondary btn-sm"
            disabled={status !== 'CONNECTED'}
            style={{ alignSelf: 'flex-end' }}
          >
            <Send size={14} /> Send Frame
          </button>
        </form>
      </div>

      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span className="form-label" style={{ margin: 0 }}>Simulate Match Event</span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          Trigger a <code>POST /matches</code> API request to see real-time broadcast in action.
        </p>
        <button className="btn btn-secondary btn-block" onClick={onOpenCreateMatch}>
          <Sparkles size={16} color="#c084fc" /> Create Test Match (API)
        </button>
      </div>
    </div>
  );
}
