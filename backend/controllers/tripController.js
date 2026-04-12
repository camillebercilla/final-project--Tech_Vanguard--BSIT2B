const Trip = require("../../models/Trip");

// Search Trips
exports.searchTrips = async (req, res) => {
  const { origin, destination } = req.query;

  const trips = await Trip.find({ origin, destination });
  res.json(trips);
};

// Get all trips
exports.getTrips = async (req, res) => {
  const trips = await Trip.find();
  res.json(trips);
};