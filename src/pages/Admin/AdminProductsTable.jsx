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
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import { Edit, Delete, Add, Visibility } from "@mui/icons-material";
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (!selected.length) return;
    setDeleting(true);
    try {
      const batch = writeBatch(db);
      selected.forEach((id) => {
        batch.delete(doc(db, "products", id));
      });
      await batch.commit();
      setSnackbar({
        open: true,
        message: `Видалено ${selected.length} товарів`,
        severity: "success",
      });
      setSelected([]);
      fetchProducts();
    } catch (e) {
      setSnackbar({
        open: true,
        message: "Помилка: " + e.message,
        severity: "error",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleOpenEditCategory = async () => {
    if (!selected.length) return;
    const firstProduct = products.find((p) => p.id === selected[0]);
    setNewCategory(firstProduct?.Категорія || "");
    setNewSubcategory(firstProduct?.Підкатегорія || "");
    setNewModel(firstProduct?.Модель || "");
    setNewDescription(firstProduct?.Опис || "");
    setExistingPhotos(firstProduct?.Фото || []);
    setInitialPhotos(firstProduct?.Фото || []);
    setEditCategoryOpen(true);
  };

  const handleRemovePhoto = (idx) => {
    setExistingPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveAllPhotos = () => {
    setExistingPhotos([]);
  };

  const handleBulkCategoryUpdate = async () => {
    if (!selected.length) return;
    setDeleting(true);
    try {
      const batch = writeBatch(db);
      let photoUrls = existingPhotos;
      if (newPhotos && newPhotos.length > 0) {
        const newUrls = await Promise.all(
          Array.from(newPhotos).map(async (file) => {
            const storageRef = storageRef(
              storage,
              `products/${Date.now()}_${file.name}`
            );
            await uploadBytes(storageRef, file);
            return await getDownloadURL(storageRef);
          })
        );
        photoUrls = [...existingPhotos, ...newUrls];
      }
      selected.forEach((id) => {
        const updateData = {};
        if (newCategory) updateData.Категорія = newCategory;
        if (newSubcategory) updateData.Підкатегорія = newSubcategory;
        if (newModel) updateData.Модель = newModel;
        if (newDescription) updateData.Опис = newDescription;
        if (photoUrls.length > 0) updateData.Фото = photoUrls;
        if (Object.keys(updateData).length > 0) {
          batch.update(doc(db, "products", id), updateData);
        }
      });
      await batch.commit();
      setSnackbar({
        open: true,
        message: `Оновлено ${selected.length} товарів`,
        severity: "success",
      });
      setSelected([]);
      setEditCategoryOpen(false);
      fetchProducts();
    } catch (e) {
      setSnackbar({
        open: true,
        message: "Помилка: " + e.message,
        severity: "error",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleToggle10 = () => {
    const first10 = paginatedProducts.slice(0, 10).map((p) => p.id);
    if (
      selected.length === first10.length &&
      first10.every((id) => selected.includes(id))
    ) {
      setSelected(selected.filter((id) => !first10.includes(id)));
    } else {
      setSelected([...new Set([...selected, ...first10])]);
    }
  };

  const isAll10Selected = paginatedProducts
    .slice(0, 10)
    .every((p) => selected.includes(p.id));

  // Мобільна версія - картки замість таблиці
  const renderMobileCards = () => (
    <Grid container spacing={2}>
      {loading ? (
        <Grid item xs={12} display="flex" justifyContent="center" py={4}>
          <CircularProgress size={40} />
        </Grid>
      ) : paginatedProducts.length === 0 ? (
        <Grid item xs={12} textAlign="center" py={4}>
          <Typography color="text.secondary">Немає товарів</Typography>
        </Grid>
      ) : (
        paginatedProducts.map((product) => (
          <Grid item xs={12} key={product.id}>
            <Card
              sx={{
                position: "relative",
                border: isSelected(product.id)
                  ? "2px solid #115e59"
                  : "1px solid #e0e0e0",
                borderRadius: 2,
              }}
            >
              <CardContent sx={{ pb: 1 }}>
                <Box display="flex" alignItems="flex-start" gap={2}>
                  <Checkbox
                    checked={isSelected(product.id)}
                    onChange={() => handleSelect(product.id)}
                    sx={{ mt: -1 }}
                  />
                  <Avatar
                    src={
                      Array.isArray(product.Фото)
                        ? product.Фото[0]
                        : product.Фото ||
                          product.imageUrl ||
                          "/default-product-image.png"
                    }
                    alt={product.Назва || product.name}
                    variant="rounded"
                    sx={{ width: 60, height: 60, bgcolor: "#e0f2fe" }}
                  />
                  <Box flex={1} minWidth={0}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        fontSize: "1rem",
                        mb: 0.5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {product.Назва || product.name}
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={0.5} mb={1}>
                      {product.Категорія && (
                        <Chip
                          label={product.Категорія}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      )}
                      {product.Підкатегорія && (
                        <Chip
                          label={product.Підкатегорія}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Модель: {product.Модель || product.model || "-"}
                    </Typography>
                    <Typography
                      variant="h6"
                      color="primary"
                      sx={{ fontWeight: 700 }}
                    >
                      {product.Ціна || product.price
                        ? `${product.Ціна || product.price} грн`
                        : "-"}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
              <Divider />
              <CardActions
                sx={{ justifyContent: "space-between", px: 2, py: 1 }}
              >
                <Box display="flex" gap={1}>
                  <Tooltip title="Редагувати">
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => {
                        setEditProduct(product);
                        setFormOpen(true);
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Видалити">
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => setDeleteId(product.id)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );

  // Десктопна версія - таблиця
  const renderDesktopTable = () => (
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
                  {row.Ціна || row.price ? `${row.Ціна || row.price} грн` : "-"}
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
    </Paper>
  );

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        flexWrap="wrap"
        gap={2}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, color: "#115e59" }}>
          Керування товарами
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setFormOpen(true)}
            sx={{
              bgcolor: "#115e59",
              ":hover": { bgcolor: "#134e4a" },
              py: isMobile ? 1 : 1.5,
              px: isMobile ? 2 : 3,
            }}
          >
            Додати товар
          </Button>
          <Button
            variant="outlined"
            onClick={() => setImportOpen(true)}
            sx={{
              py: isMobile ? 1 : 1.5,
              px: isMobile ? 2 : 3,
            }}
          >
            Імпорт
          </Button>
        </Box>
      </Box>

      {/* Масові дії: 'Видалити вибрані', 'Масове редагування' — тільки якщо є вибрані. 'Виділити 10' — завжди. */}
      <Box
        display="flex"
        gap={2}
        mb={3}
        p={2}
        bgcolor="#f0f9ff"
        borderRadius={2}
        border="1px solid #e0f2fe"
        flexWrap="wrap"
      >
        {selected.length > 0 && (
          <>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Вибрано: {selected.length}
            </Typography>
            <Button
              variant="outlined"
              color="error"
              size="small"
              disabled={!selected.length || deleting}
              onClick={handleDeleteSelected}
            >
              Видалити вибрані
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              disabled={!selected.length || deleting}
              onClick={handleOpenEditCategory}
            >
              Масове редагування
            </Button>
          </>
        )}
        <FormControlLabel
          control={
            <Checkbox checked={isAll10Selected} onChange={handleToggle10} />
          }
          label="Виділити 10"
        />
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
        sx={{
          mb: 3,
          width: isMobile ? "100%" : 320,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
      />

      {isMobile ? renderMobileCards() : renderDesktopTable()}

      <Box display="flex" justifyContent="center" my={3}>
        <Pagination
          count={pageCount}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
          shape="rounded"
          size={isMobile ? "medium" : "large"}
        />
      </Box>

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
        maxWidth="sm"
        fullWidth
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
