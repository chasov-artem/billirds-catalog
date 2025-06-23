import React, { useState, useEffect } from "react";
import { Box, Grid, CircularProgress, Alert } from "@mui/material";
import { useProducts } from "../../context/ProductsContext";
import CategorySidebar from "./CategorySidebar";
import ProductGrid from "./ProductGrid";
import styles from "./CatalogSection.module.css";

const CatalogSection = ({ products: externalProducts }) => {
  const { products: contextProducts, loading, error } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState({
    type: "all",
    value: "Усі товари",
  });

  // Використовуємо зовнішні продукти, якщо вони передані, інакше з контексту
  const products = externalProducts || contextProducts;

  useEffect(() => {
    setFilteredProducts(products);
    setActiveFilter({ type: "all", value: "Усі товари" });
  }, [products]);

  const handleFilterChange = (type, value) => {
    setActiveFilter({ type, value });
    if (type === "all") {
      setFilteredProducts(products);
    } else if (type === "category") {
      const filtered = products.filter((p) => p.Категорія === value);
      setFilteredProducts(filtered);
    } else if (type === "subcategory") {
      const filtered = products.filter((p) => p.Підкатегорія === value);
      setFilteredProducts(filtered);
    }
  };

  if (error && !externalProducts) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">
          Не вдалося завантажити товари. Перевірте консоль.
        </Alert>
      </Box>
    );
  }

  return (
    <Box className={styles.catalogSection}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 3 }}>
          <CategorySidebar
            onFilterChange={handleFilterChange}
            activeFilter={activeFilter}
            products={products}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 9 }}>
          {loading && !externalProducts ? (
            <Box className={styles.loader}>
              <CircularProgress />
            </Box>
          ) : (
            <ProductGrid
              products={filteredProducts}
              filterName={activeFilter.value}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CatalogSection;
