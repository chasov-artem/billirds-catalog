import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Firebase конфігурація
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Ініціалізація Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Базовий URL сайту
const baseUrl = "https://www.billiard-servis.com";

// Статичні сторінки
const staticPages = ["", "/catalog", "/favorites", "/about"];

// Функція для отримання всіх товарів з Firebase
async function getAllProducts() {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Помилка отримання товарів:", error);
    return [];
  }
}

// Функція для генерації sitemap
async function generateSitemap() {
  console.log("Починаємо генерацію sitemap...");

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Додаємо статичні сторінки
  staticPages.forEach((page) => {
    const url = `${baseUrl}${page}`;
    const priority = page === "" ? "1.0" : "0.8";
    const changefreq = page === "" ? "daily" : "weekly";

    sitemap += `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>
`;
  });

  // Додаємо сторінки товарів з Firebase
  let products = [];
  try {
    console.log("Отримуємо товари з Firebase...");
    products = await getAllProducts();

    console.log(`Знайдено ${products.length} товарів`);

    products.forEach((product) => {
      const productUrl = `${baseUrl}/product/${product.id}`;
      const lastmod = product.updatedAt
        ? new Date(product.updatedAt.toDate()).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];

      sitemap += `  <url>
    <loc>${productUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`;
    });
  } catch (error) {
    console.error("Помилка при додаванні товарів до sitemap:", error);
  }

  sitemap += "</urlset>";

  // Зберігаємо sitemap
  const sitemapPath = path.join(__dirname, "../public/sitemap.xml");
  fs.writeFileSync(sitemapPath, sitemap);

  console.log("Sitemap.xml успішно згенеровано!");
  console.log(`Всього URL: ${staticPages.length + products.length}`);
}

// Запускаємо генерацію
generateSitemap().catch(console.error);
