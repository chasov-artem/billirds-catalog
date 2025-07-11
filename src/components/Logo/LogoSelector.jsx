import React, { useState } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import Logo from "./Logo";
import LogoVariant2 from "./LogoVariant2";
import LogoVariant3 from "./LogoVariant3";
import LogoVariant4 from "./LogoVariant4";

const LogoSelector = ({ onSelect, currentVariant = 1 }) => {
  const [selectedVariant, setSelectedVariant] = useState(currentVariant);

  const variants = [
    { id: 1, name: "Кий", component: Logo },
    { id: 2, name: "Куля", component: LogoVariant2 },
    { id: 3, name: "Стіл", component: LogoVariant3 },
    { id: 4, name: "Текстовий", component: LogoVariant4 },
  ];

  const handleVariantSelect = (variantId) => {
    setSelectedVariant(variantId);
    if (onSelect) {
      onSelect(variantId);
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2, textAlign: "center" }}>
        Виберіть варіант лого
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "center",
          mb: 3,
        }}
      >
        {variants.map((variant) => {
          const LogoComponent = variant.component;
          return (
            <Paper
              key={variant.id}
              sx={{
                p: 2,
                cursor: "pointer",
                border:
                  selectedVariant === variant.id
                    ? "3px solid #115e59"
                    : "1px solid #ddd",
                borderRadius: 2,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                },
              }}
              onClick={() => handleVariantSelect(variant.id)}
            >
              <Box sx={{ mb: 1, textAlign: "center" }}>
                <LogoComponent size="medium" light />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  textAlign: "center",
                  fontWeight: selectedVariant === variant.id ? 600 : 400,
                  color: selectedVariant === variant.id ? "#115e59" : "#666",
                }}
              >
                {variant.name}
              </Typography>
            </Paper>
          );
        })}
      </Box>

      <Box sx={{ textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Обраний варіант:{" "}
          <strong>
            {variants.find((v) => v.id === selectedVariant)?.name}
          </strong>
        </Typography>

        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              const LogoComponent = variants.find(
                (v) => v.id === selectedVariant
              )?.component;
              if (LogoComponent) {
                // Тут можна додати логіку для збереження вибору
                console.log(`Обрано варіант ${selectedVariant}`);
              }
            }}
          >
            Застосувати
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LogoSelector;
