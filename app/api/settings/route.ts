import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateTrainingPlan } from '@/lib/training-plan'

export async function GET() {
  try {
    const settings = await prisma.settings.findFirst()

    if (!settings) {
      return NextResponse.json({ settings: null })
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.raceDate) {
      return NextResponse.json(
        { error: 'Race date is required' },
        { status: 400 }
      )
    }

    const raceDate = new Date(body.raceDate)

    // Check if settings exist
    const existing = await prisma.settings.findFirst()

    let settings
    if (existing) {
      settings = await prisma.settings.update({
        where: { id: existing.id },
        data: {
          raceDate,
          raceName: body.raceName || null,
          weeklyGoal: body.weeklyGoal || 4,
          theme: body.theme || existing.theme || 'default',
        },
      })

      // Regenerate plan if race date changed
      if (existing.raceDate.getTime() !== raceDate.getTime()) {
        await prisma.plannedWorkout.deleteMany()
        const plan = generateTrainingPlan(raceDate, { forceFullPlan: true })
        for (const workout of plan) {
          await prisma.plannedWorkout.create({ data: workout })
        }
      }
    } else {
      settings = await prisma.settings.create({
        data: {
          raceDate,
          raceName: body.raceName || null,
          weeklyGoal: body.weeklyGoal || 4,
        },
      })

      // Generate initial full 12-week training plan
      const plan = generateTrainingPlan(raceDate, { forceFullPlan: true })
      for (const workout of plan) {
        await prisma.plannedWorkout.create({ data: workout })
      }
    }

    return NextResponse.json({ settings }, { status: existing ? 200 : 201 })
  } catch (error) {
    console.error('Error saving settings:', error)
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    )
  }
}
