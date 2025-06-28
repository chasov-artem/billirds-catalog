import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  Typography,
  Paper,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { Google } from "@mui/icons-material";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import app from "../../firebase/config";

const ADMIN_EMAIL = "chasov90@gmail.com";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setError("");
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      setError("Помилка входу: " + e.message);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  if (loading) {
    return (
      <Box
        minHeight="60vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user)
    return (
      <Box
        minHeight="60vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Paper sx={{ p: 4, textAlign: "center", maxWidth: 400 }}>
          <Typography variant="h5" mb={2} color="primary">
            Вхід для адміністратора
          </Typography>
          <Button
            variant="contained"
            startIcon={<Google />}
            onClick={handleSignIn}
            sx={{ bgcolor: "#115e59", ":hover": { bgcolor: "#134e4a" } }}
          >
            Увійти через Google
          </Button>
          {error && (
            <Typography color="error" mt={2}>
              {error}
            </Typography>
          )}
        </Paper>
      </Box>
    );

  if (user.email !== ADMIN_EMAIL)
    return (
      <Box
        minHeight="60vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Paper sx={{ p: 4, textAlign: "center", maxWidth: 400 }}>
          <Typography variant="h6" color="error">
            Доступ заборонено
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Ви не є адміністратором цього сайту
          </Typography>
          <Button variant="outlined" onClick={handleSignOut}>
            Вийти
          </Button>
        </Paper>
      </Box>
    );

  // Тут буде основний інтерфейс адмінки
  return (
    <Box
      minHeight="60vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Paper sx={{ p: 4, textAlign: "center", maxWidth: 600, width: "100%" }}>
        <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
          <Avatar
            src={user.photoURL}
            alt={user.displayName}
            sx={{ width: 56, height: 56, mr: 2 }}
          />
          <Box>
            <Typography variant="h6">{user.displayName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        </Box>
        <Typography variant="h5" mb={2} color="primary">
          Адмін-панель (далі буде CRUD)
        </Typography>
        <Button variant="outlined" onClick={handleSignOut}>
          Вийти
        </Button>
      </Paper>
    </Box>
  );
}
