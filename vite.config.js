import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Розділяємо vendor чанки для кращого кешування
          vendor: ["react", "react-dom"],
          mui: [
            "@mui/material",
            "@mui/icons-material",
            "@emotion/react",
            "@emotion/styled",
          ],
          firebase: [
            "firebase/app",
            "firebase/firestore",
            "firebase/storage",
            "firebase/auth",
          ],
          router: ["react-router-dom"],
          icons: ["react-icons"],
          utils: ["axios", "clsx"],
        },
      },
    },
    // Оптимізація розміру бандла
    chunkSizeWarningLimit: 1000,
    // Мінімізація для production
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Оптимізація source maps
    sourcemap: false,
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
