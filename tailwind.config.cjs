/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['Titillium Web', 'sans-serif'],
    },
    extend: {
      screens: {
        xs: { max: '639px' },
        sm: '640px',
        md: '768px',
        lg: '1025px',
        xl: '1280px',
        xxl: '1536px',
        ptablet: {
          raw: '(min-width: 768px) and (max-width: 1024px) and (orientation: portrait)',
        },
        ltablet: {
          raw: '(min-width: 768px) and (max-width: 1024px) and (orientation: landscape)',
        },
      },
      colors: {
        primary: colors.blue,
        muted: colors.gray,
        info: colors.sky,
        success: colors.green,
        warning: colors.amber,
        danger: colors.rose,
      },
      animation: {
        gelatine: 'gelatine 600ms both',
        scaleAnimation: 'scaleAnimation 1s ease-out 0s 1 both',
        drawCircleFadeOut: 'drawCircle 1s cubic-bezier(0.77, 0, 0.175, 1) 0s 1 both ,fadeOut 0.3s linear 0.9s 1 both ',
        drawCheckFadeOut: 'drawCheck 1s cubic-bezier(0.77, 0, 0.175, 1) 0s 1 both ,fadeOut   0.3s linear 0.9s 1 both',
        fadeIn: 'fadeIn 0.3s linear 0.9s both',
      },
      keyframes: {
        fadeOut: {
          '0%': {
            opacity: '1',
          },
          '100%': {
            opacity: '0',
          },
        },
        fadeIn: {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        scaleAnimation: {
          '0%': {
            opacity: '0',
            transform: 'scale(1.5)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        drawCircle: {
          '0%': {
            'stroke-dashoffset': '151px',
          },
          '100%': {
            'stroke-dashoffset': '0',
          },
        },
        drawCheck: {
          '0%': {
            'stroke-dashoffset': '36px',
          },
          '100%': {
            'stroke-dashoffset': '0',
          },
        },
        spinAround: {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
        gelatine: {
          'from,to': {
            transform: 'scale(1, 1)',
          },
          '25%': {
            transform: 'scale(0.9, 1.1)',
          },
          '50%': {
            transform: 'scale(1.1, 0.9)',
          },
          '75%': {
            transform: 'scale(0.95, 1.05)',
          },
        },
      },
    },
  },
  plugins: [],
}
