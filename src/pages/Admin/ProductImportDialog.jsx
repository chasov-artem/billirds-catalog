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
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

export default function ProductImportDialog({ open, onClose, onImport }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);

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
          setPreview(results.data);
          setLoading(false);
        },
        error: () => setLoading(false),
      });
    } else if (ext === "xlsx" || ext === "xls") {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);
        setPreview(json);
        setLoading(false);
      };
      reader.onerror = () => setLoading(false);
      reader.readAsArrayBuffer(f);
    } else {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!preview.length) return;
    setImporting(true);
    try {
      for (const row of preview) {
        // Мапінг під ваші поля Firestore
        await addDoc(collection(db, "products"), {
          Назва: row["Назва"] || row["name"] || "",
          Категорія: row["Категорія"] || row["category"] || "",
          Ціна: Number(row["Ціна"] || row["price"] || 0),
          Опис: row["Опис"] || row["description"] || "",
          Фото: row["Фото"] ? [row["Фото"]] : [],
          createdAt: new Date(),
        });
      }
      if (onImport) onImport(preview);
      onClose();
    } catch (e) {
      alert("Помилка імпорту: " + e.message);
    } finally {
      setImporting(false);
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
          {importing ? "Імпорт..." : "Імпортувати"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
