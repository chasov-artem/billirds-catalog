import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  IconButton,
} from "@mui/material";
import { ShoppingCart, Visibility } from "@mui/icons-material";
import { Link } from "react-router-dom";
import styles from "./ProductCard.module.css";

const ProductCard = ({ product }) => {
  const defaultImage = "/src/assets/default-product-image.png"; // Шлях до зображення-заглушки

  const handleOrder = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const message = `Здравствуйте! Мені цікавить товар: ${product.Назва}\n\nЦіна: ${product.Ціна} грн\n\nМожу отримати додаткову інформацію?`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://t.me/your-username?text=${encodedMessage}`, "_blank");
  };

  return (
    <Card className={styles.productCard}>
      <Box className={styles.imageContainer}>
        <CardMedia
          component="img"
          image={product.imageUrl || product.зображення || defaultImage}
          alt={product.Назва || product.name}
          className={styles.productImage}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultImage;
          }}
        />
        <Box className={styles.imageOverlay}>
          <IconButton
            component={Link}
            to={`/product/${product.id}`}
            className={styles.viewButton}
            size="large"
          >
            <Visibility />
          </IconButton>
        </Box>
      </Box>

      <CardContent className={styles.cardContent}>
        <Typography
          variant="h6"
          component={Link}
          to={`/product/${product.id}`}
          className={styles.productName}
        >
          {product.Назва || product.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          className={styles.productCategory}
        >
          {product.Підкатегорія
            ? `${product.Категорія} / ${product.Підкатегорія}`
            : product.Категорія || product.category}
        </Typography>

        <Box className={styles.priceContainer}>
          <Typography
            variant="h5"
            component="p"
            className={styles.productPrice}
          >
            {product.Ціна || product.price
              ? `${(product.Ціна || product.price).toLocaleString("uk-UA")} грн`
              : "За запитом"}
          </Typography>
          <Button
            variant="contained"
            className={styles.cartButton}
            startIcon={<ShoppingCart />}
            onClick={handleOrder}
          >
            Замовити
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
