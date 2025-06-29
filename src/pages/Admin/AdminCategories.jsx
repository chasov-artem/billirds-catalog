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

  return (
    <Box>
      <Typography variant="h5" color="primary" mb={2}>
        Категорії
      </Typography>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Нова категорія"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          size="small"
        />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
          disabled={loading}
        >
          Додати
        </Button>
      </Box>
      <Paper sx={{ maxWidth: 500 }}>
        {loading ? (
          <Box p={3} display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {categories.map((cat, idx) => (
              <ListItem key={cat.id} divider>
                {editIdx === idx ? (
                  <>
                    <TextField
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      size="small"
                      sx={{ mr: 2 }}
                    />
                    <Button
                      onClick={handleEditSave}
                      disabled={updating}
                      sx={{ mr: 1 }}
                    >
                      Зберегти
                    </Button>
                    <Button
                      onClick={() => {
                        setEditIdx(null);
                        setEditValue("");
                      }}
                      disabled={updating}
                    >
                      Скасувати
                    </Button>
                  </>
                ) : (
                  <>
                    <ListItemText primary={cat.name} />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleEdit(idx)}>
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
                  </>
                )}
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
      {/* Діалог підтвердження */}
      <Dialog
        open={confirmDialog.open}
        onClose={() =>
          setConfirmDialog({ open: false, action: null, affected: 0 })
        }
      >
        <DialogTitle>
          {confirmDialog.action === "edit"
            ? "Оновити категорію у всіх товарах?"
            : "Видалити категорію у всіх товарах?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmDialog.action === "edit"
              ? `Ця категорія використовується у ${confirmDialog.affected} товарах. Оновити назву у всіх?`
              : `Ця категорія використовується у ${confirmDialog.affected} товарах. Видалити у всіх?`}
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
              if (confirmDialog.action === "edit")
                doEdit(confirmDialog.oldName, confirmDialog.newName);
              else doDelete(confirmDialog.oldName);
            }}
            color="primary"
            disabled={updating}
          >
            {updating ? "Оновлення..." : "Підтвердити"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Snackbar */}
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
