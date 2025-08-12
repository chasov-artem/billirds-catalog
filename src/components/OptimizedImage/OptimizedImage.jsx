import React, { useState, useEffect } from 'react';
import { Skeleton, Box } from '@mui/material';

const OptimizedImage = ({ 
  src, 
  alt, 
  width = '100%', 
  height = 'auto', 
  className = '',
  style = {},
  placeholder = 'https://via.placeholder.com/400x300?text=Завантаження...',
  onLoad,
  onError
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
      if (onLoad) onLoad();
    };

    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
      if (onError) onError();
    };

    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, onLoad, onError]);

  if (hasError) {
    return (
      <Box
        sx={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          color: '#666',
          fontSize: '14px',
          ...style
        }}
        className={className}
      >
        Помилка завантаження зображення
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', width, height, ...style }} className={className}>
      {isLoading && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          sx={{ position: 'absolute', top: 0, left: 0 }}
        />
      )}
      <img
        src={imageSrc}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out'
        }}
        loading="lazy"
      />
    </Box>
  );
};

export default OptimizedImage;
