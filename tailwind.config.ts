import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Obsidian palette
        obsidian: {
          void: 'hsl(var(--obsidian-void))',
          deep: 'hsl(var(--obsidian-deep))',
          base: 'hsl(var(--obsidian-base))',
          elevated: 'hsl(var(--obsidian-elevated))',
          surface: 'hsl(var(--obsidian-surface))',
          border: 'hsl(var(--obsidian-border))',
        },
        // Luminous accents
        violet: {
          DEFAULT: 'hsl(var(--violet-glow))',
          glow: 'hsl(var(--violet-glow))',
        },
        cyan: {
          DEFAULT: 'hsl(var(--cyan-glow))',
          glow: 'hsl(var(--cyan-glow))',
        },
        emerald: {
          DEFAULT: 'hsl(var(--emerald-glow))',
          glow: 'hsl(var(--emerald-glow))',
        },
        amber: {
          DEFAULT: 'hsl(var(--amber-glow))',
          glow: 'hsl(var(--amber-glow))',
        },
        rose: {
          DEFAULT: 'hsl(var(--rose-glow))',
          glow: 'hsl(var(--rose-glow))',
        },
        // Lead score colors
        hot: {
          DEFAULT: 'hsl(var(--rose-glow))',
          light: 'hsl(var(--rose-glow) / 0.15)',
        },
        warm: {
          DEFAULT: 'hsl(var(--amber-glow))',
          light: 'hsl(var(--amber-glow) / 0.15)',
        },
        cold: {
          DEFAULT: 'hsl(var(--cyan-glow))',
          light: 'hsl(var(--cyan-glow) / 0.15)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius) + 4px)',
        '2xl': 'calc(var(--radius) + 8px)',
      },
      fontFamily: {
        sans: ['Geist', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Satoshi', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px',
        'glow-md': '0 0 30px -5px',
        'glow-lg': '0 0 50px -8px',
        'glow-xl': '0 0 80px -12px',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        'elevated': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh': 'radial-gradient(ellipse 80% 50% at 20% -10%, hsl(var(--violet-glow) / 0.15), transparent), radial-gradient(ellipse 60% 40% at 80% 110%, hsl(var(--cyan-glow) / 0.12), transparent)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px -5px hsl(var(--violet-glow) / 0.3)' },
          '50%': { boxShadow: '0 0 40px -5px hsl(var(--violet-glow) / 0.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          from: { opacity: '0', transform: 'translateY(-20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-left': {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-right': {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'border-beam': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 1.5s ease-in-out infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-down': 'slide-down 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-left': 'slide-left 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-right': 'slide-right 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in': 'scale-in 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'spin-slow': 'spin-slow 8s linear infinite',
        'border-beam': 'border-beam 3s linear infinite',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
