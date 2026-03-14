import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Timer from './components/Timer'
import Tasks from './components/Tasks'
import Habits from './components/Habits'
import Stats from './components/Stats'
import { useStore } from './hooks/useStore'

export default function App() {
  const [page, setPage] = useState('timer')
  const store = useStore()

  const pages = {
    timer: <Timer addSession={store.addSession} todaySessions={store.todaySessions} />,
    tasks: <Tasks tasks={store.tasks} addTask={store.addTask} toggleTask={store.toggleTask} deleteTask={store.deleteTask} />,
    habits: <Habits habits={store.habits} addHabit={store.addHabit} toggleHabitToday={store.toggleHabitToday} deleteHabit={store.deleteHabit} todayStr={store.todayStr} />,
    stats: <Stats tasks={store.tasks} habits={store.habits} sessions={store.sessions} todayStr={store.todayStr} />,
  }

  return (
    <div className="app">
      <Sidebar
        page={page} setPage={setPage}
        completedTasks={store.completedTasks}
        totalTasks={store.totalTasks}
        habitsToday={store.habitsToday}
        totalHabits={store.habits.length}
        sessions={store.todaySessions.length}
      />
      <main className="main">{pages[page]}</main>
    </div>
  )
}
