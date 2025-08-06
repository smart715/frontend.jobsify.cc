import tailwindcssLogical from 'tailwindcss-logical'

import tailwindPlugin from './src/@core/tailwind/plugin'

const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,css}'],
  corePlugins: {
    preflight: false
  },
  important: '#__next',
  plugins: [tailwindcssLogical, tailwindPlugin],
  theme: {
    extend: {
      fontFamily: {
        myriad: ['"Myriad Pro"', 'sans-serif'],
      },
    },
  },
}

export default config
