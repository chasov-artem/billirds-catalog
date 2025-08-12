import { useEffect } from 'react';

const StructuredData = ({ data }) => {
  useEffect(() => {
    // Видаляємо попередні структуровані дані
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => script.remove());

    // Додаємо нові структуровані дані
    if (data) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(data);
      document.head.appendChild(script);
    }

    // Cleanup при розмонтуванні
    return () => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      scripts.forEach(script => script.remove());
    };
  }, [data]);

  return null;
};

export default StructuredData;
