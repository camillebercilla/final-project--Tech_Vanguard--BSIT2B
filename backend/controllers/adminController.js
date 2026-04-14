const Trip = require("../../models/Trip");

exports.addTrip = async (req, res) => {
  const trip = await Trip.create(req.body);
  res.json(trip);
};

exports.editTrip = async (req, res) => {
  const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(trip);
};

exports.deleteTrip = async (req, res) => {
  await Trip.findByIdAndDelete(req.params.id);
  res.json("Trip deleted");
};