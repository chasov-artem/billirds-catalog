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
} from "firebase/firestore";
import { db, storage } from "../../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ProductFormDialog from "./ProductFormDialog";

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
    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      category.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleSaveProduct = async (form, images, id) => {
    setFormLoading(true);
    try {
      let photoUrls = form.Фото || [];
      if (images && images.length > 0) {
        const newUrls = await Promise.all(
          images.map(async (img) => {
            const storageRef = ref(
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
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ bgcolor: "#115e59", ":hover": { bgcolor: "#134e4a" } }}
          onClick={() => setFormOpen(true)}
        >
          Додати товар
        </Button>
      </Box>
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
              <TableCell>Фото</TableCell>
              <TableCell>Назва</TableCell>
              <TableCell>Категорія</TableCell>
              <TableCell>Ціна</TableCell>
              <TableCell align="right">Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress size={32} />
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography color="text.secondary">Немає товарів</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell>
                    <Avatar
                      src={
                        Array.isArray(p.Фото)
                          ? p.Фото[0]
                          : p.Фото || p.imageUrl || "/default-product-image.png"
                      }
                      alt={p.Назва || p.name}
                      variant="rounded"
                      sx={{ width: 56, height: 40, bgcolor: "#e0f2fe" }}
                    />
                  </TableCell>
                  <TableCell>{p.Назва || p.name}</TableCell>
                  <TableCell>{p.Категорія || p.category}</TableCell>
                  <TableCell>
                    {p.Ціна || p.price ? `${p.Ціна || p.price} грн` : "-"}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Редагувати">
                      <IconButton
                        color="primary"
                        onClick={() => setEditProduct(p)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Видалити">
                      <IconButton
                        color="error"
                        onClick={() => setDeleteId(p.id)}
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
