import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box, CssBaseline, CircularProgress } from "@mui/material";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import PerformanceMonitor from "./components/Performance/PerformanceMonitor";

// Lazy loading для покращення продуктивності
const Home = React.lazy(() => import("./pages/Home/Home"));
const CatalogPage = React.lazy(() => import("./pages/Catalog/CatalogPage"));
const ProductPage = React.lazy(() => import("./pages/Product/ProductPage"));
const FavoritesPage = React.lazy(() =>
  import("./pages/Favorites/FavoritesPage")
);
const AboutPage = React.lazy(() => import("./pages/About/AboutPage"));
const AdminPage = React.lazy(() => import("./pages/Admin/AdminPage"));
const NotFound = React.lazy(() => import("./pages/NotFound/NotFound"));

// Loading component
const LoadingSpinner = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "400px",
    }}
  >
    <CircularProgress size={60} sx={{ color: "#115e59" }} />
  </Box>
);

function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      <PerformanceMonitor />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          maxWidth: "1280px",
          margin: "0 auto",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          backgroundColor: "#fff",
        }}
      >
        <Header />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Box>
        <Footer />
      </Box>
    </BrowserRouter>
  );
}

export default App;
