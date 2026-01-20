import axios from "axios";
import * as cheerio from "cheerio";

const BASE_URL = "https://books.toscrape.com/";

export async function scrapeProducts() {
  const { data } = await axios.get(BASE_URL);
  const $ = cheerio.load(data);

  const productLinks = [];

  $(".product_pod h3 a").each((i, el) => {
    if (i < 5) {
      const href = $(el).attr("href");

     
      const fullUrl = new URL(href, BASE_URL).href;
      productLinks.push(fullUrl);
    }
  });

  const products = [];

  for (const link of productLinks) {
    const { data: productPage } = await axios.get(link);
    const $product = cheerio.load(productPage);

    const title = $product(".product_main h1").text().trim();

    // FULL paragraph description
    const description = $product("#product_description")
      .next("p")
      .text()
      .trim();

    products.push({
      title,
      description: description || "No description available"
    });
  }

  return products;
}
