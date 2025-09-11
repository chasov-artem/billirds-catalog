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
  const [retryCount, setRetryCount] = useState(0);
  const [currentSrc, setCurrentSrc] = useState("");
  const imgRef = useRef(null);

  // WebP support detection with iOS Safari check
  const supportsWebP = () => {
    if (typeof window === "undefined") return false;

    // Check if it's iOS Safari
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isIOS && isSafari) {
      // iOS Safari supports WebP from iOS 14+
      const iOSVersion = navigator.userAgent.match(/OS (\d+)_/);
      return iOSVersion && parseInt(iOSVersion[1]) >= 14;
    }

    // Regular WebP detection for other browsers
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
  };

  // Generate optimized image URL with iOS fallback
  const getOptimizedSrc = (originalSrc, retryAttempt = 0) => {
    if (!originalSrc) return "";

    // If it's a Firebase Storage URL, add optimization parameters
    if (originalSrc.includes("firebasestorage.googleapis.com")) {
      const baseUrl = originalSrc.split("?")[0];
      const params = new URLSearchParams();

      // Check if it's iOS Safari
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );

      // Add WebP format if supported (but not for iOS Safari on older versions)
      if (supportsWebP() && !(isIOS && isSafari && retryAttempt === 0)) {
        params.append("alt", "media");
        params.append("format", "webp");
      } else {
        params.append("alt", "media");
      }

      // Different optimization for iOS vs other devices
      if (isIOS && isSafari) {
        // Simpler parameters for iOS Safari
        params.append("w", "400");
        params.append("q", "70");
      } else {
        // Regular optimization for other browsers
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth <= 1200;

        if (isMobile) {
          params.append("w", "250");
        } else if (isTablet) {
          params.append("w", "400");
        } else {
          params.append("w", "500");
        }
        params.append("q", "80");
      }

      return `${baseUrl}?${params.toString()}`;
    }

    return originalSrc;
  };

  // Initialize current source
  useEffect(() => {
    if (src) {
      setCurrentSrc(getOptimizedSrc(src, retryCount));
    }
  }, [src, retryCount]);

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
    setIsError(false);
  };

  const handleError = (e) => {
    if (retryCount < 3) {
      // Retry with different parameters
      setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        setCurrentSrc(getOptimizedSrc(src, retryCount + 1));
      }, 1000);
    } else {
      // Final fallback - try original URL without any parameters
      if (retryCount === 3) {
        setRetryCount(4);
        const baseUrl = src.split("?")[0];
        setCurrentSrc(baseUrl);
      } else {
        // Last resort - show error
        setIsError(true);
        if (onError) onError(e);
      }
    }
  };

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
      {isInView && !isError && currentSrc && (
        <img
          src={currentSrc}
          alt={alt}
          className={`${styles.image} ${isLoaded ? styles.loaded : ""}`}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          sizes={sizes}
          style={{
            opacity: isLoaded ? 1 : 0.7,
            backgroundColor: "#f5f5f5",
          }}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
