import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import { ProductsProvider } from "./context/ProductsContext";
import "./App.css";

function App() {
  return (
    <ProductsProvider>
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
              <Route
                path="/catalog"
                element={<div>Каталог (буде додано)</div>}
              />
              <Route
                path="/admin"
                element={<div>Адмін панель (буде додано)</div>}
              />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ProductsProvider>
  );
}

export default App;
