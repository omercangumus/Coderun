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
          DEFAULT: '#3D4AD8',
          container: '#5865F2',
          fixed: '#E0E0FF',
          'fixed-dim': '#BEC2FF',
          on: '#FFFFFF',
          'on-container': '#FFFFFF',
          inverse: '#BEC2FF',
        },
        // Secondary (Green — success/progress)
        secondary: {
          DEFAULT: '#006D37',
          container: '#6BFE9C',
          fixed: '#6BFE9C',
          'fixed-dim': '#4AE183',
          on: '#FFFFFF',
          'on-container': '#00743A',
        },
        // Tertiary (Purple — badges/achievements)
        tertiary: {
          DEFAULT: '#81419C',
          container: '#9C5AB7',
          fixed: '#F8D8FF',
          'fixed-dim': '#EBB2FF',
          on: '#FFFFFF',
          'on-container': '#FFFFFF',
        },
        // Surface
        background: '#F7FAFD',
        surface: {
          DEFAULT: '#F7FAFD',
          bright: '#F7FAFD',
          dim: '#D7DADE',
          'container-lowest': '#FFFFFF',
          'container-low': '#F1F4F8',
          container: '#EBEEF2',
          'container-high': '#E5E8EC',
          'container-highest': '#E0E3E7',
          variant: '#E0E3E7',
          tint: '#3F4CDA',
        },
        // On Surface
        'on-surface': {
          DEFAULT: '#181C1F',
          variant: '#454655',
        },
        'on-background': '#181C1F',
        outline: {
          DEFAULT: '#767686',
          variant: '#C6C5D7',
        },
        // Inverse
        'inverse-surface': '#2D3134',
        'inverse-on-surface': '#EEF1F5',
        // Error
        error: {
          DEFAULT: '#BA1A1A',
          container: '#FFDAD6',
          on: '#FFFFFF',
          'on-container': '#93000A',
        },
        // Gamification
        'xp-gold': '#FFD700',
        'streak-orange': '#FF6B35',
        'streak-fire': '#FF4500',
        'badge-purple': '#9C27B0',
        'diamond-blue': '#00B4D8',
        'gold-league': '#FFB300',
        // Node states
        'node-completed': '#4AE183',
        'node-active': '#5865F2',
        'node-locked': '#E0E3E7',
        'node-review': '#FF9800',
        'node-checkpoint': '#FFD700',
        'node-project': '#9C5AB7',
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
