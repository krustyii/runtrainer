'use client'

import { useEffect, useState } from 'react'
import ActivityCard from '@/components/ActivityCard'

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
  date: string
}

interface ActivitiesData {
  activities: Activity[]
  total: number
  limit: number
  offset: number
}

export default function HistoryPage() {
  const [data, setData] = useState<ActivitiesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchActivities()
  }, [])

  async function fetchActivities() {
    try {
      const res = await fetch('/api/activities')
      if (!res.ok) throw new Error('Failed to fetch activities')
      const data = await res.json()
      setData(data)
    } catch (err) {
      setError('Failed to load activities')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={fetchActivities}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    )
  }

  const activities = data?.activities || []

  // Calculate stats
  const totalDistance = activities.reduce((sum, a) => sum + a.distance, 0) / 1000
  const totalDuration = activities.reduce((sum, a) => sum + a.duration, 0)
  const avgPace =
    activities.length > 0
      ? activities.filter((a) => a.avgPace).reduce((sum, a) => sum + (a.avgPace || 0), 0) /
        activities.filter((a) => a.avgPace).length
      : 0

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Activity History</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Total Activities
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {activities.length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Total Distance
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {totalDistance.toFixed(1)} km
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Total Time
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {Math.round(totalDuration / 3600)}h {Math.round((totalDuration % 3600) / 60)}m
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Avg Pace
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {avgPace > 0
              ? `${Math.floor(avgPace)}:${Math.round((avgPace % 1) * 60)
                  .toString()
                  .padStart(2, '0')} /km`
              : '-'}
          </p>
        </div>
      </div>

      {/* Activities List */}
      {activities.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            No activities yet
          </h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Activities from Strava will appear here once you connect via Zapier.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  )
}
