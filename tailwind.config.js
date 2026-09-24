/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── YEF Brand Palette ─────────────────────────────────────────────
        yef: {
          red:          '#D0021B',
          'red-hover':  '#B00218',
          'red-dark':   '#8B0112',
          'red-light':  '#FDE8EB',
          'red-mid':    '#F5C6CC',
          navy:         '#1A2B6B',
          'navy-hover': '#111E4F',
          'navy-dark':  '#0C1535',
          'navy-light': '#E8ECF8',
          'navy-mid':   '#C5CCE8',
          neutral:      '#F5F6FA',
          muted:        '#6B7280',
        },
        // ── Keep 'brand' aliased to yef-red for component compatibility ───
        brand: {
          50:  '#FDE8EB',
          100: '#F5C6CC',
          200: '#EFA0AA',
          300: '#E57080',
          400: '#DA4055',
          500: '#D0021B',  // ← YEF Red core
          600: '#B00218',
          700: '#8B0112',
          800: '#66010D',
          900: '#3D0008',
          950: '#1F0004',
        },
      },
      fontFamily: {
        // ── YEF Typography ────────────────────────────────────────────────
        display: ['"Plus Jakarta Sans"', '"DM Sans"', 'system-ui', 'sans-serif'],
        body:    ['"Inter"',             'system-ui', 'sans-serif'],
        serif:   ['"Libre Baskerville"', 'Georgia',   'serif'],
      },
      boxShadow: {
        'yef-red':   '0 2px 8px rgba(208,2,27,0.25)',
        'yef-navy':  '0 2px 8px rgba(26,43,107,0.25)',
        'yef-red-lg':  '0 4px 16px rgba(208,2,27,0.30)',
        'yef-navy-lg': '0 4px 16px rgba(26,43,107,0.30)',
      },
    },
  },
  plugins: [],
}