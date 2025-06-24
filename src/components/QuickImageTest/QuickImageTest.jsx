import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { uploadImage } from "../../services/imageService";
import styles from "./QuickImageTest.module.css";

const QuickImageTest = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setMessage({ type: "", text: "" });

    // Додаємо таймаут
    const timeoutId = setTimeout(() => {
      setUploading(false);
      setMessage({
        type: "error",
        text: "Операція зайняла занадто багато часу. Спробуйте ще раз.",
      });
    }, 30000); // 30 секунд

    try {
      console.log("Початок завантаження файлів:", files.length);

      const uploadPromises = files.map(async (file) => {
        const timestamp = Date.now();
        const productId = `test_${timestamp}`;
        console.log("Завантаження файлу:", file.name, "productId:", productId);

        const imageUrl = await uploadImage(file, productId);
        console.log("Файл завантажено:", file.name, "URL:", imageUrl);

        return {
          name: file.name,
          url: imageUrl,
          size: file.size,
        };
      });

      const results = await Promise.all(uploadPromises);
      console.log("Всі файли завантажено:", results.length);

      setUploadedImages((prev) => [...prev, ...results]);

      clearTimeout(timeoutId);

      setMessage({
        type: "success",
        text: `Успішно завантажено ${files.length} зображень!`,
      });
    } catch (error) {
      clearTimeout(timeoutId);
      console.error("Помилка завантаження:", error);

      setMessage({
        type: "error",
        text: `Помилка завантаження: ${error.message}`,
      });
    } finally {
      setUploading(false);
      // Очищаємо input
      event.target.value = "";
    }
  };

  return (
    <Box className={styles.container}>
      <Typography variant="h5" component="h2" className={styles.title}>
        Швидке тестування завантаження зображень
      </Typography>

      {message.text && (
        <Alert severity={message.type} className={styles.alert}>
          {message.text}
        </Alert>
      )}

      <Card className={styles.uploadCard}>
        <CardContent>
          <input
            accept="image/*"
            id="quick-upload"
            type="file"
            multiple
            onChange={handleFileUpload}
            style={{ display: "none" }}
            disabled={uploading}
          />
          <label htmlFor="quick-upload">
            <Button
              variant="contained"
              component="span"
              startIcon={
                uploading ? <CircularProgress size={20} /> : <CloudUpload />
              }
              disabled={uploading}
              fullWidth
              className={styles.uploadButton}
            >
              {uploading ? "Завантаження..." : "Вибрати зображення"}
            </Button>
          </label>

          <Typography variant="body2" color="text.secondary" mt={1}>
            Можна вибрати кілька зображень одночасно
          </Typography>
        </CardContent>
      </Card>

      {uploadedImages.length > 0 && (
        <Box className={styles.results}>
          <Typography variant="h6" gutterBottom>
            Завантажені зображення:
          </Typography>

          <Box className={styles.imageGrid}>
            {uploadedImages.map((image, index) => (
              <Card key={index} className={styles.imageCard}>
                <CardMedia
                  component="img"
                  image={image.url}
                  alt={image.name}
                  className={styles.image}
                />
                <CardContent>
                  <Typography variant="body2" noWrap>
                    {image.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {(image.size / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default QuickImageTest;
