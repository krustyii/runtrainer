import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateTrainingPlan, getCurrentWeekNumber, getWorkoutDate } from '@/lib/training-plan'
import { regeneratePlan } from '@/lib/adaptation'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const weekParam = searchParams.get('week')

    const settings = await prisma.settings.findFirst()

    if (!settings) {
      return NextResponse.json(
        { error: 'No settings found. Please set up your race date first.' },
        { status: 404 }
      )
    }

    // Get all planned workouts
    let workouts = await prisma.plannedWorkout.findMany({
      orderBy: [{ weekNumber: 'asc' }, { dayOfWeek: 'asc' }],
    })

    // If no workouts exist, generate the full 12-week plan
    if (workouts.length === 0) {
      const plan = generateTrainingPlan(settings.raceDate, { forceFullPlan: true })
      for (const workout of plan) {
        await prisma.plannedWorkout.create({ data: workout })
      }
      workouts = await prisma.plannedWorkout.findMany({
        orderBy: [{ weekNumber: 'asc' }, { dayOfWeek: 'asc' }],
      })
    }

    const totalWeeks = Math.max(...workouts.map((w) => w.weekNumber))
    const currentWeek = getCurrentWeekNumber(settings.raceDate, totalWeeks)

    // Filter by week if specified
    if (weekParam) {
      const weekNumber = parseInt(weekParam)
      workouts = workouts.filter((w) => w.weekNumber === weekNumber)
    }

    // Add workout dates
    const workoutsWithDates = workouts.map((w) => ({
      ...w,
      date: getWorkoutDate(settings.raceDate, w.weekNumber, w.dayOfWeek, totalWeeks),
    }))

    return NextResponse.json({
      workouts: workoutsWithDates,
      currentWeek,
      totalWeeks,
      raceDate: settings.raceDate,
      raceName: settings.raceName,
    })
  } catch (error) {
    console.error('Error fetching plan:', error)
    return NextResponse.json(
      { error: 'Failed to fetch training plan' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (body.action === 'regenerate') {
      await regeneratePlan()
      return NextResponse.json({ message: 'Plan regenerated successfully' })
    }

    if (body.action === 'reset') {
      // Delete all workouts and regenerate with full 12-week plan
      await prisma.plannedWorkout.deleteMany()

      const settings = await prisma.settings.findFirst()
      if (settings) {
        const plan = generateTrainingPlan(settings.raceDate, { forceFullPlan: true })
        for (const workout of plan) {
          await prisma.plannedWorkout.create({ data: workout })
        }
      }

      return NextResponse.json({ message: 'Plan reset successfully' })
    }

    if (body.action === 'clearAll') {
      // Delete all activities and workouts, then regenerate full plan
      await prisma.activity.deleteMany()
      await prisma.plannedWorkout.deleteMany()

      const settings = await prisma.settings.findFirst()
      if (settings) {
        const plan = generateTrainingPlan(settings.raceDate, { forceFullPlan: true })
        for (const workout of plan) {
          await prisma.plannedWorkout.create({ data: workout })
        }
      }

      return NextResponse.json({ message: 'All data cleared successfully' })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error updating plan:', error)
    return NextResponse.json(
      { error: 'Failed to update plan' },
      { status: 500 }
    )
  }
}
