import { useState } from 'react';
import {
  Radio,
  Users,
  Clock,
  Volume2,
  Sparkles,
  TrendingUp} from 'lucide-react';

// Fan Reactions available to click
const FAN_REACTIONS = [
  { emoji: '⚽', label: 'GOAL', bg: 'var(--soft-mint)', color: 'var(--soft-mint-dark)' },
  { emoji: '🔥', label: 'FIRE', bg: 'var(--soft-rose)', color: 'var(--soft-rose-dark)' },
  { emoji: '👏', label: 'CLAP', bg: 'var(--soft-sky)', color: 'var(--soft-sky-dark)' },
  { emoji: '😱', label: 'SHOCK', bg: 'var(--soft-yellow)', color: 'var(--comic-dark)' },
  { emoji: '🎉', label: 'CELEBRATE', bg: 'var(--soft-lavender)', color: 'var(--soft-lavender-dark)' },
];

export default function UserScreen({
  matchData,
  broadcastFeed = [],
  isOnAir = true,
  wsConnected = false,
  onSendFanReaction
}) {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'goals' | 'cards' | 'highlights'
  const [fanReactionsCount, setFanReactionsCount] = useState({
    '⚽': 1420,
    '🔥': 3890,
    '👏': 980,
    '😱': 640,
    '🎉': 2130,
  });

  // Floating floating comic burst animations
  const [floatingEmojis, setFloatingEmojis] = useState([]);

  // Active match data fallback
  const match = matchData || {
    homeTeam: 'Thunder FC ⚡',
    awayTeam: 'Blaze United 🔥',
    homeScore: 2,
    awayScore: 1,
    minute: 74,
    period: '2nd Half',
    stoppage: 2,
    status: 'live'
  };

  // Filter commentary items
  const filteredFeed = broadcastFeed.filter((item) => {
    if (activeFilter === 'goals') return item.eventType === 'goal' || item.eventType === 'penalty';
    if (activeFilter === 'cards') return item.eventType === 'yellow_card' || item.eventType === 'red_card';
    if (activeFilter === 'highlights') return item.eventType === 'goal' || item.eventType === 'save' || item.eventType === 'var';
    return true;
  });

  // Handle fan reaction button tap
  const handleReactionClick = (emoji) => {
    setFanReactionsCount((prev) => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1
    }));

    // Spawn floating animation
    const newId = Date.now() + Math.random();
    const xOffset = Math.floor(Math.random() * 60) - 30;
    setFloatingEmojis((prev) => [
      ...prev,
      { id: newId, emoji, left: 50 + xOffset }
    ]);

    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((item) => item.id !== newId));
    }, 1400);

    if (onSendFanReaction) {
      onSendFanReaction({ emoji, timestamp: new Date().toISOString() });
    }
  };

  return (
    <div className="admin-app" style={{ background: '#f8fafc' }}>
      {/* 1. FAN TOP NAVBAR */}
      <header className="admin-navbar">
        <div className="admin-logo-group">
          <div className="comic-logo-badge">
            ⚡ SPORTZ LIVE!
          </div>
          <div>
            <h1 className="admin-brand-text">FAN MATCHDAY ARENA</h1>
            <p className="admin-brand-sub">LIVE SOCKET BROADCAST & PLAY-BY-PLAY</p>
          </div>
        </div>

        {/* BROADCAST STATUS BADGE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            className={`comic-sticker ${isOnAir ? 'sticker-crimson' : 'sticker-yellow'}`}
            style={{ fontSize: '0.85rem' }}
          >
            {isOnAir ? '🔴 LIVE ON AIR' : '⚪ STREAM STANDBY'}
          </div>

          <div
            className={`comic-sticker ${wsConnected ? 'sticker-green' : 'sticker-dark'}`}
            style={{ fontSize: '0.75rem' }}
          >
            {wsConnected ? '🟢 CONNECTED' : '🟡 LOCAL STREAM'}
          </div>
        </div>
      </header>

      {/* 2. MAIN FAN ARENA CONTENT */}
      <main className="admin-main-container" style={{ maxWidth: '1400px' }}>
        {/* HERO SCOREBOARD HUD CARD */}
        <section
          className="comic-card"
          style={{
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #ffffff 0%, var(--soft-yellow-subtle) 100%)',
            borderWidth: '3.5px'
          }}
        >
          {/* HEADER BAR */}
          <div className="comic-card-header" style={{ borderColor: '#e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="comic-sticker sticker-yellow">⚽ FOOTBALL LEAGUE CUP</span>
              <span style={{ fontFamily: 'var(--font-sport)', fontSize: '1rem', color: 'var(--text-sub)' }}>
                STADIUM ARENA • ATTENDANCE: 48,900
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="clock-display" style={{ background: '#ffffff', fontSize: '1rem' }}>
                <Clock size={16} color="var(--comic-dark)" />
                <span>{match.minute}' MIN</span>
                {match.stoppage > 0 && (
                  <span style={{ color: 'var(--soft-rose-dark)' }}>+{match.stoppage}'</span>
                )}
              </div>
              <span className="comic-sticker sticker-green">{match.period.toUpperCase()}</span>
            </div>
          </div>

          {/* MAIN MATCH SCOREBOARD HERO */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              alignItems: 'center',
              gap: '1.5rem',
              padding: '1rem 0'
            }}
          >
            {/* HOME TEAM */}
            <div
              style={{
                background: 'var(--soft-sky-subtle)',
                border: '2.5px solid var(--comic-border)',
                borderRadius: '12px',
                padding: '1.25rem 1rem',
                textAlign: 'center',
                boxShadow: 'var(--comic-shadow-sm)'
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>⚡</div>
              <h2
                style={{
                  fontFamily: 'var(--font-comic)',
                  fontSize: '1.8rem',
                  letterSpacing: '0.04em',
                  color: 'var(--comic-dark)',
                  lineHeight: 1.1
                }}
              >
                {match.homeTeam}
              </h2>
              <span className="comic-sticker sticker-cyan" style={{ marginTop: '0.4rem', fontSize: '0.75rem' }}>
                HOME SQUAD
              </span>
            </div>

            {/* SCORE HERO CENTER */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div
                className="vs-badge-comic"
                style={{
                  fontSize: '0.82rem',
                  padding: '0.15rem 0.65rem',
                  marginBottom: '0.5rem',
                  display: 'inline-block'
                }}
              >
                LIVE SCORE
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  background: '#ffffff',
                  border: '3.5px solid var(--comic-border)',
                  padding: '0.65rem 1.85rem',
                  borderRadius: '16px',
                  boxShadow: 'var(--comic-shadow)'
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-comic)',
                    fontSize: '3.8rem',
                    color: 'var(--comic-dark)',
                    lineHeight: 1
                  }}
                >
                  {match.homeScore}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-comic)',
                    fontSize: '2.5rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1
                  }}
                >
                  :
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-comic)',
                    fontSize: '3.8rem',
                    color: 'var(--comic-dark)',
                    lineHeight: 1
                  }}
                >
                  {match.awayScore}
                </span>
              </div>
            </div>

            {/* AWAY TEAM */}
            <div
              style={{
                background: 'var(--soft-rose-subtle)',
                border: '2.5px solid var(--comic-border)',
                borderRadius: '12px',
                padding: '1.25rem 1rem',
                textAlign: 'center',
                boxShadow: 'var(--comic-shadow-sm)'
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>🔥</div>
              <h2
                style={{
                  fontFamily: 'var(--font-comic)',
                  fontSize: '1.8rem',
                  letterSpacing: '0.04em',
                  color: 'var(--comic-dark)',
                  lineHeight: 1.1
                }}
              >
                {match.awayTeam}
              </h2>
              <span className="comic-sticker sticker-crimson" style={{ marginTop: '0.4rem', fontSize: '0.75rem' }}>
                AWAY SQUAD
              </span>
            </div>
          </div>

          {/* LIVE MATCH TIMELINE SUMMARY */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#ffffff',
              border: '2px solid var(--comic-border)',
              borderRadius: '10px',
              padding: '0.65rem 1rem',
              marginTop: '0.75rem',
              boxShadow: 'var(--comic-shadow-sm)',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="comic-sticker sticker-green">⚽ 71' M. Rashford (2-1)</span>
              <span className="comic-sticker sticker-crimson">🟨 58' B. Silva</span>
              <span className="comic-sticker sticker-yellow">⚽ 34' V. Osimhen (1-1)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={16} color="var(--soft-sky-dark)" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: '700' }}>
                14,820 FANS TUNED IN
              </span>
            </div>
          </div>
        </section>

        {/* 2-COLUMN SECTION: LEFT = LIVE COMMENTARY STREAM | RIGHT = FAN CHEERING & STATS */}
        <div className="admin-grid" style={{ gridTemplateColumns: '1fr 380px' }}>
          {/* ===================== LEFT: LIVE COMMENTARY FEED ===================== */}
          <div>
            <div className="comic-card">
              <div className="comic-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="comic-card-title card-title-cyan">
                    <Radio size={20} />
                    <span>LIVE BROADCAST COMMENTARY</span>
                  </span>
                  <span className="comic-sticker sticker-cyan">PLAY-BY-PLAY</span>
                </div>

                {/* FILTER PILLS */}
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setActiveFilter('all')}
                    className={`comic-btn comic-btn-sm ${activeFilter === 'all' ? 'comic-btn-yellow' : 'comic-btn-dark'}`}
                  >
                    ALL ({broadcastFeed.length})
                  </button>
                  <button
                    onClick={() => setActiveFilter('goals')}
                    className={`comic-btn comic-btn-sm ${activeFilter === 'goals' ? 'comic-btn-green' : 'comic-btn-dark'}`}
                  >
                    ⚽ GOALS
                  </button>
                  <button
                    onClick={() => setActiveFilter('cards')}
                    className={`comic-btn comic-btn-sm ${activeFilter === 'cards' ? 'comic-btn-crimson' : 'comic-btn-dark'}`}
                  >
                    🟨 CARDS
                  </button>
                  <button
                    onClick={() => setActiveFilter('highlights')}
                    className={`comic-btn comic-btn-sm ${activeFilter === 'highlights' ? 'comic-btn-cyan' : 'comic-btn-dark'}`}
                  >
                    🔥 HIGHLIGHTS
                  </button>
                </div>
              </div>

              {/* LIVE STREAM ITEMS */}
              <div className="commentary-feed-list" style={{ maxHeight: '680px' }}>
                {filteredFeed.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '3.5rem 1rem',
                      color: 'var(--text-muted)',
                      border: '2px dashed #cbd5e1',
                      borderRadius: '12px',
                      background: '#ffffff'
                    }}
                  >
                    <Volume2 size={44} style={{ opacity: 0.35, marginBottom: '0.5rem' }} />
                    <p style={{ fontFamily: 'var(--font-comic)', fontSize: '1.4rem', color: 'var(--comic-dark)' }}>
                      WAITING FOR LIVE PLAY ACTION!
                    </p>
                    <p style={{ fontSize: '0.9rem', maxWidth: '400px', margin: '0.35rem auto' }}>
                      Commentary broadcasts dispatched by the Studio Admin will appear here in real-time.
                    </p>
                  </div>
                ) : (
                  filteredFeed.map((item) => {
                    const isGoal = item.eventType === 'goal' || item.eventType === 'penalty';
                    const isCard = item.eventType === 'yellow_card' || item.eventType === 'red_card';
                    const isExit = item.eventType === 'broadcast_exit';

                    return (
                      <div
                        key={item.id}
                        className={`comic-bubble-card ${
                          isGoal
                            ? 'bubble-card-goal'
                            : isCard
                            ? 'bubble-card-card'
                            : isExit
                            ? 'bubble-card-broadcast'
                            : ''
                        }`}
                      >
                        <div className="bubble-top-row">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="bubble-minute-badge">{item.minute}'</span>
                            <span
                              className={`bubble-event-tag ${
                                isGoal
                                  ? 'event-goal'
                                  : isCard
                                  ? 'event-card'
                                  : 'event-sub'
                              }`}
                            >
                              {item.title}
                            </span>
                            {item.team && (
                              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--comic-dark)' }}>
                                {item.team}
                              </span>
                            )}
                          </div>

                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {item.timestamp}
                          </span>
                        </div>

                        {item.actor && item.actor !== 'Key Player' && (
                          <div style={{ marginBottom: '0.25rem' }}>
                            <span className="bubble-actor-tag">👤 {item.actor}:</span>
                          </div>
                        )}

                        <p className="bubble-text" style={{ fontSize: '1rem', fontWeight: '500' }}>
                          {item.message}
                        </p>

                        <div className="bubble-footer">
                          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                            {item.tags?.map((tag, idx) => (
                              <span
                                key={idx}
                                style={{
                                  fontFamily: 'var(--font-comic)',
                                  fontSize: '0.82rem',
                                  color: 'var(--comic-dark)',
                                  background: 'var(--soft-yellow)',
                                  border: '1px solid var(--comic-border)',
                                  padding: '0.1rem 0.45rem',
                                  borderRadius: '4px'
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div style={{ fontFamily: 'var(--font-comic)', fontSize: '1rem', color: 'var(--comic-dark)' }}>
                            MATCH SCORE: <strong>{item.score || '2-1'}</strong>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* ===================== RIGHT: FAN CHEER ZONE & STATS ===================== */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* 1. FAN LIVE CHEER & REACTION DECK */}
            <div className="comic-card" style={{ position: 'relative' }}>
              <div className="comic-card-header">
                <span className="comic-card-title card-title-yellow">
                  <Sparkles size={20} />
                  <span>FAN REACTION ZONE</span>
                </span>
                <span className="comic-sticker sticker-yellow">TAP TO CHEER</span>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)', marginBottom: '0.85rem' }}>
                Tap to send instant live emoji bursts to the stadium arena & match commentators:
              </p>

              {/* REACTION BUTTONS GRID */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem', marginBottom: '1rem' }}>
                {FAN_REACTIONS.map((item) => (
                  <button
                    key={item.emoji}
                    onClick={() => handleReactionClick(item.emoji)}
                    className="comic-btn"
                    style={{
                      background: item.bg,
                      color: item.color,
                      flexDirection: 'column',
                      padding: '0.5rem 0.2rem',
                      gap: '0.2rem',
                      borderRadius: '8px'
                    }}
                  >
                    <span style={{ fontSize: '1.4rem' }}>{item.emoji}</span>
                    <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
                      {fanReactionsCount[item.emoji] || 0}
                    </span>
                  </button>
                ))}
              </div>

              {/* FLOATING EMOJI ANIMATIONS CONTAINER */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  overflow: 'hidden',
                  borderRadius: '14px'
                }}
              >
                {floatingEmojis.map((anim) => (
                  <div
                    key={anim.id}
                    style={{
                      position: 'absolute',
                      bottom: '50px',
                      left: `${anim.left}%`,
                      fontSize: '2rem',
                      animation: 'floatUp 1.4s ease-out forwards'
                    }}
                  >
                    {anim.emoji}
                  </div>
                ))}
              </div>
            </div>

            {/* 2. MATCH STATS HUD CARD */}
            <div className="comic-card">
              <div className="comic-card-header">
                <span className="comic-card-title card-title-green">
                  <TrendingUp size={20} />
                  <span>LIVE MATCH STATS</span>
                </span>
                <span className="comic-sticker sticker-green">74' MIN</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {/* POSSESSION */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.3rem' }}>
                    <span>56%</span>
                    <span style={{ fontFamily: 'var(--font-sport)', fontSize: '0.95rem' }}>BALL POSSESSION</span>
                    <span>44%</span>
                  </div>
                  <div style={{ display: 'flex', height: '10px', borderRadius: '5px', overflow: 'hidden', border: '1.5px solid var(--comic-border)' }}>
                    <div style={{ width: '56%', background: 'var(--soft-sky-dark)' }} />
                    <div style={{ width: '44%', background: 'var(--soft-rose-dark)' }} />
                  </div>
                </div>

                {/* SHOTS ON TARGET */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.3rem' }}>
                    <span>7</span>
                    <span style={{ fontFamily: 'var(--font-sport)', fontSize: '0.95rem' }}>SHOTS ON TARGET</span>
                    <span>4</span>
                  </div>
                  <div style={{ display: 'flex', height: '10px', borderRadius: '5px', overflow: 'hidden', border: '1.5px solid var(--comic-border)' }}>
                    <div style={{ width: '63%', background: 'var(--soft-sky-dark)' }} />
                    <div style={{ width: '37%', background: 'var(--soft-rose-dark)' }} />
                  </div>
                </div>

                {/* CORNERS */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.3rem' }}>
                    <span>5</span>
                    <span style={{ fontFamily: 'var(--font-sport)', fontSize: '0.95rem' }}>CORNERS</span>
                    <span>3</span>
                  </div>
                  <div style={{ display: 'flex', height: '10px', borderRadius: '5px', overflow: 'hidden', border: '1.5px solid var(--comic-border)' }}>
                    <div style={{ width: '60%', background: 'var(--soft-sky-dark)' }} />
                    <div style={{ width: '40%', background: 'var(--soft-rose-dark)' }} />
                  </div>
                </div>

                {/* FOULS */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.3rem' }}>
                    <span>8</span>
                    <span style={{ fontFamily: 'var(--font-sport)', fontSize: '0.95rem' }}>FOULS</span>
                    <span>11</span>
                  </div>
                  <div style={{ display: 'flex', height: '10px', borderRadius: '5px', overflow: 'hidden', border: '1.5px solid var(--comic-border)' }}>
                    <div style={{ width: '42%', background: 'var(--soft-sky-dark)' }} />
                    <div style={{ width: '58%', background: 'var(--soft-rose-dark)' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FLOATING KEYFRAMES CSS INJECTION */}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(0.6); opacity: 1; }
          50% { transform: translateY(-70px) scale(1.3); opacity: 0.9; }
          100% { transform: translateY(-140px) scale(1.6); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
