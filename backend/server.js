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

// ── TEMP SEED ROUTE (remove after use) ───────────────────────────────────────
app.get("/api/seed-now", async (req, res) => {
  try {
    const Trip = require("./models/Trip");
    await Trip.deleteMany({});
    const TRIPS = [
      { origin:"Legazpi City", destination:"Sorsogon City", duration:"1-2 hrs", priceMin:150, priceMax:250, departures:["6:00 AM","9:00 AM","12:00 PM","3:00 PM","6:00 PM"], totalSeats:45, status:"scheduled" },
      { origin:"Legazpi City", destination:"Naga City", duration:"2-3 hrs", priceMin:200, priceMax:350, departures:["6:00 AM","9:00 AM","12:00 PM","6:00 PM","9:00 PM"], totalSeats:45, status:"scheduled" },
      { origin:"Naga City", destination:"Daet", duration:"3-4 hrs", priceMin:300, priceMax:450, departures:["7:00 AM","1:00 PM","7:00 PM"], totalSeats:45, status:"scheduled" },
      { origin:"Iriga City", destination:"Naga City", duration:"1-2 hrs", priceMin:150, priceMax:250, departures:["6:00 AM","9:00 AM","12:00 PM","3:00 PM","6:00 PM"], totalSeats:45, status:"scheduled" },
      { origin:"Ligao City", destination:"Legazpi City", duration:"30-45 mins", priceMin:80, priceMax:150, departures:["6:00 AM","8:00 AM","10:00 AM","12:00 PM","2:00 PM","4:00 PM","6:00 PM"], totalSeats:45, status:"scheduled" },
      { origin:"Polangui", destination:"Legazpi City", duration:"45-60 mins", priceMin:60, priceMax:120, departures:["6:00 AM","8:00 AM","10:00 AM","12:00 PM","2:00 PM","4:00 PM","6:00 PM"], totalSeats:45, status:"scheduled" },
    ];
    await Trip.insertMany(TRIPS);
    res.json({ ok: true, message: "Seeded " + TRIPS.length + " trips with AM/PM times" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── API ROUTES ───────────────────────────────────────────────────────────────
app.use("/api/users",    userRoutes);
app.use("/api/trips",    tripRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin",    adminRoutes);
app.use("/api",          busRoutes);

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