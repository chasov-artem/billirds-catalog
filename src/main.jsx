import React from "react";
import ReactDOM from "react-dom/client";
import { ProductsProvider } from "./context/ProductsContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import App from "./App.jsx";
import "./index.css";

// Performance optimization
const version = "1.0.0"; // Cache busting
console.log(`App version: ${version}`);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ProductsProvider>
      <FavoritesProvider>
        <App />
      </FavoritesProvider>
    </ProductsProvider>
  </React.StrictMode>
);
