import express from "express";
import path from "path";
import fs from "fs";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security & Efficiency Middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Disabled for Vite dev server compatibility
  }));
  app.use(compression());
  
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use("/api/", limiter);

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const distPath = path.resolve(__dirname, "dist");
  const hasDist = fs.existsSync(distPath);
  
  console.log(`[Institutional Log] Server starting. NODE_ENV: ${process.env.NODE_ENV}, Dist exists: ${hasDist}, Path: ${distPath}`);

  if (process.env.NODE_ENV !== "production") {
    console.log("[Institutional Log] Entering Development Mode via Vite Middleware.");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("[Institutional Log] Entering Production Mode. Serving static assets.");
    if (!hasDist) {
      console.error("[CRITICAL ERROR] Dist directory missing. Run 'npm run build' before starting.");
    }
    app.use(express.static(distPath, { index: false }));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
