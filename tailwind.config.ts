import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--canvas)',
        'canvas-subtle': 'var(--canvas-subtle)',
        'canvas-card': 'var(--canvas-card)',
        'canvas-elevated': 'var(--canvas-elevated)',
        'surface-card': 'var(--canvas-card)',
        'surface-elevated': 'var(--canvas-elevated)',
        'surface-deep': 'var(--surface-deep)',
        'surface-dark': 'var(--surface-dark)',
        'surface-dark-card': 'var(--surface-dark-card)',
        'ink-primary': 'var(--ink-primary)',
        'ink-secondary': 'var(--ink-secondary)',
        'ink-muted': 'var(--ink-muted)',
        'ink-faint': 'var(--ink-faint)',
        'border-subtle': 'var(--border-subtle)',
        'border-strong': 'var(--border-strong)',
        'border-dark': 'var(--border-dark)',
        'border-dark-strong': 'var(--border-dark-strong)',
        hairline: 'var(--border-subtle)',
        'hairline-strong': 'var(--border-strong)',
        'divider-soft': 'var(--divider-soft)',
        'accent-amber': 'var(--accent-amber)',
        'accent-amber-hover': 'var(--accent-amber-hover)',
        'accent-amber-glow': 'var(--accent-amber-glow)',
        'accent-amber-subtle': 'var(--accent-amber-subtle)',
        'accent-green': 'var(--accent-green)',
        'accent-blue': 'var(--accent-blue)',
        'accent-red': 'var(--accent-red)',
        // Legacy aliases
        ink: 'var(--ink-primary)',
        muted: 'var(--ink-muted)',
        bg: 'var(--canvas)',
        accent: 'var(--accent-amber)',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Cormorant Garamond', 'Georgia', 'serif'],
        heading: ['var(--font-serif)', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        body: ['var(--font-sans)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'Geist Mono', 'monospace'],
      },
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        pill: 'var(--radius-pill)',
      },
      animation: {
        'border-beam': 'border-beam calc(var(--duration)*1s) infinite linear',
      },
      keyframes: {
        'border-beam': {
          '100%': {
            offsetDistance: '100%',
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
