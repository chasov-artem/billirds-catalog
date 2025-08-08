import React from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Phone,
  LocationOn,
  AccessTime,
  Star,
  Directions,
  Business,
} from "@mui/icons-material";
import styles from "./GoogleMyBusinessWidget.module.css";

const GoogleMyBusinessWidget = () => {
  const handleCall = () => {
    window.open("tel:+380664070941", "_self");
  };

  const handleDirections = () => {
    const address = encodeURIComponent("Дніпро, вул Антоновича 79");
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${address}`,
      "_blank"
    );
  };



  return (
    <Paper className={styles.widgetContainer} elevation={3}>
      <Box className={styles.header}>
        <Business className={styles.businessIcon} />
        <Box className={styles.businessInfo}>
          <Typography variant="h6" className={styles.businessName}>
            Більярд сервіс
          </Typography>
          <Box className={styles.ratingContainer}>
            <Star className={styles.starIcon} />
            <Typography variant="body2" className={styles.rating}>
              Поки немає відгуків
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={2} className={styles.content}>
        {/* Контактна інформація */}
        <Grid item xs={12} md={6}>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <Phone className={styles.icon} />
              </ListItemIcon>
              <ListItemText
                primary="066 407 09 41"
                secondary="Viber/Telegram"
                className={styles.contactText}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Phone className={styles.icon} />
              </ListItemIcon>
              <ListItemText
                primary="067 541 73 08"
                secondary="Телефон"
                className={styles.contactText}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <LocationOn className={styles.icon} />
              </ListItemIcon>
              <ListItemText
                primary="Дніпро, вул Антоновича 79"
                secondary="Адреса"
                className={styles.contactText}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <AccessTime className={styles.icon} />
              </ListItemIcon>
              <ListItemText
                primary="Пн-Пт: 9:00-18:00, Сб-Нд: 9:00-15:00"
                secondary="Робочі години"
                className={styles.contactText}
              />
            </ListItem>
          </List>
        </Grid>

        {/* Кнопки дій */}
        <Grid item xs={12} md={6}>
          <Box className={styles.actionButtons}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<Phone />}
              onClick={handleCall}
              className={styles.callButton}
              sx={{
                background: "linear-gradient(135deg, #115e59 0%, #134e4a 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #134e4a 0%, #0f3d3a 100%)",
                },
              }}
            >
              Зателефонувати
            </Button>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<Directions />}
              onClick={handleDirections}
              className={styles.directionsButton}
              sx={{
                borderColor: "#115e59",
                color: "#115e59",
                "&:hover": {
                  borderColor: "#134e4a",
                  backgroundColor: "rgba(17, 94, 89, 0.04)",
                },
              }}
            >
              Маршрут
            </Button>

            
          </Box>
        </Grid>
      </Grid>

      {/* Атрибути бізнесу */}
      <Box className={styles.attributes}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Послуги:
        </Typography>
        <Box className={styles.chipContainer}>
          <Chip label="Продаж столів" size="small" className={styles.chip} />
          <Chip label="Скупка столів" size="small" className={styles.chip} />
          <Chip label="Збірка" size="small" className={styles.chip} />
          <Chip label="Перетяжка" size="small" className={styles.chip} />
          <Chip label="Доставка" size="small" className={styles.chip} />
          <Chip label="Гарантія" size="small" className={styles.chip} />
        </Box>
      </Box>
    </Paper>
  );
};

export default GoogleMyBusinessWidget;
