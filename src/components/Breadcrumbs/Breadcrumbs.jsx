import React from "react";
import {
  Breadcrumbs as MuiBreadcrumbs,
  Link,
  Typography,
  Box,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Home, NavigateNext } from "@mui/icons-material";

const Breadcrumbs = ({ items = [] }) => {
  const location = useLocation();

  // Автоматично генеруємо breadcrumbs на основі URL
  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    const breadcrumbs = [
      {
        label: "Головна",
        href: "/",
        icon: <Home fontSize="small" />,
      },
    ];

    let currentPath = "";
    pathnames.forEach((name, index) => {
      currentPath += `/${name}`;

      // Мапимо URL на читабельні назви
      const labelMap = {
        catalog: "Каталог",
        product: "Товар",
        favorites: "Обране",
        about: "Про нас",
        admin: "Адмін панель",
      };

      const label = labelMap[name] || name;

      // Останній елемент не є посиланням
      const isLast = index === pathnames.length - 1;

      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath,
        isLast,
      });
    });

    return breadcrumbs;
  };

  // Використовуємо передані items або генеруємо автоматично
  const breadcrumbItems = items.length > 0 ? items : generateBreadcrumbs();

  return (
    <Box sx={{ py: 2, px: { xs: 2, md: 0 } }}>
      <MuiBreadcrumbs
        separator={<NavigateNext fontSize="small" />}
        aria-label="breadcrumb"
        sx={{
          "& .MuiBreadcrumbs-separator": {
            color: "#666",
          },
        }}
      >
        {breadcrumbItems.map((item, index) => {
          const isLast = item.isLast || index === breadcrumbItems.length - 1;

          if (isLast) {
            return (
              <Typography
                key={item.label}
                color="text.primary"
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                {item.icon}
                {item.label}
              </Typography>
            );
          }

          return (
            <Link
              key={item.label}
              component={RouterLink}
              to={item.href}
              color="inherit"
              underline="hover"
              sx={{
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                "&:hover": {
                  color: "#1976d2",
                },
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs;
