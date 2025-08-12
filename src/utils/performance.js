// Утиліти для оптимізації продуктивності

// Оптимізація зображень
export const optimizeImageLoading = () => {
  try {
    // Додаємо loading="lazy" до всіх зображень
    const images = document.querySelectorAll("img:not([loading])");
    images.forEach((img) => {
      if (!img.loading) {
        img.loading = "lazy";
      }
    });
  } catch (error) {
    console.warn("Error optimizing images:", error);
  }
};

// Відстеження помилок завантаження
export const trackLoadingErrors = () => {
  try {
    window.addEventListener("error", (event) => {
      if (event.target && event.target.tagName === "IMG") {
        console.error("Image loading error:", event.target.src);
      }
    });
  } catch (error) {
    console.warn("Error tracking loading errors:", error);
  }
};

// Ініціалізація всіх оптимізацій
export const initializePerformanceOptimizations = () => {
  try {
    // Затримка для того, щоб DOM був готовий
    setTimeout(() => {
      optimizeImageLoading();
      trackLoadingErrors();
    }, 100);
  } catch (error) {
    console.warn("Error initializing performance optimizations:", error);
  }
};
