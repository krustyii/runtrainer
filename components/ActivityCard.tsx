'use client'

interface Activity {
  id: number
  stravaId: string
  type: string
  name: string
  distance: number
  duration: number
  avgHeartRate?: number | null
  maxHeartRate?: number | null
  avgPace?: number | null
  calories?: number | null
  date: Date | string
}

interface ActivityCardProps {
  activity: Activity
}

function formatPace(paceMinPerKm: number): string {
  const minutes = Math.floor(paceMinPerKm)
  const seconds = Math.round((paceMinPerKm - minutes) * 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  const date = new Date(activity.date)
  const distanceKm = activity.distance / 1000

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">{activity.name}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {date.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
        <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 rounded">
          {activity.type}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Distance</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {distanceKm.toFixed(2)} km
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Duration</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatDuration(activity.duration)}
          </p>
        </div>
        {activity.avgPace && (
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Avg Pace</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatPace(activity.avgPace)} /km
            </p>
          </div>
        )}
        {activity.avgHeartRate && (
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Avg HR</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {activity.avgHeartRate} bpm
            </p>
          </div>
        )}
      </div>
      {activity.calories && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {activity.calories} calories burned
          </p>
        </div>
      )}
    </div>
  )
}
