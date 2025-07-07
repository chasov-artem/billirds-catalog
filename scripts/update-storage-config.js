#!/usr/bin/env node

/**
 * Скрипт для оновлення конфігурації Firebase Storage
 * Використовується після налаштування Storage новим власником
 *
 * Архітектура:
 * - База даних (Firestore): залишається у chasov90@gmail.com
 * - Storage (зображення): буде у biillija777@gmail.com
 * - Проект Firebase: спільний доступ
 */

/* eslint-env node */
/* global require, __dirname, process, module */

const fs = require("fs");
const path = require("path");

// Функція для оновлення конфігурації Firebase
function updateFirebaseConfig(newStorageBucket) {
  const configPath = path.join(__dirname, "../src/firebase/config.js");

  try {
    // Читаємо поточний файл конфігурації
    let configContent = fs.readFileSync(configPath, "utf8");

    // Оновлюємо storageBucket
    const updatedConfig = configContent.replace(
      /storageBucket:\s*import\.meta\.env\.VITE_FIREBASE_STORAGE_BUCKET\s*\|\|\s*"[^"]*"/,
      `storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "${newStorageBucket}"`
    );

    // Записуємо оновлену конфігурацію
    fs.writeFileSync(configPath, updatedConfig, "utf8");

    console.log("✅ Firebase конфігурацію оновлено успішно!");
    console.log(`📦 Новий Storage Bucket: ${newStorageBucket}`);

    return true;
  } catch (error) {
    console.error("❌ Помилка оновлення конфігурації:", error.message);
    return false;
  }
}

// Функція для оновлення правил Storage
function updateStorageRules() {
  const rulesPath = path.join(__dirname, "../storage.rules");

  const newRules = `rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Дозволяємо читати всі файли
    match /{allPaths=**} {
      allow read: if true;
    }
    
    // Дозволяємо записувати в папку products тільки аутентифікованим адміністраторам
    match /products/{allPaths=**} {
      allow write: if request.auth != null && 
        request.auth.token.email in ['chasov90@gmail.com', 'biillija777@gmail.com'];
    }
  }
}`;

  try {
    fs.writeFileSync(rulesPath, newRules, "utf8");
    console.log("✅ Правила Storage оновлено успішно!");
    return true;
  } catch (error) {
    console.error("❌ Помилка оновлення правил Storage:", error.message);
    return false;
  }
}

// Головна функція
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("📋 Використання:");
    console.log("  node update-storage-config.js <storage-bucket-url>");
    console.log("");
    console.log("📝 Приклад:");
    console.log(
      "  node update-storage-config.js billiard-catalog-abc123.firebasestorage.app"
    );
    console.log("");
    console.log("🔧 Додаткові опції:");
    console.log("  --rules-only    - оновити тільки правила Storage");
    console.log("  --config-only   - оновити тільки конфігурацію Firebase");
    return;
  }

  const storageBucket = args[0];
  const rulesOnly = args.includes("--rules-only");
  const configOnly = args.includes("--config-only");

  console.log("🚀 Початок оновлення конфігурації Firebase...");
  console.log(`📦 Storage Bucket: ${storageBucket}`);
  console.log("");

  let success = true;

  // Оновлюємо конфігурацію Firebase
  if (!rulesOnly) {
    console.log("📝 Оновлення конфігурації Firebase...");
    success = updateFirebaseConfig(storageBucket) && success;
  }

  // Оновлюємо правила Storage
  if (!configOnly) {
    console.log("📋 Оновлення правил Storage...");
    success = updateStorageRules() && success;
  }

  console.log("");

  if (success) {
    console.log("🎉 Всі оновлення виконано успішно!");
    console.log("");
    console.log("📋 Наступні кроки:");
    console.log("1. Перевірте зміни в файлах");
    console.log("2. Запустіть проект локально для тестування");
    console.log("3. Перевірте завантаження зображень в адмінці");
    console.log("4. Розгорніть оновлення на продакшн");
  } else {
    console.log("❌ Виникли помилки під час оновлення");
    console.log("Перевірте права доступу до файлів та спробуйте ще раз");
  }
}

// Запускаємо скрипт
if (require.main === module) {
  main();
}

module.exports = {
  updateFirebaseConfig,
  updateStorageRules,
};
