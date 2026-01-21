// tts.js
import fs from "fs";
import path from "path";
import axios from "axios";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use a FREE voice (Rachel – works on free tier)
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

async function generateAudio(summaries) {
  if (!ELEVENLABS_API_KEY) {
    console.warn("⚠️ ELEVENLABS_API_KEY missing. Skipping audio generation.");
    return;
  }

  const audioDir = path.join(__dirname, "audio");
  fs.mkdirSync(audioDir, { recursive: true });

  for (let i = 0; i < summaries.length; i++) {
    const text = `${summaries[i].title}. ${summaries[i].summary}`;

    try {
      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
        {
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        },
        {
          headers: {
            "xi-api-key": ELEVENLABS_API_KEY,
            "Content-Type": "application/json",
            Accept: "audio/mpeg"
          },
          responseType: "arraybuffer"
        }
      );

      const outputPath = path.join(audioDir, `summary_${i + 1}.mp3`);
      fs.writeFileSync(outputPath, response.data);
    } catch (error) {
      console.warn(
        `⚠️ ElevenLabs failed for item ${i + 1}:`,
        error.response?.status || error.message
      );
    }
  }
}

export default generateAudio;
