# Billiard Catalog

Веб-додаток для каталогу більярдних столів з використанням React, Vite та Firebase.

## Функціональність

- Каталог продуктів з фільтрацією та пошуком
- Адміністративна панель для управління продуктами
- Масовий імпорт продуктів з CSV/Excel файлів
- Масове редагування та видалення продуктів
- Категорії та підкатегорії продуктів
- Аутентифікація адміністраторів

## Технології

- React 19
- Vite
- Firebase (Firestore, Authentication, Storage)
- Material-UI
- React Router

## Локальна розробка

```bash
# Встановлення залежностей
npm install

# Запуск сервера розробки
npm run dev

# Збірка для продакшену
npm run build

# Перегляд збірки
npm run preview
```

## Деплой на Vercel

Проект налаштований для автоматичного деплою на Vercel:

1. Підключіть репозиторій до Vercel
2. Vercel автоматично визначить налаштування з `vercel.json`
3. Додайте змінні середовища для Firebase в налаштуваннях Vercel

### Змінні середовища для Vercel

Додайте наступні змінні в налаштуваннях проекту на Vercel:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Структура проекту

```
src/
├── components/     # React компоненти
├── pages/         # Сторінки додатку
├── context/       # React Context
├── services/      # Сервіси для роботи з API
└── firebase/      # Конфігурація Firebase
```
