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

// ── API ROUTES ───────────────────────────────────────────────────────────────
app.use("/api/users",    userRoutes);
app.use("/api/trips",    tripRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin",    adminRoutes);   // ✅ MOVED UP — before the broad /api catch
app.use("/api",          busRoutes);     // ✅ broad catch is now LAST

// ── SERVE FRONTEND STATIC FILES ──────────────────────────────────────────────
const FRONTEND = path.join(__dirname, "../frontend");
app.use(express.static(FRONTEND));

// ── FALLBACK: send index.html for any non-API route ──────────────────────────
app.get(/^(?!\/api).*/, (req, res) => {
  const requestedFile = path.join(FRONTEND, req.path);
  const fs = require("fs");

  if (fs.existsSync(requestedFile) && fs.statSync(requestedFile).isFile()) {
    return res.sendFile(requestedFile);
  }

  res.sendFile(path.join(FRONTEND, "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend: http://localhost:${PORT}`);
  console.log(`Admin:    http://localhost:${PORT}/pages/admin/admin-dashboard.html`);
});