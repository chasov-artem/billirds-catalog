import React, { useState } from "react";
import { Box, Typography, Grid, Alert, Pagination } from "@mui/material";
import ProductCard from "./ProductCard";
import styles from "./ProductGrid.module.css";

const PAGE_SIZE = 20;

const ProductGrid = ({ products, filterName }) => {
  const [page, setPage] = useState(1);

  // Сортуємо товари: більярдні столи першими, потім інші категорії
  const sortedProducts = [...products].sort((a, b) => {
    const categoryA = a.Категорія || "";
    const categoryB = b.Категорія || "";

    // Більярдні столи завжди першими
    if (categoryA === "Більярдні столи" && categoryB !== "Більярдні столи") {
      return -1;
    }
    if (categoryA !== "Більярдні столи" && categoryB === "Більярдні столи") {
      return 1;
    }

    // Якщо обидва більярдні столи або обидва не більярдні столи, сортуємо за назвою
    const nameA = (a.Назва || a.name || "").toLowerCase();
    const nameB = (b.Назва || b.name || "").toLowerCase();
    return nameA.localeCompare(nameB);
  });

  const pageCount = Math.ceil(sortedProducts.length / PAGE_SIZE);
  const paginatedProducts = sortedProducts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <Box>
      <Typography variant="h4" component="h1" className={styles.title}>
        {filterName}
      </Typography>

      {sortedProducts.length === 0 ? (
        <Alert severity="info" className={styles.alert}>
          За цим запитом товари не знайдено.
        </Alert>
      ) : (
        <>
          <Grid container spacing={3}>
            {paginatedProducts.map((product) => (
              <Grid key={product.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
          {pageCount > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={pageCount}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                shape="rounded"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default ProductGrid;
