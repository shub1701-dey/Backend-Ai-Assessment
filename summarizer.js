import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import OpenAI from "openai";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function summarizeProducts(products) {
  const summaries = [];

  for (const product of products) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Summarize this book description in 2-3 sentences:\n${product.description}`
          }
        ]
      });

      summaries.push({
        name: product.name,
        summary: response.choices[0].message.content.trim()
      });

    } catch {
      summaries.push({
        name: product.name,
        summary: product.description.slice(0, 150)
      });
    }
  }

  const dataDir = path.join(__dirname, "data");
  fs.mkdirSync(dataDir, { recursive: true });

  fs.writeFileSync(
    path.join(dataDir, "summaries.json"),
    JSON.stringify(summaries, null, 2)
  );

  return summaries;
}
