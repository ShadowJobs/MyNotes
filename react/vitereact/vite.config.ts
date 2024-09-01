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
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    proxy: {
      "/api/v1": {
        target: "https://gt-pipeline-dev.mon.works",
        changeOrigin: true
      }
    }
  }
});
