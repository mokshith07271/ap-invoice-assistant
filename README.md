# AP Invoice Assistant — AI-Powered Invoice Review

An intelligent Accounts Payable (AP) invoice review assistant that performs automated 3-way matching between Invoices and Purchase Orders, identifies line-item price and quantity exceptions, and cites source document evidence with confidence scoring.

---

## 🌟 Key Features

- **Humanized Dashboard**: IST time-aware greetings (`Asia/Kolkata`), clean summary statistics cards, and full invoice deletion capabilities.
- **3-Step Upload Wizard**: Multi-step drag-and-drop file upload with live previews.
- **Interactive Document Analysis**: 6-step progress stepper with animated status checkmarks and dynamic AI progress updates.
- **Source-Grounded AI Chat (`Ask AI`)**: Conversational AI assistant supporting instant form submission, suggestion chips, live word-by-word streaming typing, and clickable source evidence links.
- **Source Evidence Viewer Modal**: Displays extracted text, page numbers, line item references, and match confidence ratings with low-confidence warnings.
- **0 Default Mock Invoices**: Clean workspace starting with 0 invoices by default; newly uploaded document projects appear automatically.
- **Real-Time LLM Integration**: Native support for Google Gemini API (`gemini-1.5-flash` / `pro`) and OpenAI API (`gpt-4o`).

---

## 🚀 Quick Start

### 1. Run Locally
```bash
# Clone repository
git clone https://github.com/mokshith07271/ap-invoice-assistant.git
cd ap-invoice-assistant

# Start local server
npm start
```
Open **`http://localhost:3000/#/`** in your browser.

---

## 📁 Project Architecture

```
ap-invoice-assistant/
├── index.html              — Main SPA Entry Shell & Integration Styles
├── server.js               — Dual IPv4/IPv6 Static HTTP Server (Port 3000)
├── css/                    — Design System (10 modular CSS files)
│   ├── variables.css
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   ├── upload.css
│   ├── analysis.css
│   ├── results.css
│   ├── chat.css
│   ├── dashboard.css
│   └── source-viewer.css
├── js/
│   ├── app.js              — SPA Router Listener & App Initializer
│   ├── state.js            — Pub/Sub Store Manager with SessionStorage
│   ├── router.js           — Hash-based SPA Router with Forced Dispatch
│   ├── ai-provider.js      — Real-Time LLM Provider (Gemini/OpenAI) + NLU Engine
│   ├── data/
│   │   └── mock-data.js    — Document schemas & stats calculation helpers
│   ├── views/              — View Modules (dashboard, upload, analysis, results, approval)
│   └── components/         — UI Components (chat, source-viewer, data-table, exception-card, toast, modal)
├── package.json            — Project Manifest
└── vercel.json             — Vercel SPA Deployment Configuration
```

---

## 📄 License
MIT License.
