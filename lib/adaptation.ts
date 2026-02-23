import { prisma } from './db'
import { getWorkoutDate } from './training-plan'

interface AdaptationResult {
  adjustments: string[]
  volumeMultiplier: number
  addRecoveryDay: boolean
}

interface WeeklyStats {
  plannedWorkouts: number
  completedWorkouts: number
  completionRate: number
  totalPlannedDistance: number
  totalActualDistance: number
  avgHeartRate: number | null
  previousWeekAvgHR: number | null
}

export async function getWeeklyStats(weekNumber: number): Promise<WeeklyStats> {
  const settings = await prisma.settings.findFirst()
  if (!settings) {
    return {
      plannedWorkouts: 0,
      completedWorkouts: 0,
      completionRate: 0,
      totalPlannedDistance: 0,
      totalActualDistance: 0,
      avgHeartRate: null,
      previousWeekAvgHR: null,
    }
  }

  const plannedWorkouts = await prisma.plannedWorkout.findMany({
    where: { weekNumber },
  })

  const completedWorkouts = plannedWorkouts.filter((w) => w.completed)

  // Get activities from this week
  const activities = await prisma.activity.findMany({
    where: {
      type: 'Run',
    },
  })

  const weekActivities = activities.filter((a) => {
    // Match activities to week based on activityId in planned workouts
    return completedWorkouts.some((w) => w.activityId === a.id)
  })

  const avgHeartRate =
    weekActivities.length > 0
      ? weekActivities.reduce((sum, a) => sum + (a.avgHeartRate || 0), 0) / weekActivities.length
      : null

  // Get previous week stats for HR comparison
  const prevWeekWorkouts = await prisma.plannedWorkout.findMany({
    where: { weekNumber: weekNumber - 1, completed: true },
  })

  const prevWeekActivityIds = prevWeekWorkouts.map((w) => w.activityId).filter(Boolean) as number[]
  const prevWeekActivities = await prisma.activity.findMany({
    where: { id: { in: prevWeekActivityIds } },
  })

  const previousWeekAvgHR =
    prevWeekActivities.length > 0
      ? prevWeekActivities.reduce((sum, a) => sum + (a.avgHeartRate || 0), 0) /
        prevWeekActivities.length
      : null

  return {
    plannedWorkouts: plannedWorkouts.filter((w) => w.type !== 'rest').length,
    completedWorkouts: completedWorkouts.filter((w) => w.type !== 'rest').length,
    completionRate:
      plannedWorkouts.filter((w) => w.type !== 'rest').length > 0
        ? completedWorkouts.filter((w) => w.type !== 'rest').length /
          plannedWorkouts.filter((w) => w.type !== 'rest').length
        : 0,
    totalPlannedDistance: plannedWorkouts.reduce((sum, w) => sum + (w.distance || 0), 0),
    totalActualDistance: weekActivities.reduce((sum, a) => sum + a.distance / 1000, 0),
    avgHeartRate,
    previousWeekAvgHR,
  }
}

export async function analyzeAndAdapt(weekNumber: number): Promise<AdaptationResult> {
  const stats = await getWeeklyStats(weekNumber)
  const adjustments: string[] = []
  let volumeMultiplier = 1.0
  let addRecoveryDay = false

  // Rule 1: Low completion rate
  if (stats.completionRate < 0.5 && stats.plannedWorkouts > 0) {
    volumeMultiplier = 0.8 // Reduce volume by 20%
    adjustments.push('Reduced next week volume by 20% due to low completion rate (<50%)')
  } else if (stats.completionRate < 0.75 && stats.plannedWorkouts > 0) {
    volumeMultiplier = 0.9 // Reduce volume by 10%
    adjustments.push('Slightly reduced next week volume due to completion rate (<75%)')
  }

  // Rule 2: Heart rate trending up (potential overtraining)
  if (stats.avgHeartRate && stats.previousWeekAvgHR) {
    const hrIncrease = stats.avgHeartRate - stats.previousWeekAvgHR
    if (hrIncrease > 5 && stats.completionRate < 0.75) {
      addRecoveryDay = true
      volumeMultiplier = Math.min(volumeMultiplier, 0.85)
      adjustments.push(
        'Added recovery day due to elevated heart rate trend and incomplete training'
      )
    }
  }

  // Rule 3: Exceeding planned distance (running well)
  if (stats.totalActualDistance > stats.totalPlannedDistance * 1.1 && stats.completionRate >= 0.9) {
    volumeMultiplier = Math.min(volumeMultiplier * 1.05, 1.15) // Max 15% increase
    adjustments.push('Slight volume increase next week due to strong performance')
  }

  return {
    adjustments,
    volumeMultiplier,
    addRecoveryDay,
  }
}

export async function regeneratePlan(): Promise<void> {
  const settings = await prisma.settings.findFirst()
  if (!settings) return

  // Get all existing workouts
  const allWorkouts = await prisma.plannedWorkout.findMany()

  // If there's no plan at all, don't regenerate (user needs to set up first)
  if (allWorkouts.length === 0) return

  // Get completed workouts
  const completedWorkouts = allWorkouts.filter(w => w.completed)

  // Get last completed week for adaptation
  const lastCompletedWeek = Math.max(...completedWorkouts.map((w) => w.weekNumber), 0)

  if (lastCompletedWeek > 0) {
    // Analyze and get adaptations
    const adaptation = await analyzeAndAdapt(lastCompletedWeek)

    // Only adapt future uncompleted workouts - don't delete and recreate them
    const futureWorkouts = allWorkouts.filter(
      (w) => !w.completed && w.weekNumber > lastCompletedWeek
    )

    // Apply adaptations to each future workout
    for (const workout of futureWorkouts) {
      if (workout.type === 'rest') continue

      const updates: { distance?: number; duration?: number } = {}

      if (workout.distance) {
        updates.distance = Math.round(workout.distance * adaptation.volumeMultiplier * 10) / 10
      }
      if (workout.duration) {
        updates.duration = Math.round(workout.duration * adaptation.volumeMultiplier)
      }

      if (Object.keys(updates).length > 0) {
        await prisma.plannedWorkout.update({
          where: { id: workout.id },
          data: updates,
        })
      }
    }
  }
  // If no completed workouts yet, do nothing - keep the existing plan as is
}

function isSameDay(date1: Date, date2: Date): boolean {
  // Compare using UTC to avoid timezone issues
  return (
    date1.getUTCFullYear() === date2.getUTCFullYear() &&
    date1.getUTCMonth() === date2.getUTCMonth() &&
    date1.getUTCDate() === date2.getUTCDate()
  )
}

export async function linkActivityToWorkout(activityId: number, activityDate: Date): Promise<void> {
  const settings = await prisma.settings.findFirst()
  if (!settings) return

  // Get all workouts to find total weeks
  const allWorkouts = await prisma.plannedWorkout.findMany()
  const totalWeeks = Math.max(...allWorkouts.map((w) => w.weekNumber), 1)

  // Get uncompleted run workouts
  const workouts = allWorkouts.filter(w => !w.completed && w.type !== 'rest')

  // Find workout that matches the actual activity date
  const matchingWorkout = workouts.find((workout) => {
    const workoutDate = getWorkoutDate(settings.raceDate, workout.weekNumber, workout.dayOfWeek, totalWeeks)
    return isSameDay(workoutDate, activityDate)
  })

  if (matchingWorkout) {
    await prisma.plannedWorkout.update({
      where: { id: matchingWorkout.id },
      data: {
        completed: true,
        activityId,
      },
    })
  }
}
