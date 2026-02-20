import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getWorkoutDate } from '@/lib/training-plan'

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

    // Parse date as local date by adding noon time to avoid timezone issues
    const parsedDate = new Date(newDate + 'T12:00:00')
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

    // Get settings
    const settings = await prisma.settings.findFirst()
    if (!settings) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 })
    }

    // Get all workouts to find total weeks and match dates
    const allWorkouts = await prisma.plannedWorkout.findMany()
    const totalWeeks = Math.max(...allWorkouts.map((w) => w.weekNumber), 1)

    // Find the week number by checking which week contains the target date
    // We do this by finding a Sunday (dayOfWeek=0) workout in each week and comparing
    let newWeekNumber = -1

    for (let week = 1; week <= totalWeeks; week++) {
      // Get the date for Sunday of this week
      const weekSundayDate = getWorkoutDate(settings.raceDate, week, 0, totalWeeks)

      // Check if target date is in this week (Sunday to Saturday)
      const weekStart = new Date(weekSundayDate)
      weekStart.setHours(0, 0, 0, 0)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 7)

      const targetDate = new Date(parsedDate)
      targetDate.setHours(0, 0, 0, 0)

      if (targetDate >= weekStart && targetDate < weekEnd) {
        newWeekNumber = week
        break
      }
    }

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
