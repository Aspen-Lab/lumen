/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          0: "#0A0A0F",
          1: "#12121A",
          2: "#1A1A24",
          3: "#22222E",
          4: "#2A2A38",
        },
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        xs: ["13px", { lineHeight: "1.5" }],
        sm: ["15px", { lineHeight: "1.5" }],
        base: ["16px", { lineHeight: "1.6" }],
        lg: ["18px", { lineHeight: "1.4" }],
        xl: ["22px", { lineHeight: "1.3" }],
        "2xl": ["30px", { lineHeight: "1.15" }],
        "3xl": ["40px", { lineHeight: "1.1" }],
      },
      maxWidth: {
        content: "960px",
      },
      width: {
        sidebar: "260px",
      },
    },
  },
  plugins: [],
};
