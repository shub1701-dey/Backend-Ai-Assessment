// index.js
import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";

import scrapeProducts from "./scraper.js";
import summarizeProducts from "./summarizer.js";
import generateAudio from "./tts.js";

// Ensure data directory exists
const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

async function runPipeline() {
  try {
    console.log("Starting backend AI pipeline...");

    // Step 1: Scrape products
    const products = await scrapeProducts();
    if (!Array.isArray(products) || products.length === 0) {
      throw new Error("No products scraped");
    }

    fs.writeFileSync(
      path.join(dataDir, "products.json"),
      JSON.stringify(products, null, 2)
    );
    console.log("Products saved.");

    // Step 2: Generate summaries
    const summaries = await summarizeProducts(products);
    if (!Array.isArray(summaries) || summaries.length === 0) {
      throw new Error("No summaries generated");
    }

    fs.writeFileSync(
      path.join(dataDir, "summaries.json"),
      JSON.stringify(summaries, null, 2)
    );
    console.log("Summaries generated.");

    // Step 3: Generate audio (gTTS)
    await generateAudio(summaries);

    console.log("✅ Pipeline completed successfully");
  } catch (err) {
    console.error("❌ Pipeline failed:", err.message);
  }
}

runPipeline();
