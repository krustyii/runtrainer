import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { linkActivityToWorkout, regeneratePlan } from '@/lib/adaptation'

interface ZapierWebhookPayload {
  activity_id: string
  type: string
  name: string
  distance: string | number
  moving_time: string | number
  elapsed_time?: string | number
  start_date: string
  average_heartrate?: string | number
  max_heartrate?: string | number
  calories?: string | number
}

export async function POST(request: NextRequest) {
  try {
    const payload: ZapierWebhookPayload = await request.json()

    // Validate required fields
    if (!payload.activity_id || !payload.type || !payload.distance) {
      return NextResponse.json(
        { error: 'Missing required fields: activity_id, type, distance' },
        { status: 400 }
      )
    }

    // Check if activity already exists
    const existing = await prisma.activity.findUnique({
      where: { stravaId: payload.activity_id },
    })

    if (existing) {
      return NextResponse.json(
        { message: 'Activity already exists', id: existing.id },
        { status: 200 }
      )
    }

    // Parse numeric fields (Zapier sends them as strings)
    const distance = parseFloat(String(payload.distance))
    const movingTime = parseInt(String(payload.moving_time), 10)
    const avgHeartRate = payload.average_heartrate ? Math.round(parseFloat(String(payload.average_heartrate))) : null
    const maxHeartRate = payload.max_heartrate ? Math.round(parseFloat(String(payload.max_heartrate))) : null
    const calories = payload.calories ? parseInt(String(payload.calories), 10) : null

    // Calculate average pace (min/km)
    const distanceKm = distance / 1000
    const durationMin = movingTime / 60
    const avgPace = distanceKm > 0 ? durationMin / distanceKm : null

    // Create the activity
    const activity = await prisma.activity.create({
      data: {
        stravaId: payload.activity_id,
        type: payload.type,
        name: payload.name || 'Untitled Activity',
        distance,
        duration: movingTime,
        avgHeartRate,
        maxHeartRate,
        avgPace,
        calories,
        date: new Date(payload.start_date),
      },
    })

    // Link activity to planned workout if it's a run
    if (payload.type === 'Run') {
      await linkActivityToWorkout(activity.id, new Date(payload.start_date))

      // Regenerate plan with adaptations
      await regeneratePlan()
    }

    return NextResponse.json(
      { message: 'Activity created successfully', id: activity.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Webhook endpoint active' })
}
