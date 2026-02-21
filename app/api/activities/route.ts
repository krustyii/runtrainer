import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const includeAnalysis = searchParams.get('includeAnalysis') === 'true'

    const activities = await prisma.activity.findMany({
      orderBy: { date: 'desc' },
      take: limit,
      skip: offset,
    })

    const total = await prisma.activity.count()

    // Fetch analyses if requested
    let analyses: Awaited<ReturnType<typeof prisma.runAnalysis.findMany>> = []
    if (includeAnalysis && activities.length > 0) {
      const activityIds = activities.map((a) => a.id)
      analyses = await prisma.runAnalysis.findMany({
        where: { activityId: { in: activityIds } },
      })
    }

    return NextResponse.json({
      activities,
      analyses,
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const activity = await prisma.activity.create({
      data: {
        stravaId: body.stravaId || `manual-${Date.now()}`,
        type: body.type || 'Run',
        name: body.name,
        distance: body.distance,
        duration: body.duration,
        avgHeartRate: body.avgHeartRate || null,
        maxHeartRate: body.maxHeartRate || null,
        avgPace: body.avgPace || null,
        calories: body.calories || null,
        date: new Date(body.date),
        perceivedEffort: body.perceivedEffort || null,
      },
    })

    return NextResponse.json(activity, { status: 201 })
  } catch (error) {
    console.error('Error creating activity:', error)
    return NextResponse.json(
      { error: 'Failed to create activity' },
      { status: 500 }
    )
  }
}
