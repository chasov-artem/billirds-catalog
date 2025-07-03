import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  Typography,
  Paper,
  Avatar,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Container,
} from "@mui/material";
import styles from "./AdminPage.module.css";
import { Google } from "@mui/icons-material";
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  getRedirectResult,
} from "firebase/auth";
import app from "../../firebase/config";
import AdminProductsTable from "./AdminProductsTable";
import AdminCategories from "./AdminCategories";
import { debugFirebase } from "../../firebase/debug";

const ADMIN_EMAIL = "chasov90@gmail.com";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usePopup, setUsePopup] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    let unsubscribe;

    const initializeAuth = async () => {
      console.log("Ініціалізація авторизації...");
      console.log("Поточний домен:", window.location.hostname);
      console.log("Auth domain:", auth.config.authDomain);

      try {
        // Спочатку перевіряємо результат redirect авторизації
        const result = await getRedirectResult(auth);
        if (result) {
          console.log("Redirect авторизація успішна:", result.user.email);
          setUser(result.user);
          setLoading(false);
          return;
        } else {
          console.log("Немає результату redirect авторизації");
        }
      } catch (error) {
        console.error("Помилка redirect авторизації:", error);
        setError("Помилка авторизації: " + error.message);
      }

      // Потім підписуємось на зміни стану авторизації
      unsubscribe = onAuthStateChanged(auth, (u) => {
        console.log("Auth state changed:", u?.email);
        setUser(u);
        setLoading(false);
      });
    };

    initializeAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleSignIn = async () => {
    setError("");
    setLoading(true);
    console.log("Початок авторизації...");

    try {
      if (usePopup || isMobile) {
        // Використовуємо popup якщо вибрано або на мобільних
        console.log("Спроба popup авторизації...");
        const result = await signInWithPopup(auth, provider);
        console.log("Popup авторизація успішна:", result.user.email);
        setUser(result.user);
        setLoading(false);
      } else {
        // На десктопі спочатку пробуємо redirect
        console.log("Спроба redirect авторизації...");
        await signInWithRedirect(auth, provider);
        console.log("Redirect авторизація ініційована");
      }
    } catch (e) {
      console.log(
        "Перший спосіб не працює, пробуємо альтернативний:",
        e.message
      );
      try {
        if (usePopup || isMobile) {
          // Якщо popup не працює, пробуємо redirect
          console.log("Спроба redirect авторизації...");
          await signInWithRedirect(auth, provider);
        } else {
          // Якщо redirect не працює, пробуємо popup
          console.log("Спроба popup авторизації...");
          const result = await signInWithPopup(auth, provider);
          console.log("Popup авторизація успішна:", result.user.email);
          setUser(result.user);
          setLoading(false);
        }
      } catch (fallbackError) {
        console.error("Помилка fallback авторизації:", fallbackError);
        setError("Помилка авторизації: " + fallbackError.message);
        setLoading(false);
      }
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
        sx={{
          background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
          minHeight: "100vh",
        }}
      >
        <CircularProgress size={60} sx={{ color: "#115e59" }} />
      </Box>
    );
  }

  if (!user)
    return (
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
          padding: isMobile ? 2 : 4,
        }}
      >
        <Paper
          sx={{
            p: isMobile ? 3 : 4,
            textAlign: "center",
            maxWidth: isMobile ? "100%" : 400,
            width: "100%",
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            variant={isMobile ? "h6" : "h5"}
            mb={3}
            color="primary"
            sx={{ fontWeight: 600 }}
          >
            Вхід для адміністратора
          </Typography>
          {isMobile && (
            <Typography
              variant="body2"
              color="text.secondary"
              mb={2}
              sx={{ fontSize: "0.9rem" }}
            >
              На мобільних пристроях авторизація може зайняти кілька секунд
            </Typography>
          )}

          <Typography
            variant="body2"
            color="text.secondary"
            mb={2}
            sx={{ fontSize: "0.8rem", fontFamily: "monospace" }}
          >
            Домен: {window.location.hostname}
          </Typography>

          <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Режим:
            </Typography>
            <Button
              size="small"
              variant={usePopup ? "outlined" : "contained"}
              onClick={() => setUsePopup(false)}
              sx={{ minWidth: "auto", px: 1 }}
            >
              Redirect
            </Button>
            <Button
              size="small"
              variant={usePopup ? "contained" : "outlined"}
              onClick={() => setUsePopup(true)}
              sx={{ minWidth: "auto", px: 1 }}
            >
              Popup
            </Button>
          </Box>
          <Button
            variant="contained"
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Google />
              )
            }
            onClick={handleSignIn}
            disabled={loading}
            sx={{
              bgcolor: "#115e59",
              ":hover": { bgcolor: "#134e4a" },
              py: isMobile ? 1.5 : 2,
              px: isMobile ? 3 : 4,
              fontSize: isMobile ? "1rem" : "1.1rem",
              borderRadius: 2,
              mb: 2,
            }}
            fullWidth={isMobile}
          >
            {loading ? "Завантаження..." : "Увійти через Google"}
          </Button>

          <Button
            variant="outlined"
            onClick={async () => {
              await debugFirebase();
            }}
            sx={{
              borderColor: "#115e59",
              color: "#115e59",
              ":hover": { borderColor: "#134e4a", color: "#134e4a" },
              py: isMobile ? 1 : 1.5,
              px: isMobile ? 2 : 3,
              fontSize: isMobile ? "0.9rem" : "1rem",
              borderRadius: 2,
              mb: 2,
            }}
            fullWidth={isMobile}
          >
            Debug Firebase
          </Button>

          {error && (
            <Typography
              color="error"
              mt={2}
              sx={{ fontSize: isMobile ? "0.9rem" : "1rem" }}
            >
              {error}
            </Typography>
          )}
        </Paper>
      </Box>
    );

  // Основний інтерфейс адмінки
  return (
    <Box className={styles.adminPage}>
      <Container maxWidth="xl" className={styles.adminContainer}>
        <Paper className={styles.adminPaper}>
          <Box className={styles.userInfo}>
            <Avatar
              src={user.photoURL}
              alt={user.displayName}
              className={styles.userAvatar}
            />
            <Box className={styles.userDetails}>
              <Typography className={styles.userName}>
                {user.displayName}
              </Typography>
              <Typography className={styles.userEmail}>{user.email}</Typography>
            </Box>
          </Box>
          <Button
            variant="outlined"
            onClick={handleSignOut}
            className={styles.logoutButton}
            fullWidth={isMobile}
          >
            Вийти
          </Button>

          <AdminProductsTable />

          <Box mt={isMobile ? 4 : 5}>
            <Typography className={styles.sectionTitle}>
              Керування категоріями
            </Typography>
            <AdminCategories />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
