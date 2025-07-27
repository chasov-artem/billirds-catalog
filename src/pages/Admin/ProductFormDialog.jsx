import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Grid,
  Typography,
  IconButton,
  Chip,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { Close, AddPhotoAlternate, Delete } from "@mui/icons-material";
import imageCompression from "browser-image-compression";

export default function ProductFormDialog({
  open,
  onClose,
  onSave,
  initialData,
  loading,
}) {
  const [form, setForm] = useState({
    Назва: "",
    Категорія: "",
    Підкатегорія: "",
    Ціна: "",
    Опис: "",
    Характеристики: "",
    Фото: [],
    Додатково: {},
    Модель: "",
    Статус: "Під замовлення",
  });
  const [images, setImages] = useState([]);
  const fileInputRef = useRef();
  const [newExtraKey, setNewExtraKey] = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const [optimizingImages, setOptimizingImages] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        Назва: initialData.Назва || "",
        Категорія: initialData.Категорія || "",
        Підкатегорія: initialData.Підкатегорія || "",
        Ціна: initialData.Ціна || "",
        Опис: initialData.Опис || "",
        Характеристики: initialData.Характеристики || "",
        Фото: initialData.Фото || [],
        Додатково: initialData.Додатково || {},
        Модель: initialData.Модель || "",
        Статус: initialData.Статус || "Під замовлення",
      });
      setExistingImages(initialData.Фото || []);
      setImages([]);
    } else {
      setForm({
        Назва: "",
        Категорія: "",
        Підкатегорія: "",
        Ціна: "",
        Опис: "",
        Характеристики: "",
        Фото: [],
        Додатково: {},
        Модель: "",
        Статус: "Під замовлення",
      });
      setExistingImages([]);
      setImages([]);
    }
  }, [initialData, open]);

  // Drag&Drop
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };
  const handleFiles = async (files) => {
    setOptimizingImages(true);
    const newImages = [];

    for (const file of files) {
      try {
        let processedFile = file;

        // Перевіряємо розмір файлу (0.5MB = 0.5 * 1024 * 1024 bytes)
        if (file.size > 0.5 * 1024 * 1024) {
          // Опції стиснення для файлів більше 0.5MB
          const options = {
            maxSizeMB: 0.5, // максимальний розмір файлу (МБ)
            maxWidthOrHeight: 1200, // максимальна ширина/висота (px)
            useWebWorker: true,
            fileType: "image/jpeg", // конвертуємо в JPEG для кращого стиснення
          };

          processedFile = await imageCompression(file, options);
        }

        newImages.push({
          file: processedFile,
          url: URL.createObjectURL(processedFile),
          originalSize: file.size,
          optimizedSize: processedFile.size,
          wasOptimized: file.size > 0.5 * 1024 * 1024,
        });
      } catch (error) {
        console.error("Помилка оптимізації зображення:", error);
        // Якщо оптимізація не вдалася, використовуємо оригінальний файл
        newImages.push({
          file: file,
          url: URL.createObjectURL(file),
          originalSize: file.size,
          optimizedSize: file.size,
          wasOptimized: false,
        });
      }
    }

    setImages((prev) => [...prev, ...newImages]);
    setOptimizingImages(false);
  };
  const handleRemoveImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // Поля форми
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddExtraField = () => {
    if (!newExtraKey.trim() || form.Додатково[newExtraKey]) return;
    setForm((prev) => ({
      ...prev,
      Додатково: { ...prev.Додатково, [newExtraKey]: "" },
    }));
    setNewExtraKey("");
  };
  const handleChangeExtraValue = (key, value) => {
    setForm((prev) => ({
      ...prev,
      Додатково: { ...prev.Додатково, [key]: value },
    }));
  };
  const handleRemoveExtra = (key) => {
    setForm((prev) => {
      const newExtra = { ...prev.Додатково };
      delete newExtra[key];
      return { ...prev, Додатково: newExtra };
    });
  };

  const handleRemoveExistingImage = (idx) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // onSave(form, images, id) — images це масив {file, url}
    // Передаю всі залишені старі фото + нові
    onSave({ ...form, Фото: existingImages }, images);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? "Редагувати товар" : "Додати товар"}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                label="Назва"
                name="Назва"
                value={form.Назва}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Категорія"
                name="Категорія"
                value={form.Категорія}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Підкатегорія"
                name="Підкатегорія"
                value={form.Підкатегорія}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Модель"
                name="Модель"
                value={form.Модель}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Ціна"
                name="Ціна"
                value={form.Ціна}
                onChange={handleChange}
                type="number"
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Статус"
                name="Статус"
                value={form.Статус}
                onChange={handleChange}
                select
                fullWidth
                required
                sx={{ mb: 2 }}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="В наявності">В наявності</option>
                <option value="Під замовлення">Під замовлення</option>
                <option value="Немає в наявності">Немає в наявності</option>
              </TextField>
              <TextField
                label="Опис"
                name="Опис"
                value={form.Опис}
                onChange={handleChange}
                fullWidth
                multiline
                minRows={3}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Характеристики (кожна з нового рядка)"
                name="Характеристики"
                value={form.Характеристики}
                onChange={handleChange}
                fullWidth
                multiline
                minRows={2}
                sx={{ mb: 2 }}
              />
              <Box sx={{ mt: 2, mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Додаткові поля
                </Typography>
                <Box display="flex" gap={1} mb={2}>
                  <TextField
                    label="Назва поля"
                    value={newExtraKey}
                    onChange={(e) => setNewExtraKey(e.target.value)}
                    size="small"
                  />
                  <Button
                    onClick={handleAddExtraField}
                    variant="outlined"
                    sx={{ minWidth: 40 }}
                  >
                    Додати поле
                  </Button>
                </Box>
                <Grid container spacing={2}>
                  {form.Додатково &&
                    Object.entries(form.Додатково).map(([key, value]) => (
                      <Grid
                        key={key}
                        size={{ xs: 12, md: 6 }}
                        display="flex"
                        alignItems="center"
                      >
                        <TextField
                          label={key}
                          value={value}
                          onChange={(e) =>
                            handleChangeExtraValue(key, e.target.value)
                          }
                          fullWidth
                          size="small"
                          sx={{ mb: 1 }}
                        />
                        <IconButton
                          onClick={() => handleRemoveExtra(key)}
                          sx={{ ml: 1 }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Grid>
                    ))}
                </Grid>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  border: "2px dashed #115e59",
                  borderRadius: 2,
                  p: 2,
                  textAlign: "center",
                  bgcolor: "#f0f9ff",
                  cursor: "pointer",
                }}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current.click()}
              >
                <AddPhotoAlternate sx={{ fontSize: 40, color: "#115e59" }} />
                <Typography variant="body2" color="text.secondary">
                  Перетягніть фото або натисніть для вибору
                </Typography>
                {optimizingImages && (
                  <Box
                    mt={1}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap={1}
                  >
                    <CircularProgress size={16} />
                    <Typography variant="caption" color="text.secondary">
                      Оптимізація зображень...
                    </Typography>
                  </Box>
                )}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  hidden
                  ref={fileInputRef}
                  onChange={(e) => handleFiles(Array.from(e.target.files))}
                />
                <Box
                  mt={2}
                  display="flex"
                  flexWrap="wrap"
                  gap={1}
                  justifyContent="center"
                >
                  {existingImages.map((url, idx) => (
                    <Box key={url} position="relative">
                      <Avatar
                        src={url}
                        variant="rounded"
                        sx={{ width: 72, height: 56, bgcolor: "#e0f2fe" }}
                      />
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveExistingImage(idx);
                        }}
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          bgcolor: "#fff",
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                  {images.map((img, idx) => (
                    <Box key={img.url} position="relative">
                      <Avatar
                        src={img.url}
                        variant="rounded"
                        sx={{ width: 72, height: 56, bgcolor: "#e0f2fe" }}
                      />
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(idx);
                        }}
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          bgcolor: "#fff",
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                      {img.wasOptimized && (
                        <Chip
                          label={`${Math.round(
                            ((img.originalSize - img.optimizedSize) /
                              img.originalSize) *
                              100
                          )}% менше`}
                          size="small"
                          color="success"
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            fontSize: "0.6rem",
                            height: "16px",
                          }}
                        />
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Скасувати</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ bgcolor: "#115e59", ":hover": { bgcolor: "#134e4a" } }}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : initialData ? (
              "Зберегти"
            ) : (
              "Додати"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
