'use client'

import { useState } from 'react'

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

const typeColors: Record<string, string> = {
  easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  tempo: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  long: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  interval: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  rest: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  recovery: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
}

export default function WorkoutCard({ workout, isToday = false, onReschedule }: WorkoutCardProps) {
  const [showReschedule, setShowReschedule] = useState(false)
  const [newDate, setNewDate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const date = workout.date ? new Date(workout.date) : null
  const colorClass = typeColors[workout.type] || typeColors.easy

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
          ? 'border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-800'
          : 'border-gray-200 dark:border-gray-700'
      } ${
        workout.completed
          ? 'bg-gray-50 dark:bg-gray-800/50'
          : 'bg-white dark:bg-gray-800'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {dayNames[workout.dayOfWeek]}
            </span>
            {date && (
              <span className="text-sm text-gray-400 dark:text-gray-500">
                {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
            {isToday && (
              <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 rounded">
                Today
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 text-xs font-medium rounded ${colorClass}`}>
              {workout.type.charAt(0).toUpperCase() + workout.type.slice(1)}
            </span>
            {workout.distance && workout.type !== 'rest' && (
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {workout.distance} km
              </span>
            )}
            {workout.duration && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ~{workout.duration} min
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">{workout.description}</p>

          {/* Reschedule UI */}
          {showReschedule && (
            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Move to a different day:
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  min={today}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <button
                  onClick={handleReschedule}
                  disabled={!newDate || isLoading}
                  className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isLoading ? '...' : 'Move'}
                </button>
                <button
                  onClick={() => {
                    setShowReschedule(false)
                    setNewDate('')
                    setError(null)
                  }}
                  className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
              )}
            </div>
          )}
        </div>
        <div className="ml-4 flex flex-col items-center gap-2">
          {workout.completed ? (
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900">
              <svg
                className="w-5 h-5 text-green-600 dark:text-green-400"
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
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700">
              <span className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-500" />
            </span>
          )}
          {canReschedule && !showReschedule && (
            <button
              onClick={() => setShowReschedule(true)}
              className="text-xs text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
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
