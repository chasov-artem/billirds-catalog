import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useProducts } from "../../context/ProductsContext";
import styles from "./CategorySidebar.module.css";

const CategorySidebar = ({ onFilterChange, activeFilter }) => {
  const { products } = useProducts();
  const [categories, setCategories] = useState({});
  const [open, setOpen] = useState({});

  useEffect(() => {
    const grouped = products.reduce((acc, product) => {
      const category = product.Категорія || "Інше";
      const subCategory = product.Підкатегорія;

      if (!acc[category]) {
        acc[category] = { count: 0, subCategories: {} };
      }
      acc[category].count++;

      if (subCategory) {
        if (!acc[category].subCategories[subCategory]) {
          acc[category].subCategories[subCategory] = 0;
        }
        acc[category].subCategories[subCategory]++;
      }
      return acc;
    }, {});
    setCategories(grouped);
  }, [products]);

  const handleToggle = (category) => {
    setOpen((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const createClickHandler = (type, value) => () => {
    onFilterChange(type, value);
  };

  const isSelected = (type, value) => {
    return activeFilter.type === type && activeFilter.value === value;
  };

  return (
    <Box className={styles.sidebar}>
      <Typography variant="h6" className={styles.title}>
        Каталог Товарів
      </Typography>
      <List component="nav" dense>
        <ListItemButton
          onClick={createClickHandler("all", "Усі товари")}
          selected={isSelected("all", "Усі товари")}
          className={styles.listItem}
        >
          <ListItemText primary="Усі товари" />
        </ListItemButton>

        {Object.entries(categories).map(([category, data]) => (
          <React.Fragment key={category}>
            <ListItemButton
              onClick={createClickHandler("category", category)}
              selected={isSelected("category", category)}
              className={styles.listItem}
            >
              <ListItemText
                primary={`${category} (${data.count})`}
                primaryTypographyProps={{ fontWeight: "bold" }}
              />
              {Object.keys(data.subCategories).length > 0 && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggle(category);
                  }}
                >
                  {open[category] ? <ExpandLess /> : <ExpandMore />}
                </span>
              )}
            </ListItemButton>
            {Object.keys(data.subCategories).length > 0 && (
              <Collapse in={open[category]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {Object.entries(data.subCategories).map(([sub, count]) => (
                    <ListItemButton
                      key={sub}
                      sx={{ pl: 4 }}
                      onClick={createClickHandler("subcategory", sub)}
                      selected={isSelected("subcategory", sub)}
                      className={styles.nestedListItem}
                    >
                      <ListItemText primary={`${sub} (${count})`} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default CategorySidebar;
