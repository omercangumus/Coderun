import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // === Coderun Stitch Design System ===
      colors: {
        // Primary (Blue)
        primary: {
          DEFAULT: 'var(--color-primary)',
          container: 'var(--color-primary-container)',
          fixed: 'var(--color-primary-fixed)',
          'fixed-dim': 'var(--color-primary-fixed-dim)',
          on: 'var(--color-on-primary)',
          'on-container': 'var(--color-on-primary-container)',
          inverse: 'var(--color-inverse-primary)',
        },
        // Secondary (Green — success/progress)
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          container: 'var(--color-secondary-container)',
          fixed: 'var(--color-secondary-fixed)',
          'fixed-dim': 'var(--color-secondary-fixed-dim)',
          on: 'var(--color-on-secondary)',
          'on-container': 'var(--color-on-secondary-container)',
        },
        // Tertiary (Purple — badges/achievements)
        tertiary: {
          DEFAULT: 'var(--color-tertiary)',
          container: 'var(--color-tertiary-container)',
          fixed: 'var(--color-tertiary-fixed)',
          'fixed-dim': 'var(--color-tertiary-fixed-dim)',
          on: 'var(--color-on-tertiary)',
          'on-container': 'var(--color-on-tertiary-container)',
        },
        // Surface
        background: 'var(--color-background)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          bright: 'var(--color-surface-bright)',
          dim: 'var(--color-surface-dim)',
          'container-lowest': 'var(--color-surface-lowest)',
          'container-low': 'var(--color-surface-low)',
          container: 'var(--color-surface-container)',
          'container-high': 'var(--color-surface-high)',
          'container-highest': 'var(--color-surface-highest)',
          variant: 'var(--color-surface-variant)',
          tint: 'var(--color-surface-tint)',
        },
        // On Surface
        'on-surface': {
          DEFAULT: 'var(--color-on-surface)',
          variant: 'var(--color-on-surface-variant)',
        },
        'on-background': 'var(--color-on-background)',
        outline: {
          DEFAULT: 'var(--color-outline)',
          variant: 'var(--color-outline-variant)',
        },
        // Inverse
        'inverse-surface': 'var(--color-inverse-surface)',
        'inverse-on-surface': 'var(--color-inverse-on-surface)',
        // Error
        error: {
          DEFAULT: 'var(--color-error)',
          container: 'var(--color-error-container)',
          on: 'var(--color-on-error)',
          'on-container': 'var(--color-on-error-container)',
        },
        // Gamification
        'xp-gold': 'var(--color-xp-gold)',
        'streak-orange': 'var(--color-streak-orange)',
        'streak-fire': 'var(--color-streak-fire)',
        'badge-purple': 'var(--color-badge-purple)',
        'diamond-blue': 'var(--color-diamond-blue)',
        'gold-league': 'var(--color-gold-league)',
        // Legacy alias — maps to primary for backward compatibility
        accent: 'var(--color-primary)',
        // Node states
        'node-completed': 'var(--color-node-completed)',
        'node-active': 'var(--color-node-active)',
        'node-locked': 'var(--color-node-locked)',
        'node-review': 'var(--color-node-review)',
        'node-checkpoint': 'var(--color-node-checkpoint)',
        'node-project': 'var(--color-node-project)',
      },
      fontFamily: {
        sans: ['Lexend', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        label: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      fontSize: {
        'h1': ['40px', { lineHeight: '1.2', fontWeight: '800' }],
        'h2': ['32px', { lineHeight: '1.3', fontWeight: '700' }],
        'h3': ['24px', { lineHeight: '1.3', fontWeight: '700' }],
        'h4': ['20px', { lineHeight: '1.4', fontWeight: '700' }],
        'body-lg': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'label-caps': ['14px', { lineHeight: '1.0', letterSpacing: '0.05em', fontWeight: '600' }],
        'label-sm': ['12px', { lineHeight: '1.0', letterSpacing: '0.04em', fontWeight: '600' }],
        'button': ['16px', { lineHeight: '1.0', fontWeight: '600' }],
        'button-sm': ['14px', { lineHeight: '1.0', fontWeight: '600' }],
      },
      spacing: {
        'unit': '8px',
        'stack-sm': '12px',
        'stack-md': '24px',
        'stack-lg': '48px',
        'gutter': '24px',
        'margin-page': '32px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '32px',
        'full': '9999px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(24, 28, 31, 0.04)',
        'card-hover': '0 4px 16px rgba(24, 28, 31, 0.08)',
        'primary': '0 4px 12px rgba(61, 74, 216, 0.2)',
        'primary-lg': '0 8px 24px rgba(61, 74, 216, 0.25)',
        'success': '0 4px 12px rgba(74, 225, 131, 0.3)',
        'glow': '0 0 20px rgba(61, 74, 216, 0.3)',
      },
      // Sidebar width
      width: {
        'sidebar': '240px',
        'sidebar-collapsed': '64px',
        'mentor-panel': '320px',
      },
      // Animation
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(61, 74, 216, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(61, 74, 216, 0.6)' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '60%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-4px)' },
          '40%, 80%': { transform: 'translateX(4px)' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'bounce-in': 'bounce-in 0.4s ease-out',
        'shake': 'shake 0.4s ease-in-out',
        'shimmer': 'shimmer 1.5s infinite',
      },
    },
  },
  plugins: [],
};

export default config;
