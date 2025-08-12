import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  Skeleton,
  Fade,
} from "@mui/material";
import { Favorite, Delete } from "@mui/icons-material";
import { useFavorites } from "../../context/FavoritesContext";
import { useProducts } from "../../context/ProductsContext";
import CatalogSection from "../../components/CatalogSection/CatalogSection";
import SEOHead from "../../components/SEO/SEOHead";
import styles from "./FavoritesPage.module.css";

const FavoritesPage = () => {
  const { favoritesCount, getFavoritesProducts, clearFavorites } =
    useFavorites();
  const { products, loading } = useProducts();
  const favoritesProducts = getFavoritesProducts(products);

  // Лоадер під час завантаження
  if (loading) {
    return (
      <div className={styles.favoritesPage}>
        <Container maxWidth="xl">
          <Box className={styles.pageHeader}>
            <Skeleton variant="text" width="60%" height={48} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="40%" height={24} />
          </Box>
          <Box className={styles.favoritesContent}>
            <Grid container spacing={3}>
              {[1, 2, 3, 4].map((i) => (
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
      <div className={styles.favoritesPage}>
        <SEOHead
          title="Обране | Більярд сервіс Дніпро"
          description="Ваші обрані більярдні столи та аксесуари. Зберігайте улюблені товари для зручного порівняння та покупки."
          keywords="обране, улюблені товари, більярдні столи, більярдні аксесуари"
          ogTitle="Обране | Більярд сервіс"
          ogDescription="Ваші обрані більярдні столи та аксесуари."
          canonical="https://billiard-servis.com/favorites"
        />
        <Container maxWidth="xl">
          {/* Заголовок сторінки */}
          <Box className={styles.pageHeader}>
            <Typography
              variant="h3"
              component="h1"
              className={styles.pageTitle}
            >
              Обране
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {favoritesCount === 0
                ? "У вас поки немає обраних товарів"
                : `У вас ${favoritesCount} обраних товарів`}
            </Typography>
          </Box>

          {/* Кнопки управління */}
          {favoritesCount > 0 && (
            <Box className={styles.actionsBox}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={() => {
                  if (
                    window.confirm(
                      "Ви впевнені, що хочете очистити все обране?"
                    )
                  ) {
                    clearFavorites();
                  }
                }}
              >
                Очистити все обране
              </Button>
            </Box>
          )}

          {/* Обрані товари */}
          <Box className={styles.favoritesContent}>
            {favoritesCount === 0 ? (
              <Paper className={styles.emptyState} elevation={1}>
                <Favorite sx={{ fontSize: 64, color: "#ccc", mb: 2 }} />
                <Typography variant="h6" align="center" gutterBottom>
                  Ваше обране порожнє
                </Typography>
                <Typography
                  variant="body2"
                  align="center"
                  color="textSecondary"
                  gutterBottom
                >
                  Додайте товари до обраного, натиснувши на іконку серця
                </Typography>
                <Button
                  variant="contained"
                  component="a"
                  href="/catalog"
                  sx={{ mt: 2 }}
                >
                  Перейти до каталогу
                </Button>
              </Paper>
            ) : (
              <CatalogSection products={favoritesProducts} />
            )}
          </Box>
        </Container>
      </div>
    </Fade>
  );
};

export default FavoritesPage;
