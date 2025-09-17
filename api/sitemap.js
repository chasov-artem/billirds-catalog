import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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
const staticPages = [
  { path: "", priority: "1.0", changefreq: "daily" },
  { path: "/catalog", priority: "0.8", changefreq: "weekly" },
  { path: "/favorites", priority: "0.8", changefreq: "weekly" },
  { path: "/about", priority: "0.8", changefreq: "weekly" },
];

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

// Функція для генерації sitemap XML
function generateSitemapXML(urls) {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  urls.forEach((url) => {
    sitemap += `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>
`;
  });

  sitemap += "</urlset>";
  return sitemap;
}

export default async function handler(req, res) {
  try {
    // Встановлюємо заголовки для XML
    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "public, max-age=3600"); // Кешуємо на 1 годину

    const urls = [];

    // Додаємо статичні сторінки
    staticPages.forEach((page) => {
      urls.push({
        loc: `${baseUrl}${page.path}`,
        lastmod: new Date().toISOString().split("T")[0],
        changefreq: page.changefreq,
        priority: page.priority,
      });
    });

    // Додаємо сторінки товарів з Firebase
    try {
      const products = await getAllProducts();
      console.log(`Знайдено ${products.length} товарів`);

      products.forEach((product) => {
        const productUrl = `${baseUrl}/product/${product.id}`;
        const lastmod = product.updatedAt
          ? new Date(product.updatedAt.toDate()).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0];

        urls.push({
          loc: productUrl,
          lastmod: lastmod,
          changefreq: "weekly",
          priority: "0.6",
        });
      });
    } catch (error) {
      console.error("Помилка при додаванні товарів до sitemap:", error);
    }

    // Генеруємо XML
    const sitemapXML = generateSitemapXML(urls);

    // Відправляємо відповідь
    res.status(200).send(sitemapXML);
  } catch (error) {
    console.error("Помилка генерації sitemap:", error);
    res.status(500).json({ error: "Помилка генерації sitemap" });
  }
}
