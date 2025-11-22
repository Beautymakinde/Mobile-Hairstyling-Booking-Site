import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6B4F8F',
          light: '#8B7BA8',
          dark: '#5A3F7A',
        },
        secondary: {
          DEFAULT: '#E8A598',
          light: '#F0BEB5',
          dark: '#D98D7E',
        },
        heading: '#1A1A1A',
        body: '#3D3D3D',
        muted: '#6B6B6B',
        background: '#F8F8F8',
        card: '#FFFFFF',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        border: '#E5E7EB',
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
        raleway: ['var(--font-raleway)', 'sans-serif'],
      },
      fontSize: {
        'h1-mobile': ['40px', { lineHeight: '1.2', letterSpacing: '-0.5px' }],
        'h1-desktop': ['64px', { lineHeight: '1.2', letterSpacing: '-0.5px' }],
        'h2-mobile': ['32px', { lineHeight: '1.3', letterSpacing: '-0.3px' }],
        'h2-desktop': ['48px', { lineHeight: '1.3', letterSpacing: '-0.3px' }],
        'h3': ['24px', { lineHeight: '1.4' }],
        'h4': ['20px', { lineHeight: '1.4' }],
        'body-lg': ['18px', { lineHeight: '1.6' }],
        'body': ['16px', { lineHeight: '1.6' }],
        'body-sm': ['14px', { lineHeight: '1.5' }],
        'button': ['16px', { lineHeight: '1.2', letterSpacing: '0.5px' }],
        'label': ['14px', { lineHeight: '1.4' }],
        'badge': ['12px', { lineHeight: '1.2', letterSpacing: '0.5px' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        container: '1280px',
      },
      borderRadius: {
        'card': '12px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.08)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.12)',
        'button': '0 4px 12px rgba(107,79,143,0.3)',
      },
      minHeight: {
        'touch': '44px',
      },
    },
  },
  plugins: [],
}
export default config
