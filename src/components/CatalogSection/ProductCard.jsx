import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
} from "@mui/material";
import {
  ShoppingCart,
  Visibility,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useFavorites } from "../../context/FavoritesContext";
import OptimizedImage from "../OptimizedImage/OptimizedImage";
import styles from "./ProductCard.module.css";

const ProductCard = ({ product, priority = false }) => {
  const { toggleFavorite, isInFavorites } = useFavorites();
  const defaultImage = "/default-product-image.png"; // Шлях до зображення-заглушки
  const images = product.Фото || [];
  const mainImage =
    images[0] || product.imageUrl || product.зображення || defaultImage;

  // Визначаємо статус
  const status = product.Статус || "Під замовлення";
  let badgeClass = styles.preorderBadge;
  let badgeText = "Під замовлення";
  if (status === "В наявності") {
    badgeClass = styles.availableBadge;
    badgeText = "В наявності";
  } else if (status === "Немає в наявності") {
    badgeClass = styles.unavailableBadge;
    badgeText = "Немає в наявності";
  }

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
        <OptimizedImage
          src={mainImage}
          alt={product.Назва || product.name}
          className={styles.productImage}
          style={{ height: "220px" }}
          priority={priority}
          onError={() => console.log("Image failed to load:", mainImage)}
        />
        {/* Плашка статусу */}
        <div className={`${styles.statusBadgeAbsolute} ${badgeClass}`}>
          {badgeText}
        </div>
        <Box className={styles.imageOverlay}>
          <IconButton
            component={Link}
            to={`/product/${product.id}`}
            className={styles.viewButton}
            size="large"
            aria-label={`Переглянути ${product.Назва || product.name}`}
          >
            <Visibility />
          </IconButton>
          <IconButton
            className={styles.favoriteButton}
            size="large"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(product.id);
            }}
            aria-label={`${
              isInFavorites(product.id) ? "Видалити з" : "Додати до"
            } улюблених ${product.Назва || product.name}`}
            sx={{
              color: isInFavorites(product.id) ? "#ff4081" : "white",
              "&:hover": {
                color: isInFavorites(product.id) ? "#f50057" : "#ff4081",
              },
            }}
          >
            {isInFavorites(product.id) ? <Favorite /> : <FavoriteBorder />}
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
          className={styles.productCategory}
          style={{ color: "#fff" }}
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
