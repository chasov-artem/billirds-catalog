import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  isInFavorites,
  clearFavorites,
  getFavoritesCount,
} from "../utils/favorites";

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [favoritesCount, setFavoritesCount] = useState(0);

  // Завантажуємо обране при ініціалізації
  useEffect(() => {
    const loadFavorites = () => {
      const savedFavorites = getFavorites();
      setFavorites(savedFavorites);
      setFavoritesCount(savedFavorites.length);
    };

    loadFavorites();

    // Слухаємо зміни в localStorage
    const handleStorageChange = (e) => {
      if (e.key === "billirds_favorites") {
        loadFavorites();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Додати до обраного
  const addToFavoritesHandler = (productId) => {
    const success = addToFavorites(productId);
    if (success) {
      setFavorites((prev) => [...prev, productId]);
      setFavoritesCount((prev) => prev + 1);
    }
    return success;
  };

  // Видалити з обраного
  const removeFromFavoritesHandler = (productId) => {
    const success = removeFromFavorites(productId);
    if (success) {
      setFavorites((prev) => prev.filter((id) => id !== productId));
      setFavoritesCount((prev) => prev - 1);
    }
    return success;
  };

  // Переключити обране (додати/видалити)
  const toggleFavorite = (productId) => {
    if (isInFavorites(productId)) {
      return removeFromFavoritesHandler(productId);
    } else {
      return addToFavoritesHandler(productId);
    }
  };

  // Очистити все обране
  const clearFavoritesHandler = () => {
    const success = clearFavorites();
    if (success) {
      setFavorites([]);
      setFavoritesCount(0);
    }
    return success;
  };

  // Перевірити, чи товар в обраному
  const isInFavoritesHandler = (productId) => {
    return favorites.includes(productId);
  };

  // Отримати обрані товари з повною інформацією
  const getFavoritesProducts = (allProducts) => {
    return allProducts.filter((product) => favorites.includes(product.id));
  };

  const value = {
    favorites,
    favoritesCount,
    addToFavorites: addToFavoritesHandler,
    removeFromFavorites: removeFromFavoritesHandler,
    toggleFavorite,
    clearFavorites: clearFavoritesHandler,
    isInFavorites: isInFavoritesHandler,
    getFavoritesProducts,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
