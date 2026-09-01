import React, { useState } from 'react';
import { X, Send, AlertCircle } from 'lucide-react';

export default function CreateMatchModal({ isOpen, onClose, onCreated }) {
  const [sport, setSport] = useState('Football');
  const [homeTeam, setHomeTeam] = useState('Arsenal');
  const [awayTeam, setAwayTeam] = useState('Chelsea');
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  
  // Default start now, end in 2 hours
  const now = new Date();
  const later = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const [startTime, setStartTime] = useState(now.toISOString());
  const [endTime, setEndTime] = useState(later.toISOString());
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      sport,
      homeTeam,
      awayTeam,
      homeScore: Number(homeScore),
      awayScore: Number(awayScore),
      startTime,
      endTime,
    };

    try {
      const res = await fetch('http://localhost:8000/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error ? JSON.stringify(data.error) : 'Failed to create match');
      }

      onCreated(data.match);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error creating match');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Trigger Match Event (POST /matches)</h3>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            color: '#fb7185',
            padding: '0.6rem 0.8rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Sport</label>
            <input
              type="text"
              className="input-field"
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="form-label">Home Team</label>
              <input
                type="text"
                className="input-field"
                value={homeTeam}
                onChange={(e) => setHomeTeam(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Away Team</label>
              <input
                type="text"
                className="input-field"
                value={awayTeam}
                onChange={(e) => setAwayTeam(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="form-label">Home Score</label>
              <input
                type="number"
                min="0"
                className="input-field"
                value={homeScore}
                onChange={(e) => setHomeScore(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Away Score</label>
              <input
                type="number"
                min="0"
                className="input-field"
                value={awayScore}
                onChange={(e) => setAwayScore(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Start Time (ISO)</label>
            <input
              type="text"
              className="input-field"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">End Time (ISO)</label>
            <input
              type="text"
              className="input-field"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Send size={14} /> {loading ? 'Posting...' : 'Create Match'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
