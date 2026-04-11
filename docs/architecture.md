# SurePath AI - Architecture Overview

SurePath AI is designed as a modular, AI-driven insurance analysis platform. It uses a modern TypeScript stack to provide safe, real-time insights into complex policy documentation.

## 🏗️ Technical Stack

- **Frontend**: React 19 + Vite (Fast, optimized client-side interactions)
- **Styling**: Vanilla CSS + Tailwind Core (Custom premiums design tokens)
- **Backend**: Node.js + Express (Handles PDF parsing & Gemini API integration)
- **AI Engine**: Google Gemini 1.5 Flash (Parses unstructured policy text into structured JSON)
- **State Management**: LocalStorage for persistent user data & React Context for real-time updates.

## 📂 Project Organization

```text
├── server/               # Express backend & AI parsing logic
│   ├── gemini.ts         # Direct interface with Google AI studio
│   ├── text-extract.ts   # OCR & text normalization for PDF/Images
│   └── index.ts          # Main API endpoints
├── src/                  # React Frontend
│   ├── components/
│   │   ├── layout/       # Global UI elements (Header, Nav)
│   │   └── features/     # Specialized tools (Simulator, Visualizer)
│   ├── screens/          # Top-level page components
│   ├── hooks/            # Custom logic (e.g., usePolicy)
│   ├── types/            # TypeScript definitions (Policy, Screen)
│   └── data/             # Mock data for offline demo modes
├── docs/                 # Project documentation & presentations
└── public/               # Static assets & brand icons
```

## 🔐 Security & Privacy

- **Data Shield**: All sensitive user profile data is stored exclusively on the client device (LocalStorage).
- **Processing**: Policy documents are processed via encrypted channels and never stored permanently on our servers.
- **Privacy First**: We do not sell user data. The analysis is performed "in-flight".

## 🚀 Future Roadmap

1. **Automatic Claim Filing**: direct integration with insurer portals via browser automation.
2. **Premium Comparison**: Real-time price and feature comparison with 99% accuracy.
3. **Family Sharing**: managing multiple family members' policies under a single dashboard.
