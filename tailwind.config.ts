import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* Kiln Semantic Surfaces & Inks */
        paper: 'var(--color-paper)',
        'paper-2': 'var(--color-paper-2)',
        'paper-3': 'var(--color-paper-3)',
        ink: 'var(--color-ink)',
        'ink-2': 'var(--color-ink-2)',
        muted: 'var(--color-muted)',
        rule: 'var(--color-rule)',
        'rule-strong': 'var(--color-rule-strong)',
        accent: 'var(--color-accent)',
        'accent-ink': 'var(--color-accent-ink)',
        focus: 'var(--color-focus)',

        /* Legacy Semantic Aliases Mapped to Kiln Tokens */
        canvas: 'var(--color-paper)',
        'canvas-subtle': 'var(--color-paper-2)',
        'canvas-card': 'var(--color-paper-2)',
        'canvas-elevated': 'var(--color-paper-3)',
        'surface-card': 'var(--color-paper-2)',
        'surface-elevated': 'var(--color-paper-3)',
        'surface-deep': 'var(--color-paper)',
        'surface-dark': 'var(--color-paper)',
        'surface-dark-card': 'var(--color-paper-2)',
        'ink-primary': 'var(--color-ink)',
        'ink-secondary': 'var(--color-ink-2)',
        'ink-muted': 'var(--color-muted)',
        'ink-faint': 'var(--color-muted)',
        'border-subtle': 'var(--color-rule)',
        'border-strong': 'var(--color-rule-strong)',
        'border-dark': 'var(--color-rule)',
        'border-dark-strong': 'var(--color-rule-strong)',
        hairline: 'var(--color-rule)',
        'hairline-strong': 'var(--color-rule-strong)',
        'divider-soft': 'var(--color-rule)',
        'accent-amber': 'var(--color-accent)',
        'accent-amber-hover': 'var(--color-accent-hover)',
        'accent-amber-glow': 'var(--accent-amber-glow)',
        'accent-amber-subtle': 'var(--accent-amber-subtle)',
        'accent-green': 'var(--color-success)',
        'accent-blue': 'var(--color-ink-2)',
        'accent-red': 'var(--color-error)',
        bg: 'var(--color-paper)',
      },
      fontFamily: {
        serif: ['"Boska"', 'var(--font-serif-fallback)', 'Georgia', 'serif'],
        heading: ['"Boska"', 'var(--font-serif-fallback)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['var(--font-sans)', 'Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'Geist Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        well: 'var(--radius-well)',
        card: 'var(--radius-card)',
        pill: 'var(--radius-pill)',
      },
    },
  },
  plugins: [],
};

export default config;
