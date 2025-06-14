import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        // 1. Standard palette only
        blue: {
          DEFAULT: '#0000FF',
          500: '#0000FF',
          700: '#0000CC',
        },
        black: '#000000',
        white: '#FFFFFF',
        gray: {
          light: '#F0F0F0',   // for background areas
          DEFAULT: '#808080', // standard UI gray
          dark: '#404040',    // for text, borders if needed
        },
        // 2. Semantic colors now only map to core palette
        border: '#808080',
        input: '#F0F0F0',
        ring: '#0000FF',
        background: '#FFFFFF',
        foreground: '#000000',
        primary: {
          DEFAULT: '#0000FF',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#F0F0F0',
          foreground: '#404040',
        },
        destructive: {
          DEFAULT: '#808080', // no red allowed, use gray
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#F0F0F0',
          foreground: '#808080',
        },
        accent: {
          DEFAULT: '#F0F0F0',
          foreground: '#000000',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#000000'
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#000000'
        },
      },
      fontFamily: {
        'sf': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      backdropBlur: {
        'xs': '2px',
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.625rem',
        sm: '0.5rem',
        '2xl': '1rem',
        '3xl': '1.5rem'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
