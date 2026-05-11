// seedTrips.js
// Place in: backend/seedTrips.js
// Run with: node seedTrips.js

require("dotenv").config();
const mongoose = require("mongoose");

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

const Trip = mongoose.models.Trip || mongoose.model("Trip", tripSchema);

const TRIPS = [
  {
    origin:      "Legazpi City",
    destination: "Sorsogon City",
    duration:    "1-2 hrs",
    priceMin:    150,
    priceMax:    250,
    departures:  ["6:00 AM", "9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM"],
    totalSeats:  45,
    status:      "scheduled",
  },
  {
    origin:      "Legazpi City",
    destination: "Naga City",
    duration:    "2-3 hrs",
    priceMin:    200,
    priceMax:    350,
    departures:  ["6:00 AM", "9:00 AM", "12:00 PM", "6:00 PM", "9:00 PM"],
    totalSeats:  45,
    status:      "scheduled",
  },
  {
    origin:      "Naga City",
    destination: "Daet",
    duration:    "3-4 hrs",
    priceMin:    300,
    priceMax:    450,
    departures:  ["7:00 AM", "1:00 PM", "7:00 PM"],
    totalSeats:  45,
    status:      "scheduled",
  },
  {
    origin:      "Iriga City",
    destination: "Naga City",
    duration:    "1-2 hrs",
    priceMin:    150,
    priceMax:    250,
    departures:  ["6:00 AM", "9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM"],
    totalSeats:  45,
    status:      "scheduled",
  },
  {
    origin:      "Ligao City",
    destination: "Legazpi City",
    duration:    "30-45 mins",
    priceMin:    80,
    priceMax:    150,
    departures:  ["6:00 AM", "8:00 AM", "10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM"],
    totalSeats:  45,
    status:      "scheduled",
  },
  {
    origin:      "Polangui",
    destination: "Legazpi City",
    duration:    "45-60 mins",
    priceMin:    60,
    priceMax:    120,
    departures:  ["6:00 AM", "8:00 AM", "10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM"],
    totalSeats:  45,
    status:      "scheduled",
  },
];

async function seed() {
  try {
    const del = await Trip.deleteMany({});
    console.log("🗑  Deleted", del.deletedCount, "existing trips");

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