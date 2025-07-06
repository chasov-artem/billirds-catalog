# Налаштування Storage нового власника

## 🎯 Що потрібно зробити

### 1. Створити Firebase проект для нового власника

1. Перейдіть на [Firebase Console](https://console.firebase.google.com/)
2. Створіть новий проект (наприклад: "billiard-catalog-storage")
3. Налаштуйте Storage в новому проекті
4. Отримайте storage bucket URL

### 2. Отримати Storage Bucket URL

1. В Firebase Console нового проекту перейдіть в Storage
2. Скопіюйте storage bucket URL (наприклад: `your-project.firebasestorage.app`)

### 3. Оновити конфігурацію

В `scripts/switch-storage.cjs` замініть:

```javascript
new: {
  storageBucket: "your-new-project.firebasestorage.app", // Замініть на реальний
  description: "Storage нового власника (biillija777@gmail.com)",
},
```

На реальний URL:

```javascript
new: {
  storageBucket: "your-actual-project.firebasestorage.app", // Реальний URL
  description: "Storage нового власника (biillija777@gmail.com)",
},
```

### 4. Переключити storage

```bash
# Переключити на storage нового власника
node scripts/switch-storage.cjs new

# Переключити назад на ваш storage
node scripts/switch-storage.cjs old

# Показати поточні конфігурації
node scripts/switch-storage.cjs config
```

### 5. Оновити змінні середовища в Vercel

В Vercel Dashboard > Settings > Environment Variables додайте:

- `VITE_FIREBASE_STORAGE_BUCKET` = URL storage bucket нового власника

## 🚀 Як це працює

### Поточна конфігурація:

- **База даних**: ваш Firebase проект (`billiard-catalog`)
- **Authentication**: ваш Firebase проект
- **Storage**: може бути переключено між проектами
- **Два власники**: `chasov90@gmail.com` та `biillija777@gmail.com`

### Після переключення:

- **База даних**: залишається на вашому проекті
- **Storage**: використовує storage нового власника
- **Всі зображення**: будуть зберігатися в storage нового власника

## 🔧 Корисні команди

```bash
# Показати поточні конфігурації storage
node scripts/switch-storage.cjs config

# Переключити на storage нового власника
node scripts/switch-storage.cjs new

# Переключити назад на ваш storage
node scripts/switch-storage.cjs old

# Розгорнути правила безпеки
firebase deploy --only firestore:rules,storage
```

## 📝 Важливі файли

- `src/firebase/config.js` - конфігурація Firebase (storageBucket)
- `scripts/switch-storage.cjs` - скрипт для переключення storage
- `storage.rules` - правила безпеки для Storage

## 🛡️ Безпека

### Правила Storage для нового власника:

```javascript
rules_version = '2';
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
}
```

## 📞 Налаштування Storage нового власника

### 1. Створення проекту

1. Перейдіть на [Firebase Console](https://console.firebase.google.com/)
2. Натисніть "Create a project"
3. Введіть назву проекту (наприклад: "billiard-catalog-storage")
4. Виберіть налаштування Google Analytics (за бажанням)
5. Натисніть "Create project"

### 2. Налаштування Storage

1. В лівому меню виберіть "Storage"
2. Натисніть "Get started"
3. Виберіть регіон (той самий що і для основного проекту)
4. Натисніть "Done"

### 3. Отримання Storage Bucket URL

1. В Storage секції скопіюйте bucket URL
2. Він виглядає як: `your-project.firebasestorage.app`

### 4. Налаштування правил

1. Перейдіть в Storage > Rules
2. Оновіть правила як показано вище
3. Натисніть "Publish"

## 🎯 Результат

Після налаштування:

- Всі нові зображення будуть зберігатися в storage нового власника
- База даних залишається на вашому проекті
- Обидва власники можуть завантажувати файли
- Всі дії логуються з email'ом користувача

## 📞 Підтримка

Якщо виникли проблеми:

1. Перевірте що storage bucket URL правильний
2. Переконайтеся що правила Storage налаштовані правильно
3. Очистіть кеш браузера
4. Перевірте Firebase Console на наявність помилок
