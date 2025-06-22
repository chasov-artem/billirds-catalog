import React from "react";
import { Box, Typography, Container, Grid, Link } from "@mui/material";
import { Phone, Email, Telegram, WhatsApp } from "@mui/icons-material";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <Box component="footer" className={styles.footer}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Більярдні Столи
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Якісні більярдні столи для вашого дому та бізнесу. Професійне
              обладнання від перевірених виробників.
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Контакти
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link href="tel:+380XXXXXXXXX" className={styles.contactLink}>
                <Phone sx={{ mr: 1 }} />
                +380 XX XXX XX XX
              </Link>
              <Link
                href="mailto:info@billiard-tables.com"
                className={styles.contactLink}
              >
                <Email sx={{ mr: 1 }} />
                info@billiard-tables.com
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Соціальні мережі
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Link
                href="https://t.me/your-username"
                className={styles.socialLink}
              >
                <Telegram />
              </Link>
              <Link
                href="https://wa.me/380XXXXXXXXX"
                className={styles.socialLink}
              >
                <WhatsApp />
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ borderTop: 1, borderColor: "divider", mt: 3, pt: 2 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            © 2024 Більярдні Столи. Всі права захищені.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
