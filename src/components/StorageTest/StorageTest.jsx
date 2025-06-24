import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { uploadImage } from "../../services/imageService";
import styles from "./StorageTest.module.css";

const StorageTest = () => {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleTestUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      console.log("Тестування завантаження файлу:", file.name);
      const imageUrl = await uploadImage(file, "test");
      console.log("Тест успішний, URL:", imageUrl);

      setResult({
        url: imageUrl,
        name: file.name,
        size: file.size,
      });
    } catch (err) {
      console.error("Тест невдалий:", err);
      setError(err.message);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <Box className={styles.container}>
      <Typography variant="h5" component="h2" className={styles.title}>
        Тест Firebase Storage
      </Typography>

      {error && (
        <Alert severity="error" className={styles.alert}>
          Помилка: {error}
        </Alert>
      )}

      {result && (
        <Alert severity="success" className={styles.alert}>
          Успішно! URL: {result.url}
        </Alert>
      )}

      <Box className={styles.uploadBox}>
        <input
          accept="image/*"
          id="storage-test"
          type="file"
          onChange={handleTestUpload}
          style={{ display: "none" }}
          disabled={uploading}
        />
        <label htmlFor="storage-test">
          <Button
            variant="contained"
            component="span"
            startIcon={
              uploading ? <CircularProgress size={20} /> : <CloudUpload />
            }
            disabled={uploading}
            className={styles.uploadButton}
          >
            {uploading ? "Тестування..." : "Тест завантаження"}
          </Button>
        </label>
      </Box>

      {result && (
        <Box className={styles.result}>
          <Typography variant="h6">Результат тесту:</Typography>
          <Typography>Файл: {result.name}</Typography>
          <Typography>
            Розмір: {(result.size / 1024 / 1024).toFixed(2)} MB
          </Typography>
          <Typography>URL: {result.url}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default StorageTest;
