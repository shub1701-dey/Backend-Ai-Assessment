// tts.js
import fs from "fs";
import path from "path";
import gTTS from "gtts";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateAudio(summaries) {
  if (!Array.isArray(summaries) || summaries.length === 0) {
    console.warn("No summaries provided. Skipping audio generation.");
    return;
  }

  const audioDir = path.join(__dirname, "audio");
  fs.mkdirSync(audioDir, { recursive: true });

  // Generate audio 
  const items = summaries.slice(0, 2);

  for (let i = 0; i < items.length; i++) {
    const { title, summary } = items[i];
    const text = `${title}. ${summary}`;

    try {
      const gtts = new gTTS(text, "en");
      const outputPath = path.join(audioDir, `summary_${i + 1}.mp3`);

      await new Promise((resolve, reject) => {
        gtts.save(outputPath, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      console.log(`🔊 Audio generated: summary_${i + 1}.mp3`);
    } catch (error) {
      console.warn(` Audio generation failed for item ${i + 1}:`, error.message);
    }
  }
}

export default generateAudio;
