// Скрипт для оновлення email'ів в правилах безпеки
// Використання: node scripts/update-security-rules.js

const fs = require("fs");
const path = require("path");

const firestoreRulesPath = path.join(__dirname, "../firestore.rules");
const storageRulesPath = path.join(__dirname, "../storage.rules");

// Email'и адміністраторів (додайте сюди нові)
const ADMIN_EMAILS = [
  "chasov90@gmail.com",
  "biillija777@gmail.com", // Email нового власника
];

function updateFirestoreRules() {
  console.log("Оновлення правил Firestore...");

  const emailsString = ADMIN_EMAILS.map((email) => `'${email}'`).join(", ");

  const rules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Дозволяємо читати всі документи
    match /{document=**} {
      allow read: if true;
    }
    
    // Дозволяємо записувати в колекцію products тільки аутентифікованим адміністраторам
    match /products/{productId} {
      allow write: if request.auth != null && 
        request.auth.token.email in [${emailsString}];
    }
    
    // Дозволяємо записувати в колекцію categories тільки аутентифікованим адміністраторам
    match /categories/{categoryId} {
      allow write: if request.auth != null && 
        request.auth.token.email in [${emailsString}];
    }
  }
}`;

  fs.writeFileSync(firestoreRulesPath, rules);
  console.log("✅ Правила Firestore оновлено!");
}

function updateStorageRules() {
  console.log("Оновлення правил Storage...");

  const emailsString = ADMIN_EMAILS.map((email) => `'${email}'`).join(", ");

  const rules = `rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Дозволяємо читати всі файли
    match /{allPaths=**} {
      allow read: if true;
    }
    
    // Дозволяємо записувати в папку products тільки аутентифікованим адміністраторам
    match /products/{allPaths=**} {
      allow write: if request.auth != null && 
        request.auth.token.email in [${emailsString}];
    }
  }
}`;

  fs.writeFileSync(storageRulesPath, rules);
  console.log("✅ Правила Storage оновлено!");
}

function showCurrentEmails() {
  console.log("\n📧 Поточні email'и адміністраторів:");
  ADMIN_EMAILS.forEach((email, index) => {
    console.log(`  ${index + 1}. ${email}`);
  });
  console.log("");
}

function showHelp() {
  console.log(`
Використання: node scripts/update-security-rules.js

Цей скрипт оновлює правила безпеки Firestore та Storage
з поточним списком email'ів адміністраторів.

Для додавання нового email'а:
1. Відредагуйте масив ADMIN_EMAILS в цьому файлі
2. Запустіть скрипт: node scripts/update-security-rules.js
3. Розгорніть правила в Firebase: firebase deploy --only firestore:rules,storage

Приклад додавання email'а:
const ADMIN_EMAILS = [
  'chasov90@gmail.com',
  'newowner@example.com', // Новий email
];
  `);
}

// Головна функція
function main() {
  showCurrentEmails();

  if (ADMIN_EMAILS.length === 0) {
    console.log("❌ Список email'ів порожній! Додайте хоча б один email.");
    return;
  }

  updateFirestoreRules();
  updateStorageRules();

  console.log("\n🎉 Всі правила оновлено!");
  console.log("📝 Не забудьте розгорнути правила в Firebase:");
  console.log("   firebase deploy --only firestore:rules,storage");
}

// Перевірка аргументів командного рядка
const command = process.argv[2];

if (command === "help" || command === "--help" || command === "-h") {
  showHelp();
} else {
  main();
}
