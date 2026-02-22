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

interface TrainingPlanOverviewProps {
  workouts: Workout[]
  currentWeek: number
  totalWeeks: number
}

const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export default function TrainingPlanOverview({ workouts, currentWeek, totalWeeks }: TrainingPlanOverviewProps) {
  const { theme } = useTheme()
  const [isExpanded, setIsExpanded] = useState(false)

  // Group workouts by week
  const weekGroups = Array.from({ length: totalWeeks }, (_, i) => {
    const weekNum = i + 1
    const weekWorkouts = workouts.filter(w => w.weekNumber === weekNum)
    const completedRuns = weekWorkouts.filter(w => w.completed && w.type !== 'rest').length
    const totalRuns = weekWorkouts.filter(w => w.type !== 'rest').length
    const totalDistance = weekWorkouts.reduce((sum, w) => sum + (w.distance || 0), 0)

    return {
      week: weekNum,
      workouts: weekWorkouts.sort((a, b) => a.dayOfWeek - b.dayOfWeek),
      completedRuns,
      totalRuns,
      totalDistance,
      isComplete: completedRuns === totalRuns && totalRuns > 0,
    }
  })

  const visibleWeeks = isExpanded ? weekGroups : weekGroups.slice(0, 4)

  return (
    <div className={`${theme.colors.bgCard} rounded-2xl border ${theme.colors.border} p-6 shadow-sm`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-bold ${theme.colors.textPrimary}`}>Training Plan Overview</h3>
        <span className={`text-sm ${theme.colors.textMuted}`}>
          {totalWeeks} weeks total
        </span>
      </div>

      <div className="space-y-3">
        {visibleWeeks.map((weekData) => {
          const isCurrent = weekData.week === currentWeek
          const isPast = weekData.week < currentWeek

          return (
            <div
              key={weekData.week}
              className={`
                p-4 rounded-xl border transition-all
                ${isCurrent
                  ? 'bg-gradient-to-r from-sky-50 to-white border-sky-200 shadow-sm'
                  : isPast
                    ? 'bg-gray-50/50 border-gray-100'
                    : `${theme.colors.bgCard} ${theme.colors.border}`
                }
              `}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                    ${weekData.isComplete
                      ? 'bg-emerald-100 text-emerald-700'
                      : isCurrent
                        ? 'bg-sky-100 text-sky-700'
                        : 'bg-gray-100 text-gray-600'
                    }
                  `}>
                    {weekData.isComplete ? '✓' : weekData.week}
                  </span>
                  <div>
                    <p className={`font-semibold ${theme.colors.textPrimary}`}>
                      Week {weekData.week}
                      {isCurrent && (
                        <span className="ml-2 text-xs font-medium text-sky-600 bg-sky-100 px-2 py-0.5 rounded-full">
                          Current
                        </span>
                      )}
                      {weekData.week === totalWeeks && (
                        <span className="ml-2 text-xs font-medium text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
                          Race Week
                        </span>
                      )}
                    </p>
                    <p className={`text-sm ${theme.colors.textMuted}`}>
                      {weekData.completedRuns}/{weekData.totalRuns} runs • {weekData.totalDistance.toFixed(1)} km
                    </p>
                  </div>
                </div>
              </div>

              {/* Mini day view */}
              <div className="flex gap-1">
                {weekData.workouts.map((workout) => {
                  const typeColors = getWorkoutTypeColors(theme, workout.type)
                  return (
                    <div
                      key={workout.id}
                      className="flex-1 text-center"
                      title={`${workout.type}: ${workout.description}`}
                    >
                      <p className={`text-xs ${theme.colors.textMuted} mb-1`}>
                        {dayNames[workout.dayOfWeek]}
                      </p>
                      <div
                        className={`
                          h-2 rounded-full
                          ${workout.completed
                            ? 'bg-emerald-400'
                            : workout.type === 'rest'
                              ? 'bg-gray-200'
                              : typeColors.bg.replace('bg-', 'bg-') + '/60'
                          }
                        `}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {totalWeeks > 4 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            w-full mt-4 py-3 text-sm font-medium rounded-xl
            ${theme.colors.textMuted} hover:text-sky-600
            bg-gray-50 hover:bg-sky-50 transition-colors
          `}
        >
          {isExpanded ? 'Show less' : `Show all ${totalWeeks} weeks`}
        </button>
      )}
    </div>
  )
}
