require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/wedding-platform";

// ─── Cached MongoDB Connection (serverless-safe) ─────────────────────────────
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(MONGO_URI);
    isConnected = true;
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    throw err;
  }
}

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

// Ensure DB is connected before every request (handles serverless cold starts)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/guests", require("./routes/guestRoutes"));

// Health check
app.get("/api/health", (req, res) =>
  res.json({ status: "OK", timestamp: new Date() })
);

// ─── Global Error Handler (surfaces errors in Vercel Runtime Logs) ───────────
app.use((err, req, res, next) => {
  console.error("═══ UNHANDLED EXPRESS ERROR ═══");
  console.error("Route:", req.method, req.originalUrl);
  console.error("Error:", err.message);
  console.error("Stack:", err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "production" ? "Something went wrong" : err.message,
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