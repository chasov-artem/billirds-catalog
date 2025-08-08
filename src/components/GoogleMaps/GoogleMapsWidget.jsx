import React from "react";
import { Box, Paper, Typography, Button, Grid } from "@mui/material";
import { LocationOn, Directions, Phone, AccessTime } from "@mui/icons-material";
import styles from "./GoogleMapsWidget.module.css";

const GoogleMapsWidget = () => {
  const handleDirections = () => {
    const address = encodeURIComponent("Дніпро, вул Антоновича 79");
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${address}`,
      "_blank"
    );
  };

  const handleCall = () => {
    window.open("tel:+380664070941", "_self");
  };

  const handleViewOnMap = () => {
    const address = encodeURIComponent("Дніпро, вул Антоновича 79");
    window.open(`https://www.google.com/maps/place/${address}`, "_blank");
  };

  return (
    <Paper className={styles.mapsContainer} elevation={3}>
      <Box className={styles.header}>
        <LocationOn className={styles.locationIcon} />
        <Typography variant="h6" className={styles.title}>
          Наше розташування
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Карта */}
        <Grid item xs={12} md={8}>
          <Box className={styles.mapContainer}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2540.1234567890123!2d35.12345678901234!3d48.12345678901234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDA3JzM0LjQiTiAzNcKwMDcnMzQuNCJF!5e0!3m2!1suk!2sua!4v1234567890123"
              width="100%"
              height="300"
              style={{ border: 0, borderRadius: "8px" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Більярд сервіс на карті"
            />
          </Box>
        </Grid>

        {/* Інформація */}
        <Grid item xs={12} md={4}>
          <Box className={styles.infoContainer}>
            <Typography variant="h6" className={styles.addressTitle}>
              Адреса
            </Typography>
            <Typography variant="body1" className={styles.address}>
              Дніпро, вул Антоновича 79
            </Typography>

            <Box className={styles.contactInfo}>
              <Typography variant="h6" className={styles.contactTitle}>
                Контакти
              </Typography>
              <Typography variant="body2" className={styles.phone}>
                📞 066 407 09 41 (Viber/Telegram)
              </Typography>
              <Typography variant="body2" className={styles.phone}>
                📞 067 541 73 08
              </Typography>
            </Box>

            <Box className={styles.workingHours}>
              <Typography variant="h6" className={styles.hoursTitle}>
                Робочі години
              </Typography>
              <Typography variant="body2" className={styles.hours}>
                <AccessTime className={styles.timeIcon} />
                Пн-Пт: 9:00 - 18:00
              </Typography>
              <Typography variant="body2" className={styles.hours}>
                <AccessTime className={styles.timeIcon} />
                Сб-Нд: 9:00 - 15:00
              </Typography>
            </Box>

            <Box className={styles.actionButtons}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<Directions />}
                onClick={handleDirections}
                className={styles.directionsButton}
                sx={{
                  background:
                    "linear-gradient(135deg, #115e59 0%, #134e4a 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #134e4a 0%, #0f3d3a 100%)",
                  },
                }}
              >
                Маршрут
              </Button>

              <Button
                variant="outlined"
                fullWidth
                startIcon={<Phone />}
                onClick={handleCall}
                className={styles.callButton}
                sx={{
                  borderColor: "#115e59",
                  color: "#115e59",
                  "&:hover": {
                    borderColor: "#134e4a",
                    backgroundColor: "rgba(17, 94, 89, 0.04)",
                  },
                }}
              >
                Зателефонувати
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={handleViewOnMap}
                className={styles.mapButton}
                sx={{
                  borderColor: "#115e59",
                  color: "#115e59",
                  "&:hover": {
                    borderColor: "#134e4a",
                    backgroundColor: "rgba(17, 94, 89, 0.04)",
                  },
                }}
              >
                Переглянути на карті
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default GoogleMapsWidget;
