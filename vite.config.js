import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import compression from "vite-plugin-compression";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: "gzip",
      ext: ".gz",
      threshold: 10240, // Компресуємо файли більше 10KB
      deleteOriginFile: false,
    }),
    compression({
      algorithm: "brotliCompress",
      ext: ".br",
      threshold: 10240,
      deleteOriginFile: false,
    }),
  ],
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          mui: ["@mui/material", "@mui/icons-material"],
          router: ["react-router-dom"],
          icons: ["react-icons"],
          firebase: [
            "firebase/app",
            "firebase/auth",
            "firebase/firestore",
            "firebase/storage",
          ],
          utils: ["axios", "clsx"],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Збільшуємо ліміт попереджень
  },
  server: {
    port: 3000,
    host: true,
  },
  optimizeDeps: {
    include: [
      "firebase/app",
      "firebase/auth",
      "firebase/firestore",
      "firebase/storage",
    ],
  },
});
