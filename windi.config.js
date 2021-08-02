import { defineConfig } from "windicss/helpers";

export default defineConfig({
  theme: {
    extend: {
      colors: {
        primary: "#CE1818",
        coal: "#454545",
        accent: "#FF5252",
        hint: "#DEEBFF",
      },
    },
    fontFamily: {
      sans: ["Rambla", "sans-serif"],
    },
  },
  plugins: [],
});
