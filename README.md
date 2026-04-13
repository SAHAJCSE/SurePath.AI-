

# SurePath AI

### Enterprise-Grade Intelligence for Insurance Policy Analysis

  [License: MIT](https://opensource.org/licenses/MIT)
  [Frontend](https://reactjs.org/)
  [Backend](https://nodejs.org/)
  [AI Engine](https://ai.google.dev/)
  [Build](https://vitejs.dev/)


![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Bundler-Vite-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/API-Express-black?logo=express)
![Gemini AI](https://img.shields.io/badge/AI-Gemini%202.0-blue?logo=google)
![License](https://img.shields.io/badge/License-MIT-green.svg)
![Status](https://img.shields.io/badge/Status-Active-success)
![Build](https://img.shields.io/badge/Build-Passing-brightgreen)
---

**[View Live Application Environment](https://sure-path-ai10x.vercel.app/)**

🚨 Problem Statement

Insurance policies are complex and filled with dense legal language. Most users cannot clearly understand coverage, exclusions, or limits—leading to confusion and unexpected expenses during claims.

💡 Solution Overview

SurePath AI converts complex insurance documents into simple, structured insights using AI.

📄 Extracts key policy data from PDFs
📊 Visualizes coverage & exclusions instantly
🧠 Predicts claim approval chances
💸 Shows real out-of-pocket costs
⚠️ Highlights hidden risks & rejection causes

Transforms confusing policies → clear financial decisions in seconds

✨ Key Features (Quick View)
🧠 Claim Approval Predictor → Know approval chance before filing
💸 Cost Simulator → See what you actually pay
📊 Visual Dashboard → Charts for coverage & limits
⚠️ Risk Detector → Flags hidden exclusions
🔍 Scenario Testing → Test real-life situations

🛠️ Technical Details (Tech Stack)

👳‍♀️Client Application (Frontend)
➡️ Framework: React 19 optimized with Vite for Rapid Hot Module Replacement (HMR).
➡️ Styling: Fully bespoke Vanilla Tailwind CSS implementation focusing on modern glassmorphism, responsive constraint layouts, and semantic design tokens.
➡️ Animation Layer: Framer Motion (v12) deployed for lifecycle state handling (AnimatePresence).
➡️ Data Visualization: Recharts integration for responsive SVGs driven directly by AI payloads.

✈️Server Application (Backend)
➡️ Runtime: Node.js encapsulated by the Express micro-framework.
➡️ Parsing Engine: pdf-parse combined with custom regex text normalization algorithms.
➡️ AI Integration: Google Gemini 2.0 (@google/genai) executing strict parameterized extraction commands.
➡️ Concurrency: concurrently enabling isolated thread processes during local development.

## ⚙️ Execution Commands

Ensure your local machine operates on **Node.js (v18+)** and that you possess a valid [Gemini API Key](https://aistudio.google.com/app/apikey).

### 1. Repository Initializations

```bash
git clone https://github.com/SAHAJCSE/SurePath.AI-.git
cd surepath.ai
```

### 2. Install Dependencies

```bash
# Resolve all multi-environment dependencies securely
npm install
```

### 3. Environment Context

Establish the runtime secrets at the primary application root (`.env`):

```env
GEMINI_API_KEY=your_secured_gemini_api_key_here
VITE_API_BASE=http://localhost:5050
PORT=5050
```

### 4. Build the Project

```bash
# Compile and build the frontend application for production
npm run build
```

### 5. Run the Project Locally

Execute the initialization script to boot both the React client and the Express backend simultaneously.

```bash
# Start both the frontend (Vite) and backend (Express) concurrently
npm run dev:full
```

*The local development proxy is configured for routing via `http://localhost:5173`.*

---

## 💡 Code Standards & Contributing

This codebase operates under strict Typescript checking and ESLint linting constraints (`npm run lint`).
When contributing, ensure:

1. No explicit generic typing (`any`) is merged into deterministic schemas.
2. Changes to API routing must properly handle Cross-Origin Resource Sharing (CORS) exceptions.
3. Keep user interface components functionally pure unless fetching state explicitly through bounded Custom Hooks (`usePolicy.ts`).

  


Built with ❤️ to enforce clarity, transparency, and computational intelligence in the modern insurance domain. ❤️
