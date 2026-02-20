export type WorkoutType = 'easy' | 'tempo' | 'long' | 'interval' | 'rest' | 'recovery'

export interface PlannedWorkoutData {
  weekNumber: number
  dayOfWeek: number
  type: WorkoutType
  distance?: number
  duration?: number
  description: string
}

const HALF_MARATHON_DISTANCE = 21.1

// Base weekly templates for a 12-week half-marathon plan
// Distances in km, durations in minutes
const baseWeeklyTemplates: Record<number, Omit<PlannedWorkoutData, 'weekNumber'>[]> = {
  // Week 1-4: Base building
  1: [
    { dayOfWeek: 1, type: 'easy', distance: 4, description: 'Easy run - conversational pace' },
    { dayOfWeek: 2, type: 'rest', description: 'Rest or cross-training' },
    { dayOfWeek: 3, type: 'easy', distance: 5, description: 'Easy run with light strides at end' },
    { dayOfWeek: 4, type: 'rest', description: 'Rest day' },
    { dayOfWeek: 5, type: 'tempo', distance: 4, description: 'Tempo run - comfortably hard pace' },
    { dayOfWeek: 6, type: 'rest', description: 'Rest or light walk' },
    { dayOfWeek: 0, type: 'long', distance: 8, description: 'Long run - easy pace, build endurance' },
  ],
  2: [
    { dayOfWeek: 1, type: 'easy', distance: 5, description: 'Easy run - conversational pace' },
    { dayOfWeek: 2, type: 'rest', description: 'Rest or cross-training' },
    { dayOfWeek: 3, type: 'interval', distance: 5, description: '4x400m intervals with recovery jogs' },
    { dayOfWeek: 4, type: 'rest', description: 'Rest day' },
    { dayOfWeek: 5, type: 'easy', distance: 5, description: 'Easy recovery run' },
    { dayOfWeek: 6, type: 'rest', description: 'Rest or light walk' },
    { dayOfWeek: 0, type: 'long', distance: 10, description: 'Long run - steady easy pace' },
  ],
  3: [
    { dayOfWeek: 1, type: 'easy', distance: 5, description: 'Easy run' },
    { dayOfWeek: 2, type: 'rest', description: 'Rest or cross-training' },
    { dayOfWeek: 3, type: 'tempo', distance: 6, description: 'Tempo run with warm-up and cool-down' },
    { dayOfWeek: 4, type: 'rest', description: 'Rest day' },
    { dayOfWeek: 5, type: 'easy', distance: 5, description: 'Easy run' },
    { dayOfWeek: 6, type: 'rest', description: 'Rest or light walk' },
    { dayOfWeek: 0, type: 'long', distance: 11, description: 'Long run - focus on consistent pace' },
  ],
  4: [
    { dayOfWeek: 1, type: 'recovery', distance: 4, description: 'Recovery week - easy run' },
    { dayOfWeek: 2, type: 'rest', description: 'Rest' },
    { dayOfWeek: 3, type: 'easy', distance: 4, description: 'Easy run with strides' },
    { dayOfWeek: 4, type: 'rest', description: 'Rest day' },
    { dayOfWeek: 5, type: 'easy', distance: 4, description: 'Easy run' },
    { dayOfWeek: 6, type: 'rest', description: 'Rest' },
    { dayOfWeek: 0, type: 'long', distance: 8, description: 'Recovery long run - easy effort' },
  ],
  // Week 5-8: Building volume
  5: [
    { dayOfWeek: 1, type: 'easy', distance: 6, description: 'Easy run' },
    { dayOfWeek: 2, type: 'rest', description: 'Rest or cross-training' },
    { dayOfWeek: 3, type: 'interval', distance: 6, description: '5x800m intervals at 5K pace' },
    { dayOfWeek: 4, type: 'rest', description: 'Rest day' },
    { dayOfWeek: 5, type: 'tempo', distance: 6, description: 'Tempo run' },
    { dayOfWeek: 6, type: 'rest', description: 'Rest or light walk' },
    { dayOfWeek: 0, type: 'long', distance: 13, description: 'Long run - building distance' },
  ],
  6: [
    { dayOfWeek: 1, type: 'easy', distance: 6, description: 'Easy run' },
    { dayOfWeek: 2, type: 'rest', description: 'Rest or cross-training' },
    { dayOfWeek: 3, type: 'tempo', distance: 7, description: 'Progressive tempo run' },
    { dayOfWeek: 4, type: 'rest', description: 'Rest day' },
    { dayOfWeek: 5, type: 'easy', distance: 6, description: 'Easy run' },
    { dayOfWeek: 6, type: 'rest', description: 'Rest' },
    { dayOfWeek: 0, type: 'long', distance: 14, description: 'Long run - practice race nutrition' },
  ],
  7: [
    { dayOfWeek: 1, type: 'easy', distance: 6, description: 'Easy run' },
    { dayOfWeek: 2, type: 'rest', description: 'Rest or cross-training' },
    { dayOfWeek: 3, type: 'interval', distance: 7, description: '6x800m intervals' },
    { dayOfWeek: 4, type: 'rest', description: 'Rest day' },
    { dayOfWeek: 5, type: 'tempo', distance: 7, description: 'Tempo run at half-marathon effort' },
    { dayOfWeek: 6, type: 'rest', description: 'Rest' },
    { dayOfWeek: 0, type: 'long', distance: 16, description: 'Long run - longest training run' },
  ],
  8: [
    { dayOfWeek: 1, type: 'recovery', distance: 5, description: 'Recovery week - easy run' },
    { dayOfWeek: 2, type: 'rest', description: 'Rest' },
    { dayOfWeek: 3, type: 'easy', distance: 5, description: 'Easy run' },
    { dayOfWeek: 4, type: 'rest', description: 'Rest day' },
    { dayOfWeek: 5, type: 'easy', distance: 5, description: 'Easy run' },
    { dayOfWeek: 6, type: 'rest', description: 'Rest' },
    { dayOfWeek: 0, type: 'long', distance: 10, description: 'Recovery long run' },
  ],
  // Week 9-11: Peak training
  9: [
    { dayOfWeek: 1, type: 'easy', distance: 6, description: 'Easy run' },
    { dayOfWeek: 2, type: 'rest', description: 'Rest or cross-training' },
    { dayOfWeek: 3, type: 'interval', distance: 8, description: '4x1600m at goal pace' },
    { dayOfWeek: 4, type: 'rest', description: 'Rest day' },
    { dayOfWeek: 5, type: 'tempo', distance: 8, description: 'Tempo run at race pace' },
    { dayOfWeek: 6, type: 'rest', description: 'Rest' },
    { dayOfWeek: 0, type: 'long', distance: 18, description: 'Peak long run' },
  ],
  10: [
    { dayOfWeek: 1, type: 'easy', distance: 6, description: 'Easy run' },
    { dayOfWeek: 2, type: 'rest', description: 'Rest or cross-training' },
    { dayOfWeek: 3, type: 'tempo', distance: 10, description: 'Race pace practice' },
    { dayOfWeek: 4, type: 'rest', description: 'Rest day' },
    { dayOfWeek: 5, type: 'easy', distance: 6, description: 'Easy run' },
    { dayOfWeek: 6, type: 'rest', description: 'Rest' },
    { dayOfWeek: 0, type: 'long', distance: 19, description: 'Last big long run' },
  ],
  11: [
    { dayOfWeek: 1, type: 'easy', distance: 5, description: 'Easy run - taper begins' },
    { dayOfWeek: 2, type: 'rest', description: 'Rest' },
    { dayOfWeek: 3, type: 'interval', distance: 6, description: 'Short intervals, maintain sharpness' },
    { dayOfWeek: 4, type: 'rest', description: 'Rest day' },
    { dayOfWeek: 5, type: 'tempo', distance: 5, description: 'Short tempo run' },
    { dayOfWeek: 6, type: 'rest', description: 'Rest' },
    { dayOfWeek: 0, type: 'long', distance: 13, description: 'Moderate long run' },
  ],
  // Week 12: Race week taper
  12: [
    { dayOfWeek: 1, type: 'easy', distance: 4, description: 'Easy shakeout run' },
    { dayOfWeek: 2, type: 'rest', description: 'Rest' },
    { dayOfWeek: 3, type: 'easy', distance: 3, description: 'Short easy run with strides' },
    { dayOfWeek: 4, type: 'rest', description: 'Rest - stay off feet' },
    { dayOfWeek: 5, type: 'easy', distance: 2, description: 'Light 15-min shakeout' },
    { dayOfWeek: 6, type: 'rest', description: 'Rest - prepare gear and nutrition' },
    { dayOfWeek: 0, type: 'long', distance: HALF_MARATHON_DISTANCE, description: 'RACE DAY! Half Marathon' },
  ],
}

export function generateTrainingPlan(
  raceDate: Date,
  currentDate: Date = new Date()
): PlannedWorkoutData[] {
  const workouts: PlannedWorkoutData[] = []

  // Get start of race week (Sunday) for consistent calculation
  const raceWeekStart = new Date(raceDate)
  raceWeekStart.setDate(raceWeekStart.getDate() - raceWeekStart.getDay())

  // Get start of current week (Sunday)
  const currentWeekStart = new Date(currentDate)
  currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay())
  currentWeekStart.setHours(0, 0, 0, 0)

  // Calculate weeks between current week and race week
  const msPerWeek = 7 * 24 * 60 * 60 * 1000
  const weeksUntilRace = Math.round((raceWeekStart.getTime() - currentWeekStart.getTime()) / msPerWeek)

  // Determine which week templates to use based on time available
  // Add 1 because race week counts as a training week
  const planWeeks = Math.min(12, Math.max(4, weeksUntilRace + 1))

  // If less than 12 weeks, start from later in the plan
  const startWeek = Math.max(1, 12 - planWeeks + 1)

  for (let planWeek = startWeek; planWeek <= 12; planWeek++) {
    const weekNumber = planWeek - startWeek + 1
    const template = baseWeeklyTemplates[planWeek] || baseWeeklyTemplates[1]

    for (const workout of template) {
      workouts.push({
        weekNumber,
        ...workout,
      })
    }
  }

  return workouts
}

export function getWeekStartDate(raceDate: Date, weekNumber: number, totalWeeks: number): Date {
  const msPerDay = 24 * 60 * 60 * 1000
  const raceWeekStart = new Date(raceDate)
  raceWeekStart.setDate(raceWeekStart.getDate() - raceWeekStart.getDay()) // Start of race week (Sunday)

  const weeksBeforeRace = totalWeeks - weekNumber
  const weekStart = new Date(raceWeekStart.getTime() - (weeksBeforeRace * 7 * msPerDay))

  return weekStart
}

export function getCurrentWeekNumber(raceDate: Date, totalWeeks: number): number {
  const now = new Date()
  const msPerWeek = 7 * 24 * 60 * 60 * 1000

  // Get start of race week (Sunday)
  const raceWeekStart = new Date(raceDate)
  raceWeekStart.setDate(raceWeekStart.getDate() - raceWeekStart.getDay())

  // Get start of current week (Sunday)
  const currentWeekStart = new Date(now)
  currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay())
  currentWeekStart.setHours(0, 0, 0, 0)

  // Calculate weeks between current week and race week
  const weeksUntilRace = Math.round((raceWeekStart.getTime() - currentWeekStart.getTime()) / msPerWeek)
  const currentWeek = totalWeeks - weeksUntilRace

  return Math.max(1, Math.min(totalWeeks, currentWeek))
}

export function getWorkoutDate(raceDate: Date, weekNumber: number, dayOfWeek: number, totalWeeks: number): Date {
  const weekStart = getWeekStartDate(raceDate, weekNumber, totalWeeks)
  const date = new Date(weekStart)
  date.setDate(date.getDate() + dayOfWeek)
  return date
}
