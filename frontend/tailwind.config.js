/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Google Analytics 4 palette ────────────────────
        blue: {
          50:  '#E8F0FE',
          100: '#C5D9FB',
          200: '#9DBFF9',
          300: '#6FA4F5',
          400: '#4D8EF1',
          DEFAULT: '#1A73E8',
          500: '#1A73E8',
          600: '#1558B0',
          700: '#0D3E7A',
        },
        ink: {
          DEFAULT: '#202124',
          50:  '#F8F9FA',
          100: '#F1F3F4',
          200: '#DADCE0',
          300: '#BDC1C6',
          400: '#9AA0A6',
          500: '#80868B',
          600: '#5F6368',
          700: '#3C4043',
          800: '#303134',
          900: '#202124',
          950: '#0D0D0D',
        },
        success: { DEFAULT: '#1E8E3E', light: '#E6F4EA' },
        danger:  { DEFAULT: '#D93025', light: '#FCE8E6' },
        warn:    { DEFAULT: '#E37400', light: '#FEF7E0' },
      },
      fontFamily: { sans: ['Google Sans', 'Inter', 'system-ui', 'sans-serif'] },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },
      boxShadow: {
        'card':    '0 1px 2px 0 rgba(60,64,67,0.1), 0 1px 3px 1px rgba(60,64,67,0.06)',
        'card-md': '0 1px 3px 0 rgba(60,64,67,0.15), 0 4px 8px 3px rgba(60,64,67,0.08)',
        'card-lg': '0 2px 6px 2px rgba(60,64,67,0.15), 0 6px 20px 4px rgba(60,64,67,0.08)',
        'blue':    '0 1px 3px rgba(26,115,232,0.4)',
      },
      borderRadius: {
        DEFAULT: '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
      },
    },
  },
  plugins: [],
}
