const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// ─── Startup Diagnostics (visible in Vercel Runtime Logs) ────────────────────
console.log("╔══════════════════════════════════════╗");
console.log("║  SERVER COLD START                   ║");
console.log("╚══════════════════════════════════════╝");
console.log("→ NODE_ENV:", process.env.NODE_ENV || "(not set)");
console.log("→ MONGO_URI:", MONGO_URI ? `${MONGO_URI.substring(0, 20)}...` : "⛔ MISSING!");
console.log("→ CLIENT_URL:", process.env.CLIENT_URL || "(not set, using wildcard)");

// ─── Cached MongoDB Connection (Serverless-Optimized) ────────────────────────
// In serverless, each invocation may reuse a warm container. We check
// mongoose.connection.readyState instead of a boolean flag so we never
// try to re-connect when the driver is already connected or connecting.
//
// readyState values: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting

async function connectDB() {
  const state = mongoose.connection.readyState;

  // Already connected — reuse the warm connection
  if (state === 1) return;

  // Currently connecting from a concurrent request — wait for it
  if (state === 2) {
    await new Promise((resolve) => mongoose.connection.once("connected", resolve));
    return;
  }

  // Guard: fail fast if MONGO_URI is missing
  if (!MONGO_URI) {
    throw new Error(
      "MONGO_URI is not defined. Set it in Vercel Environment Variables."
    );
  }

  console.log("→ Connecting to MongoDB...");

  await mongoose.connect(MONGO_URI, {
    // ─ Serverless-critical options ─
    bufferCommands: false,          // Don't queue ops if not connected — fail fast
    serverSelectionTimeoutMS: 8000, // Must finish within Vercel's 10s function timeout
    socketTimeoutMS: 45000,         // Close sockets after 45s of inactivity
    maxPoolSize: 5,                 // Small pool — serverless containers are short-lived
  });

  console.log("✅ MongoDB connected | readyState:", mongoose.connection.readyState);
}

// ─── Middleware ───────────────────────────────────────────────────────────────
// CORS: On Vercel, frontend & backend share the same domain. Allow that origin
// plus localhost for development. If CLIENT_URL is unset, allow all origins.
app.use(
  cors({
    origin: process.env.CLIENT_URL
      ? [process.env.CLIENT_URL, "http://localhost:5173"]
      : true, // allow all when CLIENT_URL is not configured
  })
);
app.use(express.json());

// ─── DB Connection Middleware (runs before every request) ────────────────────
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("═══ DB MIDDLEWARE FAILURE ═══");
    console.error("Route:", req.method, req.originalUrl);
    console.error("Error:", err.message);
    console.error("Stack:", err.stack);
    res.status(500).json({
      error: "Database connection failed",
      message: err.message,
      hint: "Check MONGO_URI in Vercel Environment Variables and Atlas IP whitelist (0.0.0.0/0)",
    });
  }
});

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/guests", require("./routes/guestRoutes"));

// Health check — also tests actual DB connectivity
app.get("/api/health", async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const stateMap = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
    res.json({
      status: dbState === 1 ? "OK" : "DEGRADED",
      db: stateMap[dbState] || "unknown",
      timestamp: new Date(),
      env: {
        mongoUri: MONGO_URI ? "set" : "MISSING",
        clientUrl: process.env.CLIENT_URL || "not set",
        nodeEnv: process.env.NODE_ENV || "not set",
      },
    });
  } catch (err) {
    res.status(500).json({ status: "ERROR", error: err.message });
  }
});

// ─── Global Error Handler (surfaces full stack in Vercel Runtime Logs) ───────
app.use((err, req, res, next) => {
  console.error("═══ UNHANDLED EXPRESS ERROR ═══");
  console.error("Route:", req.method, req.originalUrl);
  console.error("Name:", err.name);
  console.error("Message:", err.message);
  console.error("Stack:", err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
});

// ─── Local Development: listen on PORT ───────────────────────────────────────
if (process.env.NODE_ENV !== "production") {
  connectDB().then(() => {
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  });
}

// ─── Vercel Serverless Export ─────────────────────────────────────────────────
module.exports = app;