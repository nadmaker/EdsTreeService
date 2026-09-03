// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel/serverless";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  output: "server",

  integrations: [react()],

  adapter: vercel({}),

  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          // @subframe/core icons are tree-shaken per-icon but shared across
          // many independent client:load island entries (one per route), so
          // Rollup's default chunking extracts each used icon into its own
          // tiny common chunk instead of merging them -- 5+ ~1KB requests
          // per page instead of 1 -- and duplicates icon code inline into
          // multiple component chunks. Force them into one shared chunk.
          manualChunks: (id) => {
            if (id.includes("@subframe/core")) return "subframe-core";
          },
        },
      },
    },
  },
});