

# SurePath AI

### Enterprise-Grade Intelligence for Insurance Policy Analysis

  [License: MIT](https://opensource.org/licenses/MIT)
  [Frontend](https://reactjs.org/)
  [Backend](https://nodejs.org/)
  [AI Engine](https://ai.google.dev/)
  [Build](https://vitejs.dev/)



---

**[View Live Application Environment](https://sure-path-ai10x.vercel.app/)**

## 🚨 Problem Statement

The insurance sector is characterized by dense, complex documentation that historically alienates the end consumer. Policyholders struggle with high-density "legalese", making it difficult to understand their true coverage, limits, and exclusions. This systemic asymmetry between insurance providers and consumers leads to confusion, frustration, and unexpected out-of-pocket expenses during the claims process.

## 💡 Solution Overview

**SurePath AI** addresses this problem by serving as a localized, AI-driven extraction and intelligence layer. It transforms non-structured, complex legal documents (PDFs) into deterministic, structured data objects that power an intuitive, real-time user dashboard. 

Built with enterprise scalability in mind, SurePath AI delivers actionable policy metrics in seconds. Users can instantly view deterministic limits, explicit exclusions, and interact with automated claim scenario simulations to understand their financial exposure before an incident occurs.

### System Architecture & Capabilities

- **Deterministic Data Extraction:** Utilizes a highly constrained Master Prompt pipeline to force Gemini to extract PDF metadata strictly matching defined Typescript schemas, neutralizing LLM hallucination risks.
- **Dynamic Recharts Data-Binding:** Real-time integration mapping generated JSON arrays to pie charts and bar configurations.
- **Client-Side Simulation Engine:** Calculates financial exposure based on real-time coverage boundaries and copay restrictions extracted natively from the document.
- **Frontend Fallback Resiliency:** Engineered with automated offline-fallback patterns minimizing catastrophic UX crashes.
- **Browser-Level Programmatic I18n:** Automated Hindi translations powered by explicit DOM manipulators interacting directly with the Google Translate programmatic API.

## 🛠️ Technical Details (Tech Stack)

### Client Application (Frontend)

- **Framework:** React 19 optimized with Vite for Rapid Hot Module Replacement (HMR).
- **Styling:** Fully bespoke Vanilla Tailwind CSS implementation focusing on modern glassmorphism, responsive constraint layouts, and semantic design tokens.
- **Animation Layer:** Framer Motion (v12) deployed for lifecycle state handling (`AnimatePresence`).
- **Data Visualization:** Recharts integration for responsive SVGs driven directly by AI payloads.

### Server Application (Backend)

- **Runtime:** Node.js encapsulated by the Express micro-framework.
- **Parsing Engine:** `pdf-parse` combined with custom regex text normalization algorithms.
- **AI Integration:** Google Gemini 2.0 (`@google/genai`) executing strict parameterized extraction commands.
- **Concurrency:** `concurrently` enabling isolated thread processes during local development.

---

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