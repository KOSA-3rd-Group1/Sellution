/** @type {import('tailwindcss').Config} */

// 기본 light 테마 가져오기
const lightTheme = require('daisyui/src/theming/themes')['[data-theme=light]'];

// 색상 테마를 생성하는 함수
const createTheme = (name, textColor, darkBgColor, midBgColor, lightBgColor) => ({
  [`Custom${name}Theme`]: {
    ...lightTheme,
    primary: textColor,
    secondary: darkBgColor,
    accent: midBgColor,
    neutral: lightBgColor,
  },
});

export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/react-tailwindcss-datepicker/dist/index.esm.js',
  ],
  theme: {
    extend: {
      colors: {
        brandOrange: {
          DEFAULT: '#F37021',
          light: '#FCE8DB',
        },
        navbarBackground: '#191A1C',
        sidebarText: {
          dark: '#000000',
          DEFAULT: '#696A6E',
        },
        sidebarline: '#D3D6E0',
      },
      boxShadow: {
        header: '2px -1px 5px rgba(0,0,0,0.2)',
        footer: '0 -5px 5px -5px rgba(0,0,0,0.2);',
      },
    },
  },
  plugins: [
    require('daisyui'),
    ({ addUtilities }) => {
      addUtilities({
        '.row-center-position': {
          '@apply flex flex-row justify-center items-center': '',
        },
        '.col-center-position': {
          '@apply flex flex-col justify-center items-center': '',
        },
        '.sideBtn': {
          '@apply flex flex-row items-center': '',
        },
        '.loginContainer': {
          'container-type': 'inline-size',
          'transform-style': 'preserve-3d',
          'transition-property': 'outline',
        },
        '.scene': {
          'mask-image': `linear-gradient(transparent, white var(--buff) calc(100% - var(--buff)), transparent),
                         linear-gradient(90deg, transparent, white var(--buff) calc(100% - var(--buff)), transparent)`,
          'mask-composite': 'intersect',
        },
        '.preserve-3d': {
          'transform-style': 'preserve-3d',
        },
      });
    },
  ],
  daisyui: {
    themes: [
      createTheme('Rose', '#e11d48', '#be123c', '#fda4af', '#fff1f2'),
      createTheme('Pink', '#d946ef', '#a21caf', '#f0abfc', '#fdf4ff'),
      createTheme('Orange', '#f97316', '#c2410c', '#fdba74', '#fff7ed'),
      createTheme('Yellow', '#eab308', '#a16207', '#fde047', '#fefce8'),
      createTheme('Amber', '#f59e0b', '#b45309', '#fcd34d', '#fffbeb'),
      createTheme('Lime', '#84cc16', '#4d7c0f', '#bef264', '#f7fee7'),
      createTheme('Green', '#22c55e', '#15803d', '#86efac', '#f0fdf4'),
      createTheme('Teal', '#14b8a6', '#0f766e', '#5eead4', '#f0fdfa'),
      createTheme('Cyan', '#06b6d4', '#0e7490', '#67e8f9', '#ecfeff'),
      createTheme('Blue', '#3b82f6', '#1d4ed8', '#93c5fd', '#eff6ff'),
      createTheme('Indigo', '#6366f1', '#4338ca', '#a5b4fc', '#eef2ff'),
      createTheme('Fuchsia', '#d946ef', '#a21caf', '#f0abfc', '#fdf4ff'),
      createTheme('Purple', '#a855f7', '#7e22ce', '#d8b4fe', '#faf5ff'),
      createTheme('Stone', '#78716c', '#44403c', '#d6d3d1', '#fafaf9'),
    ],
  },
};
