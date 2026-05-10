// seedTrips.js
// Place in: backend/seedTrips.js
// Run with: node seedTrips.js

require("dotenv").config();
const mongoose = require("mongoose");

// ── Connect directly (no relying on connectDB wrapper) ──────────────────────
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://localhost:27017/quickreserve";

console.log("Connecting to:", MONGO_URI);

mongoose.connect(MONGO_URI)
  .then(function() {
    console.log("✅ MongoDB connected");
    return seed();
  })
  .catch(function(err) {
    console.error("❌ Connection failed:", err.message);
    process.exit(1);
  });

// ── Trip Schema (inline — no import issues) ─────────────────────────────────
const tripSchema = new mongoose.Schema({
  origin:      { type: String, required: true },
  destination: { type: String, required: true },
  priceMin:    { type: Number, default: 0 },
  priceMax:    { type: Number, default: 0 },
  departures:  [{ type: String }],
  duration:    { type: String, default: "" },
  totalSeats:  { type: Number, default: 45 },
  status: {
    type: String,
    enum: ["scheduled", "rescheduled", "cancelled"],
    default: "scheduled",
  },
}, { timestamps: true });

// Use existing model if already registered (avoid OverwriteModelError)
const Trip = mongoose.models.Trip || mongoose.model("Trip", tripSchema);

// ── Correct trip data matching index.html routes ─────────────────────────────
const TRIPS = [
  {
    origin:      "Legazpi City",
    destination: "Sorsogon City",
    duration:    "1-2 hrs",
    priceMin:    150,
    priceMax:    250,
    departures:  ["06:00", "09:00", "12:00", "15:00", "18:00"],
    totalSeats:  45,
    status:      "scheduled",
  },
  {
    origin:      "Legazpi City",
    destination: "Naga City",
    duration:    "2-3 hrs",
    priceMin:    200,
    priceMax:    350,
    departures:  ["06:00", "09:00", "12:00", "18:00", "21:00"],
    totalSeats:  45,
    status:      "scheduled",
  },
  {
    origin:      "Naga City",
    destination: "Daet",
    duration:    "3-4 hrs",
    priceMin:    300,
    priceMax:    450,
    departures:  ["07:00", "13:00", "19:00"],
    totalSeats:  45,
    status:      "scheduled",
  },
  {
    origin:      "Iriga City",
    destination: "Naga City",
    duration:    "1-2 hrs",
    priceMin:    150,
    priceMax:    250,
    departures:  ["06:00", "09:00", "12:00", "15:00", "18:00"],
    totalSeats:  45,
    status:      "scheduled",
  },
  {
    origin:      "Ligao City",
    destination: "Legazpi City",
    duration:    "30-45 mins",
    priceMin:    80,
    priceMax:    150,
    departures:  ["06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00"],
    totalSeats:  45,
    status:      "scheduled",
  },
  {
    origin:      "Polangui",
    destination: "Legazpi City",
    duration:    "45-60 mins",
    priceMin:    60,
    priceMax:    120,
    departures:  ["06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00"],
    totalSeats:  45,
    status:      "scheduled",
  },
];

async function seed() {
  try {
    // Delete everything in the trips collection
    const del = await Trip.deleteMany({});
    console.log("🗑  Deleted", del.deletedCount, "existing trips");

    // Insert correct trips one by one so we can see each result
    for (var i = 0; i < TRIPS.length; i++) {
      var t = await Trip.create(TRIPS[i]);
      console.log("✅ Created:", t.origin, "→", t.destination, "| ₱" + t.priceMin + "–₱" + t.priceMax, "| Deps:", t.departures.join(", "));
    }

    console.log("\n🎉 Seeding complete! Refresh your admin panel.");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}