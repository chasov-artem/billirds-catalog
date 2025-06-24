import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { Add, Image } from "@mui/icons-material";
import { addProduct } from "../../services/productsService";
import styles from "./TestDataGenerator.module.css";

const TestDataGenerator = () => {
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const testProducts = [
    {
      Назва: "Більярдний стіл Brunswick",
      Категорія: "Більярдні столи",
      Підкатегорія: "Професійні",
      Ціна: 45000,
      Опис: "Професійний більярдний стіл Brunswick з високоякісним сукном та дерев'яною рамою.",
    },
    {
      Назва: "Більярдний стіл для дому",
      Категорія: "Більярдні столи",
      Підкатегорія: "Домашні",
      Ціна: 25000,
      Опис: "Компактний більярдний стіл для домашнього використання.",
    },
    {
      Назва: "Кий більярдний",
      Категорія: "Аксесуари",
      Підкатегорія: "Кії",
      Ціна: 3500,
      Опис: "Професійний більярдний кій з натурального дерева.",
    },
    {
      Назва: "Сукно для більярду",
      Категорія: "Аксесуари",
      Підкатегорія: "Сукно",
      Ціна: 1200,
      Опис: "Високоякісне сукно для більярдного столу.",
    },
    {
      Назва: "Набір куль",
      Категорія: "Аксесуари",
      Підкатегорія: "Кулі",
      Ціна: 800,
      Опис: "Повний набір більярдних куль для гри.",
    },
  ];

  const generateTestData = async () => {
    setGenerating(true);
    setMessage({ type: "", text: "" });

    try {
      const promises = testProducts.map(async (product) => {
        return await addProduct(product);
      });

      const results = await Promise.all(promises);

      setMessage({
        type: "success",
        text: `Успішно додано ${results.length} тестових товарів!`,
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: `Помилка додавання тестових даних: ${error.message}`,
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Box className={styles.container}>
      <Typography variant="h5" component="h2" className={styles.title}>
        Генератор тестових даних
      </Typography>

      {message.text && (
        <Alert severity={message.type} className={styles.alert}>
          {message.text}
        </Alert>
      )}

      <Card className={styles.card}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Додати тестові товари
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={2}>
            Це додасть {testProducts.length} тестових товарів до бази даних без
            зображень.
          </Typography>

          <Button
            variant="contained"
            startIcon={generating ? <CircularProgress size={20} /> : <Add />}
            onClick={generateTestData}
            disabled={generating}
            className={styles.generateButton}
          >
            {generating ? "Додавання..." : "Додати тестові товари"}
          </Button>
        </CardContent>
      </Card>

      <Grid container spacing={2} className={styles.productsPreview}>
        {testProducts.map((product, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card className={styles.productCard}>
              <CardContent>
                <Box className={styles.imagePlaceholder}>
                  <Image fontSize="large" color="disabled" />
                </Box>
                <Typography variant="h6" noWrap>
                  {product.Назва}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.Категорія} / {product.Підкатегорія}
                </Typography>
                <Typography variant="h6" color="primary">
                  {product.Ціна.toLocaleString("uk-UA")} грн
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TestDataGenerator;
