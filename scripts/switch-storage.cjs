// Скрипт для переключення storage між Firebase проектами
// Використання: node scripts/switch-storage.cjs [old|new|config]

const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "../src/firebase/config.js");

// Конфігурації storage для різних власників
const STORAGE_CONFIGS = {
  old: {
    storageBucket: "billiard-catalog.firebasestorage.app",
    description: "Ваш storage (chasov90@gmail.com)",
  },
  new: {
    storageBucket: "your-new-project.firebasestorage.app", // Замініть на реальний
    description: "Storage нового власника (biillija777@gmail.com)",
  },
};

function switchStorage(target) {
  console.log(
    `Переключення storage на: ${STORAGE_CONFIGS[target].description}`
  );

  // Читаємо поточну конфігурацію
  let config = fs.readFileSync(configPath, "utf8");

  // Замінюємо storageBucket
  const newStorageBucket = STORAGE_CONFIGS[target].storageBucket;

  // Знаходимо та замінюємо storageBucket
  config = config.replace(
    /storageBucket:\s*import\.meta\.env\.VITE_FIREBASE_STORAGE_BUCKET\s*\|\|\s*"[^"]*"/g,
    `storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "${newStorageBucket}"`
  );

  // Записуємо оновлену конфігурацію
  fs.writeFileSync(configPath, config);

  console.log(`✅ Storage переключено на: ${newStorageBucket}`);
  console.log(
    "📝 Не забудьте оновити змінну VITE_FIREBASE_STORAGE_BUCKET в Vercel"
  );
}

function showConfig() {
  console.log("\n📋 Поточні конфігурації storage:");
  Object.entries(STORAGE_CONFIGS).forEach(([key, config]) => {
    console.log(`  ${key}: ${config.storageBucket} (${config.description})`);
  });

  console.log("\n📝 Для налаштування нового storage:");
  console.log("1. Оновіть STORAGE_CONFIGS.new.storageBucket в цьому файлі");
  console.log("2. Запустіть: node scripts/switch-storage.cjs new");
  console.log("3. Оновіть змінну VITE_FIREBASE_STORAGE_BUCKET в Vercel");
}

function showHelp() {
  console.log(`
Використання: node scripts/switch-storage.cjs [old|new|config]

Команди:
  old    - Переключити на ваш storage (billiard-catalog)
  new    - Переключити на storage нового власника
  config - Показати поточні конфігурації
  
Приклади:
  node scripts/switch-storage.cjs old
  node scripts/switch-storage.cjs new
  node scripts/switch-storage.cjs config

Для налаштування нового storage:
1. Отримайте storage bucket URL з Firebase Console нового власника
2. Оновіть STORAGE_CONFIGS.new.storageBucket в цьому файлі
3. Запустіть: node scripts/switch-storage.cjs new
4. Оновіть змінну VITE_FIREBASE_STORAGE_BUCKET в Vercel
  `);
}

const command = process.argv[2];

switch (command) {
  case "old":
    switchStorage("old");
    break;
  case "new":
    switchStorage("new");
    break;
  case "config":
    showConfig();
    break;
  case "help":
  case "--help":
  case "-h":
  default:
    showHelp();
    break;
}
