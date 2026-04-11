const Trip = require("../models/Trip");

exports.getTrips = async (req, res) => {
  const trips = await Trip.find();
  res.json(trips);
};

exports.addTrip = async (req, res) => {
  const trip = await Trip.create(req.body);
  res.json(trip);
};