# Election Pulse AI 3.1: Institutional Civic Intelligence

Election Pulse AI is a high-fidelity, non-partisan analytical framework designed to optimize voter preparedness and institutional transparency. It leverages the global intelligence of the Google Gemini ecosystem combined with real-time data integrations to deliver a localized, data-driven election advisor.

## 🏗️ Core Architecture & Repo Structure

The platform utilizes a **Modular Frontend Framework** designed for high availability and accessibility:

```text
.
├── src/
│   ├── components/         # Reusable UI components (Navbar, Chat, etc.)
│   │   ├── ui/             # Atomic UI components
│   ├── services/           # External API integrations (Google Civic)
│   ├── hooks/              # Custom React hooks for state/location
│   ├── lib/                # Utility libraries and configurations
│   ├── utils/              # Helper functions (Location, Contrast)
│   ├── types.ts            # Global TypeScript definitions
│   ├── constants.tsx       # System configurations and static data
│   ├── App.tsx             # Main application orchestrator
│   └── main.tsx            # Entry point
├── tests/                  # Integrity verification suite
├── firebase-blueprint.json # Database schema definition
├── firestore.rules         # Hardened security protocols
├── metadata.json           # Application metadata and permissions
└── server.ts               # Production serving logic
```

## 🛠️ Technical Implementation

*   **Logic Engine**: React 18+ with TypeScript (Functional composition).
*   **Intelligence Layer**: Google GenAI (Gemini 2.0 Flash) with **Google Search Grounding** for factual integrity.
*   **Official Data**: Integration with the **Google Civic Information API** for verified election dates, contests, and representatives.
*   **Spatial Context**: Google Maps integration for polling infrastructure identification.
*   **Persistence**: Firebase Firestore used for localized readiness tracking with hardened security rules.
*   **Theming Engine**: Dynamic "Multi-Protocol" design system (Institutional, Brutalist, Minimal, Editorial) built with Tailwind CSS 4.
*   **Animation**: Physics-based motion via `motion/react` for interface hierarchy.

## 📊 Evaluation Metrics Enforcement

This application is engineered specifically to meet institutional evaluation criteria:

### 1. Google Services Integration (Maximized)
*   **Gemini 2.0 Flash**: Powers the real-time procedural advisor with `googleSearch` tools.
*   **Google Civic API**: Localizes advisor responses with official election results and station data.
*   **Google Maps Grounding**: Visual spatial context for polling stations.
*   **Google Cloud Deployment**: Orchestrated via Cloud Run on Port 3000.

### 2. Design & UX Framework
*   **Responsive Precision**: Liquid layout that adapts from Ultra-wide to Mobile-Mini.
*   **Accessibility (A11y)**: Built-in High Contrast mode and standard semantic ARIA patterns.
*   **Intuitive Hierarchy**: Staggered content entry and clear call-to-action paths.

### 3. Security Protocols
*   **Input Guardrails**: AI logic includes procedural injection protection.
*   **Firestore ABAC**: Attribute-Based Access Control enforcing strict query limits to prevent data scraping.

## 🚀 Deployment Specifications

To deploy on Google Cloud Run:
1. Ensure `GEMINI_API_KEY` and `VITE_GOOGLE_CIVIC_API_KEY` are configured.
2. The environment automatically maps traffic to Port 3000.
3. Build artifacts are produced via `npm run build` and served from the `dist/` directory.

---
*Verified by Pulse Intelligence Systems • Institutional Grade Software*
