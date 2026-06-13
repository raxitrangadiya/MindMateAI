/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#6C63FF', light: '#8B83FF', dark: '#5A52E0' },
        secondary: { DEFAULT: '#00D9FF', light: '#33E1FF', dark: '#00B8D9' },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        dark: { DEFAULT: '#0F0F1A', lighter: '#1A1A2E', card: '#16162A' },
        surface: 'rgba(255,255,255,0.05)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(108,99,255,0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(108,99,255,0.6)' },
        },
      },
    },
  },
  plugins: [],
};
