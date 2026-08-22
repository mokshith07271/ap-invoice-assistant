# AP Invoice Assistant — AI-Powered Accounts Payable Review Assistant

[![GitHub Pages](https://img.shields.io/badge/Live_Demo-GitHub_Pages-brightgreen?logo=github)](https://mokshith07271.github.io/ap-invoice-assistant/#/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

An intelligent Accounts Payable (AP) invoice review assistant that performs automated 3-way matching between Invoices and Purchase Orders, identifies line-item price and quantity exceptions, and cites source document evidence with confidence scoring.

🌐 **Live Website**: [https://mokshith07271.github.io/ap-invoice-assistant/#/](https://mokshith07271.github.io/ap-invoice-assistant/#/)

---

## ✨ Features

- 📊 **IST Time-Aware Dashboard**: Displays Indian Standard Time (`Asia/Kolkata`) greetings, summary stats cards (`Total Invoices`, `Needs Review`, `Matched`, `Flagged`/`Rejected`), clean table headers, per-row deletion, and clear-all support.
- 📁 **3-Step Upload Wizard**: Multi-step drag-and-drop file upload interface for Invoice and Purchase Order document pairs.
- ⚙️ **Interactive Document Analysis**: 6-step progress stepper with status checkmarks and dynamic AI processing messages.
- 💬 **Context-Grounded AI Chat (`Ask AI`)**: Conversational AI assistant supporting instant form submission, suggestion chips, live word-by-word streaming typing, and clickable source evidence links.
- 🔍 **Source Evidence Viewer Modal**: Displays extracted text, page numbers, line item references, and match confidence ratings.
- 🧹 **Clean Workspace**: Starts with 0 default mock invoices; uploaded document projects appear automatically.
- 🤖 **Real-Time LLM Engine**: Pre-integrated with Google Gemini API (`gemini-1.5-flash` / `pro`) and OpenAI API (`gpt-4o`).

---

## 🛠️ Tech Stack

- **Frontend**: Vanilla ES2022 JavaScript, HTML5, Modular CSS Design System (Flexbox/Grid).
- **State Management**: Lightweight Pub/Sub Store with SessionStorage persistence.
- **Routing**: Hash-based SPA Router (`#/`, `#/upload`, `#/analysis`, `#/results/:id`, `#/approval/:id`).
- **AI Integration**: Custom NLU Intent Engine & Real-Time Gemini / OpenAI API Provider.
- **Hosting**: GitHub Pages (Zero-dependency single-file deployment bundle).

---

## 📁 Repository Structure

```
ap-invoice-assistant/
├── index.html              # 100% Self-Contained SPA Entry & Inlined Design System
├── styles.css              # Combined Modular CSS Design System
├── app.bundle.js           # Unified Frontend ES Modules Bundle
├── scripts/
│   ├── bundle.js           # Production Bundling Script
│   └── server.js           # Optional Local Development HTTP Server (Port 3000)
├── js/                     # Modular ES Core Source Files
│   ├── app.js              # SPA Bootstrapper
│   ├── state.js            # Pub/Sub State Store
│   ├── router.js           # Hash Router
│   ├── ai-provider.js      # LLM Provider & NLU Engine
│   ├── data/               # Schemas & Stats Calculations
│   ├── views/              # View Modules (dashboard, upload, analysis, results, approval)
│   └── components/         # UI Components (chat, source-viewer, data-table, toast, modal)
├── README.md               # Documentation & Usage Guide
└── package.json            # Project Manifest
```

---

## 🚀 Local Development Setup

1. **Clone Repository**:
   ```bash
   git clone https://github.com/mokshith07271/ap-invoice-assistant.git
   cd ap-invoice-assistant
   ```

2. **Start Local HTTP Server**:
   ```bash
   npm start
   ```

3. **Open Browser**:
   Navigate to `http://localhost:3000/#/`

---

## 🌐 Live GitHub Pages Deployment

This repository is configured for automatic deployment on GitHub Pages:

- **Live URL**: `https://mokshith07271.github.io/ap-invoice-assistant/#/`
- **Source Branch**: `main` (`/root`)

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
