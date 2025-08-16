import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { compression } from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: "gzip",
      ext: ".gz",
    }),
    compression({
      algorithm: "brotliCompress",
      ext: ".br",
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Розділяємо vendor чанки
          vendor: ["react", "react-dom"],
          mui: ["@mui/material", "@mui/icons-material"],
          firebase: ["firebase/app", "firebase/firestore", "firebase/storage"],
          router: ["react-router-dom"],
          icons: ["react-icons"],
        },
      },
    },
    // Оптимізація розміру бандла
    chunkSizeWarningLimit: 1000,
    // Видаляємо console.log в production
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  // Оптимізація dev сервера
  server: {
    hmr: {
      overlay: false,
    },
  },
  // Оптимізація залежностей
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "@mui/material",
      "@mui/icons-material",
      "react-router-dom",
    ],
  },
});
