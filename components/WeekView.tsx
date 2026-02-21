'use client'

import WorkoutCard from './WorkoutCard'
import { useTheme } from './ThemeProvider'

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

interface WeekViewProps {
  weekNumber: number
  workouts: Workout[]
  isCurrentWeek?: boolean
  totalWeeks: number
  onReschedule?: (workoutId: number, newDate: string) => Promise<void>
}

function isSameDay(date1: Date, date2: Date): boolean {
  // Compare using UTC to avoid timezone issues
  return (
    date1.getUTCFullYear() === date2.getUTCFullYear() &&
    date1.getUTCMonth() === date2.getUTCMonth() &&
    date1.getUTCDate() === date2.getUTCDate()
  )
}

export default function WeekView({
  weekNumber,
  workouts,
  isCurrentWeek = false,
  totalWeeks,
  onReschedule,
}: WeekViewProps) {
  const { theme } = useTheme()
  const today = new Date()

  const sortedWorkouts = [...workouts].sort((a, b) => a.dayOfWeek - b.dayOfWeek)

  const completedCount = workouts.filter((w) => w.completed && w.type !== 'rest').length
  const totalRuns = workouts.filter((w) => w.type !== 'rest').length
  const totalDistance = workouts.reduce((sum, w) => sum + (w.distance || 0), 0)

  return (
    <div
      className={`${theme.colors.bgCard} rounded-xl shadow-sm border ${
        isCurrentWeek
          ? theme.colors.accentText.replace('text-', 'border-')
          : theme.colors.border
      }`}
    >
      <div className={`p-4 border-b ${theme.colors.border}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-lg font-semibold ${theme.colors.textPrimary}`}>
              Week {weekNumber}
              {weekNumber === totalWeeks && (
                <span className={`ml-2 px-2 py-0.5 text-xs font-medium ${theme.colors.danger} bg-red-500/20 rounded`}>
                  Race Week
                </span>
              )}
            </h3>
            {isCurrentWeek && (
              <span className={`text-sm ${theme.colors.accentText}`}>Current Week</span>
            )}
          </div>
          <div className="text-right">
            <p className={`text-sm font-medium ${theme.colors.textPrimary}`}>
              {completedCount}/{totalRuns} runs
            </p>
            <p className={`text-sm ${theme.colors.textMuted}`}>{totalDistance.toFixed(1)} km planned</p>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-3">
        {sortedWorkouts.map((workout) => {
          const workoutDate = workout.date ? new Date(workout.date) : null
          const isToday = workoutDate ? isSameDay(workoutDate, today) : false
          return (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              isToday={isToday}
              onReschedule={onReschedule}
            />
          )
        })}
      </div>
    </div>
  )
}
