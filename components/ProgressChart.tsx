'use client'

import { useTheme } from './ThemeProvider'

interface WeeklyData {
  week: number
  plannedDistance: number
  actualDistance: number
  completionRate: number
}

interface ProgressChartProps {
  data: WeeklyData[]
  currentWeek: number
}

export default function ProgressChart({ data, currentWeek }: ProgressChartProps) {
  const { theme } = useTheme()
  const maxDistance = Math.max(...data.map((d) => Math.max(d.plannedDistance, d.actualDistance)))

  return (
    <div className={`${theme.colors.bgCard} rounded-xl shadow-sm border ${theme.colors.border} p-6`}>
      <h3 className={`text-lg font-semibold ${theme.colors.textPrimary} mb-4`}>Weekly Progress</h3>
      <div className="space-y-4">
        {data.map((week) => (
          <div key={week.week} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span
                className={`font-medium ${
                  week.week === currentWeek
                    ? theme.colors.accentText
                    : theme.colors.textSecondary
                }`}
              >
                Week {week.week}
                {week.week === currentWeek && ' (Current)'}
              </span>
              <span className={theme.colors.textMuted}>
                {week.actualDistance.toFixed(1)} / {week.plannedDistance.toFixed(1)} km
              </span>
            </div>
            <div className={`relative h-4 ${theme.colors.bgSecondary} rounded-full overflow-hidden`}>
              {/* Planned distance bar (background) */}
              <div
                className={`absolute inset-y-0 left-0 ${theme.colors.bgPrimary} rounded-full`}
                style={{ width: `${(week.plannedDistance / maxDistance) * 100}%` }}
              />
              {/* Actual distance bar (foreground) */}
              <div
                className={`absolute inset-y-0 left-0 rounded-full ${
                  week.completionRate >= 1
                    ? 'bg-green-500'
                    : week.completionRate >= 0.75
                    ? theme.colors.accent
                    : week.completionRate >= 0.5
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${(week.actualDistance / maxDistance) * 100}%` }}
              />
            </div>
            <div className="flex justify-end">
              <span
                className={`text-xs font-medium ${
                  week.completionRate >= 1
                    ? theme.colors.success
                    : week.completionRate >= 0.75
                    ? theme.colors.accentText
                    : week.completionRate >= 0.5
                    ? theme.colors.warning
                    : theme.colors.danger
                }`}
              >
                {Math.round(week.completionRate * 100)}% complete
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className={`mt-6 pt-4 border-t ${theme.colors.border}`}>
        <div className={`flex items-center gap-4 text-xs ${theme.colors.textMuted}`}>
          <div className="flex items-center gap-1">
            <span className={`w-3 h-3 ${theme.colors.bgPrimary} rounded`} />
            <span>Planned</span>
          </div>
          <div className="flex items-center gap-1">
            <span className={`w-3 h-3 ${theme.colors.accent} rounded`} />
            <span>Actual</span>
          </div>
        </div>
      </div>
    </div>
  )
}
