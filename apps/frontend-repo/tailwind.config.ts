import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  important: "#__next",
  future: {
    hoverOnlyWhenSupported: true,
  },
};
export default config;
