import React from "react";
import { Box, Container } from "@mui/material";
import CatalogSection from "../../components/CatalogSection/CatalogSection";
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

      {/* Catalog Section */}
      <CatalogSection />
    </Box>
  );
};

export default Home;
