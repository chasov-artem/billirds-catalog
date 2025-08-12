import { useEffect } from "react";

const PerformanceMonitor = () => {
  useEffect(() => {
    try {
      // Відстежуємо час завантаження сторінки
      window.addEventListener("load", () => {
        const loadTime = performance.now();
        console.log("Page Load Time:", loadTime);
      });

      // Відстежуємо метрики продуктивності (якщо підтримуються)
      if ("PerformanceObserver" in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              // LCP (Largest Contentful Paint)
              if (entry.entryType === "largest-contentful-paint") {
                console.log("LCP:", entry.startTime);
              }

              // FID (First Input Delay)
              if (entry.entryType === "first-input") {
                console.log("FID:", entry.processingStart - entry.startTime);
              }

              // CLS (Cumulative Layout Shift)
              if (entry.entryType === "layout-shift" && !entry.hadRecentInput) {
                console.log("CLS:", entry.value);
              }
            }
          });

          // Спостерігаємо за метриками
          observer.observe({
            entryTypes: [
              "largest-contentful-paint",
              "first-input",
              "layout-shift",
            ],
          });

          return () => {
            observer.disconnect();
          };
        } catch (error) {
          console.warn("PerformanceObserver error:", error);
        }
      }
    } catch (error) {
      console.warn("PerformanceMonitor error:", error);
    }
  }, []);

  return null; // Цей компонент не рендерить нічого
};

export default PerformanceMonitor;
