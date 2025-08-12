// tailwind.config.js
import { fontFamily } from 'tailwindcss/defaultTheme';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#13233D',
        secondary: '#F8F8F8',
        accent: '#ff8400',
        background: '#F8F9FA',
        fontprimary: '#0B0829',
        fontsecondary: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Pretendard', ...fontFamily.sans],
      },
    },
  },
  plugins: [typography],
};
