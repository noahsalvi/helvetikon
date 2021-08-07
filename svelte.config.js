import preprocess from "svelte-preprocess";
import WindiCSS from "vite-plugin-windicss";
import adapter from "@sveltejs/adapter-node";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const https = !!process.env.HTTPS;

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
        https: https
          ? {
              key: fs.readFileSync(
                "/etc/letsencrypt/live/noahsalvi.ch/privkey.pem"
              ),
              cert: fs.readFileSync(
                "/etc/letsencrypt/live/noahsalvi.ch/fullchain.pem"
              ),
            }
          : {},
      },
    },
  },
};

export default config;
