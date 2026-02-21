import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateAndStoreAnalysis } from '@/lib/ai-analysis'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const activityId = parseInt(id, 10)

    if (isNaN(activityId)) {
      return NextResponse.json(
        { error: 'Invalid activity ID' },
        { status: 400 }
      )
    }

    const analysis = await prisma.runAnalysis.findUnique({
      where: { activityId },
    })

    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis not found for this activity' },
        { status: 404 }
      )
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Error fetching analysis:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analysis' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const activityId = parseInt(id, 10)

    if (isNaN(activityId)) {
      return NextResponse.json(
        { error: 'Invalid activity ID' },
        { status: 400 }
      )
    }

    // Verify activity exists
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
    })

    if (!activity) {
      return NextResponse.json(
        { error: 'Activity not found' },
        { status: 404 }
      )
    }

    // Generate and store new analysis
    await generateAndStoreAnalysis(activityId)

    // Fetch and return the new analysis
    const analysis = await prisma.runAnalysis.findUnique({
      where: { activityId },
    })

    return NextResponse.json(analysis, { status: 201 })
  } catch (error) {
    console.error('Error generating analysis:', error)
    return NextResponse.json(
      { error: 'Failed to generate analysis' },
      { status: 500 }
    )
  }
}
