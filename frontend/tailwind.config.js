/** @type {import('tailwindcss').Config} */

import plugin from 'tailwindcss/plugin'
import { generateVariantStyle } from './src/utils'

/* Converts HEX color to RGB */
// const toRGB = (value) => parseColor(value).color.join(' ')

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Colores inspirados en Tabasco
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          dark: '#f87171', // Rojo más brillante para modo oscuro
          green: '#00A750',
          yellow: '#FFD100',
          red: '#E63946',
          orange: '#F4A261',
          lime: '#A3E635',
          emerald: '#10B981',
          teal: '#14B8A6',
          cyan: '#06B6D4',
          sky: '#38BDF8',
          blue: '#3B82F6',
          purple: '#A855F7',
          pink: '#EC4899',
          rose: '#F43F5E',
          fuchsia: '#D946EF',
          amber: '#EAB308',
          stone: '#E5E7EB',
          slate: '#64748B',
        },
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          dark: '#4ade80', // Verde más brillante para modo oscuro
        },
        'accent-purple': '#6B46C1', // Purple
        'card-dark': '#2D3748', // Darker Blue/Gray
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents, theme }) {
      addComponents(generateVariantStyle(theme))
    }),
  ],
}
