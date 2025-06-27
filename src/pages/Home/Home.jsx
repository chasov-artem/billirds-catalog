import React from "react";
import { Box, Container, Fade } from "@mui/material";
import CatalogSection from "../../components/CatalogSection/CatalogSection";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <Fade in={true} timeout={800}>
      <Box className={styles.home}>
        {/* Hero Section */}
        <Box className={styles.heroSection}>
          <Container maxWidth="lg">
            <Box className={styles.heroContent}>
              <h1>Більярд Сервіс</h1>
              <p>Якісні більярдні столи для вашого дому та бізнесу</p>
            </Box>
          </Container>
        </Box>

        {/* Catalog Section */}
        <CatalogSection />
      </Box>
    </Fade>
  );
};

export default Home;
