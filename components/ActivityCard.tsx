'use client'

import { useState } from 'react'
import { useTheme } from './ThemeProvider'

interface RunAnalysis {
  id: number
  activityId: number
  summary: string
  insights: string
  paceAnalysis: string | null
  hrAnalysis: string | null
  comparison: string | null
  suggestions: string | null
  createdAt: string
}

interface Activity {
  id: number
  stravaId: string
  type: string
  name: string
  distance: number
  duration: number
  avgHeartRate?: number | null
  maxHeartRate?: number | null
  avgPace?: number | null
  calories?: number | null
  date: Date | string
}

interface ActivityCardProps {
  activity: Activity
  analysis?: RunAnalysis | null
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
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

export default function ActivityCard({ activity, analysis }: ActivityCardProps) {
  const { theme } = useTheme()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [localAnalysis, setLocalAnalysis] = useState<RunAnalysis | null>(analysis ?? null)
  const date = new Date(activity.date)
  const distanceKm = activity.distance / 1000

  async function handleRegenerate() {
    setIsRegenerating(true)
    try {
      const res = await fetch(`/api/activities/${activity.id}/analysis`, {
        method: 'POST',
      })
      if (res.ok) {
        const newAnalysis = await res.json()
        setLocalAnalysis(newAnalysis)
      }
    } catch (error) {
      console.error('Failed to regenerate analysis:', error)
    } finally {
      setIsRegenerating(false)
    }
  }

  return (
    <div className={`${theme.colors.bgCard} rounded-lg border ${theme.colors.border} p-4`}>
      <div className="flex items-start justify-between">
        <div>
          <h4 className={`font-medium ${theme.colors.textPrimary}`}>{activity.name}</h4>
          <p className={`text-sm ${theme.colors.textMuted}`}>
            {date.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
        <span className={`px-2 py-1 text-xs font-medium ${theme.colors.accentLight} ${theme.colors.accentText} rounded`}>
          {activity.type}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <p className={`text-xs ${theme.colors.textMuted} uppercase tracking-wide`}>Distance</p>
          <p className={`text-lg font-semibold ${theme.colors.textPrimary}`}>
            {distanceKm.toFixed(2)} km
          </p>
        </div>
        <div>
          <p className={`text-xs ${theme.colors.textMuted} uppercase tracking-wide`}>Duration</p>
          <p className={`text-lg font-semibold ${theme.colors.textPrimary}`}>
            {formatDuration(activity.duration)}
          </p>
        </div>
        {activity.avgPace && (
          <div>
            <p className={`text-xs ${theme.colors.textMuted} uppercase tracking-wide`}>Avg Pace</p>
            <p className={`text-lg font-semibold ${theme.colors.textPrimary}`}>
              {formatPace(activity.avgPace)} /km
            </p>
          </div>
        )}
        {activity.avgHeartRate && (
          <div>
            <p className={`text-xs ${theme.colors.textMuted} uppercase tracking-wide`}>Avg HR</p>
            <p className={`text-lg font-semibold ${theme.colors.textPrimary}`}>
              {activity.avgHeartRate} bpm
            </p>
          </div>
        )}
      </div>
      {activity.calories && (
        <div className={`mt-3 pt-3 border-t ${theme.colors.border}`}>
          <p className={`text-sm ${theme.colors.textMuted}`}>
            {activity.calories} calories burned
          </p>
        </div>
      )}

      {/* AI Analysis Section */}
      {activity.type === 'Run' && (
        <div className={`mt-4 pt-4 border-t ${theme.colors.border}`}>
          {localAnalysis ? (
            <>
              {/* Summary always visible */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className={`w-4 h-4 ${theme.colors.accentText}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span className={`text-sm font-medium ${theme.colors.accentText}`}>AI Analysis</span>
                  </div>
                  <p className={`text-sm ${theme.colors.textPrimary}`}>{localAnalysis.summary}</p>
                </div>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={`p-1 rounded ${theme.colors.textMuted} hover:${theme.colors.textPrimary} transition-colors`}
                  aria-label={isExpanded ? 'Collapse analysis' : 'Expand analysis'}
                >
                  <svg
                    className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Expandable detailed analysis */}
              {isExpanded && (
                <div className="mt-4 space-y-3">
                  {/* Insights */}
                  <div>
                    <h5 className={`text-xs font-medium ${theme.colors.textMuted} uppercase tracking-wide mb-1`}>
                      Insights
                    </h5>
                    <p className={`text-sm ${theme.colors.textPrimary}`}>{localAnalysis.insights}</p>
                  </div>

                  {/* Pace Analysis */}
                  {localAnalysis.paceAnalysis && (
                    <div>
                      <h5 className={`text-xs font-medium ${theme.colors.textMuted} uppercase tracking-wide mb-1`}>
                        Pacing
                      </h5>
                      <p className={`text-sm ${theme.colors.textPrimary}`}>{localAnalysis.paceAnalysis}</p>
                    </div>
                  )}

                  {/* HR Analysis */}
                  {localAnalysis.hrAnalysis && (
                    <div>
                      <h5 className={`text-xs font-medium ${theme.colors.textMuted} uppercase tracking-wide mb-1`}>
                        Heart Rate
                      </h5>
                      <p className={`text-sm ${theme.colors.textPrimary}`}>{localAnalysis.hrAnalysis}</p>
                    </div>
                  )}

                  {/* Comparison to planned */}
                  {localAnalysis.comparison && (
                    <div>
                      <h5 className={`text-xs font-medium ${theme.colors.textMuted} uppercase tracking-wide mb-1`}>
                        vs. Planned
                      </h5>
                      <p className={`text-sm ${theme.colors.textPrimary}`}>{localAnalysis.comparison}</p>
                    </div>
                  )}

                  {/* Suggestions */}
                  {localAnalysis.suggestions && (
                    <div className={`p-3 rounded-lg ${theme.colors.accentLight}`}>
                      <h5 className={`text-xs font-medium ${theme.colors.accentText} uppercase tracking-wide mb-1`}>
                        Suggestions
                      </h5>
                      <p className={`text-sm ${theme.colors.textPrimary}`}>{localAnalysis.suggestions}</p>
                    </div>
                  )}

                  {/* Regenerate button */}
                  <button
                    onClick={handleRegenerate}
                    disabled={isRegenerating}
                    className={`mt-2 px-3 py-1.5 text-xs font-medium rounded-md ${theme.colors.bgCard} border ${theme.colors.border} ${theme.colors.textMuted} hover:${theme.colors.textPrimary} disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                  >
                    {isRegenerating ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Regenerating...
                      </span>
                    ) : (
                      'Regenerate Analysis'
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-between">
              <p className={`text-sm ${theme.colors.textMuted}`}>No AI analysis available</p>
              <button
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className={`px-3 py-1.5 text-xs font-medium rounded-md ${theme.colors.accent} text-white ${theme.colors.accentHover} disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
              >
                {isRegenerating ? 'Generating...' : 'Generate Analysis'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
