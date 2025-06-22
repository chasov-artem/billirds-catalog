import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
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
        }}
      >
        <Header />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<div>Каталог (буде додано)</div>} />
            <Route
              path="/admin"
              element={<div>Адмін панель (буде додано)</div>}
            />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </Router>
  );
}

export default App;
