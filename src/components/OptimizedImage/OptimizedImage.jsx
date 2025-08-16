import React, { useState, useEffect, useRef } from "react";
import { Skeleton, Box } from "@mui/material";

const OptimizedImage = ({
  src,
  alt,
  width = "100%",
  height = "auto",
  className = "",
  style = {},
  placeholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFyZSBsb2FkaW5nLi4uPC90ZXh0Pjwvc3ZnPg==",
  onLoad,
  onError,
  priority = false,
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    if (!src) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    // Якщо priority = true, завантажуємо одразу
    if (priority) {
      loadImage(src);
      return;
    }

    // Налаштовуємо Intersection Observer для lazy loading
    if ("IntersectionObserver" in window && !priority) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              observerRef.current?.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: "50px 0px", // Завантажуємо за 50px до появи в viewport
          threshold: 0.1,
        }
      );

      if (imgRef.current) {
        observerRef.current.observe(imgRef.current);
      }
    } else {
      // Fallback для браузерів без Intersection Observer
      setIsInView(true);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [src, priority]);

  useEffect(() => {
    if (isInView && src) {
      loadImage(src);
    }
  }, [isInView, src]);

  const loadImage = (imageSrc) => {
    setIsLoading(true);
    setHasError(false);

    const img = new Image();

    img.onload = () => {
      setImageSrc(imageSrc);
      setIsLoading(false);
      if (onLoad) onLoad();
    };

    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
      if (onError) onError();
    };

    img.src = imageSrc;
  };

  if (hasError) {
    return (
      <Box
        sx={{
          width,
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
          color: "#666",
          fontSize: "14px",
          borderRadius: "8px",
          ...style,
        }}
        className={className}
      >
        Помилка завантаження зображення
      </Box>
    );
  }

  return (
    <Box
      ref={imgRef}
      sx={{
        position: "relative",
        width,
        height,
        overflow: "hidden",
        borderRadius: "8px",
        ...style,
      }}
      className={className}
    >
      {isLoading && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            borderRadius: "8px",
          }}
        />
      )}
      <img
        src={imageSrc}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.3s ease-in-out",
          borderRadius: "8px",
        }}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
      />
    </Box>
  );
};

export default OptimizedImage;
