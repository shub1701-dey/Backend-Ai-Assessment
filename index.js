import dotenv from "dotenv";
dotenv.config();

import scrapeProducts from "./scraper.js";
import summarizeProducts from "./summarizer.js";
import generateAudio from "./tts.js";
import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

async function runPipeline() {
  try {
    console.log("Starting backend AI pipeline...");

    const products = await scrapeProducts();
    if (!products.length) throw new Error("No products scraped");

    fs.writeFileSync(
      path.join(dataDir, "products.json"),
      JSON.stringify(products, null, 2)
    );

    const summaries = await summarizeProducts(products);

    fs.writeFileSync(
      path.join(dataDir, "summaries.json"),
      JSON.stringify(summaries, null, 2)
    );

    await generateAudio(summaries);

    console.log("✅ Pipeline completed successfully");

  } catch (err) {
    console.error("❌ Pipeline failed:", err.message);
  }
}

runPipeline();
