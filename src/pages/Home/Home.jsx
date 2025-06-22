import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { SportsEsports, LocalShipping, Support } from "@mui/icons-material";
import { Link } from "react-router-dom";
import ProductsTest from "../../components/ProductsTest/ProductsTest";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <Box className={styles.home}>
      {/* Hero Section */}
      <Box className={styles.heroSection}>
        <Container maxWidth="lg">
          <Box className={styles.heroContent}>{/* Content removed */}</Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          Чому Обирають Нас
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card className={styles.featureCard}>
              <CardContent>
                <SportsEsports className={styles.featureIcon} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Якість
                </Typography>
                <Typography variant="body1">
                  Тільки перевірені виробники з гарантією якості. Професійне
                  обладнання для серйозної гри.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card className={styles.featureCard}>
              <CardContent>
                <LocalShipping className={styles.featureIcon} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Доставка
                </Typography>
                <Typography variant="body1">
                  Швидка доставка по всій Україні. Збірка та налаштування на
                  місці.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card className={styles.featureCard}>
              <CardContent>
                <Support className={styles.featureIcon} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Підтримка
                </Typography>
                <Typography variant="body1">
                  Технічна підтримка та консультації. Запчастини та аксесуари
                  завжди в наявності.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Firebase Test Section */}
      <Box sx={{ bgcolor: "#f8f9fa", py: 4 }}>
        <ProductsTest />
      </Box>

      {/* CTA Section */}
      <Box className={styles.ctaSection}>
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            Готові Обрати Свій Стіл?
          </Typography>
          <Typography variant="h6" align="center" sx={{ mb: 4 }}>
            Зв'яжіться з нами для консультації та замовлення
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              size="large"
              href="https://t.me/your-username"
              target="_blank"
            >
              Telegram
            </Button>
            <Button
              variant="contained"
              size="large"
              href="https://wa.me/380XXXXXXXXX"
              target="_blank"
            >
              WhatsApp
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/catalog"
            >
              Каталог
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
