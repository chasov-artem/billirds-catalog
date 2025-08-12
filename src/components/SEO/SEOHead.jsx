import { useEffect } from 'react';

const SEOHead = ({ 
  title, 
  description, 
  keywords, 
  ogTitle, 
  ogDescription, 
  ogImage, 
  canonical 
}) => {
  useEffect(() => {
    // Оновлюємо заголовок сторінки
    if (title) {
      document.title = title;
    }

    // Оновлюємо мета-теги
    const updateMetaTag = (name, content) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const updatePropertyTag = (property, content) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Оновлюємо description
    if (description) {
      updateMetaTag('description', description);
    }

    // Оновлюємо keywords
    if (keywords) {
      updateMetaTag('keywords', keywords);
    }

    // Оновлюємо Open Graph теги
    if (ogTitle) {
      updatePropertyTag('og:title', ogTitle);
    }
    if (ogDescription) {
      updatePropertyTag('og:description', ogDescription);
    }
    if (ogImage) {
      updatePropertyTag('og:image', ogImage);
    }

    // Оновлюємо canonical URL
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = canonical;
    }

    // Оновлюємо Twitter Card теги
    if (ogTitle) {
      updateMetaTag('twitter:title', ogTitle);
    }
    if (ogDescription) {
      updateMetaTag('twitter:description', ogDescription);
    }
    if (ogImage) {
      updateMetaTag('twitter:image', ogImage);
    }

  }, [title, description, keywords, ogTitle, ogDescription, ogImage, canonical]);

  return null;
};

export default SEOHead;
