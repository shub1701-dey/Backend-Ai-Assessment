import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function summarizeProducts(products) {
  if (!Array.isArray(products) || products.length === 0) {
    throw new Error("Products is not iterable or empty");
  }

  const summaries = [];

  for (const product of products) {
    try {
      if (!product.description) {
        console.warn(` Missing description for ${product.title}`);
        continue;
      }

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You summarize product descriptions in clear, concise 2-line summaries.",
          },
          {
            role: "user",
            content: `Product Name: ${product.title}\nDescription: ${product.description}`,
          },
        ],
      });

      summaries.push({
        title: product.title,
        summary: response.choices[0].message.content.trim(),
      });
    } catch (err) {
      console.warn(
        `Summary failed for ${product.title}:`,
        err.message
      );
    }
  }

  return summaries;
}
