import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Альтернатива якщо BrowserRouter не працює на Vercel:
// import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import CatalogPage from "./pages/Catalog/CatalogPage";
import ProductPage from "./pages/Product/ProductPage";
import FavoritesPage from "./pages/Favorites/FavoritesPage";
import NotFound from "./pages/NotFound/NotFound";
import AdminPage from "./pages/Admin/AdminPage";
import "./App.css";

function App() {
  return (
    <Router>
      <CssBaseline />
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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/product/:productId" element={<ProductPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </Router>
  );
}

export default App;
