import dotenv from "dotenv";
import { scrapeProducts } from "./scraper.js";
import { summarizeProducts } from "./summarizer.js";
import { generateAudio } from "./tts.js";

dotenv.config();

async function runPipeline() {
  console.log("Starting backend AI pipeline...");

  const products = await scrapeProducts();
  console.log("Products scraped.");

  const summaries = await summarizeProducts(products);
  console.log("Summaries generated.");

  await generateAudio(summaries);
  console.log("Audio generation complete.");
}

runPipeline().catch(console.error);
