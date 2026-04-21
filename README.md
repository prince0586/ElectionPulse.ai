# 🗳️ Election Pulse.ai

**Election Pulse.ai** is a professional, institutional-grade election intelligence platform designed to empower citizens with grounded, real-time, and localized voting data. Built with the **"Professional Polish"** theme, it serves as a non-partisan framework for civic engagement.

---

## 🏗️ Architecture Overview

The application follows a modern **Full-Stack (Express + Vite)** architecture, optimized for high performance, accessibility, and real-time AI capabilities.

### 1. Frontend Layer (Single Page Application)
- **Framework**: React 18+ with TypeScript.
- **State Management**: React Hooks (`useState`, `useEffect`, `useRef`) for local UI state and navigation.
- **Styling**: Tailwind CSS 4.0 using the "Professional Polish Contrast" system (Brand Blue, Slate Ink, and Surface Grays).
- **Animations**: `framer-motion` for fluid component transitions and micro-interactions.
- **Visualizations**: `recharts` for voter turnout trends and institutional metrics.

### 2. Service Layer (AI & Grounding)
- **Engine**: Google Gemini 1.5 Flash.
- **Grounding**: Integrated with **Google Search Grounding**. This ensures the AI advisor provides live, verifiable links to Secretary of State portals and authenticates election dates in real-time.
- **Citations**: Automatic extraction of institutional sources, displayed as verified badges below AI responses.

### 3. Middleware & Deployment (Server-Side)
- **Server**: Express.ts serving as a production-ready entry point.
- **Hydration**: Uses Vite middleware in development and serves optimized static assets from `dist/` in production.
- **Hosting**: Pre-configured for **Google Cloud Run** with standard port binding (`3000`) and the `0.0.0.0` host pattern.

---

## 🛠️ Technical Implementation Details

### **Real-World Grounding System**
The AI Advisor utilizes the `@google/genai` SDK with the `googleSearch` tool enabled. Unlike standard LLMs, this implementation rejects hallucinations by cross-referencing user queries against live web results before formulating a response.

### **Dynamic Localization Hook**
A built-in integration with `zippopotam.us` allows users to localize their experience. By entering a 5-digit zip code, the app fetches state-level metadata, which is then injected into the AI system prompt to provide tailored registration guidance.

### **Accessibility Core (A11y)**
For an app focused on democracy, accessibility is non-optional:
- **ARIA Live Regions**: Ensuring chat responses are announced immediately to screen readers.
- **Contrast Ratios**: Strictly adhering to WCAG 2.1 AA standards for institutional trust.
- **Keyboard Navigation**: Full `tab-index` coverage for the "Cycle Architecture" timeline.

---

## 🚀 Getting Started

### Local Development
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Environment Setup**: Create a `.env` file and add your `GEMINI_API_KEY`.
3. **Launch Dev Server**:
   ```bash
   npm run dev
   ```

### Production Build & Deploy
1. **Build Assets**:
   ```bash
   npm run build
   ```
2. **Start Production Server**:
   ```bash
   npm start
   ```

---

## 📊 Key Modules
- `ChatAssistant.tsx`: The heart of the AI grounding system.
- `VoterChecklist.tsx`: Predictive readiness tracker with exportable reports.
- `TimelineStep.tsx`: Vertical procedural visualization of the electoral cycle.

**Election Pulse.ai** — *Precision Governance. Grounded Intel. Verified Citizenship.*
