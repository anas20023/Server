// models/CountdownState.js

const mongoose = require("mongoose");

const CountdownStateSchema = new mongoose.Schema({
  nmbr: { type: Number, required: true },
  luck: { type: Number, required: true },
  endTime: { type: Date, required: true },
});

module.exports = mongoose.model("CountdownState", CountdownStateSchema);
