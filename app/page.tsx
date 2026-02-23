'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import HeroSection from '@/components/HeroSection'
import HorizontalWeekView from '@/components/HorizontalWeekView'
import StatsAndAchievements from '@/components/StatsAndAchievements'
import TrainingPlanOverview from '@/components/TrainingPlanOverview'
import CalendarView from '@/components/CalendarView'
import { useTheme } from '@/components/ThemeProvider'

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

interface Activity {
  id: number
  type: string
  distance: number
  duration: number
  date: string
}

export default function Dashboard() {
  const { theme } = useTheme()
  const [planData, setPlanData] = useState<PlanData | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCalendar, setShowCalendar] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      // Fetch both plan and activities in parallel
      const [planRes, activitiesRes] = await Promise.all([
        fetch('/api/plan'),
        fetch('/api/activities?limit=100')
      ])

      if (planRes.status === 404) {
        setError('setup')
        return
      }
      if (!planRes.ok) throw new Error('Failed to fetch plan')

      const planDataResult = await planRes.json()
      setPlanData(planDataResult)

      if (activitiesRes.ok) {
        const activitiesData = await activitiesRes.json()
        setActivities(activitiesData.activities?.filter((a: Activity) => a.type === 'Run') || [])
      }
    } catch (err) {
      setError('Failed to load training plan')
    } finally {
      setLoading(false)
    }
  }

  async function fetchPlan() {
    fetchData()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500" />
          <p className={`text-sm ${theme.colors.textMuted}`}>Loading your training plan...</p>
        </div>
      </div>
    )
  }

  if (error === 'setup') {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className={`${theme.colors.bgCard} rounded-2xl shadow-lg border ${theme.colors.border} p-8`}>
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-sky-100 to-amber-100 flex items-center justify-center">
            <span className="text-4xl">🏃</span>
          </div>
          <h2 className={`text-2xl font-bold ${theme.colors.textPrimary} mb-4`}>
            Welcome to Run Trainer!
          </h2>
          <p className={`${theme.colors.textSecondary} mb-6`}>
            Let&apos;s set up your race date to create your personalized half-marathon training plan.
          </p>
          <Link
            href="/settings"
            className="inline-flex items-center px-6 py-3 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 shadow-lg shadow-sky-500/30 transition-all"
          >
            Get Started
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className={theme.colors.danger}>{error}</p>
        <button
          onClick={fetchPlan}
          className="mt-4 px-6 py-3 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-colors"
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

    fetchPlan()
  }

  if (!planData) return null

  const { workouts, currentWeek, totalWeeks, raceDate, raceName } = planData

  // Get current week workouts
  const currentWeekWorkouts = workouts.filter((w) => w.weekNumber === currentWeek)

  // Get today's workout or next workout
  const today = new Date()
  const todayDay = today.getDay()
  const todayWorkout = currentWeekWorkouts.find(
    (w) => w.dayOfWeek === todayDay && !w.completed && w.type !== 'rest'
  )
  const nextWorkout = todayWorkout || currentWeekWorkouts
    .filter((w) => w.dayOfWeek > todayDay && !w.completed && w.type !== 'rest')
    .sort((a, b) => a.dayOfWeek - b.dayOfWeek)[0]

  // Calculate days until race
  const raceDateObj = new Date(raceDate)
  const daysUntilRace = Math.ceil((raceDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  // Calculate streak from actual activities
  const streak = calculateStreakFromActivities(activities)

  // Calculate total distance from actual activities (in km)
  const totalDistanceFromActivities = activities.reduce((sum, a) => sum + (a.distance / 1000), 0)

  // Get this week's start and end dates
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay())
  weekStart.setHours(0, 0, 0, 0)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 7)

  // Filter activities for this week
  const thisWeekActivities = activities.filter(a => {
    const activityDate = new Date(a.date)
    return activityDate >= weekStart && activityDate < weekEnd
  })

  // Prepare weekly data for stats
  const weeklyData = Array.from({ length: currentWeek }, (_, i) => {
    const weekNum = i + 1
    const weekWorkouts = workouts.filter((w) => w.weekNumber === weekNum)
    const plannedDistance = weekWorkouts.reduce((sum, w) => sum + (w.distance || 0), 0)
    const completedInWeek = weekWorkouts.filter((w) => w.completed && w.type !== 'rest')
    const totalRuns = weekWorkouts.filter((w) => w.type !== 'rest').length

    // For current week, calculate completion from actual activities
    let completionRate = 0
    if (weekNum === currentWeek) {
      // Use actual activities for current week
      completionRate = totalRuns > 0 ? thisWeekActivities.length / totalRuns : 0
    } else {
      // Use workout completed field for past weeks
      completionRate = totalRuns > 0 ? completedInWeek.length / totalRuns : 0
    }

    // Use actual activities for distance if available
    const actualDistance = completedInWeek.length > 0
      ? completedInWeek.reduce((sum, w) => sum + (w.distance || 0), 0)
      : 0

    return {
      week: weekNum,
      plannedDistance,
      actualDistance,
      completionRate: Math.min(completionRate, 1), // Cap at 100%
    }
  })

  // Calculate total distances - use activities for actual distance
  const totalDistanceCompleted = totalDistanceFromActivities
  const totalDistancePlanned = workouts
    .filter(w => w.weekNumber <= currentWeek && w.type !== 'rest')
    .reduce((sum, w) => sum + (w.distance || 0), 0)

  // Count workouts completed this week based on activities
  const completedThisWeek = thisWeekActivities.length
  const totalThisWeek = currentWeekWorkouts.filter(w => w.type !== 'rest').length

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <HeroSection
        raceName={raceName}
        daysUntilRace={daysUntilRace}
        nextWorkout={todayWorkout || nextWorkout}
        streak={streak}
        completedThisWeek={completedThisWeek}
        totalThisWeek={totalThisWeek}
      />

      {/* This Week - Horizontal Cards */}
      <HorizontalWeekView
        workouts={currentWeekWorkouts}
        weekNumber={currentWeek}
        onReschedule={handleReschedule}
      />

      {/* Stats and Achievements */}
      <StatsAndAchievements
        currentWeek={currentWeek}
        totalWeeks={totalWeeks}
        weeklyData={weeklyData}
        totalDistanceCompleted={totalDistanceCompleted}
        totalDistancePlanned={totalDistancePlanned}
        streak={streak}
      />

      {/* Training Plan Overview */}
      <TrainingPlanOverview
        workouts={workouts}
        currentWeek={currentWeek}
        totalWeeks={totalWeeks}
      />

      {/* Calendar Toggle */}
      <div className={`${theme.colors.bgCard} rounded-2xl border ${theme.colors.border} overflow-hidden shadow-sm`}>
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className={`w-full p-4 flex items-center justify-between ${theme.colors.textPrimary} hover:bg-gray-50 transition-colors`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">📅</span>
            <span className="font-semibold">Calendar View</span>
          </div>
          <svg
            className={`w-5 h-5 transition-transform ${showCalendar ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showCalendar && (
          <div className="p-4 border-t border-gray-100">
            <CalendarView workouts={workouts} raceDate={raceDate} />
          </div>
        )}
      </div>
    </div>
  )
}

function calculateStreakFromActivities(activities: Activity[]): number {
  if (activities.length === 0) return 0

  // Sort by date descending
  const sorted = [...activities]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let checkDate = new Date(today)

  for (let i = 0; i < 30; i++) {
    const hasActivity = sorted.some(a => {
      const activityDate = new Date(a.date)
      activityDate.setHours(0, 0, 0, 0)
      return activityDate.getTime() === checkDate.getTime()
    })

    if (hasActivity) {
      streak++
    } else if (streak > 0) {
      break
    }

    checkDate.setDate(checkDate.getDate() - 1)
  }

  return streak
}
