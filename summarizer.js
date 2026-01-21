import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function summarizeProducts(products) {
  if (!Array.isArray(products)) {
    throw new Error("Products is not iterable");
  }

  const summaries = [];

  for (const product of products) {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Give a short 2-line summary of this product:\n${product.description}`,
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
