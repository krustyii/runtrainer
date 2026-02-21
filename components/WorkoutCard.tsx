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
  date?: Date | string
}

interface WorkoutCardProps {
  workout: Workout
  isToday?: boolean
  onReschedule?: (workoutId: number, newDate: string) => Promise<void>
}

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function WorkoutCard({ workout, isToday = false, onReschedule }: WorkoutCardProps) {
  const { theme } = useTheme()
  const [showReschedule, setShowReschedule] = useState(false)
  const [newDate, setNewDate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const date = workout.date ? new Date(workout.date) : null
  const typeColors = getWorkoutTypeColors(theme, workout.type)

  const canReschedule = !workout.completed && workout.type !== 'rest' && onReschedule

  async function handleReschedule() {
    if (!newDate || !onReschedule) return

    setIsLoading(true)
    setError(null)

    try {
      await onReschedule(workout.id, newDate)
      setShowReschedule(false)
      setNewDate('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reschedule')
    } finally {
      setIsLoading(false)
    }
  }

  // Get min date (today) for the date picker
  const today = new Date().toISOString().split('T')[0]

  return (
    <div
      className={`p-4 rounded-lg border ${
        isToday
          ? `${theme.colors.accentText.replace('text-', 'border-')} ring-2 ${theme.colors.accentLight}`
          : theme.colors.border
      } ${
        workout.completed
          ? `${theme.colors.bgSecondary}/50`
          : theme.colors.bgCard
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-sm font-medium ${theme.colors.textMuted}`}>
              {dayNames[workout.dayOfWeek]}
            </span>
            {date && (
              <span className={`text-sm ${theme.colors.textMuted}`}>
                {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
            {isToday && (
              <span className={`px-2 py-0.5 text-xs font-medium ${theme.colors.accentLight} ${theme.colors.accentText} rounded`}>
                Today
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 text-xs font-medium rounded ${typeColors.bg} ${typeColors.text}`}>
              {workout.type.charAt(0).toUpperCase() + workout.type.slice(1)}
            </span>
            {workout.distance && workout.type !== 'rest' && (
              <span className={`text-sm font-semibold ${theme.colors.textPrimary}`}>
                {workout.distance} km
              </span>
            )}
            {workout.duration && (
              <span className={`text-sm ${theme.colors.textMuted}`}>
                ~{workout.duration} min
              </span>
            )}
          </div>
          <p className={`text-sm ${theme.colors.textSecondary}`}>{workout.description}</p>

          {/* Reschedule UI */}
          {showReschedule && (
            <div className={`mt-3 p-3 ${theme.colors.bgSecondary} rounded-lg`}>
              <p className={`text-sm font-medium ${theme.colors.textSecondary} mb-2`}>
                Move to a different day:
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  min={today}
                  className={`flex-1 px-2 py-1 text-sm border ${theme.colors.border} rounded ${theme.colors.bgPrimary} ${theme.colors.textPrimary}`}
                />
                <button
                  onClick={handleReschedule}
                  disabled={!newDate || isLoading}
                  className={`px-3 py-1 text-sm ${theme.colors.accent} text-white rounded ${theme.colors.accentHover} disabled:opacity-50`}
                >
                  {isLoading ? '...' : 'Move'}
                </button>
                <button
                  onClick={() => {
                    setShowReschedule(false)
                    setNewDate('')
                    setError(null)
                  }}
                  className={`px-3 py-1 text-sm ${theme.colors.bgPrimary} ${theme.colors.textSecondary} rounded hover:opacity-80`}
                >
                  Cancel
                </button>
              </div>
              {error && (
                <p className={`mt-2 text-sm ${theme.colors.danger}`}>{error}</p>
              )}
            </div>
          )}
        </div>
        <div className="ml-4 flex flex-col items-center gap-2">
          {workout.completed ? (
            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${theme.colors.successLight}`}>
              <svg
                className={`w-5 h-5 ${theme.colors.success}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </span>
          ) : (
            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${theme.colors.bgSecondary}`}>
              <span className={`w-3 h-3 rounded-full ${theme.colors.bgPrimary}`} />
            </span>
          )}
          {canReschedule && !showReschedule && (
            <button
              onClick={() => setShowReschedule(true)}
              className={`text-xs ${theme.colors.textMuted} hover:${theme.colors.accentText}`}
              title="Reschedule workout"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
