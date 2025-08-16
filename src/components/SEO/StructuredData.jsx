import { useEffect } from "react";

const StructuredData = ({ data, id = "structured-data" }) => {
  useEffect(() => {
    if (!data) return;

    // Видаляємо попередні структуровані дані з таким же id
    const existingScripts = document.querySelectorAll(
      `script[data-structured-id="${id}"]`
    );
    existingScripts.forEach((script) => script.remove());

    // Додаємо нові структуровані дані
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-structured-id", id);
    script.text = JSON.stringify(data);
    document.head.appendChild(script);

    // Cleanup при розмонтуванні
    return () => {
      const scripts = document.querySelectorAll(
        `script[data-structured-id="${id}"]`
      );
      scripts.forEach((script) => script.remove());
    };
  }, [data, id]);

  return null;
};

export default StructuredData;
