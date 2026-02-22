'use client'

import { useTheme } from './ThemeProvider'
import ProgressRing from './ProgressRing'

interface WeeklyData {
  week: number
  plannedDistance: number
  actualDistance: number
  completionRate: number
}

interface StatsAndAchievementsProps {
  currentWeek: number
  totalWeeks: number
  weeklyData: WeeklyData[]
  totalDistanceCompleted: number
  totalDistancePlanned: number
  streak: number
}

interface Badge {
  id: string
  name: string
  emoji: string
  description: string
  unlocked: boolean
}

export default function StatsAndAchievements({
  currentWeek,
  totalWeeks,
  weeklyData,
  totalDistanceCompleted,
  totalDistancePlanned,
  streak,
}: StatsAndAchievementsProps) {
  const { theme } = useTheme()

  // Calculate current week stats
  const currentWeekData = weeklyData.find(w => w.week === currentWeek)
  const weekProgress = currentWeekData ? Math.round(currentWeekData.completionRate * 100) : 0
  const trainingProgress = Math.round((currentWeek / totalWeeks) * 100)
  const distanceProgress = totalDistancePlanned > 0
    ? Math.round((totalDistanceCompleted / totalDistancePlanned) * 100)
    : 0

  // Define badges
  const badges: Badge[] = [
    {
      id: 'first-run',
      name: 'First Steps',
      emoji: '👟',
      description: 'Complete your first workout',
      unlocked: totalDistanceCompleted > 0,
    },
    {
      id: 'week-complete',
      name: 'Week Warrior',
      emoji: '🏆',
      description: 'Complete all workouts in a week',
      unlocked: weeklyData.some(w => w.completionRate >= 1),
    },
    {
      id: 'streak-3',
      name: 'On Fire',
      emoji: '🔥',
      description: '3 day workout streak',
      unlocked: streak >= 3,
    },
    {
      id: 'streak-7',
      name: 'Unstoppable',
      emoji: '⚡',
      description: '7 day workout streak',
      unlocked: streak >= 7,
    },
    {
      id: '10k',
      name: '10K Club',
      emoji: '🎯',
      description: 'Run 10km total',
      unlocked: totalDistanceCompleted >= 10,
    },
    {
      id: '50k',
      name: 'Distance Runner',
      emoji: '🌟',
      description: 'Run 50km total',
      unlocked: totalDistanceCompleted >= 50,
    },
    {
      id: '100k',
      name: 'Century',
      emoji: '💯',
      description: 'Run 100km total',
      unlocked: totalDistanceCompleted >= 100,
    },
    {
      id: 'halfway',
      name: 'Halfway There',
      emoji: '🎉',
      description: 'Complete 50% of training',
      unlocked: trainingProgress >= 50,
    },
  ]

  const unlockedBadges = badges.filter(b => b.unlocked)
  const nextBadge = badges.find(b => !b.unlocked)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Progress Rings */}
      <div className={`${theme.colors.bgCard} rounded-2xl border ${theme.colors.border} p-6 shadow-sm`}>
        <h3 className={`text-lg font-bold ${theme.colors.textPrimary} mb-6`}>Your Progress</h3>
        <div className="flex justify-around items-start">
          <ProgressRing
            progress={weekProgress}
            label="This Week"
            value={`${weekProgress}%`}
            color="#0ea5e9"
          />
          <ProgressRing
            progress={trainingProgress}
            label="Training Plan"
            value={`${currentWeek}/${totalWeeks}`}
            color="#f59e0b"
          />
          <ProgressRing
            progress={Math.min(distanceProgress, 100)}
            label="Distance"
            value={`${totalDistanceCompleted.toFixed(0)}km`}
            color="#10b981"
          />
        </div>
      </div>

      {/* Achievements */}
      <div className={`${theme.colors.bgCard} rounded-2xl border ${theme.colors.border} p-6 shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-bold ${theme.colors.textPrimary}`}>Achievements</h3>
          <span className={`text-sm ${theme.colors.textMuted}`}>
            {unlockedBadges.length}/{badges.length} unlocked
          </span>
        </div>

        {/* Unlocked badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {unlockedBadges.map((badge) => (
            <div
              key={badge.id}
              className="group relative"
              title={badge.description}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-2xl shadow-sm hover:scale-110 transition-transform cursor-pointer">
                {badge.emoji}
              </div>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                <p className="font-semibold">{badge.name}</p>
                <p className="text-slate-300">{badge.description}</p>
              </div>
            </div>
          ))}

          {/* Locked badge placeholders */}
          {badges.filter(b => !b.unlocked).slice(0, 4).map((badge) => (
            <div
              key={badge.id}
              className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl opacity-30"
              title={`${badge.name}: ${badge.description}`}
            >
              {badge.emoji}
            </div>
          ))}
        </div>

        {/* Next badge to unlock */}
        {nextBadge && (
          <div className={`p-3 rounded-xl bg-gradient-to-r from-sky-50 to-amber-50 border border-sky-100`}>
            <p className="text-xs font-medium text-sky-600 mb-1">Next achievement</p>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{nextBadge.emoji}</span>
              <div>
                <p className={`font-semibold ${theme.colors.textPrimary}`}>{nextBadge.name}</p>
                <p className={`text-sm ${theme.colors.textMuted}`}>{nextBadge.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
