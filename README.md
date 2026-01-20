# Backend AI Assessment – Product Scraping, Summarization & TTS

This project demonstrates a backend pipeline that scrapes product data from a live website, summarizes product descriptions using AI logic, and converts those summaries into audio using a Text-to-Speech (TTS) service.

The focus of this assignment is **backend architecture, data flow, and integration of external services**, not frontend UI.

---

## 📌 Features

- Scrapes live product data (name, description) from a real-world web source
- Stores raw scraped data in JSON format
- Generates concise 1-2 sentence summaries for each product using OpenAI
- Converts summaries into individual audio files using ElevenLabs TTS
- Gracefully handles API key usage and errors

---

## 🛠️ Tech Stack

- **Node.js** (ES Modules)
- **Cheerio** or **Axios** – Live web scraping and HTML parsing
- **OpenAI API** – LLM-based summarization
- **ElevenLabs API** – Text-to-Speech integration
- **dotenv** – Environment variable management
- **File System (fs)** – Local data persistence

---

## 🌐 Website Scraped

The project scrapes product data from **[Books to Scrape](http://books.toscrape.com)**, a live demo site for web scraping.

The script targets:
- **Product Name** (Book Title)
- **Description** (Extracted from the product detail pages)

Using a live site demonstrates the ability to handle real-world HTML structures, navigate DOM elements, and manage asynchronous network requests.

---

## Project Structure

```text
backend-ai-assessment/
│
├── index.js           # Main controller: Runs Scraping → Storage → Summarization → TTS
│
├── scraper.js         # Scrapes data from books.toscrape.com
│                      # Extracts exactly 5 products/books
│
├── summarizer.js      # Uses OpenAI to generate short AI summaries
│                      # Saves summaries to JSON
│
├── tts.js             # Integrates with ElevenLabs API
│                      # Generates 5 distinct .mp3 files
│
├── data/
│   ├── products.json  # Stored raw scraped book data
│   └── summaries.json # AI-generated book summaries
│
├── audio/             # Generated audio output (.mp3 files)
│
├── .env               # API Keys (OPENAI_API_KEY, ELEVENLABS_API_KEY)
├── .gitignore         # Prevents committing node_modules, .env and  audio
├── package.json       # Project metadata and dependencies
└── README.md          # Project documentation

HOW TO RUN THE SCRIPT (STEP BY STEP)

STEP 1: INSTALL NODE.JS
Download Node.js (LTS version) from: https://nodejs.org

Verify installation in your terminal:

node -v
npm -v

STEP 2: OPEN PROJECT FOLDER
Open your terminal or command prompt.

Navigate to the project directory:
cd path/to/backend-ai-assessment

STEP 3: INSTALL PROJECT DEPENDENCIES
Run the following command once to install all required libraries:

Bash

npm install


STEP 4: CONFIGURE API KEYS (.env)
Create a file named .env in the root folder.

Paste your keys inside:

OPENAI_API_KEY=your_actual_openai_key
ELEVENLABS_API_KEY=your_actual_elevenlabs_key


STEP 5: CREATE REQUIRED DIRECTORIES
Ensure the following folders exist (create them manually if they don't):

data/
audio/


STEP 6: RUN THE AUTOMATED PIPELINE
Execute the main script:

node index.js



## Design Choices (Brief Explanation)


Live Scraping Implementation: I transitioned from a static file to Books to Scrape to demonstrate real-world scraping capabilities, including navigating DOM hierarchies and handling live network latency.

Modular Architecture:
By separating logic into scraper.js, summarizer.js, and tts.js, the code remains clean. index.js acts as the orchestrator to ensure a "single command" execution flow.

Intermediate Persistence: 
Data is saved to JSON at each stage. This allows for easier debugging and ensures that if the TTS step fails, the scraped data and AI summaries are still preserved.

Prompt Engineering: 
The OpenAI prompt is strictly defined to return only 1-2 sentences of plain text, ensuring the ElevenLabs audio output is high-quality and free of markdown/HTML artifacts.

Reliability: 
The script includes sequential processing for API calls to remain within standard rate limits and handle "responsible usage" of the provided assessment keys.