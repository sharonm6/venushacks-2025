import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        // Venus Color Palette
        venus: {
          50: "#fdf2f8", // lightest pink
          100: "#fce7f3", // very light pink
          200: "#fbcfe8", // light pink
          300: "#f9a8d4", // medium pink
          400: "#f472b6", // bright pink
          500: "#ec4899", // main pink
          600: "#db2777", // dark pink
          700: "#be185d", // darker pink
          800: "#9d174d", // very dark pink
          900: "#831843", // darkest pink
          purple: {
            50: "#faf5ff", // lightest purple
            100: "#f3e8ff", // very light purple
            200: "#e9d5ff", // light purple
            300: "#d8b4fe", // medium light purple
            400: "#c084fc", // medium purple
            500: "#a855f7", // main purple
            600: "#9333ea", // dark purple
            700: "#7c3aed", // darker purple
            800: "#6b21a8", // very dark purple
            900: "#581c87", // darkest purple
          },
          gradient: {
            light:
              "linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 50%, #dbeafe 100%)",
            primary: "linear-gradient(135deg, #f9a8d4 0%, #c084fc 100%)",
            secondary: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
            dark: "linear-gradient(135deg, #581c87 0%, #be185d 50%, #1e1b4b 100%)",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "venus-light":
          "linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 50%, #dbeafe 100%)",
        "venus-primary": "linear-gradient(135deg, #f9a8d4 0%, #c084fc 100%)",
        "venus-secondary": "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
        "venus-dark":
          "linear-gradient(135deg, #581c87 0%, #be185d 50%, #1e1b4b 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
