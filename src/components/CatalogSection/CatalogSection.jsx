import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  CircularProgress,
  Alert,
  Skeleton,
  Fade,
} from "@mui/material";
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

  // Лоадер з скелетонами
  if (loading && !externalProducts) {
    return (
      <Box className={styles.catalogSection}>
        <Grid container spacing={4}>
          {/* Сайдбар - скелетон */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Box sx={{ p: 2 }}>
              <Skeleton variant="text" width="80%" height={32} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="70%" height={24} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="50%" height={24} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="65%" height={24} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="55%" height={24} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="75%" height={24} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="45%" height={24} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="60%" height={24} />
            </Box>
          </Grid>

          {/* Сітка товарів - скелетон */}
          <Grid size={{ xs: 12, md: 9 }}>
            <Box sx={{ mb: 3 }}>
              <Skeleton variant="text" width="40%" height={32} />
            </Box>
            <Grid container spacing={3}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "white",
                      boxShadow: 1,
                    }}
                  >
                    <Skeleton
                      variant="rectangular"
                      height={200}
                      sx={{ borderRadius: 1, mb: 2 }}
                    />
                    <Skeleton
                      variant="text"
                      width="80%"
                      height={24}
                      sx={{ mb: 1 }}
                    />
                    <Skeleton
                      variant="text"
                      width="60%"
                      height={20}
                      sx={{ mb: 1 }}
                    />
                    <Skeleton variant="text" width="40%" height={32} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Fade in={true} timeout={500}>
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
            <ProductGrid
              products={filteredProducts}
              filterName={activeFilter.value}
            />
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
};

export default CatalogSection;
