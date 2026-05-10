require("dns").setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const userRoutes    = require("./routes/userRoutes");
const tripRoutes    = require("./routes/tripRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const busRoutes     = require("./routes/busRoutes");
const adminRoutes   = require("./routes/adminRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("REQ:", req.method, req.url);
  next();
});

// ── API ROUTES (must come BEFORE static files) ──────────────────────────────
app.use("/api/users",    userRoutes);
app.use("/api/trips",    tripRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api",          busRoutes);
app.use("/api/admin",    adminRoutes);

// ── SERVE FRONTEND STATIC FILES ─────────────────────────────────────────────
// Assumes your folder structure is:
//   backend/   ← server.js lives here
//   frontend/  ← index.html, css/, js/, pages/ live here
//
// If your frontend folder has a different name or location, update the path below.
const FRONTEND = path.join(__dirname, "../frontend");
app.use(express.static(FRONTEND));

// ── FALLBACK: send index.html for any non-API route ─────────────────────────
// This lets you open any .html page directly in the browser via the Express server.
// The auth guard inside each HTML file will handle login redirection.
app.get(/^(?!\/api).*/, (req, res) => {
  const requestedFile = path.join(FRONTEND, req.path);
  const fs = require("fs");

  // If the exact file exists, serve it (e.g. /pages/admin/admin-dashboard.html)
  if (fs.existsSync(requestedFile) && fs.statSync(requestedFile).isFile()) {
    return res.sendFile(requestedFile);
  }

  // Otherwise fall back to index.html
  res.sendFile(path.join(FRONTEND, "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend: http://localhost:${PORT}`);
  console.log(`Admin:    http://localhost:${PORT}/pages/admin/admin-dashboard.html`);
});