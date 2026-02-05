import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function summarizeProducts(products) {
  if (!Array.isArray(products) || products.length < 5) {
    throw new Error("At least 5 products are required for summarization");
  }

  const summaries = [];

  for (const product of products.slice(0, 5)) {
    if (!product.description || !product.title) continue;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You create short, clear, professional 2-line summaries of product descriptions.",
        },
        {
          role: "user",
          content: `Product: ${product.title}\nDescription: ${product.description}`,
        },
      ],
    });

    summaries.push({
      title: product.title,
      summary: response.choices[0].message.content.trim(),
    });
  }

  return summaries;
}
