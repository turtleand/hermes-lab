/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        panel: 'var(--panel)',
        'panel-soft': 'var(--panel-soft)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        'accent-2': 'var(--accent-2)',
        border: 'var(--border)',
        'border-strong': 'var(--border-strong)',
      },
      fontFamily: {
        sans: ['Inter var', 'IBM Plex Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        pill: '999px',
      },
      boxShadow: {
        glow: 'var(--glow)',
      },
    },
  },
  plugins: [],
};
