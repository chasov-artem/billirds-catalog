import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUuwSaYga67Tb3uofxYVtSPWrUR21dp5c",
  authDomain: "billiard-catalog.firebaseapp.com",
  projectId: "billiard-catalog",
  storageBucket: "billiard-catalog.firebasestorage.app",
  messagingSenderId: "548960891243",
  appId: "1:548960891243:web:7a5f54a0380f1b6a4a1c2e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;
