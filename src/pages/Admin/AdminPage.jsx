import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Container,
  Avatar,
} from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
import styles from "./AdminPage.module.css";
import AdminProductsTable from "./AdminProductsTable";
import AdminCategories from "./AdminCategories";

// Лейзи-завантаження Firebase Auth
const loadFirebaseAuth = async () => {
  const {
    getAuth,
    signInWithPopup,
    signInWithRedirect,
    GoogleAuthProvider,
    signOut,
    getRedirectResult,
  } = await import("firebase/auth");
  const { default: app } = await import("../../firebase/config");
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  return {
    auth,
    signInWithPopup,
    signInWithRedirect,
    signOut,
    getRedirectResult,
    provider,
  };
};

// Список дозволених email адміністраторів
const ADMIN_EMAILS = [
  "chasov.artem@gmail.com",
  "chasov90@gmail.com",
  "biillija777@gmail.com",
  "admin@billiard-servis.com",
];

function AdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authLoaded, setAuthLoaded] = useState(false);
  const [authInstance, setAuthInstance] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Лейзи-завантаження Firebase Auth
  useEffect(() => {
    const initAuth = async () => {
      try {
        const auth = await loadFirebaseAuth();
        setAuthInstance(auth);
        setAuthLoaded(true);
      } catch (error) {
        console.error("Помилка завантаження Firebase Auth:", error);
        setError("Помилка ініціалізації авторизації");
      }
    };

    initAuth();
  }, []);

  // Перевірка збереженого користувача
  useEffect(() => {
    if (!authLoaded) return;

    const savedUser = localStorage.getItem("adminUser");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch {
        localStorage.removeItem("adminUser");
      }
    }

    // Перевіряємо результат redirect авторизації
    const checkRedirectResult = async () => {
      try {
        const result = await authInstance.getRedirectResult(authInstance.auth);
        if (result?.user) {
          if (ADMIN_EMAILS.includes(result.user.email)) {
            setUser(result.user);
            localStorage.setItem("adminUser", JSON.stringify(result.user));
          } else {
            await authInstance.signOut(authInstance.auth);
            setError(
              "Доступ заборонено. Ваш email не в списку адміністраторів."
            );
          }
        }
      } catch (error) {
        console.error("Помилка перевірки redirect результату:", error);
      }
    };

    checkRedirectResult();

    // Слухач змін авторизації
    const unsubscribe = authInstance?.auth?.onAuthStateChanged((user) => {
      if (user && ADMIN_EMAILS.includes(user.email)) {
        setUser(user);
        localStorage.setItem("adminUser", JSON.stringify(user));
      } else if (!user) {
        setUser(null);
        localStorage.removeItem("adminUser");
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [authLoaded, authInstance]);

  const handleSignIn = async () => {
    if (!authInstance) {
      setError("Авторизація ще не завантажена");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const { auth, signInWithPopup, signInWithRedirect, provider } =
        authInstance;

      // Спочатку пробуємо popup, якщо не спрацює - redirect
      try {
        const result = await signInWithPopup(auth, provider);

        // Перевіряємо чи email користувача в списку дозволених
        if (!ADMIN_EMAILS.includes(result.user.email)) {
          await authInstance.signOut(auth);
          setError("Доступ заборонено. Ваш email не в списку адміністраторів.");
          setLoading(false);
          return;
        }

        setUser(result.user);
        localStorage.setItem("adminUser", JSON.stringify(result.user));
        setLoading(false);
      } catch (popupError) {
        console.log("Popup failed, trying redirect:", popupError);
        // Якщо popup не спрацював, використовуємо redirect
        await signInWithRedirect(auth, provider);
        // Redirect відбувається автоматично
      }
    } catch (e) {
      console.error("Помилка авторизації:", e);
      setError("Помилка авторизації: " + e.message);
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (!authInstance) return;

    try {
      await authInstance.signOut(authInstance.auth);
      setUser(null);
      localStorage.removeItem("adminUser");
    } catch (e) {
      console.error("Помилка виходу:", e);
    }
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

  if (!authLoaded) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
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

          {error && (
            <Typography
              variant="body2"
              color="error"
              mb={2}
              sx={{ fontSize: "0.9rem" }}
            >
              {error}
            </Typography>
          )}

          <Button
            variant="contained"
            startIcon={<GoogleIcon />}
            onClick={handleSignIn}
            disabled={loading}
            sx={{
              width: "100%",
              py: 1.5,
              backgroundColor: "#4285f4",
              "&:hover": {
                backgroundColor: "#3367d6",
              },
            }}
          >
            {loading ? "Вхід..." : "Увійти через Google"}
          </Button>
        </Paper>
      </Box>
    );

  // Основний інтерфейс адмінки
  return (
    <Box className={styles.adminPage}>
      <Container maxWidth="xl" className={styles.adminContainer}>
        <Paper className={styles.adminPaper}>
          <Box className={styles.userInfo}>
            <Avatar className={styles.userAvatar}>
              {user.displayName?.charAt(0) || user.email?.charAt(0) || "A"}
            </Avatar>
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
            sx={{
              borderColor: "#115e59",
              color: "#115e59",
              "&:hover": {
                borderColor: "#134e4a",
                backgroundColor: "rgba(17, 94, 89, 0.04)",
              },
            }}
          >
            Вийти
          </Button>
        </Paper>

        <Box className={styles.adminContent}>
          <AdminProductsTable />
          <AdminCategories />
        </Box>
      </Container>
    </Box>
  );
}

export default AdminPage;
