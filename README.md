
# 🚀 SurePath AI

### Enterprise-Grade Intelligence for Insurance Policy Analysis

<p>
  <a href="https://opensource.org/licenses/MIT">MIT License</a> |
  <a href="https://reactjs.org/">Frontend</a> |
  <a href="https://nodejs.org/">Backend</a> |
  <a href="https://ai.google.dev/">AI Engine</a> |
  <a href="https://vitejs.dev/">Build</a>
</p>


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




---

## 🌐 Live Application

<p>
  <a href="https://sure-path-ai10x.vercel.app/">
    👉 View Live Demo
    for Better UX open in mobile
  </a>
</p>

---



##🚨 Problem Statement

Insurance policies are complex, legal-heavy, and difficult for users to understand. Most people cannot clearly identify what is covered, what is excluded, and what they will actually pay during a claim.

This creates a major gap between insurers and users, often leading to confusion, claim rejection surprises, and financial stress during emergencies.

📉 Core Issues
Policies are overwhelming and hard to interpret
Exclusions and limits are hidden in legal text
No visual or simple explanation of coverage
Users only understand impact during claim time

---

## 💡 Solution Overview

SurePath AI simplifies insurance documents into structured, easy-to-understand insights using AI.

<ul>
  <li>
    <b>📄 Extracts key policy data from PDFs</b><br/>
    Converts unstructured insurance documents into structured AI-readable data.
  </li>

  <li>
    <b>📊 Visualizes coverage & exclusions</b><br/>
    Turns policy data into charts for instant understanding.
  </li>

  <li>
    <b>🧠 Predicts claim approval chances</b><br/>
    Analyzes policy rules to estimate claim success probability.
  </li>

  <li>
    <b>💸 Shows real out-of-pocket cost</b><br/>
    Calculates actual user expenses after insurance coverage.
  </li>

  <li>
    <b>⚠️ Highlights hidden risks</b><br/>
    Detects exclusions and clauses that may lead to rejection.
  </li>
</ul>

<p><b>➡️ Transforms confusing policies into clear financial decisions in seconds</b></p>

---

## ✨ Key Features

<ul>
  <li>🧠 Claim Approval Predictor → Estimates approval probability before filing</li>
  <li>💸 Cost Simulator → Shows real payable amount after coverage</li>
  <li>📊 Visual Dashboard → Displays coverage & exclusions in charts</li>
  <li>⚠️ Risk Detector → Identifies hidden rejection risks</li>
  <li>🔍 Scenario Testing → Simulates real-world insurance cases</li>
</ul>

---

## 🛠️ Technical Stack

<p><b>Frontend</b></p>
<p>
➡️ React 19 – Fast UI rendering<br/>
➡️ Vite – Lightning-fast build system<br/>
➡️ Tailwind CSS – Utility-first styling<br/>
➡️ Framer Motion – Smooth animations<br/>
➡️ Recharts – Data visualization for AI outputs
</p>

<p><b>Backend</b></p>
<p>
➡️ Node.js – Runtime environment<br/>
➡️ Express – API framework<br/>
➡️ pdf-parse – Extracts PDF insurance data<br/>
➡️ Gemini AI – AI-powered policy understanding<br/>
➡️ concurrently – Runs frontend + backend together
</p>

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

  

## 💡 Built With

<p>
Built with clarity, transparency, and AI-driven insurance intelligence.
</p>
