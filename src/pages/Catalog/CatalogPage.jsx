import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Chip,
} from "@mui/material";
import { Search, FilterList, Sort } from "@mui/icons-material";
import CatalogSection from "../../components/CatalogSection/CatalogSection";
import { useProducts } from "../../context/ProductsContext";
import styles from "./CatalogPage.module.css";

const CatalogPage = () => {
  const { products } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState("all");

  // Фільтруємо та сортуємо продукти
  const filteredProducts = products
    .filter((product) => {
      const productName = product.Назва || product.name || "";
      const productDescription = product.Опис || product.description || "";

      const matchesSearch =
        productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        productDescription.toLowerCase().includes(searchTerm.toLowerCase());

      const productPrice = product.Ціна || product.price || 0;
      let matchesPrice = true;
      if (priceRange === "low") {
        matchesPrice = productPrice <= 5000;
      } else if (priceRange === "medium") {
        matchesPrice = productPrice > 5000 && productPrice <= 15000;
      } else if (priceRange === "high") {
        matchesPrice = productPrice > 15000;
      }

      return matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      const nameA = a.Назва || a.name || "";
      const nameB = b.Назва || b.name || "";
      const priceA = a.Ціна || a.price || 0;
      const priceB = b.Ціна || b.price || 0;

      switch (sortBy) {
        case "name":
          return nameA.localeCompare(nameB);
        case "price-low":
          return priceA - priceB;
        case "price-high":
          return priceB - priceA;
        default:
          return 0;
      }
    });

  return (
    <div className={styles.catalogPage}>
      <Container maxWidth="xl">
        {/* Заголовок сторінки */}
        <Box className={styles.pageHeader}>
          <Typography variant="h3" component="h1" className={styles.pageTitle}>
            Каталог більярдних столів
          </Typography>
          <Typography variant="body1" className={styles.pageSubtitle}>
            Знайдіть ідеальний стіл для вашого більярдного клубу або дому
          </Typography>
        </Box>

        {/* Панель фільтрів та пошуку */}
        <Paper className={styles.filtersPanel} elevation={2}>
          <Grid container spacing={3} alignItems="center">
            {/* Пошук */}
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                placeholder="Пошук столів..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search className={styles.searchIcon} />,
                }}
                className={styles.searchField}
              />
            </Grid>

            {/* Сортування */}
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Сортування</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  startAdornment={<Sort className={styles.filterIcon} />}
                >
                  <MenuItem value="name">За назвою</MenuItem>
                  <MenuItem value="price-low">Ціна: від дешевих</MenuItem>
                  <MenuItem value="price-high">Ціна: від дорогих</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Фільтр за ціною */}
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Ціновий діапазон</InputLabel>
                <Select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  startAdornment={<FilterList className={styles.filterIcon} />}
                >
                  <MenuItem value="all">Всі ціни</MenuItem>
                  <MenuItem value="low">До 5,000 грн</MenuItem>
                  <MenuItem value="medium">5,000 - 15,000 грн</MenuItem>
                  <MenuItem value="high">Понад 15,000 грн</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Статистика */}
            <Grid size={{ xs: 12, md: 2 }}>
              <Box className={styles.stats}>
                <Typography variant="body2" color="textSecondary">
                  Знайдено: {filteredProducts.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Всього: {products.length}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Активні фільтри */}
        {(searchTerm || priceRange !== "all") && (
          <Box className={styles.activeFilters}>
            <Typography variant="body2" component="span">
              Активні фільтри:{" "}
            </Typography>
            {searchTerm && (
              <Chip
                label={`Пошук: "${searchTerm}"`}
                onDelete={() => setSearchTerm("")}
                className={styles.filterChip}
              />
            )}
            {priceRange !== "all" && (
              <Chip
                label={`Ціна: ${
                  priceRange === "low"
                    ? "До 5,000 грн"
                    : priceRange === "medium"
                    ? "5,000 - 15,000 грн"
                    : "Понад 15,000 грн"
                }`}
                onDelete={() => setPriceRange("all")}
                className={styles.filterChip}
              />
            )}
          </Box>
        )}

        {/* Каталог */}
        <Box className={styles.catalogContent}>
          <CatalogSection products={filteredProducts} />
        </Box>

        {/* Повідомлення, якщо нічого не знайдено */}
        {filteredProducts.length === 0 && (
          <Paper className={styles.noResults} elevation={1}>
            <Typography variant="h6" align="center">
              На жаль, за вашими критеріями нічого не знайдено
            </Typography>
            <Typography variant="body2" align="center" color="textSecondary">
              Спробуйте змінити параметри пошуку або фільтри
            </Typography>
          </Paper>
        )}
      </Container>
    </div>
  );
};

export default CatalogPage;
