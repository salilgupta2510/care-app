/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F4C81',
          light: '#1E6BB8',
          dark: '#0A3560',
        },
        accent: {
          DEFAULT: '#00A8A8',
          light: '#00C9C9',
          dark: '#007878',
        },
        urgent: '#DC2626',
        appointment: '#2563EB',
        inquiry: '#7C3AED',
        surface: {
          DEFAULT: '#F8FAFC',
          dark: '#0F172A',
        },
        card: {
          DEFAULT: '#FFFFFF',
          dark: '#1E293B',
        },
        border: {
          DEFAULT: '#E2E8F0',
          dark: '#334155',
        },
        muted: {
          DEFAULT: '#64748B',
          dark: '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'System'],
        mono: ['JetBrainsMono', 'monospace'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};
