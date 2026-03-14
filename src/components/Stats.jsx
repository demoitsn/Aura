export default function Stats({ tasks, habits, sessions, todayStr }) {
  const doneTasks = tasks.filter(t => t.done).length
  const totalTasks = tasks.length
  const completion = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0

  const todaySessions = sessions.filter(s => new Date(s.ts).toDateString() === todayStr)
  const focusMinutes = todaySessions.filter(s => s.type === 'work').length * 25

  const habitsCompleted = habits.filter(h => h.history.includes(todayStr)).length
  const habitCompletion = habits.length ? Math.round((habitsCompleted / habits.length) * 100) : 0

  const maxStreak = habits.reduce((m, h) => Math.max(m, h.streak), 0)

  // Last 7 days sessions chart
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const dateStr = d.toDateString()
    const count = sessions.filter(s => new Date(s.ts).toDateString() === dateStr && s.type === 'work').length
    return { label: d.toLocaleDateString('en', { weekday: 'short' }), count, dateStr }
  })
  const maxSessions = Math.max(...last7.map(d => d.count), 1)

  const stats = [
    { label: 'Task Completion', value: `${completion}%`, sub: `${doneTasks}/${totalTasks} tasks`, color: '#6c63ff', cls: 'stat-card-1' },
    { label: 'Focus Time Today', value: `${focusMinutes}m`, sub: `${todaySessions.length} sessions`, color: '#ff6584', cls: 'stat-card-2' },
    { label: 'Habits Today', value: `${habitCompletion}%`, sub: `${habitsCompleted}/${habits.length} done`, color: '#43c6ac', cls: 'stat-card-3' },
    { label: 'Best Streak', value: `${maxStreak}🔥`, sub: 'days in a row', color: '#f9a03c', cls: 'stat-card-4' },
  ]

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <div className="page-title">Insights</div>
        <div className="page-sub">Your productivity at a glance.</div>
      </div>

      <div className="grid-2">
        {stats.map(s => (
          <div key={s.label} className={`card stat-card ${s.cls}`} style={{ paddingTop: 20 }}>
            <div style={{ fontSize: 32, fontWeight: 600, color: s.color, fontFamily: 'var(--mono)', letterSpacing: '-1px' }}>{s.value}</div>
            <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }}>{s.label}</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Focus sessions bar chart */}
      <div className="card">
        <div style={{ fontWeight: 500, marginBottom: 20, fontSize: 15 }}>Focus Sessions — Last 7 Days</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 100 }}>
          {last7.map(d => (
            <div key={d.dateStr} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ width: '100%', borderRadius: '6px 6px 0 0', background: d.dateStr === todayStr ? 'var(--accent)' : 'rgba(108,99,255,0.2)', height: `${(d.count / maxSessions) * 80}px`, minHeight: d.count > 0 ? 8 : 0, transition: 'height 0.3s', position: 'relative' }}>
                {d.count > 0 && <div style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)', fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--accent)', fontWeight: 500 }}>{d.count}</div>}
              </div>
              <div style={{ fontSize: 11, color: d.dateStr === todayStr ? 'var(--accent)' : 'var(--text-3)', fontWeight: d.dateStr === todayStr ? 600 : 400 }}>{d.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Habit streaks */}
      {habits.length > 0 && (
        <div className="card">
          <div style={{ fontWeight: 500, marginBottom: 16, fontSize: 15 }}>Habit Streaks</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {habits.sort((a, b) => b.streak - a.streak).map(h => (
              <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 18, width: 28 }}>{h.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 13, fontWeight: 450 }}>{h.name}</span>
                    <span style={{ fontSize: 12, fontFamily: 'var(--mono)', color: h.color }}>🔥 {h.streak}</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${Math.min((h.streak / 30) * 100, 100)}%`, background: h.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Priority breakdown */}
      <div className="card">
        <div style={{ fontWeight: 500, marginBottom: 16, fontSize: 15 }}>Task Priority Breakdown</div>
        <div className="grid-3">
          {[
            { label: 'High', key: 'high', color: '#ff6584' },
            { label: 'Medium', key: 'medium', color: '#f9a03c' },
            { label: 'Low', key: 'low', color: '#43c6ac' },
          ].map(p => {
            const count = tasks.filter(t => t.priority === p.key).length
            const done = tasks.filter(t => t.priority === p.key && t.done).length
            return (
              <div key={p.key} style={{ textAlign: 'center', padding: '12px', borderRadius: 'var(--radius-sm)', background: `${p.color}12` }}>
                <div style={{ fontSize: 22, fontWeight: 600, color: p.color }}>{count}</div>
                <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{p.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1 }}>{done} done</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
