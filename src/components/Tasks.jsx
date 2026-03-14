import { useState } from 'react'

const PRIORITIES = { high: { label: 'High', color: '#ff6584', bg: 'rgba(255,101,132,0.10)' }, medium: { label: 'Medium', color: '#f9a03c', bg: 'rgba(249,160,60,0.10)' }, low: { label: 'Low', color: '#43c6ac', bg: 'rgba(67,198,172,0.10)' } }

export default function Tasks({ tasks, addTask, toggleTask, deleteTask }) {
  const [text, setText] = useState('')
  const [priority, setPriority] = useState('medium')
  const [filter, setFilter] = useState('all')
  const [hovered, setHovered] = useState(null)

  const submit = () => {
    if (!text.trim()) return
    addTask(text.trim(), priority)
    setText('')
  }

  const filtered = tasks.filter(t => filter === 'all' ? true : filter === 'done' ? t.done : !t.done)
    .sort((a, b) => { const po = { high: 0, medium: 1, low: 2 }; return po[a.priority] - po[b.priority] })

  const done = tasks.filter(t => t.done).length

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="page-header">
        <div>
          <div className="page-title">Tasks</div>
          <div className="page-sub">{done} of {tasks.length} completed</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['all', 'active', 'done'].map(f => (
            <button key={f} className={`btn ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '7px 14px', fontSize: 13, ...(filter === f ? {} : {}) }}
              onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Progress overview */}
      <div className="grid-3">
        {[
          { label: 'Total', value: tasks.length, color: 'var(--accent)' },
          { label: 'Active', value: tasks.filter(t => !t.done).length, color: '#f9a03c' },
          { label: 'Done', value: done, color: '#43c6ac' },
        ].map(s => (
          <div key={s.label} className="card card-sm" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 600, color: s.color, fontFamily: 'var(--mono)' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Add task */}
      <div className="card" style={{ display: 'flex', gap: 10, padding: 16 }}>
        <input className="input" value={text} onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="Add a new task... (press Enter)" />
        <select className="input" value={priority} onChange={e => setPriority(e.target.value)} style={{ width: 120 }}>
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>
        <button className="btn btn-primary" onClick={submit} style={{ whiteSpace: 'nowrap' }}>+ Add</button>
      </div>

      {/* Task list */}
      <div className="card" style={{ padding: 12 }}>
        {filtered.length === 0 ? (
          <div style={{ color: 'var(--text-3)', fontSize: 14, textAlign: 'center', padding: '32px 0' }}>
            {filter === 'done' ? '🎉 No completed tasks yet.' : '✨ All clear! Add something new.'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filtered.map(task => {
              const p = PRIORITIES[task.priority]
              return (
                <div key={task.id}
                  onMouseEnter={() => setHovered(task.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px',
                    borderRadius: 'var(--radius-sm)', transition: 'background 0.12s',
                    background: hovered === task.id ? 'rgba(0,0,0,0.03)' : 'transparent',
                    opacity: task.done ? 0.55 : 1,
                  }}>
                  <div className={`checkbox ${task.done ? 'checked' : ''}`} onClick={() => toggleTask(task.id)} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 450, textDecoration: task.done ? 'line-through' : 'none', color: task.done ? 'var(--text-3)' : 'var(--text)' }}>
                      {task.text}
                    </div>
                  </div>
                  <span className="badge" style={{ background: p.bg, color: p.color, fontSize: 11 }}>{p.label}</span>
                  {hovered === task.id && (
                    <button className="btn btn-icon btn-danger" onClick={() => deleteTask(task.id)} style={{ fontSize: 13 }}>✕</button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {done > 0 && (
        <div className="card" style={{ background: 'var(--grad-3)', border: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 28 }}>🎯</div>
          <div>
            <div style={{ fontWeight: 500, fontSize: 14 }}>Great progress!</div>
            <div style={{ fontSize: 13, color: 'var(--text-2)' }}>You've completed {done} task{done !== 1 ? 's' : ''} today. Keep the momentum going.</div>
          </div>
        </div>
      )}
    </div>
  )
}
