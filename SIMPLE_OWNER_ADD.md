# Додавання нового власника до існуючого Firebase проекту

## ✅ Що зроблено

### 1. Додано новий email в список адміністраторів

- Email `biillija777@gmail.com` додано в `ADMIN_EMAILS` масив
- Тепер обидва власники можуть увійти в адмінку

### 2. Оновлено правила безпеки

- **Firestore Rules**: додано `biillija777@gmail.com` до списку дозволених email'ів
- **Storage Rules**: додано `biillija777@gmail.com` до списку дозволених email'ів
- Правила розгорнуті в Firebase

### 3. Створено інструменти для управління

- `scripts/update-security-rules.js` - для оновлення email'ів в правилах
- `scripts/switch-project.js` - для переключення між проектами (якщо потрібно)

## 🚀 Як це працює

### Поточна конфігурація:

- **База даних**: залишається на вашому Firebase проекті (`billiard-catalog`)
- **Storage**: може бути переключено між проектами (ваш або нового власника)
- **Authentication**: використовує ваш Firebase проект
- **Два власники**: `chasov90@gmail.com` та `biillija777@gmail.com`

### Доступні дії для обох власників:

- ✅ Увійти в адмінку
- ✅ Додавати/редагувати/видаляти продукти
- ✅ Додавати/редагувати/видаляти категорії
- ✅ Завантажувати зображення
- ✅ Імпортувати продукти з Excel
- ✅ Виконувати bulk операції

## 🔧 Корисні команди

```bash
# Оновити правила безпеки (якщо додаєте нових власників)
node scripts/update-security-rules.cjs

# Розгорнути правила в Firebase
firebase deploy --only firestore:rules,storage

# Переключити storage між власниками
node scripts/switch-storage.cjs config  # Показати конфігурації
node scripts/switch-storage.cjs new     # Переключити на storage нового власника
node scripts/switch-storage.cjs old     # Переключити на ваш storage

# Управління проектом
node scripts/switch-project.cjs deploy
```

## 📝 Важливі файли

- `src/pages/Admin/AdminPage.jsx` - список дозволених email'ів
- `firestore.rules` - правила безпеки для Firestore
- `storage.rules` - правила безпеки для Storage
- `scripts/update-security-rules.cjs` - скрипт для оновлення email'ів
- `scripts/switch-storage.cjs` - скрипт для переключення storage

## 🛡️ Безпека

- Всі дії в адмінці логуються з email'ом користувача
- Правила безпеки перевіряють email на рівні Firebase
- Дані захищені на рівні Firebase Security Rules
- Тільки дозволені email'и можуть редагувати дані

## 🎯 Результат

Тепер `biillija777@gmail.com` може:

1. Увійти в адмінку за адресою `/admin`
2. Виконувати всі адміністративні функції
3. Бачити всі дані та зміни
4. Працювати з тими ж даними що й ви

## 📞 Підтримка

Якщо виникли проблеми:

1. Перевірте що email `biillija777@gmail.com` додано в `ADMIN_EMAILS`
2. Переконайтеся що правила розгорнуті: `firebase deploy --only firestore:rules,storage`
3. Очистіть кеш браузера та localStorage
4. Перевірте Firebase Console на наявність помилок

## 🔄 Додавання нових власників

Для додавання нових власників:

1. Додайте email в `src/pages/Admin/AdminPage.jsx` в масив `ADMIN_EMAILS`
2. Оновіть `scripts/update-security-rules.cjs` з новим email'ом
3. Запустіть: `node scripts/update-security-rules.cjs`
4. Розгорніть правила: `firebase deploy --only firestore:rules,storage`
