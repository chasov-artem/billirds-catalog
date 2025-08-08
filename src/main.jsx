import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ProductsProvider } from "./context/ProductsContext.jsx";
import { FavoritesProvider } from "./context/FavoritesContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ProductsProvider>
      <FavoritesProvider>
        <App />
      </FavoritesProvider>
    </ProductsProvider>
  </StrictMode>
);
