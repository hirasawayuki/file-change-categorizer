import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import manifest from "./src/manifest"

const SERVER_PORT = 5173

export default defineConfig({
  server: {
    port: SERVER_PORT,
    strictPort: true,
    hmr: {
      port: SERVER_PORT,
    },
  },
  root: resolve(__dirname, "src"),
  publicDir: resolve(__dirname, "public"),
  build: {
    outDir: resolve(__dirname, "dist"),
    rollupOptions: {
      output: {
        chunkFileNames: "assets/chunk-[hash].js",
      },
    },
  },
  plugins: [crx({ manifest }), react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
