import React from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  Fade,
} from "@mui/material";
import { Home, Search, ArrowBack, ErrorOutline } from "@mui/icons-material";
import styles from "./NotFound.module.css";

const NotFound = () => {
  return (
    <Fade in={true} timeout={1000}>
      <div className={styles.notFoundPage}>
        <Container maxWidth="lg">
          <Box className={styles.content}>
            {/* Іконка помилки */}
            <Box className={styles.errorIcon}>
              <ErrorOutline sx={{ fontSize: 120, color: "#115e59" }} />
            </Box>

            {/* Заголовок */}
            <Typography variant="h1" className={styles.errorCode}>
              404
            </Typography>

            <Typography variant="h4" className={styles.errorTitle}>
              Сторінку не знайдено
            </Typography>

            <Typography variant="body1" className={styles.errorMessage}>
              На жаль, сторінка, яку ви шукаєте, не існує або була переміщена.
              <br />
              Перевірте правильність URL або поверніться на головну сторінку.
            </Typography>

            {/* Кнопки навігації */}
            <Box className={styles.navigationButtons}>
              <Grid container spacing={2} justifyContent="center">
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Button
                    component={Link}
                    to="/"
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={<Home />}
                    className={styles.homeButton}
                  >
                    На головну
                  </Button>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Button
                    component={Link}
                    to="/catalog"
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={<Search />}
                    className={styles.catalogButton}
                  >
                    До каталогу
                  </Button>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    size="large"
                    startIcon={<ArrowBack />}
                    onClick={() => window.history.back()}
                    className={styles.backButton}
                  >
                    Назад
                  </Button>
                </Grid>
              </Grid>
            </Box>

            {/* Додаткова інформація */}
            <Paper className={styles.infoCard}>
              <Typography variant="h6" gutterBottom>
                Що можна зробити:
              </Typography>
              <Box className={styles.suggestions}>
                <Typography variant="body2" component="div">
                  • Перевірте правильність URL адреси
                </Typography>
                <Typography variant="body2" component="div">
                  • Використайте пошук для знаходження потрібної сторінки
                </Typography>
                <Typography variant="body2" component="div">
                  • Перейдіть до каталогу товарів
                </Typography>
                <Typography variant="body2" component="div">
                  • Зв'яжіться з нами для отримання допомоги
                </Typography>
              </Box>
            </Paper>

            {/* Контактна інформація */}
            <Box className={styles.contactInfo}>
              <Typography variant="body2" color="text.secondary">
                Потрібна допомога? Зв'яжіться з нами:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                📞 066 407 09 41 | 📧 info@billiardservice.com
              </Typography>
            </Box>
          </Box>
        </Container>
      </div>
    </Fade>
  );
};

export default NotFound;
