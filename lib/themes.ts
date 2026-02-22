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
  playful: {
    name: 'playful',
    label: 'Run Trainer',
    description: 'Playful and colorful theme matching the Run Trainer logo',
    colors: {
      bgPrimary: 'bg-gradient-to-b from-sky-100 to-amber-50',
      bgSecondary: 'bg-white/80',
      bgCard: 'bg-white',
      bgCardHover: 'hover:bg-sky-50',
      textPrimary: 'text-slate-800',
      textSecondary: 'text-slate-700',
      textMuted: 'text-slate-500',
      accent: 'bg-sky-500',
      accentHover: 'hover:bg-sky-600',
      accentLight: 'bg-sky-100',
      accentText: 'text-sky-600',
      border: 'border-sky-200',
      borderLight: 'border-sky-100',
      workoutEasy: 'bg-emerald-500',
      workoutEasyText: 'text-white',
      workoutTempo: 'bg-amber-500',
      workoutTempoText: 'text-white',
      workoutLong: 'bg-sky-500',
      workoutLongText: 'text-white',
      workoutInterval: 'bg-rose-500',
      workoutIntervalText: 'text-white',
      workoutRest: 'bg-slate-300',
      workoutRestText: 'text-slate-700',
      workoutRecovery: 'bg-violet-500',
      workoutRecoveryText: 'text-white',
      success: 'text-emerald-600',
      successLight: 'bg-emerald-100',
      warning: 'text-amber-600',
      danger: 'text-rose-600',
    },
  },
  default: {
    name: 'default',
    label: 'Classic Dark',
    description: 'Clean dark theme with indigo accents',
    colors: {
      bgPrimary: 'bg-slate-900',
      bgSecondary: 'bg-slate-800',
      bgCard: 'bg-slate-800',
      bgCardHover: 'hover:bg-slate-700',
      textPrimary: 'text-white',
      textSecondary: 'text-slate-200',
      textMuted: 'text-slate-300',
      accent: 'bg-indigo-600',
      accentHover: 'hover:bg-indigo-700',
      accentLight: 'bg-indigo-900',
      accentText: 'text-indigo-400',
      border: 'border-slate-600',
      borderLight: 'border-slate-500',
      workoutEasy: 'bg-green-600',
      workoutEasyText: 'text-white',
      workoutTempo: 'bg-orange-500',
      workoutTempoText: 'text-white',
      workoutLong: 'bg-blue-600',
      workoutLongText: 'text-white',
      workoutInterval: 'bg-red-600',
      workoutIntervalText: 'text-white',
      workoutRest: 'bg-slate-600',
      workoutRestText: 'text-slate-200',
      workoutRecovery: 'bg-purple-600',
      workoutRecoveryText: 'text-white',
      success: 'text-green-400',
      successLight: 'bg-green-900',
      warning: 'text-yellow-400',
      danger: 'text-red-400',
    },
  },
  light: {
    name: 'light',
    label: 'Clean Light',
    description: 'Bright and clean light theme',
    colors: {
      bgPrimary: 'bg-gray-50',
      bgSecondary: 'bg-white',
      bgCard: 'bg-white',
      bgCardHover: 'hover:bg-gray-100',
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-700',
      textMuted: 'text-gray-500',
      accent: 'bg-indigo-600',
      accentHover: 'hover:bg-indigo-700',
      accentLight: 'bg-indigo-100',
      accentText: 'text-indigo-600',
      border: 'border-gray-200',
      borderLight: 'border-gray-300',
      workoutEasy: 'bg-green-100',
      workoutEasyText: 'text-green-800',
      workoutTempo: 'bg-orange-100',
      workoutTempoText: 'text-orange-800',
      workoutLong: 'bg-blue-100',
      workoutLongText: 'text-blue-800',
      workoutInterval: 'bg-red-100',
      workoutIntervalText: 'text-red-800',
      workoutRest: 'bg-gray-100',
      workoutRestText: 'text-gray-700',
      workoutRecovery: 'bg-purple-100',
      workoutRecoveryText: 'text-purple-800',
      success: 'text-green-600',
      successLight: 'bg-green-100',
      warning: 'text-yellow-600',
      danger: 'text-red-600',
    },
  },
  runner: {
    name: 'runner',
    label: 'Runner Orange',
    description: 'Energetic orange theme inspired by sunrise runs',
    colors: {
      bgPrimary: 'bg-slate-900',
      bgSecondary: 'bg-slate-800',
      bgCard: 'bg-slate-800',
      bgCardHover: 'hover:bg-slate-700',
      textPrimary: 'text-white',
      textSecondary: 'text-slate-200',
      textMuted: 'text-slate-300',
      accent: 'bg-orange-500',
      accentHover: 'hover:bg-orange-600',
      accentLight: 'bg-orange-900',
      accentText: 'text-orange-400',
      border: 'border-slate-600',
      borderLight: 'border-slate-500',
      workoutEasy: 'bg-emerald-600',
      workoutEasyText: 'text-white',
      workoutTempo: 'bg-orange-500',
      workoutTempoText: 'text-white',
      workoutLong: 'bg-sky-600',
      workoutLongText: 'text-white',
      workoutInterval: 'bg-rose-600',
      workoutIntervalText: 'text-white',
      workoutRest: 'bg-slate-600',
      workoutRestText: 'text-slate-200',
      workoutRecovery: 'bg-violet-600',
      workoutRecoveryText: 'text-white',
      success: 'text-emerald-400',
      successLight: 'bg-emerald-900',
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
      bgCard: 'bg-zinc-900',
      bgCardHover: 'hover:bg-zinc-800',
      textPrimary: 'text-white',
      textSecondary: 'text-zinc-200',
      textMuted: 'text-zinc-300',
      accent: 'bg-lime-500',
      accentHover: 'hover:bg-lime-400',
      accentLight: 'bg-lime-900',
      accentText: 'text-lime-400',
      border: 'border-zinc-700',
      borderLight: 'border-zinc-600',
      workoutEasy: 'bg-lime-500',
      workoutEasyText: 'text-black',
      workoutTempo: 'bg-yellow-500',
      workoutTempoText: 'text-black',
      workoutLong: 'bg-cyan-500',
      workoutLongText: 'text-black',
      workoutInterval: 'bg-pink-500',
      workoutIntervalText: 'text-white',
      workoutRest: 'bg-zinc-700',
      workoutRestText: 'text-zinc-200',
      workoutRecovery: 'bg-purple-500',
      workoutRecoveryText: 'text-white',
      success: 'text-lime-400',
      successLight: 'bg-lime-900',
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
      bgCard: 'bg-slate-800',
      bgCardHover: 'hover:bg-slate-700',
      textPrimary: 'text-white',
      textSecondary: 'text-slate-200',
      textMuted: 'text-slate-300',
      accent: 'bg-cyan-500',
      accentHover: 'hover:bg-cyan-400',
      accentLight: 'bg-cyan-900',
      accentText: 'text-cyan-400',
      border: 'border-slate-600',
      borderLight: 'border-slate-500',
      workoutEasy: 'bg-teal-600',
      workoutEasyText: 'text-white',
      workoutTempo: 'bg-amber-500',
      workoutTempoText: 'text-white',
      workoutLong: 'bg-blue-600',
      workoutLongText: 'text-white',
      workoutInterval: 'bg-rose-600',
      workoutIntervalText: 'text-white',
      workoutRest: 'bg-slate-600',
      workoutRestText: 'text-slate-200',
      workoutRecovery: 'bg-indigo-600',
      workoutRecoveryText: 'text-white',
      success: 'text-teal-400',
      successLight: 'bg-teal-900',
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
      bgCard: 'bg-stone-800',
      bgCardHover: 'hover:bg-stone-700',
      textPrimary: 'text-stone-100',
      textSecondary: 'text-stone-200',
      textMuted: 'text-stone-300',
      accent: 'bg-emerald-600',
      accentHover: 'hover:bg-emerald-500',
      accentLight: 'bg-emerald-900',
      accentText: 'text-emerald-400',
      border: 'border-stone-600',
      borderLight: 'border-stone-500',
      workoutEasy: 'bg-green-600',
      workoutEasyText: 'text-white',
      workoutTempo: 'bg-amber-500',
      workoutTempoText: 'text-white',
      workoutLong: 'bg-teal-600',
      workoutLongText: 'text-white',
      workoutInterval: 'bg-red-600',
      workoutIntervalText: 'text-white',
      workoutRest: 'bg-stone-600',
      workoutRestText: 'text-stone-200',
      workoutRecovery: 'bg-lime-600',
      workoutRecoveryText: 'text-white',
      success: 'text-green-400',
      successLight: 'bg-green-900',
      warning: 'text-amber-400',
      danger: 'text-red-400',
    },
  },
}

export function getTheme(themeName: string): Theme {
  return themes[themeName] || themes.default
}

export function getWorkoutTypeColors(theme: Theme, type: string): { bg: string; text: string } {
  switch (type.toLowerCase()) {
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
