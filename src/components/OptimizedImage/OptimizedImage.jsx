import React, { useState, useRef, useEffect } from "react";
import styles from "./OptimizedImage.module.css";

const OptimizedImage = ({
  src,
  alt,
  className,
  style,
  onError,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef(null);

  // WebP support detection
  const supportsWebP = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
  };

  // Generate optimized image URL
  const getOptimizedSrc = (originalSrc) => {
    if (!originalSrc) return "";

    // If it's a Firebase Storage URL, add optimization parameters
    if (originalSrc.includes("firebasestorage.googleapis.com")) {
      const baseUrl = originalSrc.split("?")[0];
      const params = new URLSearchParams();

      // Add WebP format if supported
      if (supportsWebP()) {
        params.append("alt", "media");
        params.append("format", "webp");
      }

      // Add size optimization based on container size and device
      const isMobile = window.innerWidth <= 768;
      const isTablet = window.innerWidth <= 1200;

      if (isMobile) {
        params.append("w", "250"); // Much smaller for mobile
      } else if (isTablet) {
        params.append("w", "400"); // Medium size for tablet
      } else {
        params.append("w", "500"); // Smaller for desktop too
      }

      // Add quality parameter for better compression
      params.append("q", "80"); // Lower quality for better compression

      return `${baseUrl}?${params.toString()}`;
    }

    return originalSrc;
  };

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "50px 0px",
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = (e) => {
    setIsError(true);
    if (onError) onError(e);
  };

  const optimizedSrc = getOptimizedSrc(src);

  return (
    <div
      ref={imgRef}
      className={`${styles.imageContainer} ${className || ""}`}
      style={style}
    >
      {/* Skeleton placeholder */}
      {!isLoaded && !isError && <div className={styles.skeleton} />}

      {/* Error placeholder */}
      {isError && (
        <div className={styles.errorPlaceholder}>
          <span>Помилка завантаження</span>
        </div>
      )}

      {/* Actual image */}
      {isInView && !isError && (
        <img
          src={optimizedSrc}
          alt={alt}
          className={`${styles.image} ${isLoaded ? styles.loaded : ""}`}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          sizes={sizes}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
