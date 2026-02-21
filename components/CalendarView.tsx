'use client'

import { useState } from 'react'
import { useTheme } from './ThemeProvider'
import { getWorkoutTypeColors } from '@/lib/themes'

interface Workout {
  id: number
  weekNumber: number
  dayOfWeek: number
  type: string
  distance?: number | null
  duration?: number | null
  description: string
  completed: boolean
  date?: string
}

interface CalendarViewProps {
  workouts: Workout[]
  raceDate: string
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Format date as YYYY-MM-DD using local time (not UTC)
function formatLocalDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function CalendarView({ workouts, raceDate }: CalendarViewProps) {
  const { theme } = useTheme()
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())

  // Filter out rest days
  const trainingWorkouts = workouts.filter(w => w.type !== 'rest')

  // Create a map of date string to workouts
  const workoutsByDate: Record<string, Workout[]> = {}
  trainingWorkouts.forEach(workout => {
    if (workout.date) {
      const dateKey = formatLocalDate(new Date(workout.date))
      if (!workoutsByDate[dateKey]) {
        workoutsByDate[dateKey] = []
      }
      workoutsByDate[dateKey].push(workout)
    }
  })

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDayOfWeek = firstDayOfMonth.getDay()

  // Get race date for highlighting
  const raceDateObj = new Date(raceDate)
  const raceDateKey = formatLocalDate(raceDateObj)

  // Navigate months
  function goToPreviousMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  function goToNextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  function goToToday() {
    setCurrentMonth(today.getMonth())
    setCurrentYear(today.getFullYear())
  }

  // Build calendar grid
  const calendarDays: (number | null)[] = []

  // Add empty cells for days before the first day of month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  // Check if a date is today
  function isToday(day: number): boolean {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    )
  }

  // Get date key for a day
  function getDateKey(day: number): string {
    const date = new Date(currentYear, currentMonth, day)
    return formatLocalDate(date)
  }

  return (
    <div className={`${theme.colors.bgCard} rounded-xl shadow-sm border ${theme.colors.border} p-6`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold ${theme.colors.textPrimary}`}>
          Training Calendar
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className={`px-3 py-1 text-sm ${theme.colors.bgSecondary} ${theme.colors.textSecondary} rounded hover:opacity-80`}
          >
            Today
          </button>
          <button
            onClick={goToPreviousMonth}
            className={`p-2 ${theme.colors.textSecondary} hover:${theme.colors.textPrimary} rounded`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className={`text-lg font-medium ${theme.colors.textPrimary} min-w-[160px] text-center`}>
            {monthNames[currentMonth]} {currentYear}
          </span>
          <button
            onClick={goToNextMonth}
            className={`p-2 ${theme.colors.textSecondary} hover:${theme.colors.textPrimary} rounded`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div
            key={day}
            className={`text-center text-sm font-medium ${theme.colors.textMuted} py-2`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="min-h-[80px]" />
          }

          const dateKey = getDateKey(day)
          const dayWorkouts = workoutsByDate[dateKey] || []
          const isRaceDay = dateKey === raceDateKey
          const isTodayDate = isToday(day)

          return (
            <div
              key={day}
              className={`min-h-[80px] p-1 rounded-lg border ${
                isTodayDate
                  ? `${theme.colors.accentLight} border-2 ${theme.colors.accentText.replace('text-', 'border-')}`
                  : isRaceDay
                  ? 'bg-red-900 border-red-500'
                  : `${theme.colors.bgSecondary} ${theme.colors.border}`
              }`}
            >
              <div className={`text-sm font-medium mb-1 ${
                isTodayDate
                  ? theme.colors.accentText
                  : isRaceDay
                  ? 'text-red-300'
                  : theme.colors.textSecondary
              }`}>
                {day}
                {isRaceDay && (
                  <span className="ml-1 text-xs text-red-400">Race!</span>
                )}
              </div>
              <div className="space-y-1">
                {dayWorkouts.map(workout => {
                  const typeColors = getWorkoutTypeColors(theme, workout.type)
                  return (
                    <div
                      key={workout.id}
                      className={`text-xs px-1 py-0.5 rounded truncate ${typeColors.bg} ${typeColors.text} ${
                        workout.completed ? 'opacity-60' : ''
                      }`}
                      title={`${workout.type}: ${workout.distance}km - ${workout.description}`}
                    >
                      <span className="font-medium capitalize">{workout.type}</span>
                      {workout.distance && (
                        <span className="ml-1">{workout.distance}km</span>
                      )}
                      {workout.completed && (
                        <span className="ml-1">✓</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className={`mt-4 pt-4 border-t ${theme.colors.border} flex flex-wrap gap-4 text-sm`}>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded ${theme.colors.accentLight}`} />
          <span className={theme.colors.textMuted}>Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-900" />
          <span className={theme.colors.textMuted}>Race Day</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-600" />
          <span className={theme.colors.textMuted}>Easy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-orange-500" />
          <span className={theme.colors.textMuted}>Tempo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-600" />
          <span className={theme.colors.textMuted}>Long</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-600" />
          <span className={theme.colors.textMuted}>Interval</span>
        </div>
      </div>
    </div>
  )
}
