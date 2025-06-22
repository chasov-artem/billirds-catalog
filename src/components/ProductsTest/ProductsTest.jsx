import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useProducts } from "../../context/ProductsContext";
import styles from "./ProductsTest.module.css";

const ProductsTest = () => {
  const { products, loading, error } = useProducts();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box className={styles.container}>
      <Typography variant="h4" component="h2" gutterBottom>
        Тестування підключення до Firebase
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        Знайдено товарів: {products.length}
      </Typography>

      {products.length === 0 ? (
        <Alert severity="info">
          Товари не знайдено. Перевірте підключення до Firebase або додайте
          товари в базу даних.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
              <Card className={styles.productCard}>
                {product.imageUrl && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.imageUrl}
                    alt={product.name}
                    className={styles.productImage}
                  />
                )}
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Категорія: {product.category}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Ціна:{" "}
                    {product.price ? `${product.price} грн` : "Ціна не вказана"}
                  </Typography>
                  {product.description && (
                    <Typography variant="body2" color="text.secondary">
                      {product.description}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ProductsTest;
