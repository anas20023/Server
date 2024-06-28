const mongoose = require("mongoose");

// Define the schema
const winnerHistorySchema = new mongoose.Schema({
  date: {
    type: Date, // Changed to Date type
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  users: {
    type: String,
    required: true,
  }
});

// Create the model from the schema
const WinnerHistory = mongoose.model("WinnerHistory", winnerHistorySchema);

module.exports = WinnerHistory;
