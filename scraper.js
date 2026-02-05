import axios from "axios";
import * as cheerio from "cheerio";

export default async function scrapeProducts(baseUrl) {
  try {
    // 1. Load homepage
    const homeRes = await axios.get(baseUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120",
      },
      timeout: 20000,
    });

    const $ = cheerio.load(homeRes.data);

    // 2. Find first product-category link
    let categoryLink = null;

    $("a").each((_, el) => {
      const href = $(el).attr("href");
      if (
        href &&
        href.includes("/product-category/") &&
        !categoryLink
      ) {
        categoryLink = href.startsWith("http")
          ? href
          : `${baseUrl}${href}`;
      }
    });

    if (!categoryLink) {
      throw new Error("No product category found");
    }

    // 3. Load category page
    const catRes = await axios.get(categoryLink, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120",
      },
      timeout: 20000,
    });

    const $$ = cheerio.load(catRes.data);

    // 4. Extract product links
    const productLinks = [];

    $$("a").each((_, el) => {
      const href = $$(el).attr("href");
      if (href && href.includes("/product/")) {
        const fullUrl = href.startsWith("http")
          ? href
          : `${baseUrl}${href}`;
        productLinks.push(fullUrl);
      }
    });

    const uniqueLinks = [...new Set(productLinks)];

    if (uniqueLinks.length < 5) {
      throw new Error("Less than 5 product links found");
    }

    // 5. Pick 5 random products
    const selectedLinks = uniqueLinks
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);

    const products = [];

    // 6. Scrape each product page
    for (const url of selectedLinks) {
      try {
        const res = await axios.get(url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120",
          },
          timeout: 20000,
        });

        const $$$ = cheerio.load(res.data);

        const title = $$$("h1.product_title").text().trim();
        const price = $$$("p.price").first().text().trim();
        const description = $$$(
          ".woocommerce-product-details__short-description"
        )
          .text()
          .replace(/\s+/g, " ")
          .trim();

        if (!title || !description) continue;

        products.push({
          title,
          price,
          description,
          url,
        });
      } catch {
        continue;
      }
    }

    if (products.length < 5) {
      throw new Error("Less than 5 valid products scraped");
    }

    return products;
  } catch (err) {
    console.error("❌ Scraping failed:", err.message);
    return [];
  }
}
