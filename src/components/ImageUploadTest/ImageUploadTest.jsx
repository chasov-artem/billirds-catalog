import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import { CloudUpload, Add } from "@mui/icons-material";
import { addProduct } from "../../services/productsService";
import styles from "./ImageUploadTest.module.css";

const ImageUploadTest = () => {
  const [formData, setFormData] = useState({
    Назва: "",
    Категорія: "",
    Підкатегорія: "",
    Ціна: "",
    Опис: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);

      // Створюємо превью зображення
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    // Додаємо таймаут на випадок, якщо операція зависне
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setMessage({
        type: "error",
        text: "Операція зайняла занадто багато часу. Спробуйте ще раз.",
      });
    }, 30000); // 30 секунд

    try {
      console.log("Початок handleSubmit");

      // Валідація
      if (!formData.Назва.trim()) {
        throw new Error("Назва товару обов'язкова");
      }

      const productData = {
        ...formData,
        Ціна: formData.Ціна ? parseFloat(formData.Ціна) : null,
      };

      console.log("Виклик addProduct з даними:", productData);
      const productId = await addProduct(productData, imageFile);
      console.log("addProduct завершено, ID:", productId);

      clearTimeout(timeoutId);

      setMessage({
        type: "success",
        text: `Товар успішно додано! ID: ${productId}`,
      });

      // Очищаємо форму
      setFormData({
        Назва: "",
        Категорія: "",
        Підкатегорія: "",
        Ціна: "",
        Опис: "",
      });
      setImageFile(null);
      setImagePreview(null);

      // Очищаємо input файлу
      const fileInput = document.getElementById("image-input");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      clearTimeout(timeoutId);
      console.error("Помилка в handleSubmit:", error);

      setMessage({
        type: "error",
        text: `Помилка: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className={styles.container}>
      <Typography variant="h4" component="h1" className={styles.title}>
        Тестування завантаження зображень
      </Typography>

      {message.text && (
        <Alert severity={message.type} className={styles.alert}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card className={styles.formCard}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Додати новий товар з зображенням
              </Typography>

              <Box
                component="form"
                onSubmit={handleSubmit}
                className={styles.form}
              >
                <TextField
                  fullWidth
                  label="Назва товару"
                  name="Назва"
                  value={formData.Назва}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                />

                <TextField
                  fullWidth
                  label="Категорія"
                  name="Категорія"
                  value={formData.Категорія}
                  onChange={handleInputChange}
                  margin="normal"
                />

                <TextField
                  fullWidth
                  label="Підкатегорія"
                  name="Підкатегорія"
                  value={formData.Підкатегорія}
                  onChange={handleInputChange}
                  margin="normal"
                />

                <TextField
                  fullWidth
                  label="Ціна (грн)"
                  name="Ціна"
                  type="number"
                  value={formData.Ціна}
                  onChange={handleInputChange}
                  margin="normal"
                />

                <TextField
                  fullWidth
                  label="Опис"
                  name="Опис"
                  value={formData.Опис}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                  margin="normal"
                />

                <Box className={styles.imageUpload}>
                  <input
                    accept="image/*"
                    id="image-input"
                    type="file"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                  <label htmlFor="image-input">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUpload />}
                      fullWidth
                      className={styles.uploadButton}
                    >
                      Завантажити зображення
                    </Button>
                  </label>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <Add />}
                  className={styles.submitButton}
                >
                  {loading ? "Додавання..." : "Додати товар"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card className={styles.previewCard}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Превью зображення
              </Typography>

              {imagePreview ? (
                <Box className={styles.imagePreview}>
                  <CardMedia
                    component="img"
                    image={imagePreview}
                    alt="Превью зображення"
                    className={styles.previewImage}
                  />
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    Розмір файлу: {(imageFile?.size / 1024 / 1024).toFixed(2)}{" "}
                    MB
                  </Typography>
                </Box>
              ) : (
                <Box className={styles.noImage}>
                  <Typography variant="body2" color="text.secondary">
                    Виберіть зображення для перегляду
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ImageUploadTest;
