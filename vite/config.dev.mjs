import { defineConfig } from "vite";

export default defineConfig({
  base: "https://savevsgames.github.io/js_rpg2/",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ["phaser"],
        },
      },
    },
  },
  server: {
    port: 8080,
  },
});
