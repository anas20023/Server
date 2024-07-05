// models/CountdownState.js

const mongoose = require('mongoose');

const CountdownStateSchema = new mongoose.Schema({
  remainingTime: {
    type: Number,
    default: 300, // 5 minutes in seconds
  },
  eventNumber: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('CountdownState', CountdownStateSchema);
