import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Альтернатива якщо BrowserRouter не працює на Vercel:
// import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Box, CssBaseline, CircularProgress } from "@mui/material";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import PerformanceMonitor from "./components/Performance/PerformanceMonitor";
import LazyFirebaseAuth from "./components/LazyFirebaseAuth/LazyFirebaseAuth";
import "./App.css";

// Lazy loading для сторінок
const Home = lazy(() => import("./pages/Home/Home"));
const CatalogPage = lazy(() => import("./pages/Catalog/CatalogPage"));
const ProductPage = lazy(() => import("./pages/Product/ProductPage"));
const FavoritesPage = lazy(() => import("./pages/Favorites/FavoritesPage"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));
const AdminPage = lazy(() => import("./pages/Admin/AdminPage"));

function App() {
  return (
    <LazyFirebaseAuth>
      <Router>
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
            <Suspense
              fallback={
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
              }
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/product/:productId" element={<ProductPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Box>
          <Footer />
        </Box>
      </Router>
    </LazyFirebaseAuth>
  );
}

export default App;
