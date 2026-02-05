import fs from "fs";
import path from "path";
import gTTS from "gtts";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function generateAudio(summaries) {
  const audioDir = path.join(__dirname, "audio");
  fs.mkdirSync(audioDir, { recursive: true });

  for (let i = 0; i < summaries.length; i++) {
    const text = `${summaries[i].title}. ${summaries[i].summary}`;
    const filePath = path.join(audioDir, `summary_${i + 1}.mp3`);

    const tts = new gTTS(text, "en");

    await new Promise((resolve, reject) => {
      tts.save(filePath, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}
