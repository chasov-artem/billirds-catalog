import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <AppBar position="static" className={styles.header}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" className={styles.logoLink}>
            Більярд Сервіс
          </Link>
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit" component={Link} to="/">
            Головна
          </Button>
          <Button color="inherit" component={Link} to="/catalog">
            Каталог
          </Button>
          <Button color="inherit" component={Link} to="/admin">
            Адмін
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
