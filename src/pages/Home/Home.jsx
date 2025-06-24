import React from "react";
import { Box, Container } from "@mui/material";
import CatalogSection from "../../components/CatalogSection/CatalogSection";
import ImageUploadTest from "../../components/ImageUploadTest/ImageUploadTest";
import QuickImageTest from "../../components/QuickImageTest/QuickImageTest";
import TestDataGenerator from "../../components/TestDataGenerator/TestDataGenerator";
import StorageTest from "../../components/StorageTest/StorageTest";
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

      {/* Storage Test */}
      <StorageTest />

      {/* Test Data Generator */}
      <TestDataGenerator />

      {/* Quick Image Upload Test */}
      <QuickImageTest />

      {/* Image Upload Test Section */}
      <ImageUploadTest />

      {/* Catalog Section */}
      <CatalogSection />
    </Box>
  );
};

export default Home;
