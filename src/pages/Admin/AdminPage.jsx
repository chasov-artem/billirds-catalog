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
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import app from "../../firebase/config";
import AdminProductsTable from "./AdminProductsTable";
import AdminCategories from "./AdminCategories";

const ADMIN_EMAIL = "chasov90@gmail.com";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
          <Button
            variant="contained"
            startIcon={<Google />}
            onClick={handleSignIn}
            sx={{
              bgcolor: "#115e59",
              ":hover": { bgcolor: "#134e4a" },
              py: isMobile ? 1.5 : 2,
              px: isMobile ? 3 : 4,
              fontSize: isMobile ? "1rem" : "1.1rem",
              borderRadius: 2,
            }}
            fullWidth={isMobile}
          >
            Увійти через Google
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

  if (user.email !== ADMIN_EMAIL)
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
            variant={isMobile ? "h6" : "h6"}
            color="error"
            sx={{ fontWeight: 600, mb: 2 }}
          >
            Доступ заборонено
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            mb={3}
            sx={{ fontSize: isMobile ? "0.9rem" : "1rem" }}
          >
            Ви не є адміністратором цього сайту
          </Typography>
          <Button
            variant="outlined"
            onClick={handleSignOut}
            fullWidth={isMobile}
            sx={{
              py: isMobile ? 1.5 : 2,
              borderRadius: 2,
            }}
          >
            Вийти
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
