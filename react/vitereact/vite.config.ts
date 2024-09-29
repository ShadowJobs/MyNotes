import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  server: {
    host: "0.0.0.0",
    port: 6002,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    proxy: {
      "/api/v1": {
        target: "https://gt-pipe-dev.mon.works",
        changeOrigin: true
      }
    }
  }
});
