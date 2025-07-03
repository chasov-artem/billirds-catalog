import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Автоматично визначаємо authDomain на основі поточного домену
const getAuthDomain = () => {
  if (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN) {
    return import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
  }

  // Якщо ми на Vercel, використовуємо поточний домен
  if (
    typeof window !== "undefined" &&
    window.location.hostname.includes("vercel.app")
  ) {
    return window.location.hostname;
  }

  // Дефолтне значення для локальної розробки
  return "billiard-catalog.firebaseapp.com";
};

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyDUuwSaYga67Tb3uofxYVtSPWrUR21dp5c",
  authDomain: getAuthDomain(),
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "billiard-catalog",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "billiard-catalog.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "548960891243",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:548960891243:web:7a5f54a0380f1b6a4a1c2e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;
