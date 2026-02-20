'use client'

import WorkoutCard from './WorkoutCard'

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
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export default function WeekView({
  weekNumber,
  workouts,
  isCurrentWeek = false,
  totalWeeks,
  onReschedule,
}: WeekViewProps) {
  const today = new Date()

  const sortedWorkouts = [...workouts].sort((a, b) => a.dayOfWeek - b.dayOfWeek)

  const completedCount = workouts.filter((w) => w.completed && w.type !== 'rest').length
  const totalRuns = workouts.filter((w) => w.type !== 'rest').length
  const totalDistance = workouts.reduce((sum, w) => sum + (w.distance || 0), 0)

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border ${
        isCurrentWeek
          ? 'border-indigo-300 dark:border-indigo-700'
          : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Week {weekNumber}
              {weekNumber === totalWeeks && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded">
                  Race Week
                </span>
              )}
            </h3>
            {isCurrentWeek && (
              <span className="text-sm text-indigo-600 dark:text-indigo-400">Current Week</span>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {completedCount}/{totalRuns} runs
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{totalDistance.toFixed(1)} km planned</p>
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
