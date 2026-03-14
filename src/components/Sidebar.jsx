export default function Sidebar({ page, setPage, completedTasks, totalTasks, habitsToday, totalHabits, sessions }) {
  const nav = [
    { id: 'timer', icon: '⏱', label: 'Focus Timer' },
    { id: 'tasks', icon: '✓', label: 'Tasks' },
    { id: 'habits', icon: '🔥', label: 'Habits' },
    { id: 'stats', icon: '◈', label: 'Insights' },
  ]

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-dot" />
        Aura
      </div>

      {nav.map(n => (
        <button key={n.id} className={`nav-item ${page === n.id ? 'active' : ''}`} onClick={() => setPage(n.id)}>
          <span className="nav-icon">{n.icon}</span>
          {n.label}
        </button>
      ))}

      <div style={{ height: 1, background: 'var(--border)', margin: '16px 0' }} />

      <div style={{ padding: '4px 12px', fontSize: 12, color: 'var(--text-3)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Today</div>

      <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 13, color: 'var(--text-2)', display: 'flex', justifyContent: 'space-between' }}>
          <span>Tasks</span>
          <span style={{ fontFamily: 'var(--mono)', color: 'var(--accent)' }}>{completedTasks}/{totalTasks}</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${totalTasks ? (completedTasks/totalTasks)*100 : 0}%`, background: 'var(--accent)' }} />
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-2)', display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <span>Habits</span>
          <span style={{ fontFamily: 'var(--mono)', color: '#43c6ac' }}>{habitsToday}/{totalHabits}</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${totalHabits ? (habitsToday/totalHabits)*100 : 0}%`, background: 'linear-gradient(90deg, #43c6ac, #4facfe)' }} />
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-2)', display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <span>Focus sessions</span>
          <span style={{ fontFamily: 'var(--mono)', color: '#f9a03c' }}>{sessions}</span>
        </div>
      </div>

      <div className="sidebar-footer" style={{ marginTop: 'auto' }}>
        <strong>📅 {today}</strong>
        {sessions > 0 ? `${sessions} session${sessions > 1 ? 's' : ''} done. Keep it up!` : 'Start your first focus session!'}
      </div>
    </aside>
  )
}
