import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Interfaces & Types ---
interface HealthResponse {
  status: "ok" | "error";
  timestamp: string;
  uptime: number;
}

interface CacheStore<T> {
  [key: string]: {
    data: T;
    expiry: number;
  };
}

// --- Global Constants ---
const PORT = 3000;
const CACHE_TTL = 300000; // 5 minutes

// --- Utilities ---
const cache: CacheStore<unknown> = {};

/**
 * Standardized response trimmer for institutional data.
 */
function trimPayload<T extends object>(data: T, allowedKeys: (keyof T)[]): Partial<T> {
  const trimmed: Partial<T> = {};
  allowedKeys.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      trimmed[key] = data[key];
    }
  });
  return trimmed;
}

async function startServer() {
  const app = express();
  
  // Requirement for express-rate-limit behind Cloud Run / Proxy
  app.set('trust proxy', 1);

  // Security & Efficiency Middleware
  app.use(
    helmet({
      contentSecurityPolicy: false,
      frameguard: false, // Required for AI Studio iFrame preview
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );
  app.use(compression());
  app.use(express.json());

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use("/api/", limiter);

  // --- API Routes ---

  app.get("/api/health", (req: Request, res: Response<HealthResponse>) => {
    try {
      res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    } catch (error) {
      console.error("[Institutional Error] Health check failure:", error);
      res.status(500).json({
        status: "error",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    }
  });

  // Example of a cached, trimmed API route with enhanced TTL logic
  app.get("/api/stats", async (req: Request, res: Response) => {
    const cacheKey = "global_civic_stats_v1";
    const now = Date.now();

    if (cache[cacheKey] && cache[cacheKey].expiry > now) {
      res.setHeader("X-Institutional-Cache", "HIT");
      return res.json(cache[cacheKey].data);
    }

    try {
      // Analytical Telemetry: Trace sync request
      console.log(`[Institutional Telemetry] Syncing external statistics layer...`);
      
      const rawData = {
        voters: 244500000,
        turnout: 0.66,
        lastUpdated: new Date().toISOString(),
        internalMetadata: "classified_access_required",
      };

      const trimmedData = trimPayload(rawData, ["voters", "turnout", "lastUpdated"]);

      cache[cacheKey] = {
        data: trimmedData,
        expiry: now + (CACHE_TTL * 2), // Extended TTL for static stats
      };

      res.setHeader("X-Institutional-Cache", "MISS");
      res.status(200).json(trimmedData);
    } catch (error) {
      res.status(500).json({ error: "Institutional data source unreachable" });
    }
  });

  // --- AI Advisor Proxy Route (REMOVED: Moved to client-side) ---
  
  // --- Static Asset Serving ---
  const distPath = path.resolve(__dirname, "dist");
  const hasDist = fs.existsSync(distPath);
  const isProd = process.env.NODE_ENV === "production";

  console.log(`[Institutional Log] Environment: ${process.env.NODE_ENV}, Dist folder exists: ${hasDist}`);

  if (isProd && hasDist) {
    console.log("[Institutional Log] Serving production build from dist/");
    app.use(express.static(distPath, { index: false }));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    console.log("[Institutional Log] Starting Vite middleware for development/fallback.");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  // Final Error Handler
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(`[Institutional Critical] Unhandled exception: ${err.message}`);
    res.status(500).send("Internal Server Error");
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Institutional Log] Service operational on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("[Institutional Critical] Server failed to start:", error);
});
