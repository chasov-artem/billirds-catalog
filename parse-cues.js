import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";
import { parse } from "json2csv";

const CATEGORY = "Більярдні киї";
const SUBCATS = [
  {
    name: "Киї для піраміди",
    url: "https://billiard-partner.com/bilyardnyie-kii/kiyi-dlya-piramidi/",
  },
  {
    name: "Киї для американського пулу",
    url: "https://billiard-partner.com/bilyardnyie-kii/kii-dlya-pula/",
  },
  {
    name: "Киї для снукеру",
    url: "https://billiard-partner.com/bilyardnyie-kii/kupit-kii-dlya-snukera/",
  },
  {
    name: "Ексклюзивні киї",
    url: "https://billiard-partner.com/bilyardnyie-kii/kupit-eksklyuzivnye-kii/",
  },
  {
    name: "Киї для дітей",
    url: "https://billiard-partner.com/bilyardnyie-kii/kupit-kii-dlya-detey/",
  },
];

const AXIOS_HEADERS = {
  headers: {
    "User-Agent": "Mozilla/5.0",
    "Accept-Encoding": "identity",
  },
};

async function translateRuToUk(text) {
  if (!text || !text.trim()) return "";
  try {
    const res = await axios.post(
      "https://translate.argosopentech.com/translate",
      {
        q: text,
        source: "ru",
        target: "uk",
        format: "text",
      },
      { headers: { accept: "application/json" } }
    );
    console.log("LibreTranslate response:", res.data);
    return res.data.translatedText;
  } catch (err) {
    console.log(
      "LibreTranslate error:",
      err?.response?.data || err?.message || err
    );
    return text;
  }
}

function decodeHtmlEntities(str) {
  // Використовуємо cheerio для декодування
  return cheerio
    .load("<div>" + str + "</div>")("div")
    .text();
}

async function parseCues() {
  const products = [];
  for (const subcat of SUBCATS) {
    const { data } = await axios.get(subcat.url, AXIOS_HEADERS);
    const $ = cheerio.load(data);
    // Збираємо всі посилання на товари
    const links = [];
    $(".product-thumb a[href]").each((i, el) => {
      const href = $(el).attr("href");
      if (href && href.includes(".html")) links.push(href);
    });
    const uniqueLinks = [...new Set(links)];
    console.log(`Посилання (${subcat.name}):`, uniqueLinks);
    for (const link of uniqueLinks) {
      try {
        const { data: prodHtml } = await axios.get(link, AXIOS_HEADERS);
        const $$ = cheerio.load(prodHtml);
        // Назва з h1 + декодування
        let nameRu = $$("h1").first().text().trim();
        nameRu = decodeHtmlEntities(nameRu);
        console.log(`Назва RU для ${link}:`, nameRu);
        // Ціна: .newpricespan, якщо немає — .price, якщо немає — перший текст з 'грн'
        let price = "";
        price = $$(".newpricespan").first().text().replace(/[^\d]/g, "");
        if (!price) price = $$(".price").first().text().replace(/[^\d]/g, "");
        if (!price) {
          const priceMatch = prodHtml.match(/([\d\s]+)грн/);
          if (priceMatch) price = priceMatch[1].replace(/\s/g, "").trim();
        }
        if (nameRu && price) {
          const nameUk = await translateRuToUk(nameRu);
          console.log(`Переклад для "${nameRu}":`, nameUk);
          products.push({
            Категорія: CATEGORY,
            Підкатегорія: subcat.name,
            Назва: nameUk,
            Ціна: price,
          });
          console.log(`Додано: ${nameUk} (${subcat.name}) - ${price} грн`);
        }
      } catch {
        console.log(`Помилка для ${link}`);
      }
    }
    console.log(`Зібрано: ${subcat.name}`);
  }

  // Запис у CSV
  const csv = parse(products, {
    fields: ["Категорія", "Підкатегорія", "Назва", "Ціна"],
  });
  fs.writeFileSync("cues-products.csv", csv, "utf8");
  console.log("Готово! Дані збережено у cues-products.csv");
}

parseCues();
