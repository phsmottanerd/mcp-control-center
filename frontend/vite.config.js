import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/professores": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/jobs": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/contas": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
