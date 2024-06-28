const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const WinnerHistory = require("./dbscm.js");
// env
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

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json()); // Middleware to parse JSON bodies

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
