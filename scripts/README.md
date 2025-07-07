# 📋 Скрипти для управління проектом

## update-storage-config.js

Скрипт для оновлення конфігурації Firebase Storage після налаштування новим власником.

### Використання

```bash
# Оновити конфігурацію Firebase та правила Storage
node scripts/update-storage-config.js <storage-bucket-url>

# Приклад
node scripts/update-storage-config.js billiard-catalog-abc123.firebasestorage.app
```

### Опції

- `--rules-only` - оновити тільки правила Storage
- `--config-only` - оновити тільки конфігурацію Firebase

### Приклади

```bash
# Оновити все
node scripts/update-storage-config.js billiard-catalog-abc123.firebasestorage.app

# Оновити тільки правила
node scripts/update-storage-config.js billiard-catalog-abc123.firebasestorage.app --rules-only

# Оновити тільки конфігурацію
node scripts/update-storage-config.js billiard-catalog-abc123.firebasestorage.app --config-only
```

### Що робить скрипт

1. **Оновлює конфігурацію Firebase** (`src/firebase/config.js`)

   - Змінює `storageBucket` на новий URL
   - Зберігає підтримку змінних середовища

2. **Оновлює правила Storage** (`storage.rules`)
   - Встановлює правила для читання всіх файлів
   - Дозволяє запис тільки авторизованим адміністраторам

### Авторизовані адміністратори

- chasov90@gmail.com (основний власник)
- biillija777@gmail.com (новий власник)

### Після виконання скрипта

1. Перевірте зміни в файлах
2. Запустіть проект локально для тестування
3. Перевірте завантаження зображень в адмінці
4. Розгорніть оновлення на продакшн

---

## switch-project.cjs

Скрипт для переключення між різними Firebase проектами.

### Використання

```bash
node scripts/switch-project.cjs <project-id>
```

---

## switch-storage.cjs

Скрипт для переключення між різними Storage buckets.

### Використання

```bash
node scripts/switch-storage.cjs <storage-bucket-url>
```

---

## update-security-rules.cjs

Скрипт для оновлення правил безпеки Firestore та Storage.

### Використання

```bash
node scripts/update-security-rules.cjs
```
