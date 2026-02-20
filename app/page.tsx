'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import WeekView from '@/components/WeekView'
import ProgressChart from '@/components/ProgressChart'

interface Workout {
  id: number
  weekNumber: number
  dayOfWeek: number
  type: string
  distance?: number | null
  duration?: number | null
  description: string
  completed: boolean
  date?: string
}

interface PlanData {
  workouts: Workout[]
  currentWeek: number
  totalWeeks: number
  raceDate: string
  raceName?: string
}

export default function Dashboard() {
  const [planData, setPlanData] = useState<PlanData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPlan()
  }, [])

  async function fetchPlan() {
    try {
      const res = await fetch('/api/plan')
      if (res.status === 404) {
        setError('setup')
        return
      }
      if (!res.ok) throw new Error('Failed to fetch plan')
      const data = await res.json()
      setPlanData(data)
    } catch (err) {
      setError('Failed to load training plan')
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

  if (error === 'setup') {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to RunTrainer
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Set up your race date to get started with your personalized half-marathon training plan.
          </p>
          <Link
            href="/settings"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Set Up Race Date
          </Link>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={fetchPlan}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    )
  }

  async function handleReschedule(workoutId: number, newDate: string) {
    const res = await fetch(`/api/plan/${workoutId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newDate }),
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Failed to reschedule')
    }

    // Refresh the plan
    fetchPlan()
  }

  if (!planData) return null

  const { workouts, currentWeek, totalWeeks, raceDate, raceName } = planData

  // Get current week workouts
  const currentWeekWorkouts = workouts.filter((w) => w.weekNumber === currentWeek)

  // Get next workout
  const today = new Date()
  const todayDay = today.getDay()
  const nextWorkout = currentWeekWorkouts
    .filter((w) => w.dayOfWeek >= todayDay && !w.completed && w.type !== 'rest')
    .sort((a, b) => a.dayOfWeek - b.dayOfWeek)[0]

  // Calculate days until race
  const raceDateObj = new Date(raceDate)
  const daysUntilRace = Math.ceil((raceDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  // Prepare progress data
  const weeklyData = Array.from({ length: currentWeek }, (_, i) => {
    const weekNum = i + 1
    const weekWorkouts = workouts.filter((w) => w.weekNumber === weekNum)
    const plannedDistance = weekWorkouts.reduce((sum, w) => sum + (w.distance || 0), 0)
    const completedWorkouts = weekWorkouts.filter((w) => w.completed && w.type !== 'rest')
    const totalRuns = weekWorkouts.filter((w) => w.type !== 'rest').length
    const actualDistance = completedWorkouts.reduce((sum, w) => sum + (w.distance || 0), 0)

    return {
      week: weekNum,
      plannedDistance,
      actualDistance,
      completionRate: totalRuns > 0 ? completedWorkouts.length / totalRuns : 0,
    }
  })

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Race Day
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {daysUntilRace} days
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {raceName || 'Half Marathon'} on{' '}
            {raceDateObj.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Current Week
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            Week {currentWeek} of {totalWeeks}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {currentWeekWorkouts.filter((w) => w.completed && w.type !== 'rest').length} /{' '}
            {currentWeekWorkouts.filter((w) => w.type !== 'rest').length} workouts completed
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Next Workout
          </p>
          {nextWorkout ? (
            <>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white capitalize">
                {nextWorkout.type} Run
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {nextWorkout.distance} km - {nextWorkout.description}
              </p>
            </>
          ) : (
            <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
              All workouts completed this week!
            </p>
          )}
        </div>
      </div>

      {/* Current Week View */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">This Week</h2>
        <WeekView
          weekNumber={currentWeek}
          workouts={currentWeekWorkouts}
          isCurrentWeek={true}
          totalWeeks={totalWeeks}
          onReschedule={handleReschedule}
        />
      </div>

      {/* Progress Chart */}
      {weeklyData.length > 0 && (
        <ProgressChart data={weeklyData} currentWeek={currentWeek} />
      )}

      {/* Full Plan Overview */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Full Training Plan
        </h2>
        <div className="space-y-6">
          {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((weekNum) => {
            const weekWorkouts = workouts.filter((w) => w.weekNumber === weekNum)
            return (
              <WeekView
                key={weekNum}
                weekNumber={weekNum}
                workouts={weekWorkouts}
                isCurrentWeek={weekNum === currentWeek}
                totalWeeks={totalWeeks}
                onReschedule={handleReschedule}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
