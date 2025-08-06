import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
} from "@mui/material";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase/config";

export default function ProductImportDialog({ open, onClose, onImport }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({
    current: 0,
    total: 0,
  });
  const [duplicates, setDuplicates] = useState([]);
  const [clearing, setClearing] = useState(false);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview([]);
    if (!f) return;
    setLoading(true);
    const ext = f.name.split(".").pop().toLowerCase();
    if (ext === "csv") {
      Papa.parse(f, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log("CSV parsed:", results.data);
          setPreview(results.data);
          setLoading(false);
        },
        error: (error) => {
          console.error("CSV parsing error:", error);
          setLoading(false);
        },
      });
    } else if (ext === "xlsx" || ext === "xls") {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = new Uint8Array(evt.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(sheet);
          console.log("Excel parsed:", json);
          setPreview(json);
        } catch (error) {
          console.error("Excel parsing error:", error);
        } finally {
          setLoading(false);
        }
      };
      reader.onerror = (error) => {
        console.error("File reading error:", error);
        setLoading(false);
      };
      reader.readAsArrayBuffer(f);
    } else {
      console.error("Unsupported file type:", ext);
      setLoading(false);
    }
  };

  const clearAllProducts = async () => {
    const shouldClear = confirm(
      "Ви впевнені, що хочете видалити ВСІ товари? Ця дія не може бути скасована!"
    );
    if (!shouldClear) return;

    setClearing(true);
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const deletePromises = querySnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);
      alert("Всі товари видалені!");
    } catch (e) {
      console.error("Помилка видалення:", e);
      alert("Помилка видалення: " + e.message);
    } finally {
      setClearing(false);
    }
  };

  const checkDuplicates = async (products) => {
    const duplicates = [];
    for (const product of products) {
      const productName = product["Назва"] || product["name"] || "";
      if (productName) {
        const q = query(
          collection(db, "products"),
          where("Назва", "==", productName)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          duplicates.push(productName);
        }
      }
    }
    return duplicates;
  };

  const handleImport = async () => {
    if (!preview.length) return;
    setImporting(true);
    setImportProgress({ current: 0, total: preview.length });

    try {
      // Перевіряємо дублікати
      const duplicates = await checkDuplicates(preview);
      if (duplicates.length > 0) {
        const shouldContinue = confirm(
          `Знайдено ${
            duplicates.length
          } товарів, які вже існують:\n${duplicates.join(
            ", "
          )}\n\nПродовжити імпорт?`
        );
        if (!shouldContinue) {
          setImporting(false);
          setImportProgress({ current: 0, total: 0 });
          return;
        }
      }

      for (let i = 0; i < preview.length; i++) {
        const row = preview[i];

        // Мапінг під ваші поля Firestore
        const productData = {
          Назва: row["Назва"] || row["name"] || "",
          Категорія: row["Категорія"] || row["category"] || "",
          Підкатегорія: row["Підкатегорія"] || row["subcategory"] || "",
          Модель: row["Модель"] || row["model"] || "",
          Ціна: Number(row["Ціна"] || row["price"] || 0),
          Опис: row["Опис"] || row["description"] || "",
          createdAt: new Date(),
        };

        // Додаємо фото тільки якщо воно є
        if (row["Фото"] && row["Фото"].trim()) {
          productData.Фото = [row["Фото"].trim()];
        } else {
          productData.Фото = [];
        }

        await addDoc(collection(db, "products"), productData);
        setImportProgress({ current: i + 1, total: preview.length });
      }

      if (onImport) onImport(preview);
      onClose();
    } catch (e) {
      console.error("Помилка імпорту:", e);
      alert("Помилка імпорту: " + e.message);
    } finally {
      setImporting(false);
      setImportProgress({ current: 0, total: 0 });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Імпорт товарів</DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <Button variant="contained" component="label">
            Обрати файл CSV/Excel
            <input
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              hidden
              onChange={handleFileChange}
            />
          </Button>
          {file && (
            <Typography variant="body2" mt={1}>
              Обрано файл: {file.name}
            </Typography>
          )}
          <Button
            variant="outlined"
            color="error"
            onClick={clearAllProducts}
            disabled={clearing}
            sx={{ ml: 2 }}
          >
            {clearing ? "Видалення..." : "Очистити всі товари"}
          </Button>
        </Box>
        {loading ? (
          <Box display="flex" justifyContent="center" my={3}>
            <CircularProgress />
          </Box>
        ) : preview.length > 0 ? (
          <Table size="small">
            <TableHead>
              <TableRow>
                {Object.keys(preview[0]).map((key) => (
                  <TableCell key={key}>{key}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {preview.map((row, idx) => (
                <TableRow key={idx}>
                  {Object.values(row).map((val, i) => (
                    <TableCell key={i}>{val}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={importing}>
          Скасувати
        </Button>
        <Button
          onClick={handleImport}
          variant="contained"
          disabled={!file || !preview.length || importing}
        >
          {importing
            ? `Імпорт... ${importProgress.current}/${importProgress.total}`
            : "Імпортувати"}
        </Button>
        {importing && (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress size={24} />
          </Box>
        )}
      </DialogActions>
    </Dialog>
  );
}
