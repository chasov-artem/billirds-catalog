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
  Skeleton,
  Fade,
  CircularProgress,
  Slider,
} from "@mui/material";
import { Search, FilterList, Sort } from "@mui/icons-material";
import CatalogSection from "../../components/CatalogSection/CatalogSection";
import { useProducts } from "../../context/ProductsContext";
import styles from "./CatalogPage.module.css";

// Додаю функцію для форматування ціни у форматі 10к
function formatK(value) {
  if (value >= 10000) {
    if (value === 50000) return "50к+";
    return value / 1000 + "к";
  }
  return value;
}

const CatalogPage = () => {
  const { products, loading } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState([0, 50000]);

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
      if (priceRange[0] > 0) {
        matchesPrice = matchesPrice && productPrice >= priceRange[0];
      }
      if (priceRange[1] < 50000) {
        matchesPrice = matchesPrice && productPrice <= priceRange[1];
      }

      return matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      const categoryA = a.Категорія || "";
      const categoryB = b.Категорія || "";
      const nameA = a.Назва || a.name || "";
      const nameB = b.Назва || b.name || "";
      const priceA = a.Ціна || a.price || 0;
      const priceB = b.Ціна || b.price || 0;

      // Спочатку сортуємо за категорією: більярдні столи першими
      if (categoryA === "Більярдні столи" && categoryB !== "Більярдні столи") {
        return -1;
      }
      if (categoryA !== "Більярдні столи" && categoryB === "Більярдні столи") {
        return 1;
      }

      // Якщо категорії однакові або обидва не більярдні столи, сортуємо за вибраним критерієм
      switch (sortBy) {
        case "name":
          return nameA.localeCompare(nameB);
        case "price-low":
          return priceA - priceB;
        case "price-high":
          return priceB - priceA;
        default:
          return nameA.localeCompare(nameB);
      }
    });

  // Лоадер під час завантаження
  if (loading) {
    return (
      <div className={styles.catalogPage}>
        <Container maxWidth="xl">
          {/* Заголовок сторінки - скелетон */}
          <Box className={styles.pageHeader}>
            <Skeleton variant="text" width="60%" height={48} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="40%" height={24} />
          </Box>

          {/* Панель фільтрів - скелетон */}
          <Paper className={styles.filtersPanel} elevation={2}>
            <Grid container spacing={3} alignItems="center">
              <Grid size={{ xs: 12, md: 4 }}>
                <Skeleton
                  variant="rectangular"
                  height={56}
                  sx={{ borderRadius: 1 }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Skeleton
                  variant="rectangular"
                  height={56}
                  sx={{ borderRadius: 1 }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Skeleton
                  variant="rectangular"
                  height={56}
                  sx={{ borderRadius: 1 }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <Box sx={{ textAlign: "center" }}>
                  <Skeleton variant="text" width="80%" height={20} />
                  <Skeleton variant="text" width="60%" height={20} />
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Каталог - скелетон */}
          <Box className={styles.catalogContent}>
            <Grid container spacing={3}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
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
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </div>
    );
  }

  return (
    <Fade in={true} timeout={600}>
      <div className={styles.catalogPage}>
        <Container maxWidth="xl">
          {/* Заголовок сторінки */}
          <Box className={styles.pageHeader}>
            <Typography
              variant="h3"
              component="h1"
              className={styles.pageTitle}
            >
              Каталог більярдних столів
            </Typography>
          </Box>

          {/* Панель фільтрів та пошуку */}
          <Paper className={styles.filtersPanel} elevation={2}>
            <Grid container spacing={3} alignItems="center">
              {/* Пошук */}
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  placeholder="Пошук товарів..."
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
                  <InputLabel id="sort-label">Сортування</InputLabel>
                  <Select
                    labelId="sort-label"
                    label="Сортування"
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
                <Box sx={{ px: 2 }}>
                  <Typography id="price-range-slider-label" gutterBottom>
                    Ціновий діапазон (грн)
                  </Typography>
                  <Slider
                    value={priceRange}
                    min={0}
                    max={50000}
                    step={1000}
                    onChange={(_, val) => setPriceRange(val)}
                    valueLabelDisplay="auto"
                    getAriaLabel={() => "Price range"}
                    getAriaValueText={(v) => `${formatK(v)} грн`}
                    marks={[
                      { value: 0, label: "0" },
                      { value: 10000, label: "10к" },
                      { value: 20000, label: "20к" },
                      { value: 30000, label: "30к" },
                      { value: 40000, label: "40к" },
                      { value: 50000, label: "50к+" },
                    ]}
                    sx={{ mt: 3 }}
                    aria-labelledby="price-range-slider-label"
                  />
                  <Typography variant="body2" sx={{ mt: 1, color: "#115e59" }}>
                    {formatK(priceRange[0])} —{" "}
                    {priceRange[1] === 50000 ? "50к+" : formatK(priceRange[1])}{" "}
                    грн
                  </Typography>
                </Box>
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
          {(searchTerm || priceRange[0] > 0 || priceRange[1] < 50000) && (
            <Box className={styles.activeFilters}>
              <Typography variant="body2" component="span">
                Активні фільтри:{" "}
              </Typography>
              {searchTerm && (
                <Chip
                  label={`Пошук: "${searchTerm}"`}
                  onDelete={() => setSearchTerm("")}
                  className={styles.filterChip}
                  sx={{ color: "#fff" }}
                />
              )}
              {(priceRange[0] > 0 || priceRange[1] < 50000) && (
                <Chip
                  label={`Ціна: від ${formatK(priceRange[0])}${
                    priceRange[1] < 50000
                      ? ` до ${formatK(priceRange[1])}`
                      : "+"
                  } грн`}
                  onDelete={() => setPriceRange([0, 50000])}
                  className={styles.filterChip}
                  sx={{ color: "#fff" }}
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
    </Fade>
  );
};

export default CatalogPage;
