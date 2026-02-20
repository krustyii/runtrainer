import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const workoutId = parseInt(id, 10)

    if (isNaN(workoutId)) {
      return NextResponse.json({ error: 'Invalid workout ID' }, { status: 400 })
    }

    const body = await request.json()
    const { newDate } = body

    if (!newDate) {
      return NextResponse.json({ error: 'newDate is required' }, { status: 400 })
    }

    const parsedDate = new Date(newDate)
    const newDayOfWeek = parsedDate.getDay()

    // Get the workout
    const workout = await prisma.plannedWorkout.findUnique({
      where: { id: workoutId },
    })

    if (!workout) {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 })
    }

    if (workout.completed) {
      return NextResponse.json({ error: 'Cannot reschedule completed workout' }, { status: 400 })
    }

    // Get settings to calculate week number
    const settings = await prisma.settings.findFirst()
    if (!settings) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 })
    }

    // Calculate new week number based on the new date
    const raceDate = new Date(settings.raceDate)
    const msPerWeek = 7 * 24 * 60 * 60 * 1000

    // Find race week start (Sunday)
    const raceWeekStart = new Date(raceDate)
    raceWeekStart.setDate(raceWeekStart.getDate() - raceWeekStart.getDay())

    // Find the start of the week containing the new date (Sunday)
    const newDateWeekStart = new Date(parsedDate)
    newDateWeekStart.setDate(newDateWeekStart.getDate() - newDateWeekStart.getDay())
    newDateWeekStart.setHours(0, 0, 0, 0)

    // Get total weeks
    const allWorkouts = await prisma.plannedWorkout.findMany()
    const totalWeeks = Math.max(...allWorkouts.map((w) => w.weekNumber), 12)

    // Calculate which week the new date falls into (using week starts for consistency)
    const weeksUntilRace = Math.round((raceWeekStart.getTime() - newDateWeekStart.getTime()) / msPerWeek)
    const newWeekNumber = totalWeeks - weeksUntilRace

    if (newWeekNumber < 1 || newWeekNumber > totalWeeks) {
      return NextResponse.json(
        { error: 'Cannot reschedule outside of training plan dates' },
        { status: 400 }
      )
    }

    // Check if there's already a non-rest workout on that day
    const existingWorkout = await prisma.plannedWorkout.findFirst({
      where: {
        weekNumber: newWeekNumber,
        dayOfWeek: newDayOfWeek,
        type: { not: 'rest' },
        id: { not: workoutId },
      },
    })

    if (existingWorkout) {
      return NextResponse.json(
        { error: 'There is already a workout scheduled for that day' },
        { status: 400 }
      )
    }

    // Save original position
    const originalWeekNumber = workout.weekNumber
    const originalDayOfWeek = workout.dayOfWeek

    // Delete any rest day at the target location (we're replacing it with a real workout)
    await prisma.plannedWorkout.deleteMany({
      where: {
        weekNumber: newWeekNumber,
        dayOfWeek: newDayOfWeek,
        type: 'rest',
      },
    })

    // Update the workout to new position
    const updatedWorkout = await prisma.plannedWorkout.update({
      where: { id: workoutId },
      data: {
        weekNumber: newWeekNumber,
        dayOfWeek: newDayOfWeek,
      },
    })

    // Create a rest day at the original position (unless moving within same day)
    if (originalWeekNumber !== newWeekNumber || originalDayOfWeek !== newDayOfWeek) {
      await prisma.plannedWorkout.create({
        data: {
          weekNumber: originalWeekNumber,
          dayOfWeek: originalDayOfWeek,
          type: 'rest',
          description: 'Rest day (workout moved)',
          completed: false,
        },
      })
    }

    return NextResponse.json({ workout: updatedWorkout })
  } catch (error) {
    console.error('Error rescheduling workout:', error)
    return NextResponse.json({ error: 'Failed to reschedule workout' }, { status: 500 })
  }
}
