'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Settings {
  id: number
  raceDate: string
  raceName?: string
  weeklyGoal: number
}

export default function SettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [raceDate, setRaceDate] = useState('')
  const [raceName, setRaceName] = useState('')
  const [weeklyGoal, setWeeklyGoal] = useState(4)

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      if (data.settings) {
        setSettings(data.settings)
        setRaceDate(new Date(data.settings.raceDate).toISOString().split('T')[0])
        setRaceName(data.settings.raceName || '')
        setWeeklyGoal(data.settings.weeklyGoal)
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          raceDate,
          raceName: raceName || null,
          weeklyGoal,
        }),
      })

      if (!res.ok) throw new Error('Failed to save settings')

      setMessage({ type: 'success', text: 'Settings saved successfully!' })

      if (!settings) {
        // First time setup, redirect to dashboard
        setTimeout(() => router.push('/'), 1500)
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  async function handleResetPlan() {
    if (!confirm('Are you sure you want to reset your training plan? This will clear all progress.')) {
      return
    }

    try {
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' }),
      })

      if (!res.ok) throw new Error('Failed to reset plan')

      setMessage({ type: 'success', text: 'Training plan has been reset.' })
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to reset plan. Please try again.' })
    }
  }

  async function handleClearAll() {
    if (!confirm('Are you sure you want to clear ALL data? This will delete your activity history and training plan. This cannot be undone.')) {
      return
    }

    try {
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clearAll' }),
      })

      if (!res.ok) throw new Error('Failed to clear data')

      setMessage({ type: 'success', text: 'All data has been cleared.' })
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to clear data. Please try again.' })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    )
  }

  // Calculate minimum date (at least 4 weeks from now)
  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 28)
  const minDateStr = minDate.toISOString().split('T')[0]

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Race Details</h2>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="raceDate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Race Date *
              </label>
              <input
                type="date"
                id="raceDate"
                value={raceDate}
                onChange={(e) => setRaceDate(e.target.value)}
                min={minDateStr}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Your half-marathon race date (minimum 4 weeks away)
              </p>
            </div>

            <div>
              <label
                htmlFor="raceName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Race Name
              </label>
              <input
                type="text"
                id="raceName"
                value={raceName}
                onChange={(e) => setRaceName(e.target.value)}
                placeholder="e.g., Berlin Half Marathon"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Training Preferences
          </h2>

          <div>
            <label
              htmlFor="weeklyGoal"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Target Runs Per Week
            </label>
            <select
              id="weeklyGoal"
              value={weeklyGoal}
              onChange={(e) => setWeeklyGoal(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              <option value={3}>3 runs per week</option>
              <option value={4}>4 runs per week</option>
              <option value={5}>5 runs per week</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>

      {settings && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Danger Zone
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Reset your training plan to start fresh. Keeps your activity history.
              </p>
              <button
                onClick={handleResetPlan}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Reset Training Plan
              </button>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Clear everything including activity history. This cannot be undone.
              </p>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Clear All Data
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
        <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
          Zapier Webhook Setup
        </h2>
        <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
          To sync your Polar/Strava activities automatically:
        </p>
        <ol className="list-decimal list-inside text-sm text-blue-800 dark:text-blue-200 space-y-2">
          <li>Connect Polar Flow to Strava in your Polar Flow settings</li>
          <li>Create a new Zap in Zapier with trigger: &quot;Strava - New Activity&quot;</li>
          <li>Add a filter: Activity Type = &quot;Run&quot;</li>
          <li>Add action: &quot;Webhooks by Zapier - POST&quot;</li>
          <li>
            Set URL to:{' '}
            <code className="bg-blue-100 dark:bg-blue-800 px-1 py-0.5 rounded">
              https://your-app.vercel.app/api/webhook
            </code>
          </li>
          <li>Set Payload Type to JSON and map the Strava fields</li>
        </ol>
        <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-800 rounded-md">
          <p className="text-xs font-mono text-blue-900 dark:text-blue-100">
            Expected payload format:
            <br />
            {`{`}
            <br />
            &nbsp;&nbsp;&quot;activity_id&quot;: &quot;123&quot;,
            <br />
            &nbsp;&nbsp;&quot;type&quot;: &quot;Run&quot;,
            <br />
            &nbsp;&nbsp;&quot;name&quot;: &quot;Morning Run&quot;,
            <br />
            &nbsp;&nbsp;&quot;distance&quot;: 5200,
            <br />
            &nbsp;&nbsp;&quot;moving_time&quot;: 1800,
            <br />
            &nbsp;&nbsp;&quot;start_date&quot;: &quot;2024-01-15T07:30:00Z&quot;,
            <br />
            &nbsp;&nbsp;&quot;average_heartrate&quot;: 145,
            <br />
            &nbsp;&nbsp;&quot;max_heartrate&quot;: 165
            <br />
            {`}`}
          </p>
        </div>
      </div>
    </div>
  )
}
