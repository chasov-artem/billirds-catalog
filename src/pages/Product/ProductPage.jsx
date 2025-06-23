import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardMedia,
  IconButton,
  Breadcrumbs,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack,
  ShoppingCart,
  WhatsApp,
  Telegram,
  Phone,
  Email,
  LocationOn,
  CheckCircle,
  Star,
  StarBorder,
} from "@mui/icons-material";
import { useProducts } from "../../context/ProductsContext";
import styles from "./ProductPage.module.css";

const ProductPage = () => {
  const { productId } = useParams();
  const { products, loading } = useProducts();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (products.length > 0) {
      const foundProduct = products.find((p) => p.id === productId);
      setProduct(foundProduct);
    }
  }, [products, productId]);

  const handleOrder = (platform) => {
    const productName = product?.Назва || product?.name || "Товар";
    const productPrice = product?.Ціна || product?.price || "запит";
    const message = `Здравствуйте! Мені цікавить товар: ${productName}\n\nЦіна: ${productPrice} грн\n\nМожу отримати додаткову інформацію?`;
    const encodedMessage = encodeURIComponent(message);

    let url = "";
    switch (platform) {
      case "telegram":
        url = `https://t.me/your_telegram_username?text=${encodedMessage}`;
        break;
      case "whatsapp":
        url = `https://wa.me/380XXXXXXXXX?text=${encodedMessage}`;
        break;
      case "phone":
        url = `tel:+380XXXXXXXXX`;
        break;
      default:
        break;
    }

    if (url) {
      window.open(url, "_blank");
    }
  };

  const formatPrice = (price) => {
    if (!price) return "За запитом";
    return new Intl.NumberFormat("uk-UA").format(price);
  };

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Завантаження товару...
        </Typography>
      </Box>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" className={styles.errorContainer}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Товар не знайдено (ID: {productId})
        </Alert>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Доступні товари: {products.length}
        </Typography>
        <Button
          component={Link}
          to="/catalog"
          variant="contained"
          startIcon={<ArrowBack />}
        >
          Повернутися до каталогу
        </Button>
      </Container>
    );
  }

  return (
    <div className={styles.productPage}>
      <Container maxWidth="lg">
        {/* Хлібні крихти */}
        <Breadcrumbs className={styles.breadcrumbs}>
          <Link to="/" className={styles.breadcrumbLink}>
            Головна
          </Link>
          <Link to="/catalog" className={styles.breadcrumbLink}>
            Каталог
          </Link>
          <Typography color="text.primary">
            {product.Назва || product.name}
          </Typography>
        </Breadcrumbs>

        {/* Зображення товару */}
        <Paper className={styles.imageSection} elevation={2} sx={{ mb: 4 }}>
          <CardMedia
            component="img"
            image={
              product.imageUrl ||
              product.зображення ||
              "https://via.placeholder.com/1200x600?text=Немає+зображення"
            }
            alt={product.Назва || product.name}
            className={styles.mainImage}
          />
          {/* Додаткові зображення (якщо є) */}
          {product.additionalImages && product.additionalImages.length > 0 && (
            <Box className={styles.thumbnailContainer}>
              {product.additionalImages.map((img, index) => (
                <Card
                  key={index}
                  className={`${styles.thumbnail} ${
                    selectedImage === index ? styles.selectedThumbnail : ""
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <CardMedia
                    component="img"
                    image={img}
                    alt={`${product.Назва || product.name} - зображення ${
                      index + 1
                    }`}
                    className={styles.thumbnailImage}
                  />
                </Card>
              ))}
            </Box>
          )}
        </Paper>

        <Grid container spacing={4}>
          {/* Ліва колонка: Опис */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper className={styles.additionalInfo} elevation={2}>
              <Typography variant="h5" gutterBottom>
                Опис
              </Typography>

              {/* Опис */}
              {(product.Опис || product.description) && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" paragraph>
                    {product.Опис || product.description}
                  </Typography>
                </Box>
              )}

              {/* Запасний опис, якщо немає поля "Опис" */}
              {!(product.Опис || product.description) && (
                <Typography variant="body1" paragraph>
                  {product.детальнийОпис ||
                    "Цей більярдний стіл виготовлений з високоякісних матеріалів та відповідає всім стандартам якості. Ідеально підходить для професійного використання та домашніх ігор."}
                </Typography>
              )}

              {/* Переваги */}
              <Box className={styles.featuresSection}>
                <Typography variant="h6" gutterBottom>
                  Переваги:
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box className={styles.featureItem}>
                      <CheckCircle className={styles.featureIcon} />
                      <Typography variant="body2">
                        Висока якість матеріалів
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box className={styles.featureItem}>
                      <CheckCircle className={styles.featureIcon} />
                      <Typography variant="body2">
                        Професійне покриття
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box className={styles.featureItem}>
                      <CheckCircle className={styles.featureIcon} />
                      <Typography variant="body2">Гарантія якості</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box className={styles.featureItem}>
                      <CheckCircle className={styles.featureIcon} />
                      <Typography variant="body2">Швидка доставка</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Paper>

            <Paper className={styles.contactInfo} elevation={2} sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Контактна інформація
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Phone className={styles.contactIcon} />
                  </ListItemIcon>
                  <ListItemText
                    primary="066 407 09 41"
                    secondary="Телефон Viber/Telegram"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Phone className={styles.contactIcon} />
                  </ListItemIcon>
                  <ListItemText primary="067 541 73 08" secondary="Телефон" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Email className={styles.contactIcon} />
                  </ListItemIcon>
                  <ListItemText
                    primary="info@billiardservice.com"
                    secondary="Email"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocationOn className={styles.contactIcon} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Дніпро, вул Антоновича 79"
                    secondary="Адреса"
                  />
                </ListItem>
              </List>

              <Box className={styles.workingHours}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Робочі години:</strong>
                  <br />
                  Пн-Пт: 9:00 - 18:00
                  <br />
                  Сб: 10:00 - 16:00
                  <br />
                  Нд: Вихідний
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Права колонка: Інформація про товар */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper className={styles.infoSection} elevation={2}>
              {/* Заголовок та категорія */}
              <Box className={styles.productHeader}>
                <Chip
                  label={
                    product.Категорія || product.category || "Більярдні столи"
                  }
                  className={styles.categoryChip}
                />
                <Typography
                  variant="h4"
                  component="h1"
                  className={styles.productTitle}
                >
                  {product.Назва || product.name}
                </Typography>
                {product.Підкатегорія && (
                  <Typography variant="body2" color="text.secondary">
                    {product.Підкатегорія}
                  </Typography>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Ціна */}
              <Box className={styles.priceSection}>
                <Typography
                  variant="h3"
                  component="div"
                  className={styles.price}
                >
                  {formatPrice(product.Ціна || product.price)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Включає ПДВ
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Кнопки замовлення */}
              <Box className={styles.orderSection}>
                <Typography variant="h6" gutterBottom>
                  Замовити товар:
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      startIcon={<Telegram />}
                      onClick={() => handleOrder("telegram")}
                      className={styles.telegramButton}
                    >
                      Telegram
                    </Button>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      startIcon={<WhatsApp />}
                      onClick={() => handleOrder("whatsapp")}
                      className={styles.whatsappButton}
                    >
                      WhatsApp
                    </Button>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      startIcon={<Phone />}
                      onClick={() => handleOrder("phone")}
                      className={styles.phoneButton}
                    >
                      Зателефонувати
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Розмір */}
              {(product.Розмір || product.size) && (
                <Box className={styles.descriptionSection}>
                  <Typography variant="h6" gutterBottom>
                    Розмір:
                  </Typography>
                  <Typography variant="body1" className={styles.description}>
                    {product.Розмір || product.size}
                  </Typography>
                </Box>
              )}

              {/* Характеристики */}
              {(product.Характеристики ||
                product.characteristics ||
                product.характеристики) && (
                <Box className={styles.specsSection}>
                  <Typography variant="h6" gutterBottom>
                    Характеристики:
                  </Typography>
                  {typeof (
                    product.Характеристики ||
                    product.characteristics ||
                    product.характеристики
                  ) === "object" ? (
                    <List dense>
                      {Object.entries(
                        product.Характеристики ||
                          product.characteristics ||
                          product.характеристики
                      ).map(([key, value]) => (
                        <ListItem key={key} className={styles.specItem}>
                          <ListItemIcon>
                            <CheckCircle className={styles.checkIcon} />
                          </ListItemIcon>
                          <ListItemText
                            primary={`${key}: ${value}`}
                            primaryTypographyProps={{ variant: "body2" }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <List dense>
                      {(
                        product.Характеристики ||
                        product.characteristics ||
                        product.характеристики
                      )
                        .split("\n")
                        .filter((line) => line.trim())
                        .map((line, index) => (
                          <ListItem key={index} className={styles.specItem}>
                            <ListItemIcon>
                              <CheckCircle className={styles.checkIcon} />
                            </ListItemIcon>
                            <ListItemText
                              primary={line.trim()}
                              primaryTypographyProps={{ variant: "body2" }}
                            />
                          </ListItem>
                        ))}
                    </List>
                  )}
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Кнопка повернення */}
        <Box className={styles.backButtonContainer}>
          <Button
            component={Link}
            to="/catalog"
            variant="outlined"
            startIcon={<ArrowBack />}
            className={styles.backButton}
          >
            Повернутися до каталогу
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default ProductPage;
