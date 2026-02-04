import axios from "axios";
import * as cheerio from "cheerio";

const PRODUCT_URLS = [
  "https://kapeefit.com/product/kamour-gold/",
  "https://kapeefit.com/product/amrita-kaya-kalpa-rasayan-30-tablets/",
];

export default async function scrapeProducts() {
  const products = [];

  for (const url of PRODUCT_URLS) {
    try {
      const { data } = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120",
          Accept: "text/html",
        },
        timeout: 20000,
      });

      const $ = cheerio.load(data);

      const title = $("h1.product_title").first().text().trim();

      const price =
        $("p.price").first().text().trim() ||
        $("span.woocommerce-Price-amount").first().text().trim();

      // FULL DESCRIPTION (not short snippet)
      const description = $("#tab-description")
        .text()
        .replace(/\s+/g, " ")
        .trim();

      if (!title || !description) {
        throw new Error("Missing title or description");
      }

      products.push({
        title,
        price,
        description,
        url,
      });

      console.log(`✅ Scraped: ${title}`);
    } catch (err) {
      console.warn(`⚠️ Failed to scrape ${url}: ${err.message}`);
    }
  }

  return products;
}
