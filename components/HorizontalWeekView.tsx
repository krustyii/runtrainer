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

interface HorizontalWeekViewProps {
  workouts: Workout[]
  weekNumber: number
  onReschedule?: (workoutId: number, newDate: string) => Promise<void>
}

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const fullDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getUTCFullYear() === date2.getUTCFullYear() &&
    date1.getUTCMonth() === date2.getUTCMonth() &&
    date1.getUTCDate() === date2.getUTCDate()
  )
}

export default function HorizontalWeekView({ workouts, weekNumber, onReschedule }: HorizontalWeekViewProps) {
  const { theme } = useTheme()
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null)
  const [newDate, setNewDate] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const today = new Date()
  const todayDay = today.getDay()
  const sortedWorkouts = [...workouts].sort((a, b) => a.dayOfWeek - b.dayOfWeek)

  async function handleReschedule() {
    if (!newDate || !onReschedule || !selectedWorkout) return
    setIsLoading(true)
    try {
      await onReschedule(selectedWorkout.id, newDate)
      setSelectedWorkout(null)
      setNewDate('')
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Week header */}
      <div className="flex items-center justify-between">
        <h2 className={`text-xl font-bold ${theme.colors.textPrimary}`}>Week {weekNumber}</h2>
        <div className={`text-sm ${theme.colors.textMuted}`}>
          {sortedWorkouts.filter(w => w.completed && w.type !== 'rest').length} / {sortedWorkouts.filter(w => w.type !== 'rest').length} completed
        </div>
      </div>

      {/* Horizontal scrolling day cards */}
      <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
        {sortedWorkouts.map((workout) => {
          const workoutDate = workout.date ? new Date(workout.date) : null
          const isToday = workoutDate ? isSameDay(workoutDate, today) : workout.dayOfWeek === todayDay
          const isPast = workout.dayOfWeek < todayDay
          const typeColors = getWorkoutTypeColors(theme, workout.type)

          return (
            <button
              key={workout.id}
              onClick={() => setSelectedWorkout(selectedWorkout?.id === workout.id ? null : workout)}
              className={`
                flex-shrink-0 w-28 rounded-2xl p-4 transition-all duration-200 text-left
                ${isToday
                  ? 'ring-2 ring-sky-400 shadow-lg scale-105 bg-gradient-to-br from-sky-50 to-white'
                  : theme.colors.bgCard
                }
                ${selectedWorkout?.id === workout.id ? 'ring-2 ring-amber-400' : ''}
                ${workout.completed ? 'opacity-75' : ''}
                border ${theme.colors.border}
                hover:shadow-md hover:scale-102
              `}
            >
              {/* Day label */}
              <div className="text-center mb-3">
                <p className={`text-xs font-medium ${isToday ? 'text-sky-600' : theme.colors.textMuted}`}>
                  {isToday ? 'TODAY' : dayNames[workout.dayOfWeek]}
                </p>
                {workoutDate && (
                  <p className={`text-lg font-bold ${theme.colors.textPrimary}`}>
                    {workoutDate.getDate()}
                  </p>
                )}
              </div>

              {/* Workout type badge */}
              <div className={`text-center mb-2`}>
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-lg ${typeColors.bg} ${typeColors.text}`}>
                  {workout.type.charAt(0).toUpperCase() + workout.type.slice(1)}
                </span>
              </div>

              {/* Distance */}
              {workout.distance && workout.type !== 'rest' && (
                <p className={`text-center text-sm font-bold ${theme.colors.textPrimary}`}>
                  {workout.distance} km
                </p>
              )}

              {/* Completed indicator */}
              {workout.completed && (
                <div className="flex justify-center mt-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Selected workout details */}
      {selectedWorkout && (
        <div className={`${theme.colors.bgCard} rounded-2xl border ${theme.colors.border} p-6 shadow-sm`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 text-sm font-semibold rounded-lg ${getWorkoutTypeColors(theme, selectedWorkout.type).bg} ${getWorkoutTypeColors(theme, selectedWorkout.type).text}`}>
                  {selectedWorkout.type.charAt(0).toUpperCase() + selectedWorkout.type.slice(1)}
                </span>
                {selectedWorkout.distance && selectedWorkout.type !== 'rest' && (
                  <span className={`text-lg font-bold ${theme.colors.textPrimary}`}>
                    {selectedWorkout.distance} km
                  </span>
                )}
                {selectedWorkout.completed && (
                  <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">
                    Completed
                  </span>
                )}
              </div>
              <h3 className={`text-lg font-semibold ${theme.colors.textPrimary} mb-1`}>
                {fullDayNames[selectedWorkout.dayOfWeek]}
                {selectedWorkout.date && (
                  <span className={`font-normal ${theme.colors.textMuted}`}>
                    {' '}
                    - {new Date(selectedWorkout.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </h3>
              <p className={`${theme.colors.textSecondary}`}>{selectedWorkout.description}</p>
            </div>
            <button
              onClick={() => setSelectedWorkout(null)}
              className={`p-2 rounded-lg ${theme.colors.textMuted} hover:bg-gray-100`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Reschedule option */}
          {!selectedWorkout.completed && selectedWorkout.type !== 'rest' && onReschedule && (
            <div className={`mt-4 pt-4 border-t ${theme.colors.border}`}>
              <p className={`text-sm font-medium ${theme.colors.textSecondary} mb-2`}>
                Need to move this workout?
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={`flex-1 px-3 py-2 text-sm border ${theme.colors.border} rounded-lg ${theme.colors.textPrimary}`}
                />
                <button
                  onClick={handleReschedule}
                  disabled={!newDate || isLoading}
                  className="px-4 py-2 text-sm font-medium bg-sky-500 text-white rounded-lg hover:bg-sky-600 disabled:opacity-50"
                >
                  {isLoading ? 'Moving...' : 'Reschedule'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
