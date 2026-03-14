import { useState } from 'react'

const ICONS = ['💧','🏃','🧘','📚','🥗','😴','💊','🎯','✍️','🎨','🎵','🧹']
const COLORS = ['#6c63ff','#ff6584','#43c6ac','#f9a03c','#4facfe','#a78bfa','#f472b6','#34d399']
const WEEK = ['Mo','Tu','We','Th','Fr','Sa','Su']

export default function Habits({ habits, addHabit, toggleHabitToday, deleteHabit, todayStr }) {
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ name: '', icon: '💧', color: '#6c63ff' })
  const [hovered, setHovered] = useState(null)

  const submit = () => {
    if (!form.name.trim()) return
    addHabit(form)
    setForm({ name: '', icon: '💧', color: '#6c63ff' })
    setAdding(false)
  }

  // Last 7 days for mini calendar
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toDateString()
  })

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="page-header">
        <div>
          <div className="page-title">Habits</div>
          <div className="page-sub">Build consistency, one day at a time.</div>
        </div>
        <button className="btn btn-primary" onClick={() => setAdding(a => !a)}>
          {adding ? '✕ Cancel' : '+ New Habit'}
        </button>
      </div>

      {adding && (
        <div className="card fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontWeight: 500 }}>New Habit</div>
          <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Habit name..." onKeyDown={e => e.key === 'Enter' && submit()} />
          <div style={{ display: 'flex', gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 8 }}>Icon</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {ICONS.map(ic => (
                  <button key={ic} onClick={() => setForm(f => ({ ...f, icon: ic }))}
                    style={{ fontSize: 18, padding: '6px 8px', borderRadius: 8, border: '1.5px solid', cursor: 'pointer', background: form.icon === ic ? 'var(--accent-soft)' : 'white', borderColor: form.icon === ic ? 'var(--accent)' : 'transparent', transition: 'all 0.12s' }}>
                    {ic}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 8 }}>Color</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {COLORS.map(c => (
                  <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))}
                    style={{ width: 24, height: 24, borderRadius: 8, background: c, border: `2px solid ${form.color === c ? 'var(--text)' : 'transparent'}`, cursor: 'pointer' }} />
                ))}
              </div>
            </div>
          </div>
          <button className="btn btn-primary" onClick={submit} style={{ alignSelf: 'flex-start' }}>Add Habit</button>
        </div>
      )}

      {habits.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-3)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🌱</div>
          <div style={{ fontSize: 15 }}>Start tracking your first habit!</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {habits.map(habit => {
            const doneToday = habit.history.includes(todayStr)
            return (
              <div key={habit.id} className="card"
                onMouseEnter={() => setHovered(habit.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 3, background: habit.color, borderRadius: '3px 0 0 3px' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 8 }}>
                  <div style={{ fontSize: 24 }}>{habit.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: 15 }}>{habit.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 1 }}>
                      🔥 {habit.streak} day streak
                    </div>
                  </div>
                  <button className="btn" onClick={() => toggleHabitToday(habit.id)}
                    style={{ background: doneToday ? habit.color : 'rgba(0,0,0,0.05)', color: doneToday ? 'white' : 'var(--text-2)', fontSize: 13, padding: '7px 14px' }}>
                    {doneToday ? '✓ Done' : 'Mark done'}
                  </button>
                  {hovered === habit.id && (
                    <button className="btn btn-icon btn-danger" onClick={() => deleteHabit(habit.id)} style={{ fontSize: 12 }}>✕</button>
                  )}
                </div>
                {/* Last 7 days */}
                <div style={{ display: 'flex', gap: 6, paddingLeft: 8 }}>
                  {last7.map((day, i) => {
                    const done = habit.history.includes(day)
                    const isToday = day === todayStr
                    return (
                      <div key={day} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 10, color: isToday ? habit.color : 'var(--text-3)', marginBottom: 4, fontWeight: isToday ? 600 : 400 }}>{WEEK[i]}</div>
                        <div style={{ width: 22, height: 22, borderRadius: 6, background: done ? habit.color : 'rgba(0,0,0,0.06)', border: isToday ? `1.5px solid ${habit.color}` : '1.5px solid transparent', opacity: done ? 1 : 0.5 }} />
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
