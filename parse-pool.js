import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";
import { parse } from "json2csv";

const CATEGORY = "Більярдні столи";
const SUBCATEGORY = "Американський пул";
const BASE_URL = "https://billiard-partner.com";
const PAGE_URL =
  BASE_URL + "/bilyardni-stoli/bilyardnye-stoly-dlya-amerikanskogo-pula/";

const AXIOS_HEADERS = {
  headers: {
    "User-Agent": "Mozilla/5.0",
    "Accept-Encoding": "identity",
  },
};

async function parsePool() {
  const { data } = await axios.get(PAGE_URL, AXIOS_HEADERS);
  const $ = cheerio.load(data);
  const products = [];

  // Знаходимо всі підкатегорії (моделі)
  const subcats = [];
  $(".subcategory-list a").each((i, el) => {
    const name = $(el).text().trim();
    const link = $(el).attr("href");
    if (name && link) {
      subcats.push({
        name,
        link: link.startsWith("http") ? link : BASE_URL + link,
      });
    }
  });

  for (const subcat of subcats) {
    const { data: subcatHtml } = await axios.get(subcat.link, AXIOS_HEADERS);
    const $$ = cheerio.load(subcatHtml);
    const productCards = $$(".product-layout").toArray();
    for (const el of productCards) {
      let price = "";
      $$(el)
        .find("*")
        .each((i, elem) => {
          const txt = $$(elem).text();
          if (txt.includes("грн")) {
            price = txt.replace(/[^\d]/g, "");
          }
        });
      products.push({
        Категорія: CATEGORY,
        Підкатегорія: SUBCATEGORY,
        Модель: subcat.name,
        Ціна: price,
      });
    }
    console.log(`Зібрано: ${subcat.name}`);
  }

  // Запис у CSV
  const csv = parse(products, {
    fields: ["Категорія", "Підкатегорія", "Модель", "Ціна"],
  });
  fs.writeFileSync("pool-products.csv", csv, "utf8");
  console.log("Готово! Дані збережено у pool-products.csv");
}

parsePool();
