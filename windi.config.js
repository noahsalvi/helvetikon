import { defineConfig } from "windicss/helpers";
import plugin from "windicss/plugin";

const formError = plugin(({ addVariant }) => [
  addVariant("error", ({ modifySelectors }) =>
    modifySelectors(({ className }) => `.touched.${className}:invalid`)
  ),
]);

export default defineConfig({
  theme: {
    extend: {
      colors: {
        primary: "#CE1818",
        primaryDark: "#a70000",
        coal: "#454545",
        accent: "#FF5252",
        hint: "#DEEBFF",
      },
    },
    fontFamily: {
      sans: ["Nunito", "sans-serif"],
    },
  },
  plugins: [formError],
});
