// models/Event.js
const mongoose = require("mongoose");
const eventSchema = new mongoose.Schema({
  eventDate: Date,
  winningNumber: String,
  winner: String,
  prize: String,
  description: String,
  userSubmissions: [String],
});

module.exports = mongoose.model("Event", eventSchema);
