import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import styles from "./Header.module.css";

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleDrawerToggle = () => setDrawerOpen((prev) => !prev);

  return (
    <AppBar position="static" className={styles.header}>
      <Toolbar className={styles.toolbar}>
        {/* Лого */}
        <Typography variant="h6" component="div" className={styles.logoBox}>
          <Link to="/" className={styles.logoLink}>
            Більярд Сервіс
          </Link>
        </Typography>

        {/* Адреса та контакти (тільки desktop) */}
        <Box className={styles.contactsBox}>
          <Typography variant="body2" className={styles.contactsText}>
            <span>Дніпро, вул Антоновича 79</span> |{" "}
            <a href="tel:0664070941" className={styles.contactLink}>
              066 407 09 41
            </a>{" "}
            |{" "}
            <a href="tel:0675417308" className={styles.contactLink}>
              067 541 73 08
            </a>{" "}
            | <span>Андрій</span>
          </Typography>
        </Box>

        {/* Навігація */}
        <Box className={styles.navBox}>
          <Box className={styles.desktopNav}>
            <Button color="inherit" component={Link} to="/">
              Головна
            </Button>
            <Button color="inherit" component={Link} to="/catalog">
              Каталог
            </Button>
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
            className={styles.burgerButton}
            sx={{ display: { xs: "flex", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        {/* Drawer для мобільного меню */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          className={styles.mobileDrawer}
        >
          <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={handleDrawerToggle}
          >
            <List>
              <ListItem component={Link} to="/">
                <ListItemText primary="Головна" />
              </ListItem>
              <ListItem component={Link} to="/catalog">
                <ListItemText primary="Каталог" />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <span>
                      <span>Дніпро, вул Антоновича 79</span>
                      <br />
                      <a href="tel:0664070941" className={styles.contactLink}>
                        066 407 09 41
                      </a>
                      <br />
                      <a href="tel:0675417308" className={styles.contactLink}>
                        067 541 73 08
                      </a>
                      <br />
                      <span>Андрій</span>
                    </span>
                  }
                />
              </ListItem>
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
