Backend AI Assessment – Product Scraping, Summarization & TTS

This project demonstrates a backend pipeline that scrapes product data from a live website, summarizes product descriptions using AI, and converts those summaries into audio using Google Text-to-Speech (gTTS).

The focus of this assignment is backend architecture, data flow, error handling, and third-party API integration, not frontend UI.


📌 Features

Scrapes live product data (title, description, price) from a real production website

Stores raw scraped data in JSON format

Generates concise 1–2 sentence summaries for each product using OpenAI

Converts summaries into audio files using gTTS (no paid API required)

Graceful error handling for scraping and AI failures

Clean, modular backend architecture


🛠️ Tech Stack

Node.js (ES Modules)

Axios – HTTP requests

Cheerio – HTML parsing and DOM traversal

OpenAI API – AI-based text summarization

gTTS (Google Text-to-Speech) – Audio generation

dotenv – Environment variable management

fs (File System) – Local data persistence


🌐 Website Scraped

The project scrapes product data from Kapeefit
, a live e-commerce website.

The script targets two real product pages and extracts:

Product Title

Description (from product detail pages)

Price

Using a live production website demonstrates the ability to handle real-world HTML structures, dynamic content, and network reliability issues.


📁 Project Structure
Backend-Ai-Assessment/
│
├── index.js           # Main controller: Scraping → Storage → Summarization → TTS
│
├── scraper.js         # Scrapes 2 products from Kapeefit product pages
│
├── summarizer.js      # Uses OpenAI (gpt-4o-mini) to generate short summaries
│
├── tts.js             # Converts summaries into audio using gTTS
│
├── data/
│   ├── products.json  # Stored raw scraped product data
│   └── summaries.json # AI-generated product summaries
│
├── audio/             # Generated audio output (.mp3 files)
│
├── .env               # API keys (OPENAI_API_KEY)
├── .gitignore         # Ignores node_modules, .env, audio
├── package.json       # Project metadata and dependencies
└── README.md          # Project documentation


▶️ How to Run the Project
Step 1: Install Node.js

Download and install Node.js (LTS) from:
https://nodejs.org

Verify installation:

node -v
npm -v

Step 2: Open Project Folder
cd path/to/Backend-Ai-Assessment

Step 3: Install Dependencies
npm install

Step 4: Configure Environment Variables

Create a .env file in the root directory and add:

OPENAI_API_KEY=your_openai_api_key


(gTTS does not require any API key)

Step 5: Run the Pipeline
node index.js

📤 Output

data/products.json → Raw scraped product data

data/summaries.json → AI-generated summaries

audio/summary_1.mp3, audio/summary_2.mp3 → Audio summaries generated using gTTS

🧠 Design Choices

Live Web Scraping
Kapeefit was chosen to demonstrate scraping from a real production e-commerce website rather than a static demo site.

Modular Architecture
Each responsibility (scraping, summarization, text-to-speech) is separated into its own module, keeping the codebase clean and maintainable.

Intermediate Persistence
Data is saved to JSON at each stage, ensuring partial results are preserved even if later steps fail.

AI Prompt Control
The OpenAI prompt enforces short, clean summaries suitable for audio narration.

Free & Reliable TTS
gTTS was selected to avoid paid plans and API restrictions while still producing clear audio output.
