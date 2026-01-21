import axios from "axios";
import * as cheerio from "cheerio";

const PRODUCT_URLS = [
  "https://kapeefit.com/product/kamour-gold/",
  "https://kapeefit.com/product/amrita-kaya-kalpa-rasayan-30-tablets/"
];

export default async function scrapeProducts() {
  const products = [];

  for (const url of PRODUCT_URLS) {
    try {
      const response = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept-Language": "en-US,en;q=0.9",
        },
        timeout: 20000,
      });

      const $ = cheerio.load(response.data);

      const title = $("h1.product_title").text().trim();
      const price = $("p.price").first().text().trim();
      const description = $(".woocommerce-product-details__short-description")
        .text()
        .replace(/\s+/g, " ")
        .trim();

      if (!title || !description) {
        throw new Error("Missing product data");
      }

      products.push({
        title,
        description,
        price,
        url,
      });

    } catch (error) {
      console.error(`⚠️ Failed to scrape ${url}: ${error.message}`);
    }
  }

  return products;
}
