import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert as MuiAlert,
  ListItemSecondaryAction,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Grid,
  Chip,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../firebase/config";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [editIdx, setEditIdx] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [deleteIdx, setDeleteIdx] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: null,
    affected: 0,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [updating, setUpdating] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const fetchCategories = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, "categories"));
    setCategories(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Додавання категорії
  const handleAdd = async () => {
    if (!newCategory.trim()) return;
    try {
      await addDoc(collection(db, "categories"), { name: newCategory.trim() });
      setSnackbar({
        open: true,
        message: "Категорію додано!",
        severity: "success",
      });
      setNewCategory("");
      fetchCategories();
    } catch (e) {
      setSnackbar({
        open: true,
        message: "Помилка: " + e.message,
        severity: "error",
      });
    }
  };

  // Підрахунок скільки товарів буде змінено
  const countAffectedProducts = async (categoryName) => {
    const q = query(
      collection(db, "products"),
      where("Категорія", "==", categoryName)
    );
    const snap = await getDocs(q);
    return snap.docs.length;
  };

  // Редагування категорії
  const handleEdit = async (idx) => {
    setEditIdx(idx);
    setEditValue(categories[idx].name);
  };
  const handleEditSave = async () => {
    if (!editValue.trim()) return;
    const oldName = categories[editIdx].name;
    const newName = editValue.trim();
    try {
      // Підрахунок affected
      const affected = await countAffectedProducts(oldName);
      setConfirmDialog({
        open: true,
        action: "edit",
        affected,
        oldName,
        newName,
      });
    } catch (e) {
      setSnackbar({
        open: true,
        message: "Помилка: " + e.message,
        severity: "error",
      });
      setUpdating(false);
    }
  };
  const doEdit = async (oldName, newName) => {
    try {
      // Оновлюємо категорію у довіднику
      await updateDoc(doc(db, "categories", categories[editIdx].id), {
        name: newName,
      });
      // Масове оновлення у товарах
      const q = query(
        collection(db, "products"),
        where("Категорія", "==", oldName)
      );
      const snap = await getDocs(q);
      const batch = writeBatch(db);
      snap.docs.forEach((d) => batch.update(d.ref, { Категорія: newName }));
      await batch.commit();
      setSnackbar({
        open: true,
        message: `Категорію оновлено у ${snap.docs.length} товарах!`,
        severity: "success",
      });
      setEditIdx(null);
      setEditValue("");
      fetchCategories();
    } catch (e) {
      setSnackbar({
        open: true,
        message: "Помилка: " + e.message,
        severity: "error",
      });
    } finally {
      setUpdating(false);
      setConfirmDialog({ open: false, action: null, affected: 0 });
    }
  };

  // Видалення категорії
  const handleDelete = async (idx) => {
    setDeleteIdx(idx);
    const affected = await countAffectedProducts(categories[idx].name);
    setConfirmDialog({
      open: true,
      action: "delete",
      affected,
      oldName: categories[idx].name,
    });
  };
  const doDelete = async (oldName) => {
    setUpdating(true);
    try {
      // Видаляємо категорію з довідника
      await deleteDoc(doc(db, "categories", categories[deleteIdx].id));
      // Масове оновлення у товарах (видалити категорію)
      const q = query(
        collection(db, "products"),
        where("Категорія", "==", oldName)
      );
      const snap = await getDocs(q);
      const batch = writeBatch(db);
      snap.docs.forEach((d) => batch.update(d.ref, { Категорія: "" }));
      await batch.commit();
      setSnackbar({
        open: true,
        message: `Категорію видалено у ${snap.docs.length} товарах!`,
        severity: "success",
      });
      setDeleteIdx(null);
      fetchCategories();
    } catch (e) {
      setSnackbar({
        open: true,
        message: "Помилка: " + e.message,
        severity: "error",
      });
    } finally {
      setUpdating(false);
      setConfirmDialog({ open: false, action: null, affected: 0 });
    }
  };

  // Мобільна версія - картки
  const renderMobileCards = () => (
    <Grid container spacing={2}>
      {loading ? (
        <Grid item xs={12} display="flex" justifyContent="center" py={4}>
          <CircularProgress size={40} />
        </Grid>
      ) : categories.length === 0 ? (
        <Grid item xs={12} textAlign="center" py={4}>
          <Typography color="text.secondary">Немає категорій</Typography>
        </Grid>
      ) : (
        categories.map((category, idx) => (
          <Grid item xs={12} key={category.id}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent sx={{ pb: 1 }}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box flex={1}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {category.name}
                    </Typography>
                  </Box>
                  <Box display="flex" gap={1}>
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleEdit(idx)}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDelete(idx)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );

  // Десктопна версія - список
  const renderDesktopList = () => (
    <Paper sx={{ borderRadius: 2 }}>
      <List>
        {loading ? (
          <ListItem>
            <Box display="flex" justifyContent="center" width="100%" py={4}>
              <CircularProgress size={40} />
            </Box>
          </ListItem>
        ) : categories.length === 0 ? (
          <ListItem>
            <Box display="flex" justifyContent="center" width="100%" py={4}>
              <Typography color="text.secondary">Немає категорій</Typography>
            </Box>
          </ListItem>
        ) : (
          categories.map((category, idx) => (
            <ListItem key={category.id} divider>
              <ListItemText primary={category.name} />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  color="primary"
                  onClick={() => handleEdit(idx)}
                  sx={{ mr: 1 }}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  edge="end"
                  color="error"
                  onClick={() => handleDelete(idx)}
                >
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))
        )}
      </List>
    </Paper>
  );

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2} mb={3} flexWrap="wrap">
        <TextField
          label="Нова категорія"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          size="small"
          sx={{
            flex: 1,
            minWidth: isMobile ? "100%" : 200,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
          onKeyPress={(e) => e.key === "Enter" && handleAdd()}
        />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
          disabled={!newCategory.trim()}
          sx={{
            bgcolor: "#115e59",
            ":hover": { bgcolor: "#134e4a" },
            py: isMobile ? 1 : 1.5,
            px: isMobile ? 2 : 3,
            borderRadius: 2,
          }}
        >
          Додати
        </Button>
      </Box>

      {isMobile ? renderMobileCards() : renderDesktopList()}

      {/* Діалог редагування */}
      <Dialog
        open={editIdx !== null}
        onClose={() => setEditIdx(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Редагувати категорію</DialogTitle>
        <DialogContent>
          <TextField
            label="Назва категорії"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            fullWidth
            sx={{ mt: 1 }}
            onKeyPress={(e) => e.key === "Enter" && handleEditSave()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditIdx(null)}>Скасувати</Button>
          <Button
            onClick={handleEditSave}
            variant="contained"
            disabled={!editValue.trim()}
          >
            Зберегти
          </Button>
        </DialogActions>
      </Dialog>

      {/* Діалог підтвердження */}
      <Dialog
        open={confirmDialog.open}
        onClose={() =>
          setConfirmDialog({ open: false, action: null, affected: 0 })
        }
      >
        <DialogTitle>
          {confirmDialog.action === "edit"
            ? "Редагувати категорію?"
            : "Видалити категорію?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmDialog.action === "edit" ? (
              <>
                Категорія "{confirmDialog.oldName}" буде змінена на "
                {confirmDialog.newName}".
                <br />
                Це вплине на {confirmDialog.affected} товар(ів).
              </>
            ) : (
              <>
                Категорія "{confirmDialog.oldName}" буде видалена.
                <br />
                Це вплине на {confirmDialog.affected} товар(ів).
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setConfirmDialog({ open: false, action: null, affected: 0 })
            }
            disabled={updating}
          >
            Скасувати
          </Button>
          <Button
            onClick={() => {
              if (confirmDialog.action === "edit") {
                doEdit(confirmDialog.oldName, confirmDialog.newName);
              } else {
                doDelete(confirmDialog.oldName);
              }
            }}
            color={confirmDialog.action === "edit" ? "primary" : "error"}
            variant="contained"
            disabled={updating}
          >
            {updating
              ? "Обробка..."
              : confirmDialog.action === "edit"
              ? "Редагувати"
              : "Видалити"}
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
