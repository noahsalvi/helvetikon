import preprocess from "svelte-preprocess";
import WindiCSS from "vite-plugin-windicss";
import adapter from "@sveltejs/adapter-node";
import fs from "fs";

const productionMode = process.env.NODE_ENV === "production";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    adapter: adapter({}),
    target: "#svelte",
    vite: {
      plugins: [WindiCSS.default()],
      server: {
        https: productionMode
          ? {
              key: fs.readFileSync(
                "/etc/letsencrypt/live/noahsalvi.ch/fullchain.pem"
              ),
              cert: fs.readFileSync(
                "/etc/letsencrypt/live/noahsalvi.ch/privkey.pem"
              ),
            }
          : {},
      },
    },
  },
};

export default config;
