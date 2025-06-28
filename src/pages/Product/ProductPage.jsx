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
  Skeleton,
  Fade,
  Modal,
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
  ArrowBackIos,
  ArrowForwardIos,
  Close,
} from "@mui/icons-material";
import { useProducts } from "../../context/ProductsContext";
import styles from "./ProductPage.module.css";

const ProductPage = () => {
  const { productId } = useParams();
  const { products, loading } = useProducts();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [productLoading, setProductLoading] = useState(true);
  const [productError, setProductError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  useEffect(() => {
    setProductLoading(true);
    setProductError(false);

    // Симулюємо затримку для кращого UX
    const timer = setTimeout(() => {
      if (products.length > 0) {
        const foundProduct = products.find((p) => p.id === productId);
        if (foundProduct) {
          setProduct(foundProduct);
          setProductError(false);
        } else {
          setProductError(true);
        }
      } else if (!loading) {
        setProductError(true);
      }
      setProductLoading(false);
    }, 800); // 800ms затримка для кращого UX

    return () => clearTimeout(timer);
  }, [products, productId, loading]);

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
    return `${new Intl.NumberFormat("uk-UA").format(price)} грн`;
  };

  const openModal = (index) => {
    setModalIndex(index);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);
  const prevImage = () =>
    setModalIndex((modalIndex - 1 + images.length) % images.length);
  const nextImage = () => setModalIndex((modalIndex + 1) % images.length);

  // Лоадер під час завантаження продуктів
  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress size={60} sx={{ color: "#115e59" }} />
        <Typography variant="h6" sx={{ mt: 2, color: "#115e59" }}>
          Завантаження каталогу...
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: "#6b7280" }}>
          Будь ласка, зачекайте
        </Typography>
      </Box>
    );
  }

  // Лоадер під час пошуку конкретного товару
  if (productLoading) {
    return (
      <div className={styles.productPage}>
        <Container maxWidth="lg">
          {/* Хлібні крихти - скелетон */}
          <Box sx={{ mb: 2 }}>
            <Skeleton
              variant="rectangular"
              height={40}
              sx={{ borderRadius: 2 }}
            />
          </Box>

          {/* Зображення товару - скелетон */}
          <Paper className={styles.imageSection} elevation={2} sx={{ mb: 4 }}>
            <Skeleton
              variant="rectangular"
              height={400}
              sx={{ borderRadius: 2, mb: 2 }}
            />
            <Box sx={{ display: "flex", gap: 1 }}>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  width={80}
                  height={80}
                  sx={{ borderRadius: 1 }}
                />
              ))}
            </Box>
          </Paper>

          <Grid container spacing={4}>
            {/* Ліва колонка - скелетон */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper className={styles.additionalInfo} elevation={2}>
                <Skeleton
                  variant="text"
                  width="60%"
                  height={32}
                  sx={{ mb: 2 }}
                />
                <Skeleton
                  variant="text"
                  width="100%"
                  height={20}
                  sx={{ mb: 1 }}
                />
                <Skeleton
                  variant="text"
                  width="90%"
                  height={20}
                  sx={{ mb: 1 }}
                />
                <Skeleton
                  variant="text"
                  width="80%"
                  height={20}
                  sx={{ mb: 2 }}
                />
                <Skeleton
                  variant="text"
                  width="50%"
                  height={24}
                  sx={{ mb: 1 }}
                />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} variant="text" width="70%" height={20} />
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* Права колонка - скелетон */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper className={styles.infoSection} elevation={2}>
                <Skeleton
                  variant="text"
                  width="40%"
                  height={32}
                  sx={{ mb: 2 }}
                />
                <Skeleton
                  variant="text"
                  width="80%"
                  height={48}
                  sx={{ mb: 2 }}
                />
                <Divider sx={{ my: 2 }} />
                <Skeleton
                  variant="text"
                  width="60%"
                  height={48}
                  sx={{ mb: 2 }}
                />
                <Divider sx={{ my: 2 }} />
                <Skeleton
                  variant="text"
                  width="50%"
                  height={32}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Skeleton
                    variant="rectangular"
                    height={48}
                    sx={{ borderRadius: 1 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    height={48}
                    sx={{ borderRadius: 1 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    height={48}
                    sx={{ borderRadius: 1 }}
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </div>
    );
  }

  // Помилка - товар не знайдено
  if (productError || !product) {
    return (
      <Container maxWidth="lg" className={styles.errorContainer}>
        <Fade in={true} timeout={500}>
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Alert severity="error" sx={{ mb: 3, maxWidth: 600, mx: "auto" }}>
              <Typography variant="h6" gutterBottom>
                Товар не знайдено
              </Typography>
              <Typography variant="body1">
                На жаль, товар з ID "{productId}" не існує або був видалений.
              </Typography>
            </Alert>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Доступно товарів у каталозі: {products.length}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Button
                component={Link}
                to="/catalog"
                variant="contained"
                startIcon={<ArrowBack />}
                sx={{
                  background:
                    "linear-gradient(135deg, #115e59 0%, #134e4a 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #134e4a 0%, #0f3d3a 100%)",
                  },
                }}
              >
                Повернутися до каталогу
              </Button>
              <Button
                component={Link}
                to="/"
                variant="outlined"
                sx={{
                  borderColor: "#115e59",
                  color: "#115e59",
                  "&:hover": {
                    borderColor: "#134e4a",
                    backgroundColor: "rgba(17, 94, 89, 0.04)",
                  },
                }}
              >
                На головну
              </Button>
            </Box>
          </Box>
        </Fade>
      </Container>
    );
  }

  // Основний контент товару
  const images = product.Фото || [];
  const mainImage =
    images[selectedImage] ||
    product.imageUrl ||
    product.зображення ||
    "https://via.placeholder.com/1200x600?text=Немає+зображення";

  return (
    <Fade in={true} timeout={800}>
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
              image={mainImage}
              alt={product.Назва || product.name}
              className={styles.mainImage}
              onClick={() => openModal(selectedImage)}
              style={{ cursor: images.length > 0 ? "pointer" : "default" }}
            />
            {images.length > 1 && (
              <Box className={styles.thumbnailContainer}>
                {images.map((img, index) => (
                  <Card
                    key={index}
                    className={`${styles.thumbnail} ${
                      selectedImage === index ? styles.selectedThumbnail : ""
                    }`}
                    onClick={() => openModal(index)}
                    onMouseEnter={() => setSelectedImage(index)}
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

          {/* Модалка для фото */}
          <Modal open={modalOpen} onClose={closeModal}>
            <Box className={styles.modalBox}>
              <IconButton className={styles.modalClose} onClick={closeModal}>
                <Close />
              </IconButton>
              <IconButton className={styles.modalArrowLeft} onClick={prevImage}>
                <ArrowBackIos />
              </IconButton>
              <img
                src={images[modalIndex]}
                alt={`Фото ${modalIndex + 1}`}
                className={styles.modalImage}
              />
              <IconButton
                className={styles.modalArrowRight}
                onClick={nextImage}
              >
                <ArrowForwardIos />
              </IconButton>
            </Box>
          </Modal>

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

              <Paper
                className={styles.contactInfo}
                elevation={2}
                sx={{ mt: 4 }}
              >
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
    </Fade>
  );
};

export default ProductPage;
