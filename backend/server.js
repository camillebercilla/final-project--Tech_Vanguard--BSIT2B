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

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/users",    userRoutes);
app.use("/api/trips",    tripRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api",          busRoutes);
app.use("/api/admin",    adminRoutes);                  

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});