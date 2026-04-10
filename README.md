<div align="center">
  
  # SurePath AI
  ### "Your Policy, Deciphered."
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![React](https://img.shields.io/badge/Frontend-React%2019-blue?logo=react)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Backend-Node.js%20Express-green?logo=node.js)](https://nodejs.org/)
  [![Gemini](https://img.shields.io/badge/AI-Gemini%202.0%20Flash-orange?logo=google-gemini)](https://ai.google.dev/)
</div>

---
<div align="center">   <b> <a href="https://sure-path-ai.vercel.app/"> CLICK HERE TO SEE THE APP </a></b></div>

## 📋 Problem Statement

Insurance policies are notoriously complex. Filled with dense "legalese" and hidden clauses, most policyholders don't fully understand what they are covered for until they face a crisis. This complexity leads to:
- **Unexpected Claim Rejections** due to unknown exclusions.
- **Confusion** over waiting periods and claim conditions.
- **Accessibility Barriers** for non-native English speakers.

## 🚀 Solution Overview

**SurePath AI** is an intelligent insurance companion designed to bridge the gap between complex legal documents and clear, actionable knowledge.

### Key Features:
- **Smart Policy Analysis**: Upload any insurance PDF/Text and get an instant AI-powered summary.
- **Scenario Simulator**: Test your coverage against real-world events (e.g., "What happens if I have a bike accident?") with visual eligibility simulations.
- **AI Insurance Assistant**: A context-aware chatbot that answer specific questions about your policy strictly based on the uploaded document.
- **Safety Score**: A proprietary 0-100 score indicating the resilience of your policy coverage.
- **Multi-language Support**: Seamless Hindi/English toggle using browser-level translation for maximum accessibility.

## 🛠️ Tech Stack

### Frontend
- **React 19**: Modern UI component architecture.
- **Tailwind CSS (Vite)**: For a sleek, responsive design system.
- **Framer Motion**: Premium micro-animations and screen transitions.
- **Lucide React**: High-quality iconography.

### Backend
- **Node.js & Express**: Scalable API handling.
- **Multer**: Secure file upload processing.
- **Google Generative AI (Gemini 2.0 Flash)**: State-of-the-art LLM for document extraction and natural language chat.

---

## ⚙️ Installation & Local Setup

Follow these steps to get SurePath AI running on your local machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- A [Gemini API Key](https://aistudio.google.com/app/apikey)

### 1. Clone the repository
```bash
git clone https://github.com/SAHAJCSE/SurePath.AI-.git
cd surepath.ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add your API Key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5050
```

### 4. Run the Application
You need to run both the frontend and the backend server.

**Terminal 1 (Frontend):**
```bash
npm run dev
```

**Terminal 2 (Backend Server):**
```bash
npm run server
```

The application will be available at `http://localhost:3000`.

---

## 🤝 Contributing

Students from Chitkara University (CSE) building SurePath AI.

## 👥 Team

<div align="center">

<h3>Students from Chitkara University (CSE) building <b>SurePath AI</b></h3>

</div>

<br/>

<div style="font-size:18px; line-height:1.8;">

<ul>
  <li><b>🚀 Sahaj (Lead & Full Stack)</b><br/>
  Architecture, frontend, API integration, chatbot flow</li>

  <br/>

  <li><b>🎨 Vrinda (Frontend & UI/UX)</b><br/>
  Design, responsive UI, user experience</li>

  <br/>

  <li><b>⚙️ Rajeev Ranjan (Backend)</b><br/>
  APIs, server logic, file handling</li>

  <br/>

  <li><b>🤖 Miljot Singh (AI & Testing)</b><br/>
  Gemini integration, prompt engineering, testing</li>
</ul>

</div>

<hr/>

<div align="center" style="font-size:16px;">
  Built with ❤️ to make insurance simple and transparent.
</div>

<div align="center">
  Built with ❤️ to make insurance simple, transparent, and accessible for everyone.
</div>
