<div align="center">
  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDV9yVn2Oa2ZjA1eglpBipuHrkUufp3AWRbCKeXDq8KTYARukLLzjTuC1kwzm2nzCqFm8ttH5ieV6RewqiAuFQRkZE2ebh4xiv5Lr6yVCJ8W7WkxBJ48uBn8PD0ROo9Ywoz4L6evxGNjalb3ulxew3y6vwoDub7U1kSjqGi03qthcE1UadlLiz2VnNrCQUz9tObkq6Pr-Xc3MTjwIB_wggnzb5-7VPISV87OhkOsl6pY9wKfjdQffctz0bd9Kl5uwtfotjlQA6rozEn" alt="SurePath AI Logo" width="120" />
  
  # SurePath AI
  ### Enterprise-Grade Intelligence for Insurance Policy Analysis
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Frontend](https://img.shields.io/badge/Frontend-React%2019-blue?logo=react)](https://reactjs.org/)
  [![Backend](https://img.shields.io/badge/Backend-Node.js%20(Express)-green?logo=node.js)](https://nodejs.org/)
  [![AI Engine](https://img.shields.io/badge/Engine-Gemini%202.0%20Flash-orange?logo=google-cloud)](https://ai.google.dev/)
  [![Build](https://img.shields.io/badge/Build-Vite-purple?logo=vite)](https://vitejs.dev/)
</div>

---

<div align="center">
  <b><a href="https://sure-path-ai10x.vercel.app/">View Live Application Environment</a></b>
</div>

## 📌 Executive Summary

The insurance sector is characterized by dense, complex documentation that historically alienates the end consumer. **SurePath AI** addresses this systemic asymmetry by serving as a localized, AI-driven extraction and intelligence layer. It transforms high-density "legalese" into deterministic, structured data objects that power an intuitive, real-time user dashboard. 

Built with enterprise scalability in mind, SurePath AI bridges the computational divide between non-structured legal formats (PDFs) and strict analytical visualization (Recharts), delivering actionable policy metrics—such as deterministic limits, explicit exclusions, and automated claim scenario simulations—in seconds.

## 🚀 System Architecture & Capabilities

SurePath AI implements a strict client-server decoupling with advanced Natural Language Processing (NLP) injected via Google's Gemini 2.0 construct.

- **Deterministic Data Extraction:** Utilizes a highly constrained Master Prompt pipeline to force Gemini to extract PDF metadata strictly matching defined Typescript schemas, effectively neutralizing LLM hallucination risks.
- **Dynamic Recharts Data-Binding:** Real-time integration mapping generated JSON arrays to pie charts and bar configurations, cleanly splitting sub-limits into accessible UI elements.
- **Client-Side Simulation Engine:** Rather than relying on static mockups, the simulation engine calculates financial exposure based on real-time coverage boundaries and copay restrictions extracted natively from the document.
- **Frontend Fallback Resiliency:** Engineered with automated offline-fallback patterns. If backend communication severs during PDF transmission, the interface intelligently auto-maps to predefined deterministic mock payloads (e.g. `Jeevan Shagun`) minimizing catastrophic UX crashes.
- **Browser-Level Programmatic I18n:** Automated Hindi translations powered by explicit DOM manipulators interacting directly with the Google Translate programmatic API.

## 🛠️ Technological Infrastructure

### Client Application (Frontend)
- **Framework:** React 19 optimized with Vite for Rapid Hot Module Replacement (HMR).
- **Styling:** Fully bespoke Vanilla Tailwind CSS implementation focusing on modern glassmorphism, responsive constraint layouts, and semantic design tokens.
- **Animation Layer:** Framer Motion (v12) deployed for lifecycle state handling (`AnimatePresence`) and premium micro-interactions.
- **Data Visualization:** Recharts integration for responsive SVGs driven directly by AI payloads.

### Server Application (Backend)
- **Runtime:** Node.js encapsulated by the Express micro-framework.
- **Parsing Engine:** `pdf-parse` combined with custom regex text normalization algorithms.
- **AI Integration:** `@google/genai` executing strict parameterized extraction commands.
- **Concurrency:** `concurrently` enabling isolated thread processes during local development.

---

## ⚙️ Development Environment Setup

Ensure your local machine operates on **Node.js (v18+)** and that you possess a valid [Gemini API Key](https://aistudio.google.com/app/apikey).

### 1. Repository Initializations
```bash
git clone https://github.com/SAHAJCSE/SurePath.AI-.git
cd surepath.ai
```

### 2. Dependency Resolution
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

### 4. Concurrent Bootstrapping
Execute the initialization script to boot both the React client and the Express backend simultaneously.
```bash
npm run dev:full
```
*The local development proxy is configured for routing via `http://localhost:3000`.*

---

## 💡 Code Standards & Contributing

This codebase operates under strict Typescript checking and ESLint linting constraints (`npm run lint`).
When contributing, ensure:
1. No explicit generic typing (`any`) is merged into deterministic schemas.
2. Changes to API routing must properly handle Cross-Origin Resource Sharing (CORS) exceptions.
3. Keep user interface components functionally pure unless fetching state explicitly through bounded Custom Hooks (`usePolicy.ts`).

<br/>

<div align="center" style="font-size:14px; opacity:0.8;">
  Built with ❤️ to enforce clarity, transparency, and computational intelligence in the modern insurance domain. ❤️
</div>
