'use client'

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
  const maxDistance = Math.max(...data.map((d) => Math.max(d.plannedDistance, d.actualDistance)))

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Progress</h3>
      <div className="space-y-4">
        {data.map((week) => (
          <div key={week.week} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span
                className={`font-medium ${
                  week.week === currentWeek
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                Week {week.week}
                {week.week === currentWeek && ' (Current)'}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {week.actualDistance.toFixed(1)} / {week.plannedDistance.toFixed(1)} km
              </span>
            </div>
            <div className="relative h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              {/* Planned distance bar (background) */}
              <div
                className="absolute inset-y-0 left-0 bg-gray-200 dark:bg-gray-600 rounded-full"
                style={{ width: `${(week.plannedDistance / maxDistance) * 100}%` }}
              />
              {/* Actual distance bar (foreground) */}
              <div
                className={`absolute inset-y-0 left-0 rounded-full ${
                  week.completionRate >= 1
                    ? 'bg-green-500'
                    : week.completionRate >= 0.75
                    ? 'bg-indigo-500'
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
                    ? 'text-green-600 dark:text-green-400'
                    : week.completionRate >= 0.75
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : week.completionRate >= 0.5
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {Math.round(week.completionRate * 100)}% complete
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-gray-200 dark:bg-gray-600 rounded" />
            <span>Planned</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-indigo-500 rounded" />
            <span>Actual</span>
          </div>
        </div>
      </div>
    </div>
  )
}
