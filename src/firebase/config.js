import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyDUuwSaYga67Tb3uofxYVtSPWrUR21dp5c",
  authDomain: "billiard-catalog.firebaseapp.com",
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

// Firebase Auth will be loaded only when needed
export const getAuthInstance = () => {
  // Return null for now - auth will be loaded dynamically when needed
  return null;
};

export default app;
