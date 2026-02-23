/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Workout type background colors from all themes
    'bg-emerald-500', 'bg-emerald-600', 'bg-emerald-100',
    'bg-amber-500', 'bg-amber-100',
    'bg-sky-500', 'bg-sky-600', 'bg-sky-100',
    'bg-rose-500', 'bg-rose-600', 'bg-rose-100',
    'bg-slate-300', 'bg-slate-600',
    'bg-violet-500', 'bg-violet-600', 'bg-violet-100',
    'bg-green-600', 'bg-green-100',
    'bg-orange-500', 'bg-orange-100',
    'bg-blue-600', 'bg-blue-100',
    'bg-red-600', 'bg-red-100',
    'bg-purple-600', 'bg-purple-500', 'bg-purple-100',
    'bg-lime-500', 'bg-lime-600',
    'bg-yellow-500',
    'bg-cyan-500',
    'bg-pink-500',
    'bg-zinc-700',
    'bg-teal-600',
    'bg-indigo-600',
    // Workout type text colors
    'text-white', 'text-black',
    'text-slate-700', 'text-slate-200',
    'text-green-800', 'text-orange-800', 'text-blue-800',
    'text-red-800', 'text-purple-800', 'text-gray-700',
    'text-zinc-200',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
