// SEO утиліти для оптимізації контенту

// Генерація унікального опису для товару
export const generateProductDescription = (product) => {
  const name = product.Назва || product.name || "Більярдний стіл";
  const category = product.Категорія || product.category || "Більярдні столи";
  const price = product.Ціна || product.price;
  const model = product.Модель || product.model || "";

  let description = `Купити ${name.toLowerCase()} в Дніпрі. `;

  if (category === "Більярдні столи") {
    description += `Професійний більярдний стіл для дому та комерційного використання. `;
    description += `Високоякісне покриття, надійна конструкція. `;
  } else if (category === "Киї") {
    description += `Професійний більярдний кий для гри. `;
    description += `Відмінна балансування, комфортна рукоятка. `;
  } else if (category === "Кулі") {
    description += `Більярдні кулі високої якості. `;
    description += `Точні розміри, довговічність. `;
  } else if (category === "Тенісні столи") {
    description += `Професійний тенісний стіл для дому та клубів. `;
    description += `Високоякісне покриття, регульована сітка. `;
  }

  if (model) {
    description += `Модель: ${model}. `;
  }

  if (price) {
    description += `Ціна: ${price} грн. `;
  }

  description += `Доставка по Україні. Гарантія якості. Замовляйте зараз!`;

  return description;
};

// Генерація alt-тексту для зображень
export const generateImageAlt = (product, imageIndex = 0) => {
  const name = product.Назва || product.name || "Більярдний стіл";
  const category = product.Категорія || product.category || "Більярдні столи";

  if (imageIndex === 0) {
    return `${name} - ${category} в Дніпрі`;
  } else {
    return `${name} - фото ${imageIndex + 1}, ${category}`;
  }
};

// Генерація title для сторінки товару
export const generateProductTitle = (product) => {
  const name = product.Назва || product.name || "Більярдний стіл";
  const category = product.Категорія || product.category || "Більярдні столи";
  const price = product.Ціна || product.price;

  let title = `${name} - ${category}`;

  if (price) {
    title += ` | ${price} грн`;
  }

  title += ` | Купити в Дніпрі`;

  return title;
};

// Генерація meta description для товару
export const generateProductMetaDescription = (product) => {
  const name = product.Назва || product.name || "Більярдний стіл";
  const category = product.Категорія || product.category || "Більярдні столи";
  const price = product.Ціна || product.price;

  let description = `Купити ${name.toLowerCase()} в Дніпрі. `;
  description += `${category} високої якості. `;

  if (price) {
    description += `Ціна ${price} грн. `;
  }

  description += `Доставка по Україні. Гарантія. Замовляйте зараз!`;

  return description;
};

// Генерація slug для URL
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[а-я]/g, (match) => {
      const translit = {
        а: "a",
        б: "b",
        в: "v",
        г: "h",
        ґ: "g",
        д: "d",
        е: "e",
        є: "ye",
        ж: "zh",
        з: "z",
        и: "y",
        і: "i",
        ї: "yi",
        й: "y",
        к: "k",
        л: "l",
        м: "m",
        н: "n",
        о: "o",
        п: "p",
        р: "r",
        с: "s",
        т: "t",
        у: "u",
        ф: "f",
        х: "kh",
        ц: "ts",
        ч: "ch",
        ш: "sh",
        щ: "shch",
        ь: "",
        ю: "yu",
        я: "ya",
      };
      return translit[match] || match;
    })
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim("-");
};
