'use client'

import Image from 'next/image'
import { useTheme } from './ThemeProvider'

interface HeroSectionProps {
  raceName?: string
  daysUntilRace: number
  nextWorkout?: {
    type: string
    distance?: number | null
    description: string
  } | null
  streak: number
  completedThisWeek: number
  totalThisWeek: number
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function getMotivationalMessage(streak: number, completedThisWeek: number, totalThisWeek: number): string {
  if (completedThisWeek === totalThisWeek && totalThisWeek > 0) {
    return "Amazing! You've crushed all workouts this week!"
  }
  if (streak >= 7) {
    return `${streak} day streak! You're on fire!`
  }
  if (streak >= 3) {
    return "Great consistency! Keep it up!"
  }
  if (completedThisWeek > 0) {
    return "You're making progress. Let's keep going!"
  }
  return "Ready to start your training journey?"
}

export default function HeroSection({
  raceName,
  daysUntilRace,
  nextWorkout,
  streak,
  completedThisWeek,
  totalThisWeek,
}: HeroSectionProps) {
  const { theme } = useTheme()
  const greeting = getGreeting()
  const motivation = getMotivationalMessage(streak, completedThisWeek, totalThisWeek)

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 p-6 md:p-8 text-white shadow-xl">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative flex items-center gap-6">
        {/* Mascot */}
        <div className="hidden md:block flex-shrink-0">
          <div className="w-32 h-32 relative">
            <Image
              src="/logo.png"
              alt="Run Trainer Mascot"
              width={128}
              height={128}
              className="drop-shadow-lg"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <p className="text-sky-100 text-sm font-medium mb-1">{greeting}!</p>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {nextWorkout ? (
              <>
                Today&apos;s workout:{' '}
                <span className="text-amber-300 capitalize">{nextWorkout.type} Run</span>
                {nextWorkout.distance && (
                  <span className="text-amber-300"> ({nextWorkout.distance} km)</span>
                )}
              </>
            ) : (
              'Rest day - recover well!'
            )}
          </h1>
          <p className="text-sky-100 mb-4">{motivation}</p>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-2xl">🔥</span>
              <div>
                <p className="text-xs text-sky-100">Streak</p>
                <p className="font-bold">{streak} days</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-2xl">🏅</span>
              <div>
                <p className="text-xs text-sky-100">Race Day</p>
                <p className="font-bold">{daysUntilRace} days</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-2xl">🎯</span>
              <div>
                <p className="text-xs text-sky-100">{raceName || 'Half Marathon'}</p>
                <p className="font-bold">21.1 km</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
