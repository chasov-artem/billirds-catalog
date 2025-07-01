import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";
import { parse } from "json2csv";

const CATEGORY = "Більярдні шари";
const SUBCATS = [
  {
    name: "Для піраміди",
    url: "https://billiard-partner.com/bilyardni-kuli/kuli-dlya-rosiyskoyi-piramidi/",
  },
  {
    name: "Для американського пулу",
    url: "http://billiard-partner.com/bilyardni-kuli/kuli-dlya-amerikanskogo-pulu/",
  },
  {
    name: "Для снукеру",
    url: "https://billiard-partner.com/bilyardni-kuli/kuli-dlya-snukera/",
  },
];

const AXIOS_HEADERS = {
  headers: {
    "User-Agent": "Mozilla/5.0",
    "Accept-Encoding": "identity",
  },
};

function decodeHtmlEntities(str) {
  return cheerio
    .load("<div>" + str + "</div>")("div")
    .text();
}

async function parseBalls() {
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
        let name = $$("h1").first().text().trim();
        name = decodeHtmlEntities(name);
        console.log(`Назва для ${link}:`, name);
        // Ціна: .newpricespan, якщо немає — .price, якщо немає — перший текст з 'грн'
        let price = "";
        price = $$(".newpricespan").first().text().replace(/[^\d]/g, "");
        if (!price) price = $$(".price").first().text().replace(/[^\d]/g, "");
        if (!price) {
          const priceMatch = prodHtml.match(/([\d\s]+)грн/);
          if (priceMatch) price = priceMatch[1].replace(/\s/g, "").trim();
        }
        if (name && price) {
          products.push({
            Категорія: CATEGORY,
            Підкатегорія: subcat.name,
            Назва: name,
            Ціна: price,
          });
          console.log(`Додано: ${name} (${subcat.name}) - ${price} грн`);
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
  fs.writeFileSync("balls-products.csv", csv, "utf8");
  console.log("Готово! Дані збережено у balls-products.csv");
}

parseBalls();
