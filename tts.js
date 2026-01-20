import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { ElevenLabsClient } from "elevenlabs";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY
});

export async function generateAudio(summaries) {
  if (!process.env.ELEVENLABS_API_KEY) {
    console.warn("ElevenLabs key missing. Skipping audio.");
    return;
  }

  const audioDir = path.join(__dirname, "audio");
  fs.mkdirSync(audioDir, { recursive: true });

  for (let i = 0; i < summaries.length; i++) {
    try {
      const audio = await elevenlabs.textToSpeech.convert(
        "Rachel",
        { text: summaries[i].summary }
      );

      const filePath = path.join(audioDir, `summary_${i + 1}.mp3`);
      const stream = fs.createWriteStream(filePath);
      audio.pipe(stream);

    } catch {
      console.warn(`Audio failed for item ${i + 1}`);
    }
  }
}
