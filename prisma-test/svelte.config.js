/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    target: "#svelte",

    vite: {
      optimizeDeps: {},
    },
  },
};

export default config;
