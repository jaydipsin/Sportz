import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Tv,
  Flame,
  Volume2,
  Send,
  Sparkles,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Minus,
  AlertTriangle,
  LogOut,
  Shield,
  Activity,
  Award,
  Clock,
  CheckCircle2,
  Terminal,
  Layers,
  Users,
  Eye,
  Trash2,
  Sliders,
  Maximize2
} from 'lucide-react';

// Sport List
const SPORTS_LIST = [
  { id: 'football', name: 'Football / Soccer', icon: '⚽', active: true, tag: 'LIVE READY' },
  { id: 'basketball', name: 'Basketball', icon: '🏀', active: false, tag: 'SOON' },
  { id: 'cricket', name: 'Cricket', icon: '🏏', active: false, tag: 'SOON' },
  { id: 'tennis', name: 'Tennis', icon: '🎾', active: false, tag: 'SOON' },
  { id: 'f1', name: 'Motorsports F1', icon: '🏎️', active: false, tag: 'SOON' },
];

// Commentary Event Types
const EVENT_TYPES = [
  { id: 'goal', label: 'GOAL!', icon: '⚽', color: 'event-goal' },
  { id: 'yellow_card', label: 'YELLOW', icon: '🟨', color: 'event-card' },
  { id: 'red_card', label: 'RED CARD', icon: '🟥', color: 'event-card' },
  { id: 'substitution', label: 'SUB', icon: '🔄', color: 'event-sub' },
  { id: 'penalty', label: 'PENALTY', icon: '🎯', color: 'event-goal' },
  { id: 'save', label: 'SAVE', icon: '🧤', color: 'event-info' },
  { id: 'var', label: 'VAR', icon: '📺', color: 'event-card' },
  { id: 'whistle', label: 'WHISTLE', icon: '📢', color: 'event-info' },
];

// Comic Sound Tags
const COMIC_TAGS = [
  '💥 #BOOM',
  '⚡ #SCREAMER',
  '🔥 #ON_FIRE',
  '🧤 #BRICK_WALL',
  '🎯 #TOP_CORNER',
  '⚠️ #DRAMA',
  '🏆 #CLUTCH',
  '🚀 #ROCKET'
];

// Quick Templates for Rapid Commentary
const QUICK_PHRASES = [
  "⚡ UNBELIEVABLE STRIKE! The ball thunders into the top corner!",
  "🧤 STUNNING REFLEX SAVE! The goalkeeper denies a certain goal!",
  "🟨 Tactical foul committed on the counter attack. Yellow card shown.",
  "💥 GOAL! Cool as ice from inside the penalty box!",
  "📢 The referee blows the whistle! 4 minutes of stoppage time added.",
  "⚠️ VAR Check in progress for possible foul in the build-up!"
];

export default function AdminDashboard({
  onBroadcastMessage,
  onGoOnAirChange,
  onExitBroadcastSubmit,
  wsConnected = false,
  wsUrl = "ws://localhost:8000/ws"
}) {
  // 1. Sport Selection State
  const [selectedSport, setSelectedSport] = useState('football');

  // 2. Broadcast Live State
  const [isOnAir, setIsOnAir] = useState(false);
  const [audienceCount, setAudienceCount] = useState(14820);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [exitReason, setExitReason] = useState('MATCH_CONCLUDED');
  const [customExitText, setCustomExitText] = useState('Broadcast concluded. Thank you for watching live with Sportz!');

  // 3. Match State
  const [matchInfo, setMatchInfo] = useState({
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

  // Clock Timer State
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setMatchInfo((prev) => {
          if (prev.minute >= 120) return prev;
          return { ...prev, minute: prev.minute + 1 };
        });
      }, 2000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  // Audience Simulation when on Air
  useEffect(() => {
    let interval = null;
    if (isOnAir) {
      interval = setInterval(() => {
        setAudienceCount((prev) => prev + Math.floor(Math.random() * 25) - 10);
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOnAir]);

  // 4. Commentary Form State
  const [eventType, setEventType] = useState('goal');
  const [actorName, setActorName] = useState('');
  const [targetTeam, setTargetTeam] = useState('home'); // 'home' | 'away' | 'neutral'
  const [commentaryText, setCommentaryText] = useState('');
  const [selectedTags, setSelectedTags] = useState(['💥 #BOOM']);
  const [showJsonInspector, setShowJsonInspector] = useState(false);

  // 5. Broadcast Feed / History
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

  // Toggle On Air
  const handleToggleOnAir = () => {
    const newState = !isOnAir;
    setIsOnAir(newState);
    if (onGoOnAirChange) {
      onGoOnAirChange(newState);
    }
    const notice = {
      id: 'broadcast-' + Date.now(),
      minute: matchInfo.minute,
      eventType: 'broadcast_state',
      title: newState ? '🔴 ON AIR: LIVE' : '⚪ OFF AIR',
      actor: 'STUDIO DESK',
      team: 'BROADCAST',
      message: newState
        ? '📢 Match is now broadcasting LIVE to all connected fan screens & websockets!'
        : '⏸️ Transmission paused by Admin Studio.',
      tags: ['⚡ #LIVE_ON_AIR'],
      timestamp: new Date().toLocaleTimeString(),
      score: `${matchInfo.homeScore} - ${matchInfo.awayScore}`
    };
    setBroadcastFeed((prev) => [notice, ...prev]);

    if (onBroadcastMessage) {
      onBroadcastMessage({
        type: 'BROADCAST_STATUS_CHANGE',
        isOnAir: newState,
        matchId: matchInfo.id,
        timestamp: new Date().toISOString()
      });
    }
  };

  // Exit Broadcast Action
  const handleExitBroadcast = () => {
    setIsOnAir(false);
    setIsExitModalOpen(false);

    const exitPayload = {
      type: 'EXIT_BROADCAST_MESSAGE',
      reason: exitReason,
      message: customExitText,
      finalScore: `${matchInfo.homeScore} - ${matchInfo.awayScore}`,
      matchId: matchInfo.id,
      timestamp: new Date().toISOString()
    };

    const exitItem = {
      id: 'exit-' + Date.now(),
      minute: matchInfo.minute,
      eventType: 'broadcast_exit',
      title: '🔴 BROADCAST CONCLUDED',
      actor: 'STUDIO DIRECTOR',
      team: 'BROADCAST',
      message: `[${exitReason}] ${customExitText}`,
      tags: ['🏁 #MATCH_OVER'],
      timestamp: new Date().toLocaleTimeString(),
      score: `${matchInfo.homeScore} - ${matchInfo.awayScore}`
    };

    setBroadcastFeed((prev) => [exitItem, ...prev]);

    if (onExitBroadcastSubmit) {
      onExitBroadcastSubmit(exitPayload);
    }
    if (onBroadcastMessage) {
      onBroadcastMessage(exitPayload);
    }
  };

  // Score adjustments
  const handleScoreChange = (team, delta) => {
    setMatchInfo((prev) => {
      const updated = {
        ...prev,
        [team === 'home' ? 'homeScore' : 'awayScore']: Math.max(
          0,
          prev[team === 'home' ? 'homeScore' : 'awayScore'] + delta
        )
      };

      if (onBroadcastMessage) {
        onBroadcastMessage({
          type: 'SCORE_UPDATE',
          matchId: updated.id,
          homeTeam: updated.homeTeam,
          awayTeam: updated.awayTeam,
          homeScore: updated.homeScore,
          awayScore: updated.awayScore,
          minute: updated.minute,
          period: updated.period,
          timestamp: new Date().toISOString()
        });
      }

      return updated;
    });
  };

  // Tag toggle
  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Send Commentary to Audience
  const handleSendCommentary = (e) => {
    if (e) e.preventDefault();
    if (!commentaryText.trim()) return;

    const matchedType = EVENT_TYPES.find((t) => t.id === eventType);
    const assignedTeamName =
      targetTeam === 'home'
        ? matchInfo.homeTeam
        : targetTeam === 'away'
        ? matchInfo.awayTeam
        : 'Neutral / Match Official';

    const newCommentaryEvent = {
      id: 'cmt-' + Date.now(),
      matchId: matchInfo.id,
      sport: selectedSport,
      minute: matchInfo.minute,
      stoppage: matchInfo.stoppage,
      period: matchInfo.period,
      eventType: eventType,
      title: matchedType?.label || 'EVENT',
      actor: actorName.trim() || 'Key Player',
      team: assignedTeamName,
      message: commentaryText.trim(),
      tags: selectedTags,
      score: `${matchInfo.homeScore} - ${matchInfo.awayScore}`,
      timestamp: new Date().toLocaleTimeString(),
      isoTimestamp: new Date().toISOString()
    };

    setBroadcastFeed((prev) => [newCommentaryEvent, ...prev]);

    if (onBroadcastMessage) {
      onBroadcastMessage({
        type: 'COMMENTARY_BROADCAST',
        data: newCommentaryEvent
      });
    }

    setCommentaryText('');
    setActorName('');
  };

  const applyQuickPhrase = (phrase) => {
    setCommentaryText(phrase);
  };

  const clearFeed = () => {
    if (window.confirm('Clear live broadcast commentary feed?')) {
      setBroadcastFeed([]);
    }
  };

  return (
    <div className="admin-app">
      {/* 1. TOP NAVBAR */}
      <header className="admin-navbar">
        <div className="admin-logo-group">
          <div className="comic-logo-badge">
            ⚡ SPORTZ!
          </div>
          <div>
            <h1 className="admin-brand-text">ADMIN BROADCAST STUDIO</h1>
            <p className="admin-brand-sub">HORIZONTAL CONTROL CONSOLE & LIVE STREAM</p>
          </div>
        </div>

        {/* SPORT SELECTOR */}
        <div className="sport-selector-bar">
          {SPORTS_LIST.map((sport) => (
            <button
              key={sport.id}
              onClick={() => sport.active && setSelectedSport(sport.id)}
              className={`sport-tab-btn ${selectedSport === sport.id ? 'active' : ''} ${
                !sport.active ? 'disabled' : ''
              }`}
            >
              <span>{sport.icon}</span>
              <span>{sport.name}</span>
              {!sport.active && <span className="lock-pill">SOON</span>}
            </button>
          ))}
        </div>

        {/* DEV PAYLOAD TOGGLE & SOCKET STATUS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div className={`comic-sticker ${wsConnected ? 'sticker-green' : 'sticker-yellow'}`} style={{ fontSize: '0.75rem' }}>
            {wsConnected ? '🟢 SOCKET ACTIVE' : '🟡 LOCAL DECK'}
          </div>
          <button
            onClick={() => setShowJsonInspector(!showJsonInspector)}
            className="comic-btn comic-btn-dark comic-btn-sm"
          >
            <Terminal size={14} />
            <span>JSON PAYLOAD</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN ADMIN VIEWPORT */}
      <main className="admin-main-container" style={{ maxWidth: '1700px' }}>
        {/* JSON PAYLOAD INSPECTOR MODAL DRAWER */}
        {showJsonInspector && (
          <div className="comic-card" style={{ marginBottom: '1.25rem', background: '#0a0f1d' }}>
            <div className="comic-card-header">
              <span className="comic-card-title card-title-cyan">
                <Terminal size={18} />
                <span>LIVE WEBSOCKET JSON PAYLOAD (BACKEND SYNC)</span>
              </span>
              <span className="comic-sticker sticker-cyan">WS PROTOCOL: READY</span>
            </div>
            <div className="json-comic-box">
              {JSON.stringify(
                {
                  endpoint: wsUrl,
                  sport: selectedSport,
                  match: matchInfo,
                  broadcastState: { isOnAir, audienceCount },
                  latestDispatchedEvent: broadcastFeed[0] || null
                },
                null,
                2
              )}
            </div>
          </div>
        )}

        {/* ===================== ROW 1: MASTER ON-AIR & MATCH SCOREBOARD BAR ===================== */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.35fr 1fr',
            gap: '1.25rem',
            marginBottom: '1.25rem',
            alignItems: 'stretch'
          }}
        >
          {/* 1A. LIVE SCOREBOARD & CLOCK CONTROLLER */}
          <div className="comic-card" style={{ padding: '0.85rem 1.15rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div className="comic-card-header" style={{ marginBottom: '0.5rem', paddingBottom: '0.35rem' }}>
              <span className="comic-card-title card-title-yellow" style={{ fontSize: '1.15rem' }}>
                <Award size={18} />
                <span>MATCH HUD & SCORE CONTROLLER</span>
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="clock-display" style={{ padding: '0.2rem 0.55rem', fontSize: '0.95rem' }}>
                  <Clock size={14} />
                  <span>{matchInfo.minute}' MIN</span>
                  {matchInfo.stoppage > 0 && <span style={{ color: 'var(--soft-rose-dark)' }}>+{matchInfo.stoppage}'</span>}
                </div>
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="comic-btn comic-btn-sm comic-btn-cyan"
                  style={{ padding: '0.2rem 0.55rem', fontSize: '0.8rem' }}
                >
                  {isTimerRunning ? <Pause size={12} /> : <Play size={12} />}
                  <span>{isTimerRunning ? 'PAUSE' : 'RUN'}</span>
                </button>
                <select
                  value={matchInfo.period}
                  onChange={(e) => setMatchInfo({ ...matchInfo, period: e.target.value })}
                  className="comic-select"
                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.82rem', width: 'auto' }}
                >
                  <option value="1st Half">1st Half</option>
                  <option value="Halftime">Halftime</option>
                  <option value="2nd Half">2nd Half</option>
                  <option value="Extra Time">Extra Time</option>
                  <option value="Full Time">Full Time</option>
                </select>
              </div>
            </div>

            {/* SCOREBOARD MATCHUP ROW */}
            <div className="score-board-comic" style={{ padding: '0.5rem 0.75rem', margin: 0 }}>
              <div className="scoreboard-matchup" style={{ gap: '0.5rem' }}>
                {/* HOME */}
                <div className="team-box home-active" style={{ padding: '0.4rem 0.6rem' }}>
                  <input
                    type="text"
                    value={matchInfo.homeTeam}
                    onChange={(e) => setMatchInfo({ ...matchInfo, homeTeam: e.target.value })}
                    className="team-name-input"
                    style={{ fontSize: '1.15rem', marginBottom: '0.15rem' }}
                  />
                  <div className="score-control-wrap">
                    <button onClick={() => handleScoreChange('home', -1)} className="score-stepper-btn">
                      <Minus size={14} />
                    </button>
                    <span className="score-digit" style={{ fontSize: '2rem' }}>{matchInfo.homeScore}</span>
                    <button onClick={() => handleScoreChange('home', 1)} className="score-stepper-btn">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="vs-badge-comic" style={{ fontSize: '1rem', padding: '0.15rem 0.45rem' }}>VS</div>

                {/* AWAY */}
                <div className="team-box away-active" style={{ padding: '0.4rem 0.6rem' }}>
                  <input
                    type="text"
                    value={matchInfo.awayTeam}
                    onChange={(e) => setMatchInfo({ ...matchInfo, awayTeam: e.target.value })}
                    className="team-name-input"
                    style={{ fontSize: '1.15rem', marginBottom: '0.15rem' }}
                  />
                  <div className="score-control-wrap">
                    <button onClick={() => handleScoreChange('away', -1)} className="score-stepper-btn">
                      <Minus size={14} />
                    </button>
                    <span className="score-digit" style={{ fontSize: '2rem' }}>{matchInfo.awayScore}</span>
                    <button onClick={() => handleScoreChange('away', 1)} className="score-stepper-btn">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 1B. MASTER ON-AIR BROADCAST STATUS DECK */}
          <div
            className={`comic-card ${isOnAir ? 'is-live' : ''}`}
            style={{
              padding: '0.85rem 1.15rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: isOnAir ? 'var(--soft-rose-subtle)' : '#ffffff'
            }}
          >
            <div className="comic-card-header" style={{ marginBottom: '0.5rem', paddingBottom: '0.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className={`pulse-beacon ${isOnAir ? 'live' : 'off'}`} />
                <span className="comic-card-title card-title-crimson" style={{ fontSize: '1.15rem' }}>
                  {isOnAir ? '🔴 LIVE ON AIR TRANSMISSION' : '⚪ STUDIO OFF-AIR STANDBY'}
                </span>
              </div>
              <span className={`comic-sticker ${isOnAir ? 'sticker-crimson' : 'sticker-dark'}`} style={{ fontSize: '0.75rem' }}>
                {isOnAir ? 'BROADCASTING' : 'MUTED'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div className="audience-meter">
                <Users size={16} color="var(--soft-sky-dark)" />
                <span><strong>{audienceCount.toLocaleString()}</strong> FANS TUNED IN</span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={handleToggleOnAir}
                  className={`comic-btn comic-btn-lg ${isOnAir ? 'comic-btn-crimson' : 'comic-btn-yellow'}`}
                  style={{ padding: '0.6rem 1.25rem', fontSize: '1.15rem' }}
                >
                  {isOnAir ? <Tv size={18} /> : <Radio size={18} />}
                  <span>{isOnAir ? 'STOP AIR' : '⚡ GO ON AIR!'}</span>
                </button>

                <button
                  onClick={() => setIsExitModalOpen(true)}
                  className="comic-btn comic-btn-dark"
                  style={{ padding: '0.6rem 0.85rem', fontSize: '0.95rem' }}
                  title="Conclude match stream & broadcast farewell message"
                >
                  <LogOut size={16} />
                  <span>EXIT</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== ROW 2: HORIZONTAL COMMENTARY CONTROL CONSOLE DECK ===================== */}
        <section className="comic-card" style={{ marginBottom: '1.25rem', borderWidth: '3.5px', background: '#ffffff' }}>
          <div className="comic-card-header" style={{ marginBottom: '0.75rem', paddingBottom: '0.45rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="comic-card-title card-title-green">
                <Sliders size={20} />
                <span>HORIZONTAL BROADCAST COMMENTARY CONSOLE (REAL-LIFE DESK)</span>
              </span>
              <span className="comic-sticker sticker-green">CONTROL DECK</span>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Keyboard Shortcut: <kbd style={{ background: '#f1f5f9', padding: '0.15rem 0.4rem', borderRadius: '4px', border: '1.5px solid #cbd5e1', fontWeight: '700' }}>Ctrl + Enter</kbd> to Transmit
            </span>
          </div>

          <form onSubmit={handleSendCommentary} className="broadcast-deck-horizontal">
            {/* STATION 1: EVENT SELECTOR */}
            <div className="studio-station">
              <div className="studio-station-header">
                <span className="studio-station-title">
                  <span>1. EVENT TYPE</span>
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--soft-sky-dark)', fontWeight: '700' }}>
                  {EVENT_TYPES.find((t) => t.id === eventType)?.label}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem' }}>
                {EVENT_TYPES.map((type) => (
                  <div
                    key={type.id}
                    onClick={() => setEventType(type.id)}
                    className={`event-type-pill ${eventType === type.id ? 'active' : ''}`}
                    style={{ padding: '0.35rem 0.4rem', fontSize: '0.82rem', justifyContent: 'center' }}
                  >
                    <span>{type.icon}</span>
                    <span style={{ fontSize: '0.78rem' }}>{type.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* STATION 2: ACTOR & TARGET TEAM */}
            <div className="studio-station">
              <div className="studio-station-header">
                <span className="studio-station-title">
                  <span>2. PLAYER & TEAM</span>
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div>
                  <label className="comic-label" style={{ fontSize: '0.8rem', marginBottom: '0.15rem' }}>
                    KEY PLAYER:
                  </label>
                  <input
                    type="text"
                    value={actorName}
                    onChange={(e) => setActorName(e.target.value)}
                    placeholder="e.g. Mbappé, Ref"
                    className="comic-input"
                    style={{ padding: '0.35rem 0.55rem', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label className="comic-label" style={{ fontSize: '0.8rem', marginBottom: '0.15rem' }}>
                    ASSIGN TEAM:
                  </label>
                  <div style={{ display: 'flex', gap: '0.2rem' }}>
                    <button
                      type="button"
                      onClick={() => setTargetTeam('home')}
                      className={`comic-btn comic-btn-sm ${targetTeam === 'home' ? 'comic-btn-cyan' : 'comic-btn-dark'}`}
                      style={{ flex: 1, padding: '0.25rem 0.15rem', fontSize: '0.75rem' }}
                    >
                      HOME
                    </button>
                    <button
                      type="button"
                      onClick={() => setTargetTeam('away')}
                      className={`comic-btn comic-btn-sm ${targetTeam === 'away' ? 'comic-btn-crimson' : 'comic-btn-dark'}`}
                      style={{ flex: 1, padding: '0.25rem 0.15rem', fontSize: '0.75rem' }}
                    >
                      AWAY
                    </button>
                    <button
                      type="button"
                      onClick={() => setTargetTeam('neutral')}
                      className={`comic-btn comic-btn-sm ${targetTeam === 'neutral' ? 'comic-btn-yellow' : 'comic-btn-dark'}`}
                      style={{ flex: 1, padding: '0.25rem 0.15rem', fontSize: '0.75rem' }}
                    >
                      REF
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* STATION 3: COMMENTARY NARRATIVE & PRESETS */}
            <div className="studio-station">
              <div className="studio-station-header">
                <span className="studio-station-title">
                  <span>3. LIVE COMMENTARY PLAY-BY-PLAY</span>
                </span>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--comic-dark)' }}>
                  {commentaryText.length}/350
                </span>
              </div>

              <textarea
                value={commentaryText}
                onChange={(e) => setCommentaryText(e.target.value)}
                placeholder="Type real-time commentary description dispatched to audience... (e.g., Screamer from 25 yards into top corner!)"
                className="comic-textarea"
                rows={2}
                maxLength={350}
                style={{ minHeight: '52px', padding: '0.45rem 0.65rem', fontSize: '0.92rem', marginBottom: '0.4rem' }}
                onKeyDown={(e) => {
                  if (e.ctrlKey && e.key === 'Enter') {
                    handleSendCommentary();
                  }
                }}
              />

              {/* QUICK TAGS & 1-CLICK PRESETS ROW */}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                  {COMIC_TAGS.slice(0, 5).map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`comic-tag-btn ${selectedTags.includes(tag) ? 'selected' : ''}`}
                      style={{ fontSize: '0.72rem', padding: '0.1rem 0.35rem' }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '0.25rem', overflowX: 'auto', flex: 1 }}>
                  {QUICK_PHRASES.slice(0, 2).map((phrase, idx) => (
                    <div
                      key={idx}
                      onClick={() => applyQuickPhrase(phrase)}
                      className="quick-phrase-pill"
                      style={{ fontSize: '0.72rem', padding: '0.15rem 0.45rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
                      title={phrase}
                    >
                      ⚡ {phrase.slice(0, 32)}...
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* STATION 4: MASTER ACTION TRANSMIT BUTTON */}
            <div className="studio-station" style={{ justifyContent: 'center', background: 'var(--soft-yellow-subtle)', borderColor: 'var(--comic-border)' }}>
              <button
                type="submit"
                disabled={!commentaryText.trim()}
                className="comic-btn comic-btn-yellow comic-btn-lg"
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: '80px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                  fontSize: '1.25rem',
                  boxShadow: 'var(--comic-shadow)'
                }}
              >
                <Send size={24} />
                <span>⚡ BROADCAST</span>
                <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
                  TRANSMIT TO AUDIENCE
                </span>
              </button>
            </div>
          </form>
        </section>

        {/* ===================== ROW 3: LIVE TRANSMISSION FEED WITH INTERNAL SCROLL ===================== */}
        <section className="comic-card">
          <div className="comic-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span className="comic-card-title card-title-cyan">
                <Activity size={20} />
                <span>LIVE TRANSMISSION FEED ({broadcastFeed.length} EVENTS BROADCASTED)</span>
              </span>
              <span className="comic-sticker sticker-cyan">INTERNAL SCROLL DECK</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={clearFeed}
                className="comic-btn comic-btn-sm comic-btn-dark"
                title="Clear commentary history list"
              >
                <Trash2 size={13} />
                <span>CLEAR STREAM</span>
              </button>
              <span className="comic-sticker sticker-yellow">FANS RECEIVING LIVE</span>
            </div>
          </div>

          {/* DEDICATED INTERNAL SCROLL FEED CONTAINER */}
          <div className="feed-internal-scroll">
            {broadcastFeed.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '3rem 1rem',
                  color: 'var(--text-muted)',
                  border: '2px dashed #cbd5e1',
                  borderRadius: '12px',
                  background: '#ffffff'
                }}
              >
                <Volume2 size={40} style={{ opacity: 0.35, marginBottom: '0.5rem' }} />
                <p style={{ fontFamily: 'var(--font-comic)', fontSize: '1.3rem', color: 'var(--comic-dark)' }}>
                  STREAM CHANNEL IS IDLE!
                </p>
                <p style={{ fontSize: '0.85rem' }}>
                  Trigger events from the Horizontal Control Console above to broadcast real-time play-by-play commentary to fan sockets.
                </p>
              </div>
            ) : (
              broadcastFeed.map((item) => {
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

                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {item.timestamp}
                      </span>
                    </div>

                    {item.actor && item.actor !== 'Key Player' && (
                      <div style={{ marginBottom: '0.2rem' }}>
                        <span className="bubble-actor-tag">👤 {item.actor}:</span>
                      </div>
                    )}

                    <p className="bubble-text" style={{ fontSize: '0.96rem', fontWeight: '500' }}>
                      {item.message}
                    </p>

                    <div className="bubble-footer">
                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                        {item.tags?.map((tag, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontFamily: 'var(--font-comic)',
                              fontSize: '0.78rem',
                              color: 'var(--comic-dark)',
                              background: 'var(--soft-yellow)',
                              border: '1px solid var(--comic-border)',
                              padding: '0.1rem 0.4rem',
                              borderRadius: '4px'
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div style={{ fontFamily: 'var(--font-comic)', fontSize: '0.95rem', color: 'var(--comic-dark)' }}>
                        MATCH SCORE: <strong>{item.score || '2-1'}</strong>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>

      {/* 3. EXIT BROADCAST POPUP MODAL */}
      {isExitModalOpen && (
        <div className="comic-modal-overlay">
          <div className="comic-modal">
            <div className="comic-card-header">
              <span className="comic-card-title card-title-crimson">
                <AlertTriangle size={22} />
                <span>EXIT & CONCLUDE BROADCAST</span>
              </span>
              <span className="comic-sticker sticker-crimson">OFF-AIR NOTICE</span>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-sub)', marginBottom: '1rem' }}>
              Select an exit reason and message to dispatch to all connected fans and web-sockets before shutting down the live air stream.
            </p>

            <div style={{ marginBottom: '1rem' }}>
              <label className="comic-label">SELECT BROADCAST EXIT REASON:</label>
              <select
                value={exitReason}
                onChange={(e) => {
                  setExitReason(e.target.value);
                  if (e.target.value === 'MATCH_CONCLUDED') {
                    setCustomExitText('Full Time Whistle! Match has concluded. Thank you for watching live with Sportz!');
                  } else if (e.target.value === 'HALFTIME_BREAK') {
                    setCustomExitText('Halftime break! Studio broadcast will resume in 15 minutes for the 2nd half.');
                  } else if (e.target.value === 'TECHNICAL_DELAY') {
                    setCustomExitText('Broadcast paused due to technical/weather delay. Please stand by!');
                  }
                }}
                className="comic-select"
              >
                <option value="MATCH_CONCLUDED">🏁 Match Concluded / Full Time</option>
                <option value="HALFTIME_BREAK">⏸️ Halftime Interval Break</option>
                <option value="TECHNICAL_DELAY">⚠️ Technical / Weather Interruption</option>
                <option value="CUSTOM_EXIT">📝 Custom Farewell Message</option>
              </select>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label className="comic-label">FINAL TRANSMISSION MESSAGE:</label>
              <textarea
                value={customExitText}
                onChange={(e) => setCustomExitText(e.target.value)}
                className="comic-textarea"
                rows={3}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setIsExitModalOpen(false)}
                className="comic-btn comic-btn-dark"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleExitBroadcast}
                className="comic-btn comic-btn-crimson"
              >
                <LogOut size={16} />
                <span>SEND EXIT MSG & GO OFF-AIR</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
