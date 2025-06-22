import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import styles from "./ProductCard.module.css";

const ProductCard = ({ product }) => {
  const defaultImage = "/src/assets/default-product-image.png"; // Шлях до зображення-заглушки

  return (
    <Card className={styles.productCard}>
      <CardMedia
        component="img"
        image={product.imageUrl || defaultImage}
        alt={product.Назва}
        className={styles.productImage}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = defaultImage;
        }}
      />
      <CardContent className={styles.cardContent}>
        <Typography variant="h6" component="h3" className={styles.productName}>
          {product.Назва}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          className={styles.productCategory}
        >
          {product.Підкатегорія
            ? `${product.Категорія} / ${product.Підкатегорія}`
            : product.Категорія}
        </Typography>

        <Box className={styles.priceContainer}>
          <Typography
            variant="h5"
            component="p"
            className={styles.productPrice}
          >
            {product.Ціна
              ? `${product.Ціна.toLocaleString("uk-UA")} грн`
              : "За запитом"}
          </Typography>
          <Button
            variant="contained"
            className={styles.cartButton}
            startIcon={<ShoppingCart />}
            href={`https://t.me/your-username?text=Хочу замовити: ${product.Назва}`} // Замініть на ваш telegram
            target="_blank"
          >
            Замовити
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
