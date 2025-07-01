import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";
import { parse } from "json2csv";

const CATEGORY = "Тенісні столи";
const SUBCATEGORY = "Тенісні столи для приміщень";
const BASE_URL = "https://billiard-partner.com";
const PAGE_URL = BASE_URL + "/nastilniy-tenis/stoly-dlya-pomeshcheniy/";

const AXIOS_HEADERS = {
  headers: {
    "User-Agent": "Mozilla/5.0",
    "Accept-Encoding": "identity",
  },
};

async function parseTennis() {
  const { data } = await axios.get(PAGE_URL, AXIOS_HEADERS);
  const $ = cheerio.load(data);
  const products = [];

  // Знаходимо всі товари на сторінці - спробуємо різні селектори
  let productCards = $(
    ".product-layout, .product-thumb, .product-item"
  ).toArray();

  // Якщо не знайшли, спробуємо знайти по структурі з назвами та цінами
  if (productCards.length === 0) {
    productCards = $("div")
      .filter((i, el) => {
        const $el = $(el);
        const hasName = $el.find("h4, h3, .product-title, .caption").length > 0;
        const hasPrice = $el.text().includes("грн");
        return hasName && hasPrice;
      })
      .toArray();
  }

  console.log(`Знайдено ${productCards.length} потенційних товарів`);

  for (const el of productCards) {
    const $el = $(el);

    // Отримуємо назву товару - спробуємо різні селектори
    let name = "";
    const nameSelectors = [
      ".caption h4 a",
      ".caption h4",
      ".product-title",
      "h4 a",
      "h4",
      "h3 a",
      "h3",
      ".caption",
      "a[href*='product']",
    ];

    for (const selector of nameSelectors) {
      const nameElement = $el.find(selector);
      if (nameElement.length > 0) {
        name = nameElement.first().text().trim();
        if (name) break;
      }
    }

    // Отримуємо ціну
    let price = "";
    $el.find("*").each((i, elem) => {
      const txt = $(elem).text();
      if (txt.includes("грн")) {
        const priceMatch = txt.match(/(\d+)\s*грн/);
        if (priceMatch) {
          price = priceMatch[1];
        }
      }
    });

    if (name && price) {
      products.push({
        Категорія: CATEGORY,
        Підкатегорія: SUBCATEGORY,
        Назва: name,
        Ціна: price,
      });
      console.log(`Додано: ${name} - ${price} грн`);
    }
  }

  console.log(`Знайдено ${products.length} товарів`);

  // Запис у CSV
  const csv = parse(products, {
    fields: ["Категорія", "Підкатегорія", "Назва", "Ціна"],
  });
  fs.writeFileSync("tennis-products.csv", csv, "utf8");
  console.log("Готово! Дані збережено у tennis-products.csv");
}

parseTennis();
