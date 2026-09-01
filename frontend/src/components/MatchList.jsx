import React from 'react';
import { Trophy, Clock, RefreshCw } from 'lucide-react';

export default function MatchList({ matches, onRefresh, isLoading }) {
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'live':
      case 'in_progress':
        return <span className="match-status-tag tag-live">● Live</span>;
      case 'scheduled':
      case 'upcoming':
        return <span className="match-status-tag tag-scheduled">Scheduled</span>;
      case 'finished':
      case 'completed':
        return <span className="match-status-tag tag-finished">Finished</span>;
      default:
        return <span className="match-status-tag tag-scheduled">{status || 'Live'}</span>;
    }
  };

  return (
    <div className="card" style={{ marginTop: '1.5rem' }}>
      <div className="card-header">
        <h3 className="card-title">
          <Trophy size={18} color="#f59e0b" />
          Active Matches & WebSocket Sync
          <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)' }}>
            ({matches.length})
          </span>
        </h3>

        <button
          className="btn btn-secondary btn-sm"
          onClick={onRefresh}
          disabled={isLoading}
          title="Fetch latest matches from REST API"
        >
          <RefreshCw size={14} className={isLoading ? 'spin-icon' : ''} />
          Fetch API
        </button>
      </div>

      {matches.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-dim)' }}>
          <p>No matches yet.</p>
          <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
            Matches received via WebSocket broadcast or fetched from API will be rendered here.
          </p>
        </div>
      ) : (
        <div className="matches-grid">
          {matches.map((m, idx) => (
            <div key={m.id || idx} className="match-card">
              <div className="match-card-header">
                <span className="match-sport">{m.sport || 'Match Event'}</span>
                {getStatusBadge(m.status)}
              </div>

              <div className="teams-container">
                <div className="team-row">
                  <span>{m.homeTeam || m.home_team || 'Home Team'}</span>
                  <span className="team-score">{m.homeScore ?? m.home_score ?? 0}</span>
                </div>
                <div className="team-row">
                  <span>{m.awayTeam || m.away_team || 'Away Team'}</span>
                  <span className="team-score">{m.awayScore ?? m.away_score ?? 0}</span>
                </div>
              </div>

              <div className="match-time">
                <span>ID: #{m.id || idx + 1}</span>
                {m.startTime && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={12} />
                    {new Date(m.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
