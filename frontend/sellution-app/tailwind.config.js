/** @type {import('tailwindcss').Config} */
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
        sidebarline: 'D3D6E0',
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
};
