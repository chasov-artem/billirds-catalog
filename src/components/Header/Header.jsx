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
  Badge,
} from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LogoCustom from "../Logo/LogoCustom";
import { useFavorites } from "../../context/FavoritesContext";
import styles from "./Header.module.css";

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { favoritesCount } = useFavorites();
  const handleDrawerToggle = () => setDrawerOpen((prev) => !prev);

  return (
    <AppBar position="static" className={styles.header}>
      <Toolbar className={styles.toolbar}>
        {/* Лого */}
        <Box className={styles.logoBox}>
          <Link to="/" className={styles.logoLink}>
            <LogoCustom width={200} height={80} />
          </Link>
        </Box>

        {/* Адреса та контакти (тільки desktop) */}
        <Box className={styles.contactsBox}>
          <Typography variant="body2" className={styles.contactsText}>
            <span>Дніпро, Антоновича 79</span>
            <br />
            <span>
              <a href="tel:0664070941" className={styles.contactLink}>
                066 407 09 41
              </a>{" "}
              |{" "}
              <a href="tel:0675417308" className={styles.contactLink}>
                067 541 73 08
              </a>{" "}
              | <span>Андрій</span>
            </span>
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
            <Button color="inherit" component={Link} to="/about">
              Про нас
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/favorites"
              startIcon={
                <Badge badgeContent={favoritesCount} color="error">
                  <FavoriteIcon />
                </Badge>
              }
            >
              Обране
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/admin"
              startIcon={<AdminPanelSettingsIcon />}
              className={styles.adminButton}
            >
              Адмін
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
              <ListItem component={Link} to="/about">
                <ListItemText primary="Про нас" />
              </ListItem>
              <ListItem component={Link} to="/favorites">
                <ListItemText
                  primary={
                    <span>
                      Обране
                      <Badge
                        badgeContent={favoritesCount}
                        color="error"
                        sx={{ ml: 1 }}
                      >
                        <FavoriteIcon fontSize="small" />
                      </Badge>
                    </span>
                  }
                />
              </ListItem>
              <ListItem component={Link} to="/admin">
                <ListItemText
                  primary="Адмін"
                  primaryTypographyProps={{
                    sx: {
                      display: "flex",
                      alignItems: "center",
                      fontWeight: "bold",
                    },
                  }}
                />
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
