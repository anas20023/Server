const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const WinnerHistory = require("./dbscm.js");
const Event = require("./models/Event.js");

// Load environment variables
require("dotenv").config();

const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.DBSTR, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit process if unable to connect to MongoDB
  });

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json()); // Middleware to parse JSON bodies

// Define a schema and model for the guesses
const guessSchema = new mongoose.Schema({
  number: String,
  brand: String,
  username: String,
});

const Guess = mongoose.model("Guess", guessSchema);

// Handle form submissions
app.post("/submit-guess", async (req, res) => {
  try {
    const guess = new Guess(req.body);
    await guess.save();
    res.status(201).json({ message: "Guess submitted successfully!" });
  } catch (error) {
    res.status(400).json({ error: "Error submitting guess" });
  }
});

// Route to fetch winner history
app.get("/winner-history", async (req, res) => {
  try {
    const history = await WinnerHistory.find();
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch winner history", error });
  }
});

// Route to fetch submission numbers
app.get("/submission-numbers", async (req, res) => {
  try {
    const numbers = await Guess.find().select("number");
    res.json(numbers);
  } catch (error) {
    console.error("Error fetching submission numbers:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch submission numbers", error });
  }
});

// Route to fetch current lucky number
app.get("/current-lucky-number", async (req, res) => {
  try {
    // Assuming you have a method or query to fetch the current lucky number from the database
    const currentLuckyNumber = await fetchCurrentLuckyNumber(); // Replace with your actual logic to fetch the current lucky number
    res.json({ number: currentLuckyNumber }); // Respond with JSON containing the current lucky number
  } catch (error) {
    console.error("Error fetching current lucky number:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch current lucky number", error });
  }
});

///////////////////////////////////////////////////////////////
app.get("/event", async (req, res) => {
 // const eventId = req.params.eventId;
  console.log("Fetching event with ID:"); // Log event ID

  try {
    const event = await Event.find();
    if (!event) {
      console.log("Event not found");
      return res.status(404).json({ message: "Event not found" });
    }
    console.log("Event found:", event); // Log found event
    res.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ message: "Failed to fetch event", error });
  }
});

///////////////////////////////////////////////////////////////
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

async function getEventDetailsFromDatabase(eventId) {
  try {
    const event = await Event.findById(eventId);
    return event;
  } catch (error) {
    throw new Error(`Error fetching event from database: ${error.message}`);
  }
}