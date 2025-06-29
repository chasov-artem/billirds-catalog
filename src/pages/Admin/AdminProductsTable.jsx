import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Avatar,
  CircularProgress,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert as MuiAlert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormControlLabel,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db, storage } from "../../firebase/config";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import ProductFormDialog from "./ProductFormDialog";
import ProductImportDialog from "./ProductImportDialog";
import Checkbox from "@mui/material/Checkbox";
import Pagination from "@mui/material/Pagination";
import { Delete as DeleteIcon } from "@mui/icons-material";

const PAGE_SIZE = 20;

export default function AdminProductsTable() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [formOpen, setFormOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [importOpen, setImportOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [editCategoryOpen, setEditCategoryOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");
  const [newModel, setNewModel] = useState("");
  const [newPhotos, setNewPhotos] = useState([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [page, setPage] = useState(1);
  const [newDescription, setNewDescription] = useState("");
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [initialPhotos, setInitialPhotos] = useState([]);

  const fetchProducts = async () => {
    setLoading(true);
    const q = query(collection(db, "products"), orderBy("Назва", "asc"));
    const snap = await getDocs(q);
    setProducts(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = products.filter((p) => {
    const name = p.Назва || p.name || "";
    const category = p.Категорія || p.category || "";
    const subcategory = p.Підкатегорія || p.subcategory || "";
    const model = p.Модель || p.model || "";
    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      category.toLowerCase().includes(search.toLowerCase()) ||
      subcategory.toLowerCase().includes(search.toLowerCase()) ||
      model.toLowerCase().includes(search.toLowerCase())
    );
  });

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const paginatedProducts = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleSaveProduct = async (form, images, id) => {
    setFormLoading(true);
    try {
      let photoUrls = form.Фото || [];
      if (images && images.length > 0) {
        const newUrls = await Promise.all(
          images.map(async (img) => {
            const storageRef = storageRef(
              storage,
              `products/${Date.now()}_${img.file.name}`
            );
            await uploadBytes(storageRef, img.file);
            return await getDownloadURL(storageRef);
          })
        );
        photoUrls = [...photoUrls, ...newUrls];
      }
      if (id) {
        await updateDoc(doc(db, "products", id), {
          ...form,
          Фото: photoUrls,
          updatedAt: new Date(),
        });
        setSnackbar({
          open: true,
          message: "Товар оновлено!",
          severity: "success",
        });
      } else {
        await addDoc(collection(db, "products"), {
          ...form,
          Фото: photoUrls,
          createdAt: new Date(),
        });
        setSnackbar({
          open: true,
          message: "Товар додано!",
          severity: "success",
        });
      }
      setFormOpen(false);
      setEditProduct(null);
      fetchProducts();
    } catch (e) {
      setSnackbar({
        open: true,
        message: "Помилка: " + e.message,
        severity: "error",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, "products", deleteId));
      setSnackbar({
        open: true,
        message: "Товар успішно видалено",
        severity: "success",
      });
      setDeleteId(null);
      fetchProducts();
    } catch (e) {
      setSnackbar({
        open: true,
        message: "Помилка видалення: " + e.message,
        severity: "error",
      });
    } finally {
      setDeleting(false);
    }
  };

  const isSelected = (id) => selected.includes(id);
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(paginatedProducts.map((p) => p.id));
    } else {
      setSelected(
        selected.filter((id) => !paginatedProducts.some((p) => p.id === id))
      );
    }
  };
  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (!selected.length) return;
    if (!window.confirm(`Видалити ${selected.length} товар(ів)?`)) return;
    setDeleting(true);
    try {
      const batch = writeBatch(db);
      selected.forEach((id) => {
        batch.delete(doc(db, "products", id));
      });
      await batch.commit();
      setSnackbar({
        open: true,
        message: `Видалено ${selected.length} товар(ів)`,
        severity: "success",
      });
      setSelected([]);
      fetchProducts();
    } catch (e) {
      setSnackbar({
        open: true,
        message: "Помилка видалення: " + e.message,
        severity: "error",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleOpenEditCategory = async () => {
    if (selected.length > 0) {
      const selectedProducts = products.filter((p) => selected.includes(p.id));
      const allPhotos = selectedProducts.map((p) => p.Фото || []);
      const first = JSON.stringify(allPhotos[0] || []);
      const same = allPhotos.every(
        (arr) => JSON.stringify(arr || []) === first
      );
      const photos = same ? allPhotos[0] : [];
      setExistingPhotos(photos);
      setInitialPhotos(photos);
    } else {
      setExistingPhotos([]);
      setInitialPhotos([]);
    }
    setEditCategoryOpen(true);
  };

  const handleRemovePhoto = (idx) => {
    setExistingPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveAllPhotos = () => {
    setExistingPhotos([]);
  };

  const handleBulkCategoryUpdate = async () => {
    const hasChanges =
      newCategory ||
      newPhotos.length > 0 ||
      newSubcategory ||
      newModel ||
      newDescription ||
      JSON.stringify(existingPhotos) !== JSON.stringify(initialPhotos);
    if (!selected.length || !hasChanges) return;
    setDeleting(true);
    let photoUrls = [];
    try {
      if (newPhotos.length > 0) {
        setUploadingPhoto(true);

        // Створюємо Map для унікальних файлів (хеш файлу -> URL)
        const uniqueFiles = new Map();

        // Функція для створення хешу файлу
        const createFileHash = async (file) => {
          const buffer = await file.arrayBuffer();
          const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
        };

        // Обробляємо кожен файл
        for (const file of Array.from(newPhotos)) {
          const fileHash = await createFileHash(file);

          // Якщо файл з таким хешем вже оброблений, використовуємо існуючий URL
          if (uniqueFiles.has(fileHash)) {
            photoUrls.push(uniqueFiles.get(fileHash));
          } else {
            // Завантажуємо новий файл
            const fileRef = storageRef(
              storage,
              `products/bulk_${fileHash}_${file.name}`
            );
            await uploadBytes(fileRef, file);
            const url = await getDownloadURL(fileRef);
            uniqueFiles.set(fileHash, url);
            photoUrls.push(url);
          }
        }

        setUploadingPhoto(false);
      }
      const batch = writeBatch(db);
      selected.forEach((id) => {
        const updateData = {};
        if (newCategory) updateData["Категорія"] = newCategory;
        if (newSubcategory) updateData["Підкатегорія"] = newSubcategory;
        if (newModel) updateData["Модель"] = newModel;
        if (newDescription) updateData["Опис"] = newDescription;

        if (photoUrls.length > 0 && existingPhotos.length > 0) {
          updateData["Фото"] = [...existingPhotos, ...photoUrls];
        } else if (photoUrls.length > 0) {
          updateData["Фото"] = photoUrls;
        } else if (
          JSON.stringify(existingPhotos) !== JSON.stringify(initialPhotos)
        ) {
          updateData["Фото"] = existingPhotos;
        }

        if (Object.keys(updateData).length > 0) {
          batch.update(doc(db, "products", id), updateData);
        }
      });
      await batch.commit();

      setSnackbar({
        open: true,
        message: `Оновлено ${selected.length} товар(ів)`,
        severity: "success",
      });
      setSelected([]);
      fetchProducts();
      setEditCategoryOpen(false);
      setNewCategory("");
      setNewSubcategory("");
      setNewModel("");
      setNewPhotos([]);
      setNewDescription("");
      setExistingPhotos([]);
      setInitialPhotos([]);
    } catch (e) {
      setSnackbar({
        open: true,
        message: "Помилка оновлення: " + e.message,
        severity: "error",
      });
    } finally {
      setDeleting(false);
      setUploadingPhoto(false);
    }
  };

  const isAll10Selected = paginatedProducts
    .slice(0, 10)
    .every((p) => selected.includes(p.id));
  const isAllPageSelected = paginatedProducts.every((p) =>
    selected.includes(p.id)
  );

  const handleToggle10 = () => {
    const ids = paginatedProducts.slice(0, 10).map((p) => p.id);
    if (isAll10Selected) {
      setSelected(selected.filter((id) => !ids.includes(id)));
    } else {
      setSelected([...new Set([...selected, ...ids])]);
    }
  };
  const handleToggleAllPage = () => {
    const ids = paginatedProducts.map((p) => p.id);
    if (isAllPageSelected) {
      setSelected(selected.filter((id) => !ids.includes(id)));
    } else {
      setSelected([...new Set([...selected, ...ids])]);
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h5" color="primary">
          Товари
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{ bgcolor: "#115e59", ":hover": { bgcolor: "#134e4a" } }}
            onClick={() => setFormOpen(true)}
          >
            Додати товар
          </Button>
          <Button variant="outlined" onClick={() => setImportOpen(true)}>
            Імпорт товарів
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={!selected.length || deleting}
            onClick={handleDeleteSelected}
          >
            Видалити вибрані
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={!selected.length || deleting}
            onClick={handleOpenEditCategory}
          >
            Масове редагування
          </Button>
          <FormControlLabel
            control={
              <Checkbox checked={isAll10Selected} onChange={handleToggle10} />
            }
            label="Виділити 10"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isAllPageSelected}
                onChange={handleToggleAllPage}
              />
            }
            label="Виділити всі на сторінці"
          />
        </Box>
      </Box>
      <ProductImportDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={() => {
          setImportOpen(false);
          fetchProducts();
        }}
      />
      <TextField
        label="Пошук по назві або категорії"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        size="small"
        sx={{ mb: 2, width: 320 }}
      />
      <Paper sx={{ width: "100%", overflow: "auto" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f0f9ff" }}>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selected.length > 0 &&
                    selected.length < paginatedProducts.length
                  }
                  checked={
                    paginatedProducts.length > 0 &&
                    paginatedProducts.every((p) => selected.includes(p.id))
                  }
                  onChange={handleSelectAll}
                  inputProps={{ "aria-label": "select all products" }}
                />
              </TableCell>
              <TableCell>Фото</TableCell>
              <TableCell>Назва</TableCell>
              <TableCell>Категорія</TableCell>
              <TableCell>Підкатегорія</TableCell>
              <TableCell>Модель</TableCell>
              <TableCell>Ціна</TableCell>
              <TableCell align="right">Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress size={32} />
                </TableCell>
              </TableRow>
            ) : paginatedProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography color="text.secondary">Немає товарів</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedProducts.map((row) => (
                <TableRow key={row.id} selected={isSelected(row.id)}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected(row.id)}
                      onChange={() => handleSelect(row.id)}
                      inputProps={{ "aria-label": `select product ${row.id}` }}
                    />
                  </TableCell>
                  <TableCell>
                    <Avatar
                      src={
                        Array.isArray(row.Фото)
                          ? row.Фото[0]
                          : row.Фото ||
                            row.imageUrl ||
                            "/default-product-image.png"
                      }
                      alt={row.Назва || row.name}
                      variant="rounded"
                      sx={{ width: 56, height: 40, bgcolor: "#e0f2fe" }}
                    />
                  </TableCell>
                  <TableCell>{row.Назва || row.name}</TableCell>
                  <TableCell>{row.Категорія || row.category}</TableCell>
                  <TableCell>{row.Підкатегорія || row.subcategory}</TableCell>
                  <TableCell>{row.Модель || row.model}</TableCell>
                  <TableCell>
                    {row.Ціна || row.price
                      ? `${row.Ціна || row.price} грн`
                      : "-"}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Редагувати">
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setEditProduct(row);
                          setFormOpen(true);
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Видалити">
                      <IconButton
                        color="error"
                        onClick={() => setDeleteId(row.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Box display="flex" justifyContent="center" my={2}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            shape="rounded"
            size="large"
          />
        </Box>
      </Paper>
      <ProductFormDialog
        open={formOpen || !!editProduct}
        onClose={() => {
          setFormOpen(false);
          setEditProduct(null);
        }}
        onSave={(form, images) =>
          handleSaveProduct(form, images, editProduct?.id)
        }
        initialData={editProduct}
        loading={formLoading}
      />
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Видалити товар?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ви впевнені, що хочете видалити цей товар? Цю дію не можна
            скасувати.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)} disabled={deleting}>
            Скасувати
          </Button>
          <Button onClick={handleDelete} color="error" disabled={deleting}>
            {deleting ? "Видалення..." : "Видалити"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={editCategoryOpen}
        onClose={() => setEditCategoryOpen(false)}
      >
        <DialogTitle>
          Змінити категорію для {selected.length} товар(ів)
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Категорія"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Підкатегорія"
            value={newSubcategory}
            onChange={(e) => setNewSubcategory(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Модель"
            value={newModel}
            onChange={(e) => setNewModel(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Опис"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              fullWidth
              multiline
              minRows={2}
              maxRows={6}
              disabled={deleting}
            />
          </Box>
          <Box mt={2} display="flex" flexDirection="column" gap={1}>
            {existingPhotos.length > 0 && (
              <Box mb={1}>
                <Typography variant="body2" mb={0.5}>
                  Існуючі фото:
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {existingPhotos.map((url, idx) => (
                    <Box key={idx} position="relative" display="inline-block">
                      <img
                        src={url}
                        alt="product"
                        style={{
                          width: 60,
                          height: 40,
                          objectFit: "cover",
                          borderRadius: 4,
                          border: "1px solid #ddd",
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRemovePhoto(idx)}
                        style={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          background: "#fff",
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                  <Button
                    size="small"
                    color="error"
                    onClick={handleRemoveAllPhotos}
                    sx={{ ml: 2 }}
                  >
                    Видалити всі фото
                  </Button>
                </Box>
              </Box>
            )}
            <Button
              variant="outlined"
              component="label"
              disabled={uploadingPhoto || deleting}
            >
              {newPhotos.length > 0
                ? `Фото: ${Array.from(newPhotos)
                    .map((f) => f.name)
                    .join(", ")}`
                : "Додати фото"}
              <input
                type="file"
                accept="image/*"
                hidden
                multiple
                onChange={(e) => setNewPhotos(e.target.files)}
              />
            </Button>
            {uploadingPhoto && (
              <span style={{ marginLeft: 8 }}>Завантаження...</span>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setEditCategoryOpen(false)}
            disabled={deleting || uploadingPhoto}
          >
            Скасувати
          </Button>
          <Button
            onClick={handleBulkCategoryUpdate}
            variant="contained"
            disabled={
              !selected.length ||
              (!newCategory &&
                newPhotos.length === 0 &&
                !newSubcategory &&
                !newModel &&
                !newDescription &&
                JSON.stringify(existingPhotos) ===
                  JSON.stringify(initialPhotos)) ||
              deleting ||
              uploadingPhoto
            }
          >
            {deleting || uploadingPhoto ? "Оновлення..." : "Оновити"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}
