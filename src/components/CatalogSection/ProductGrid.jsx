import React from "react";
import { Box, Typography, Grid, Alert } from "@mui/material";
import ProductCard from "./ProductCard";
import styles from "./ProductGrid.module.css";

const ProductGrid = ({ products, filterName }) => {
  return (
    <Box>
      <Typography variant="h4" component="h1" className={styles.title}>
        {filterName}
      </Typography>

      {products.length === 0 ? (
        <Alert severity="info" className={styles.alert}>
          За цим запитом товари не знайдено.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid key={product.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ProductGrid;
