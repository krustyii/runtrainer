import Anthropic from '@anthropic-ai/sdk'
import { prisma } from './db'

interface Activity {
  id: number
  stravaId: string
  type: string
  name: string
  distance: number
  duration: number
  avgHeartRate: number | null
  maxHeartRate: number | null
  avgPace: number | null
  calories: number | null
  date: Date
  perceivedEffort: number | null
}

interface PlannedWorkout {
  id: number
  weekNumber: number
  dayOfWeek: number
  type: string
  distance: number | null
  duration: number | null
  description: string
  completed: boolean
  activityId: number | null
}

interface RunAnalysisData {
  activityId: number
  summary: string
  insights: string
  paceAnalysis: string | null
  hrAnalysis: string | null
  comparison: string | null
  suggestions: string | null
}

interface AIAnalysisResponse {
  summary: string
  insights: string
  paceAnalysis: string | null
  hrAnalysis: string | null
  comparison: string | null
  suggestions: string | null
}

function formatPace(paceMinPerKm: number): string {
  const minutes = Math.floor(paceMinPerKm)
  const seconds = Math.round((paceMinPerKm - minutes) * 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`
  }
  return `${minutes}m ${secs}s`
}

function buildActivityContext(activity: Activity): string {
  const distanceKm = (activity.distance / 1000).toFixed(2)
  const pace = activity.avgPace ? formatPace(activity.avgPace) : 'N/A'
  const duration = formatDuration(activity.duration)

  return `
Activity: ${activity.name}
Date: ${activity.date.toISOString().split('T')[0]}
Type: ${activity.type}
Distance: ${distanceKm} km
Duration: ${duration}
Average Pace: ${pace} /km
Average Heart Rate: ${activity.avgHeartRate ? `${activity.avgHeartRate} bpm` : 'N/A'}
Max Heart Rate: ${activity.maxHeartRate ? `${activity.maxHeartRate} bpm` : 'N/A'}
Calories: ${activity.calories ?? 'N/A'}
Perceived Effort: ${activity.perceivedEffort ? `${activity.perceivedEffort}/10` : 'N/A'}
`.trim()
}

function buildPlannedWorkoutContext(workout: PlannedWorkout | null): string {
  if (!workout) {
    return 'No planned workout was linked to this activity.'
  }

  return `
Planned Workout:
- Type: ${workout.type}
- Description: ${workout.description}
- Target Distance: ${workout.distance ? `${workout.distance} km` : 'N/A'}
- Target Duration: ${workout.duration ? formatDuration(workout.duration * 60) : 'N/A'}
- Week Number: ${workout.weekNumber}
`.trim()
}

function buildRecentActivitiesContext(activities: Activity[]): string {
  if (activities.length === 0) {
    return 'No recent activities to compare with.'
  }

  const summaries = activities.map((a) => {
    const distanceKm = (a.distance / 1000).toFixed(2)
    const pace = a.avgPace ? formatPace(a.avgPace) : 'N/A'
    return `- ${a.date.toISOString().split('T')[0]}: ${a.name} - ${distanceKm}km at ${pace}/km, HR: ${a.avgHeartRate ?? 'N/A'} bpm`
  })

  return `Recent Activities (last ${activities.length}):\n${summaries.join('\n')}`
}

export async function generateRunAnalysis(
  activity: Activity,
  plannedWorkout: PlannedWorkout | null,
  recentActivities: Activity[]
): Promise<RunAnalysisData> {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    console.warn('ANTHROPIC_API_KEY not set, returning placeholder analysis')
    return {
      activityId: activity.id,
      summary: 'AI analysis is not available. Please configure ANTHROPIC_API_KEY.',
      insights: 'To enable AI-powered run analysis, add your Anthropic API key to the environment variables.',
      paceAnalysis: null,
      hrAnalysis: null,
      comparison: null,
      suggestions: null,
    }
  }

  const anthropic = new Anthropic({ apiKey })

  const activityContext = buildActivityContext(activity)
  const plannedContext = buildPlannedWorkoutContext(plannedWorkout)
  const recentContext = buildRecentActivitiesContext(recentActivities)

  const prompt = `You are an experienced running coach analyzing a completed run. Provide helpful, encouraging, and actionable feedback.

${activityContext}

${plannedContext}

${recentContext}

Based on this data, provide analysis in the following JSON format:
{
  "summary": "A brief 1-2 sentence summary of the run and overall assessment",
  "insights": "Detailed analysis of the run performance (2-4 sentences). Include observations about effort, execution, and notable patterns.",
  "paceAnalysis": "Analysis of pacing strategy if pace data is available, or null if no pace data",
  "hrAnalysis": "Heart rate zone analysis if HR data is available, or null if no HR data",
  "comparison": "Comparison to the planned workout if one was linked, or null if no planned workout",
  "suggestions": "1-2 specific, actionable suggestions for improvement or things to focus on next time"
}

Guidelines:
- Be encouraging but honest
- Focus on actionable insights
- Keep responses concise
- Use metric units (km, min/km)
- If data is missing, work with what's available
- Reference recent activities to identify trends when relevant

Respond with only valid JSON, no markdown code blocks or additional text.`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const textContent = response.content.find((block) => block.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from AI')
    }

    const analysisText = textContent.text.trim()
    const analysis: AIAnalysisResponse = JSON.parse(analysisText)

    return {
      activityId: activity.id,
      summary: analysis.summary,
      insights: analysis.insights,
      paceAnalysis: analysis.paceAnalysis,
      hrAnalysis: analysis.hrAnalysis,
      comparison: analysis.comparison,
      suggestions: analysis.suggestions,
    }
  } catch (error) {
    console.error('Error generating AI analysis:', error)
    return {
      activityId: activity.id,
      summary: 'Unable to generate AI analysis at this time.',
      insights: 'An error occurred while analyzing this run. Please try regenerating the analysis later.',
      paceAnalysis: null,
      hrAnalysis: null,
      comparison: null,
      suggestions: null,
    }
  }
}

export async function generateAndStoreAnalysis(activityId: number): Promise<void> {
  const activity = await prisma.activity.findUnique({
    where: { id: activityId },
  })

  if (!activity) {
    console.error(`Activity ${activityId} not found`)
    return
  }

  // Find linked planned workout
  const linkedWorkout = await prisma.plannedWorkout.findFirst({
    where: { activityId },
  })

  // Get recent activities (last 10, excluding current)
  const recentActivities = await prisma.activity.findMany({
    where: {
      type: 'Run',
      id: { not: activityId },
      date: { lt: activity.date },
    },
    orderBy: { date: 'desc' },
    take: 10,
  })

  const analysisData = await generateRunAnalysis(
    activity,
    linkedWorkout,
    recentActivities
  )

  // Upsert the analysis (create or update)
  await prisma.runAnalysis.upsert({
    where: { activityId },
    create: analysisData,
    update: {
      summary: analysisData.summary,
      insights: analysisData.insights,
      paceAnalysis: analysisData.paceAnalysis,
      hrAnalysis: analysisData.hrAnalysis,
      comparison: analysisData.comparison,
      suggestions: analysisData.suggestions,
    },
  })
}
