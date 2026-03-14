import { useState, useEffect, useRef } from 'react'

const MODES = [
  { id: 'work', label: 'Focus', minutes: 25, color: '#6c63ff', grad: 'var(--grad-1)' },
  { id: 'short', label: 'Short Break', minutes: 5, color: '#43c6ac', grad: 'var(--grad-3)' },
  { id: 'long', label: 'Long Break', minutes: 15, color: '#ff6584', grad: 'var(--grad-2)' },
]

export default function Timer({ addSession, todaySessions }) {
  const [modeIdx, setModeIdx] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(MODES[0].minutes * 60)
  const [running, setRunning] = useState(false)
  const [round, setRound] = useState(1)
  const intervalRef = useRef(null)
  const mode = MODES[modeIdx]

  const total = mode.minutes * 60
  const progress = (secondsLeft / total)
  const circumference = 2 * Math.PI * 90
  const offset = circumference * (1 - progress)

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const secs = String(secondsLeft % 60).padStart(2, '0')

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            if (MODES[modeIdx].id === 'work') {
              addSession('work')
              setRound(r => r + 1)
            }
            return 0
          }
          return s - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, modeIdx])

  const switchMode = (idx) => {
    clearInterval(intervalRef.current)
    setModeIdx(idx)
    setSecondsLeft(MODES[idx].minutes * 60)
    setRunning(false)
  }

  const reset = () => {
    clearInterval(intervalRef.current)
    setSecondsLeft(mode.minutes * 60)
    setRunning(false)
  }

  const workSessions = todaySessions.filter(s => s.type === 'work').length

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="page-header">
        <div>
          <div className="page-title">Focus Timer</div>
          <div className="page-sub">Deep work, minimal distractions.</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="badge badge-purple">🔥 Round {round}</span>
          <span className="badge" style={{ background: 'rgba(249,160,60,0.12)', color: '#f9a03c' }}>⏱ {workSessions} today</span>
        </div>
      </div>

      {/* Mode switcher */}
      <div style={{ display: 'flex', gap: 8 }}>
        {MODES.map((m, i) => (
          <button key={m.id} className={`btn ${modeIdx === i ? 'btn-primary' : 'btn-ghost'}`}
            style={modeIdx === i ? { background: m.color } : {}}
            onClick={() => switchMode(i)}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Timer ring */}
      <div className="card" style={{ background: mode.grad, border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px', gap: 32 }}>
        <div style={{ position: 'relative', width: 220, height: 220 }}>
          <svg width="220" height="220" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="110" cy="110" r="90" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="10" />
            <circle cx="110" cy="110" r="90" fill="none"
              stroke={mode.color} strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="timer-ring"
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 44, fontWeight: 500, letterSpacing: '-2px', color: 'var(--text)' }}>
              {mins}:{secs}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}>{mode.label}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-ghost" onClick={reset} style={{ minWidth: 80 }}>↺ Reset</button>
          <button className="btn" onClick={() => setRunning(r => !r)}
            style={{ background: mode.color, color: 'white', minWidth: 120, fontSize: 16 }}>
            {running ? '⏸ Pause' : '▶ Start'}
          </button>
        </div>
      </div>

      {/* Session log */}
      <div className="card">
        <div style={{ fontWeight: 500, marginBottom: 16, fontSize: 15 }}>Today's Sessions</div>
        {todaySessions.length === 0 ? (
          <div style={{ color: 'var(--text-3)', fontSize: 14, textAlign: 'center', padding: '20px 0' }}>
            No sessions yet. Start focusing! 🎯
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {todaySessions.map((s, i) => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.03)' }}>
                <span style={{ fontSize: 16 }}>{s.type === 'work' ? '🎯' : '☕'}</span>
                <span style={{ fontSize: 14, color: 'var(--text-2)' }}>Session {i + 1} — {s.type === 'work' ? '25 min focus' : 'break'}</span>
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text-3)' }}>
                  {new Date(s.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="card" style={{ background: 'var(--grad-1)', border: 'none' }}>
        <div style={{ fontWeight: 500, marginBottom: 12, fontSize: 14 }}>💡 Focus Tips</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {['Phone in another room', 'One tab at a time', 'Noise-cancelling headphones', 'Block distracting sites'].map(tip => (
            <div key={tip} style={{ fontSize: 13, color: 'var(--text-2)', display: 'flex', gap: 6, alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--accent)', marginTop: 1 }}>·</span> {tip}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
