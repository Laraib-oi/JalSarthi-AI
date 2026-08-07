import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

/**
 * JalSarthi Platform — Tailwind design tokens.
 *
 * Every raw hex value in the product lives here, once. Components should
 * always reference the semantic token (e.g. `bg-primary-600`) rather than
 * an arbitrary value, so the palette stays a single source of truth.
 */
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "2.5rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1200px",
        "2xl": "1360px",
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0B5ED7",
          50: "#EAF2FD",
          100: "#D0E2FA",
          200: "#A1C5F5",
          300: "#72A8F0",
          400: "#438BEB",
          500: "#0B5ED7",
          600: "#094CB0",
          700: "#073A88",
          800: "#052861",
          900: "#031639",
        },
        secondary: {
          DEFAULT: "#4EA8DE",
          50: "#EFF8FD",
          100: "#D6EDFA",
          500: "#4EA8DE",
          600: "#2C8CC7",
          700: "#20699A",
        },
        accent: {
          DEFAULT: "#00B4D8",
          50: "#E6FBFF",
          100: "#B3F1FC",
          500: "#00B4D8",
          600: "#0090AD",
        },
        surface: {
          DEFAULT: "#F8FAFC",
          raised: "#FFFFFF",
        },
        success: {
          DEFAULT: "#16A34A",
          50: "#EAFBF1",
        },
        danger: {
          DEFAULT: "#DC2626",
          50: "#FDEDED",
        },
        ink: {
          DEFAULT: "#0F172A",
          muted: "#64748B",
          faint: "#94A3B8",
        },
        border: {
          DEFAULT: "#E2E8F0",
        },
      },
      fontFamily: {
        heading: ["var(--font-poppins)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      fontSize: {
        "display-lg": [
          "3.5rem",
          { lineHeight: "1.08", letterSpacing: "-0.02em", fontWeight: "600" },
        ],
        "display-md": [
          "2.75rem",
          { lineHeight: "1.12", letterSpacing: "-0.02em", fontWeight: "600" },
        ],
        "display-sm": [
          "2.125rem",
          { lineHeight: "1.18", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        "heading-lg": ["1.75rem", { lineHeight: "1.25", fontWeight: "600" }],
        "heading-md": ["1.375rem", { lineHeight: "1.3", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.65" }],
        body: ["1rem", { lineHeight: "1.65" }],
        "body-sm": ["0.875rem", { lineHeight: "1.55" }],
        caption: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.02em" }],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        soft: "0 1px 2px 0 rgb(15 23 42 / 0.04), 0 8px 24px -8px rgb(15 23 42 / 0.08)",
        card: "0 1px 2px 0 rgb(15 23 42 / 0.04), 0 12px 32px -12px rgb(11 94 215 / 0.16)",
        "card-hover":
          "0 4px 12px 0 rgb(15 23 42 / 0.06), 0 24px 48px -16px rgb(11 94 215 / 0.24)",
        nav: "0 1px 0 0 rgb(15 23 42 / 0.04), 0 8px 24px -12px rgb(15 23 42 / 0.10)",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #0B5ED7 0%, #00B4D8 100%)",
        "gradient-surface": "linear-gradient(180deg, #F8FAFC 0%, #EAF2FD 100%)",
        "gradient-radial-fade":
          "radial-gradient(60% 60% at 50% 0%, rgba(11,94,215,0.10) 0%, rgba(248,250,252,0) 70%)",
      },
      keyframes: {
        ripple: {
          "0%": { transform: "scale(0.9)", opacity: "0.35" },
          "100%": { transform: "scale(1.4)", opacity: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        ripple: "ripple 2.8s cubic-bezier(0.4, 0, 0.2, 1) infinite",
        "fade-up": "fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
