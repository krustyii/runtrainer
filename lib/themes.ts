export interface Theme {
  name: string
  label: string
  description: string
  colors: {
    // Background colors
    bgPrimary: string
    bgSecondary: string
    bgCard: string
    bgCardHover: string
    // Text colors
    textPrimary: string
    textSecondary: string
    textMuted: string
    // Accent colors
    accent: string
    accentHover: string
    accentLight: string
    accentText: string
    // Border colors
    border: string
    borderLight: string
    // Workout type colors
    workoutEasy: string
    workoutEasyText: string
    workoutTempo: string
    workoutTempoText: string
    workoutLong: string
    workoutLongText: string
    workoutInterval: string
    workoutIntervalText: string
    workoutRest: string
    workoutRestText: string
    workoutRecovery: string
    workoutRecoveryText: string
    // Status colors
    success: string
    successLight: string
    warning: string
    danger: string
  }
}

export const themes: Record<string, Theme> = {
  default: {
    name: 'default',
    label: 'Classic Dark',
    description: 'Clean dark theme with indigo accents',
    colors: {
      bgPrimary: 'bg-gray-900',
      bgSecondary: 'bg-gray-800',
      bgCard: 'bg-gray-800',
      bgCardHover: 'hover:bg-gray-700',
      textPrimary: 'text-white',
      textSecondary: 'text-gray-300',
      textMuted: 'text-gray-400',
      accent: 'bg-indigo-600',
      accentHover: 'hover:bg-indigo-700',
      accentLight: 'bg-indigo-100 dark:bg-indigo-900',
      accentText: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-gray-700',
      borderLight: 'border-gray-600',
      workoutEasy: 'bg-green-900',
      workoutEasyText: 'text-green-200',
      workoutTempo: 'bg-orange-900',
      workoutTempoText: 'text-orange-200',
      workoutLong: 'bg-blue-900',
      workoutLongText: 'text-blue-200',
      workoutInterval: 'bg-red-900',
      workoutIntervalText: 'text-red-200',
      workoutRest: 'bg-gray-700',
      workoutRestText: 'text-gray-200',
      workoutRecovery: 'bg-purple-900',
      workoutRecoveryText: 'text-purple-200',
      success: 'text-green-400',
      successLight: 'bg-green-900',
      warning: 'text-yellow-400',
      danger: 'text-red-400',
    },
  },
  runner: {
    name: 'runner',
    label: 'Runner Orange',
    description: 'Energetic orange theme inspired by sunrise runs',
    colors: {
      bgPrimary: 'bg-slate-900',
      bgSecondary: 'bg-slate-800',
      bgCard: 'bg-slate-800/90',
      bgCardHover: 'hover:bg-slate-700',
      textPrimary: 'text-white',
      textSecondary: 'text-slate-300',
      textMuted: 'text-slate-400',
      accent: 'bg-orange-500',
      accentHover: 'hover:bg-orange-600',
      accentLight: 'bg-orange-500/20',
      accentText: 'text-orange-400',
      border: 'border-slate-700',
      borderLight: 'border-slate-600',
      workoutEasy: 'bg-emerald-500/20',
      workoutEasyText: 'text-emerald-300',
      workoutTempo: 'bg-orange-500/30',
      workoutTempoText: 'text-orange-300',
      workoutLong: 'bg-sky-500/20',
      workoutLongText: 'text-sky-300',
      workoutInterval: 'bg-rose-500/20',
      workoutIntervalText: 'text-rose-300',
      workoutRest: 'bg-slate-600/50',
      workoutRestText: 'text-slate-300',
      workoutRecovery: 'bg-violet-500/20',
      workoutRecoveryText: 'text-violet-300',
      success: 'text-emerald-400',
      successLight: 'bg-emerald-500/20',
      warning: 'text-amber-400',
      danger: 'text-rose-400',
    },
  },
  neon: {
    name: 'neon',
    label: 'Neon Sport',
    description: 'High-energy neon accents on dark background',
    colors: {
      bgPrimary: 'bg-zinc-950',
      bgSecondary: 'bg-zinc-900',
      bgCard: 'bg-zinc-900/80',
      bgCardHover: 'hover:bg-zinc-800',
      textPrimary: 'text-white',
      textSecondary: 'text-zinc-300',
      textMuted: 'text-zinc-500',
      accent: 'bg-lime-500',
      accentHover: 'hover:bg-lime-400',
      accentLight: 'bg-lime-500/20',
      accentText: 'text-lime-400',
      border: 'border-zinc-800',
      borderLight: 'border-zinc-700',
      workoutEasy: 'bg-lime-500/20',
      workoutEasyText: 'text-lime-300',
      workoutTempo: 'bg-yellow-500/20',
      workoutTempoText: 'text-yellow-300',
      workoutLong: 'bg-cyan-500/20',
      workoutLongText: 'text-cyan-300',
      workoutInterval: 'bg-pink-500/20',
      workoutIntervalText: 'text-pink-300',
      workoutRest: 'bg-zinc-700/50',
      workoutRestText: 'text-zinc-400',
      workoutRecovery: 'bg-purple-500/20',
      workoutRecoveryText: 'text-purple-300',
      success: 'text-lime-400',
      successLight: 'bg-lime-500/20',
      warning: 'text-yellow-400',
      danger: 'text-pink-400',
    },
  },
  ocean: {
    name: 'ocean',
    label: 'Ocean Blue',
    description: 'Calming blue tones for focused training',
    colors: {
      bgPrimary: 'bg-slate-950',
      bgSecondary: 'bg-slate-900',
      bgCard: 'bg-slate-800/70',
      bgCardHover: 'hover:bg-slate-700',
      textPrimary: 'text-white',
      textSecondary: 'text-slate-300',
      textMuted: 'text-slate-400',
      accent: 'bg-cyan-500',
      accentHover: 'hover:bg-cyan-400',
      accentLight: 'bg-cyan-500/20',
      accentText: 'text-cyan-400',
      border: 'border-slate-700',
      borderLight: 'border-slate-600',
      workoutEasy: 'bg-teal-500/20',
      workoutEasyText: 'text-teal-300',
      workoutTempo: 'bg-amber-500/20',
      workoutTempoText: 'text-amber-300',
      workoutLong: 'bg-blue-500/20',
      workoutLongText: 'text-blue-300',
      workoutInterval: 'bg-rose-500/20',
      workoutIntervalText: 'text-rose-300',
      workoutRest: 'bg-slate-600/50',
      workoutRestText: 'text-slate-300',
      workoutRecovery: 'bg-indigo-500/20',
      workoutRecoveryText: 'text-indigo-300',
      success: 'text-teal-400',
      successLight: 'bg-teal-500/20',
      warning: 'text-amber-400',
      danger: 'text-rose-400',
    },
  },
  forest: {
    name: 'forest',
    label: 'Trail Runner',
    description: 'Natural greens inspired by trail running',
    colors: {
      bgPrimary: 'bg-stone-950',
      bgSecondary: 'bg-stone-900',
      bgCard: 'bg-stone-800/80',
      bgCardHover: 'hover:bg-stone-700',
      textPrimary: 'text-stone-100',
      textSecondary: 'text-stone-300',
      textMuted: 'text-stone-400',
      accent: 'bg-emerald-600',
      accentHover: 'hover:bg-emerald-500',
      accentLight: 'bg-emerald-500/20',
      accentText: 'text-emerald-400',
      border: 'border-stone-700',
      borderLight: 'border-stone-600',
      workoutEasy: 'bg-green-600/20',
      workoutEasyText: 'text-green-300',
      workoutTempo: 'bg-amber-600/20',
      workoutTempoText: 'text-amber-300',
      workoutLong: 'bg-teal-600/20',
      workoutLongText: 'text-teal-300',
      workoutInterval: 'bg-red-600/20',
      workoutIntervalText: 'text-red-300',
      workoutRest: 'bg-stone-600/50',
      workoutRestText: 'text-stone-300',
      workoutRecovery: 'bg-lime-600/20',
      workoutRecoveryText: 'text-lime-300',
      success: 'text-green-400',
      successLight: 'bg-green-600/20',
      warning: 'text-amber-400',
      danger: 'text-red-400',
    },
  },
}

export function getTheme(themeName: string): Theme {
  return themes[themeName] || themes.default
}

export function getWorkoutTypeColors(theme: Theme, type: string): { bg: string; text: string } {
  switch (type) {
    case 'easy':
      return { bg: theme.colors.workoutEasy, text: theme.colors.workoutEasyText }
    case 'tempo':
      return { bg: theme.colors.workoutTempo, text: theme.colors.workoutTempoText }
    case 'long':
      return { bg: theme.colors.workoutLong, text: theme.colors.workoutLongText }
    case 'interval':
      return { bg: theme.colors.workoutInterval, text: theme.colors.workoutIntervalText }
    case 'rest':
      return { bg: theme.colors.workoutRest, text: theme.colors.workoutRestText }
    case 'recovery':
      return { bg: theme.colors.workoutRecovery, text: theme.colors.workoutRecoveryText }
    default:
      return { bg: theme.colors.workoutEasy, text: theme.colors.workoutEasyText }
  }
}
