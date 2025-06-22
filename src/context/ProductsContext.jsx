import React, { createContext, useContext, useState, useEffect } from "react";
import { getAllProducts, getCategories } from "../services/productsService";

const ProductsContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
};

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Завантаження всіх товарів
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const productsData = await getAllProducts();
      setProducts(productsData);
    } catch (err) {
      setError("Помилка завантаження товарів");
      console.error("Помилка завантаження товарів:", err);
    } finally {
      setLoading(false);
    }
  };

  // Завантаження категорій
  const loadCategories = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (err) {
      console.error("Помилка завантаження категорій:", err);
    }
  };

  // Оновлення товарів
  const refreshProducts = () => {
    loadProducts();
    loadCategories();
  };

  // Фільтрація товарів за категорією
  const getProductsByCategory = (category) => {
    if (!category || category === "all") {
      return products;
    }
    return products.filter((product) => product.category === category);
  };

  // Пошук товарів
  const searchProducts = (searchTerm) => {
    if (!searchTerm) {
      return products;
    }
    const searchLower = searchTerm.toLowerCase();
    return products.filter(
      (product) =>
        product.name?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.category?.toLowerCase().includes(searchLower)
    );
  };

  // Завантаження даних при монтуванні компонента
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const value = {
    products,
    categories,
    loading,
    error,
    refreshProducts,
    getProductsByCategory,
    searchProducts,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};
