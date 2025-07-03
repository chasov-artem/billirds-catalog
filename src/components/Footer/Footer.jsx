import React from "react";
import { Box, Typography, Container, Grid, Link } from "@mui/material";
import { Phone, Email, Telegram, WhatsApp } from "@mui/icons-material";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <Box component="footer" className={styles.footer}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" gutterBottom>
              Більярд Сервіс
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Якісні більярдні столи для вашого дому та бізнесу. Професійне
              обладнання від перевірених виробників.
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" gutterBottom>
              Контакти
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link href="tel:0664070941" className={styles.contactLink}>
                <Phone sx={{ mr: 1 }} />
                066 407 09 41 (Viber/Telegram)
              </Link>
              <Link href="tel:0675417308" className={styles.contactLink}>
                <Phone sx={{ mr: 1 }} />
                067 541 73 08
              </Link>
              <Link
                href="mailto:biillija777@gmail.com"
                className={styles.contactLink}
              >
                <Email sx={{ mr: 1 }} />
                biillija777@gmail.com
              </Link>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Дніпро, вул Антоновича 79
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
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
