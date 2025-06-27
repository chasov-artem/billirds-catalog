import React from "react";
import { Box, Container, Fade, Typography, Grid, Paper } from "@mui/material";
import { GiReceiveMoney, Gi3dHammer } from "react-icons/gi";
import { BsWrenchAdjustable } from "react-icons/bs";
import CatalogSection from "../../components/CatalogSection/CatalogSection";
import styles from "./Home.module.css";

const services = [
  {
    title: "Скупка більярдних столів",
    icon: <GiReceiveMoney size={48} color="#10b981" />,
    description:
      "Швидко та вигідно викупимо ваш старий більярдний стіл. Оцінка та вивіз у зручний для вас час.",
  },
  {
    title: "Збірка більярдних столів",
    icon: <Gi3dHammer size={48} color="#10b981" />,
    description:
      "Професійна збірка столів будь-якої складності. Гарантія якості та точності монтажу.",
  },
  {
    title: "Перетяжка більярдних столів",
    icon: <BsWrenchAdjustable size={48} color="#10b981" />,
    description:
      "Якісна заміна сукна та ремонт ігрової поверхні. Оновимо ваш стіл до ідеального стану!",
  },
];

const Home = () => {
  return (
    <Fade in={true} timeout={800}>
      <Box className={styles.home}>
        {/* Hero Section */}
        <Box className={styles.heroSection}>
          <Container maxWidth="lg">
            <Box className={styles.heroContent}>
              {/* <h1>Більярд Сервіс</h1>
              <p>Якісні більярдні столи для вашого дому та бізнесу</p> */}
            </Box>
          </Container>
        </Box>

        {/* Services Section */}
        <Container maxWidth="lg" className={styles.servicesSection}>
          <Typography
            variant="h4"
            align="center"
            sx={{ fontWeight: 700, mb: 4, color: "#115e59" }}
          >
            Наші послуги
          </Typography>
          <Grid
            container
            spacing={4}
            justifyContent="center"
            wrap="nowrap"
            className={styles.servicesRow}
          >
            {services.map((service, idx) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={idx}
                className={styles.serviceGridItem}
              >
                <Paper elevation={3} className={styles.serviceCard}>
                  <Box className={styles.serviceIcon}>{service.icon}</Box>
                  <Typography variant="h6" className={styles.serviceTitle}>
                    {service.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    className={styles.serviceDescription}
                  >
                    {service.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Catalog Section */}
        <CatalogSection />
      </Box>
    </Fade>
  );
};

export default Home;
