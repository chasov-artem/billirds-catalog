import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Базовий URL сайту
const baseUrl = 'https://billiard-servis.com';

// Статичні сторінки
const staticPages = [
  '',
  '/catalog',
  '/favorites'
];

// Функція для генерації sitemap
function generateSitemap() {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Додаємо статичні сторінки
  staticPages.forEach(page => {
    const url = `${baseUrl}${page}`;
    const priority = page === '' ? '1.0' : '0.8';
    const changefreq = page === '' ? 'daily' : 'weekly';
    
    sitemap += `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>
`;
  });

  // Додаємо сторінки товарів (якщо є дані)
  try {
    const productsPath = path.join(__dirname, '../src/data/products.json');
    if (fs.existsSync(productsPath)) {
      const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
      
      products.forEach(product => {
        const productUrl = `${baseUrl}/product/${product.id}`;
        sitemap += `  <url>
    <loc>${productUrl}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`;
      });
    }
  } catch (error) {
    console.log('Не вдалося завантажити дані товарів для sitemap');
  }

  sitemap += '</urlset>';

  // Зберігаємо sitemap
  const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap);
  
  console.log('Sitemap.xml успішно згенеровано!');
  console.log(`Збережено в: ${sitemapPath}`);
}

// Запускаємо генерацію
generateSitemap();
