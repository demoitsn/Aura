import { useState, useEffect, useCallback } from 'react'

const DEFAULTS = {
  tasks: [
    { id: 1, text: 'Review weekly goals', priority: 'high', done: false, created: Date.now() },
    { id: 2, text: 'Read for 30 minutes', priority: 'medium', done: false, created: Date.now() },
    { id: 3, text: 'Reply to emails', priority: 'low', done: true, created: Date.now() },
  ],
  habits: [
    { id: 1, name: 'Morning water', icon: '💧', color: '#4facfe', days: [1,2,3,4,5], streak: 5, history: [] },
    { id: 2, name: 'Meditation', icon: '🧘', color: '#a78bfa', days: [1,2,3,4,5,6,7], streak: 3, history: [] },
    { id: 3, name: 'Exercise', icon: '🏃', color: '#43c6ac', days: [1,3,5], streak: 2, history: [] },
    { id: 4, name: 'Read a book', icon: '📚', color: '#f9a03c', days: [1,2,3,4,5,6,7], streak: 7, history: [] },
  ],
  sessions: [],
  pomodoroSettings: { work: 25, short: 5, long: 15 },
}

function load() {
  try {
    const s = localStorage.getItem('aura-state')
    return s ? { ...DEFAULTS, ...JSON.parse(s) } : DEFAULTS
  } catch { return DEFAULTS }
}

export function useStore() {
  const [state, setState] = useState(load)

  const update = useCallback((fn) => {
    setState(prev => {
      const next = fn(prev)
      localStorage.setItem('aura-state', JSON.stringify(next))
      return next
    })
  }, [])

  // Tasks
  const addTask = (text, priority = 'medium') => update(s => ({
    ...s, tasks: [...s.tasks, { id: Date.now(), text, priority, done: false, created: Date.now() }]
  }))
  const toggleTask = (id) => update(s => ({
    ...s, tasks: s.tasks.map(t => t.id === id ? { ...t, done: !t.done } : t)
  }))
  const deleteTask = (id) => update(s => ({ ...s, tasks: s.tasks.filter(t => t.id !== id) }))

  // Habits
  const addHabit = (habit) => update(s => ({
    ...s, habits: [...s.habits, { id: Date.now(), streak: 0, history: [], days: [1,2,3,4,5,6,7], ...habit }]
  }))
  const toggleHabitToday = (id) => {
    const today = new Date().toDateString()
    update(s => ({
      ...s, habits: s.habits.map(h => {
        if (h.id !== id) return h
        const done = h.history.includes(today)
        const history = done ? h.history.filter(d => d !== today) : [...h.history, today]
        const streak = done ? Math.max(0, h.streak - 1) : h.streak + 1
        return { ...h, history, streak }
      })
    }))
  }
  const deleteHabit = (id) => update(s => ({ ...s, habits: s.habits.filter(h => h.id !== id) }))

  // Sessions
  const addSession = (type) => update(s => ({
    ...s, sessions: [...s.sessions, { id: Date.now(), type, ts: Date.now() }]
  }))

  const todayStr = new Date().toDateString()
  const todaySessions = state.sessions.filter(s => new Date(s.ts).toDateString() === todayStr)
  const completedTasks = state.tasks.filter(t => t.done).length
  const totalTasks = state.tasks.length
  const habitsToday = state.habits.filter(h => h.history.includes(todayStr)).length

  return {
    ...state,
    addTask, toggleTask, deleteTask,
    addHabit, toggleHabitToday, deleteHabit,
    addSession,
    todaySessions, completedTasks, totalTasks, habitsToday,
    todayStr,
  }
}
