import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ProductsProvider } from "./context/ProductsContext.jsx";
import { FavoritesProvider } from "./context/FavoritesContext.jsx";
import { initializePerformanceOptimizations } from "./utils/performance.js";

// Версія для примусового оновлення кешу
const APP_VERSION = Date.now();

// Ініціалізуємо оптимізації продуктивності
initializePerformanceOptimizations();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ProductsProvider>
      <FavoritesProvider>
        <App />
      </FavoritesProvider>
    </ProductsProvider>
  </StrictMode>
);
