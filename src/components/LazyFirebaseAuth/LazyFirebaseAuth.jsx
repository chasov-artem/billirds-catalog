import React, { useEffect, useState } from "react";

const LazyFirebaseAuth = ({ children }) => {
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  useEffect(() => {
    // Відкладаємо завантаження Firebase Auth
    const loadAuth = async () => {
      try {
        // Завантажуємо Firebase Auth тільки коли потрібно
        const { getAuth } = await import("firebase/auth");
        getAuth(); // Ініціалізуємо auth
        setIsAuthLoaded(true);
      } catch (error) {
        console.warn("Failed to load Firebase Auth:", error);
        setIsAuthLoaded(true); // Продовжуємо роботу навіть якщо auth не завантажився
      }
    };

    // Завантажуємо auth через 3 секунди після завантаження сторінки
    const timer = setTimeout(loadAuth, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {children}
      {!isAuthLoaded && (
        <div style={{ display: "none" }}>
          {/* Прихований елемент для preload Firebase Auth */}
        </div>
      )}
    </>
  );
};

export default LazyFirebaseAuth;
