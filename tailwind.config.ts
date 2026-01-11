import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Кольори Carp Pro
        forest: {
          50: '#f0f5f0',
          100: '#d8e5d8',
          200: '#b3cbb3',
          300: '#8eb18e',
          400: '#6a976a',
          500: '#4a7c4a',
          600: '#3a633a',
          700: '#2d4a2d',
          800: '#1a1a1a',
          900: '#0f0f0f',
        },
        // Яскраво-зелений з логотипу Carp Pro
        carp: {
          50: '#f0ffe4',
          100: '#dcffc4',
          200: '#b8ff8a',
          300: '#8cff47',
          400: '#6bef23',
          500: '#5cd915',
          600: '#4db80e',
          700: '#3d8c0d',
          800: '#326e10',
          900: '#2a5c12',
        },
        water: {
          50: '#e8f4f8',
          100: '#c5e4ed',
          200: '#9dd2e0',
          300: '#74c0d3',
          400: '#4baec6',
          500: '#2d8fa8',
          600: '#247286',
          700: '#1b5564',
          800: '#123842',
          900: '#091c21',
        },
        sand: {
          50: '#faf8f5',
          100: '#f2ede5',
          200: '#e5dcc8',
          300: '#d5c8a8',
          400: '#c4b388',
          500: '#a89460',
          600: '#8a7848',
          700: '#6b5c38',
          800: '#4c4028',
          900: '#2d2518',
        },
        earth: {
          50: '#f5f3f0',
          100: '#e5e0d8',
          200: '#ccc2b3',
          300: '#b3a48e',
          400: '#9a866a',
          500: '#7d6b50',
          600: '#64553f',
          700: '#4b402f',
          800: '#322a1f',
          900: '#191510',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Impact', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': 'linear-gradient(135deg, rgba(18, 25, 18, 0.9) 0%, rgba(9, 28, 33, 0.8) 100%)',
      },
    },
  },
  plugins: [],
};

export default config;

