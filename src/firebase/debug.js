import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import app from "./config";

const auth = getAuth(app);

export const debugFirebase = async () => {
  console.log("=== FIREBASE DEBUG ===");
  console.log("App config:", app.options);
  console.log("Auth config:", auth.config);
  console.log("Current domain:", window.location.hostname);
  console.log("User agent:", navigator.userAgent);

  try {
    // Тестуємо анонімну авторизацію
    console.log("Тестування анонімної авторизації...");
    const result = await signInAnonymously(auth);
    console.log("✅ Анонімна авторизація працює:", result.user.uid);

    // Відразу виходимо
    await auth.signOut();
    console.log("✅ Вихід працює");

    return true;
  } catch (error) {
    console.error("❌ Помилка Firebase:", error);
    return false;
  }
};

export const checkAuthState = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state check:", user ? user.email : "null");
      unsubscribe();
      resolve(user);
    });
  });
};
