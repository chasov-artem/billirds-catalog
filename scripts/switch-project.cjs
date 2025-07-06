// Скрипт для управління Firebase проектом
// Використання: node scripts/switch-project.js [deploy|rules|help]

const { execSync } = require("child_process");

function deployRules() {
  console.log("Розгортання правил безпеки...");
  try {
    execSync("firebase deploy --only firestore:rules,storage", {
      stdio: "inherit",
    });
    console.log("✅ Правила успішно розгорнуті!");
  } catch (error) {
    console.error("❌ Помилка розгортання правил:", error.message);
  }
}

function showHelp() {
  console.log(`
Використання: node scripts/switch-project.js [deploy|rules|help]

Команди:
  deploy  - Розгорнути правила безпеки в Firebase
  rules   - Показати поточні правила безпеки
  help    - Показати цю довідку
  
Приклади:
  node scripts/switch-project.js deploy
  node scripts/switch-project.js rules
  node scripts/switch-project.js help

Поточні адміністратори:
  - chasov90@gmail.com
  - biillija777@gmail.com
  `);
}

function showRules() {
  console.log(`
📋 Поточні правила безпеки:

Firestore Rules (firestore.rules):
- Читання: дозволено всім
- Запис: тільки для chasov90@gmail.com та biillija777@gmail.com

Storage Rules (storage.rules):
- Читання: дозволено всім  
- Запис: тільки для chasov90@gmail.com та biillija777@gmail.com

Для оновлення email'ів використовуйте:
node scripts/update-security-rules.js
  `);
}

const command = process.argv[2];

switch (command) {
  case "deploy":
    deployRules();
    break;
  case "rules":
    showRules();
    break;
  case "help":
  case "--help":
  case "-h":
  default:
    showHelp();
    break;
}
