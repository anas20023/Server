const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const WinnerHistory = require("./models/dbscm.js");
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
const eventSchema = new mongoose.Schema(
  {
    nmbr: {
      type: Number,
      required: true,
    },
    luck: {
      type: Number,
      required: true,
    },
    // other fields
  },
  { collection: "eventnm" }
); // Specify collection name explicitly

const Eventnm = mongoose.model("eventnm", eventSchema);
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json()); // Middleware to parse JSON bodies

// Define a schema and model for the guesses
const guessSchema = new mongoose.Schema({
  number: Number,
  eventNumber: Number,
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
    const numbers = await Guess.find().select("number eventNumber username"); // Fetching both 'number' and 'eventNumber'
    res.json(numbers);
  } catch (error) {
    console.error("Error fetching submission numbers:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch submission numbers", error });
  }
});
// Route to fetch previous submissions
app.get("/previous-submissions", async (req, res) => {
  try {
    const submissions = await Guess.find();
    res.json(submissions);
  } catch (error) {
    console.error("Error fetching previous submissions:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch previous submissions", error });
  }
});
// Route to fetch event details
app.get("/event", async (req, res) => {
  try {
    const event = await Event.find();
    if (!event) {
      console.log("Event not found");
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ message: "Failed to fetch event", error });
  }
});
app.get("/getevntnmr", async (req, res) => {
  try {
    // Find the document with the highest 'nmbr'
    // i need that full object which has that highst num
    const lastEvent = await Eventnm.findOne().sort({ nmbr: -1 });
    if (!lastEvent) {
      return res.status(404).json({ error: "No events found" });
    }
    res.json(lastEvent);
  } catch (error) {
    console.error("Error fetching last event number:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// create a post route for add number in Eventnm
app.post("/addnumber", async (req, res) => {
  try {
    const { nmbr, luck } = req.body;
    const newEvent = new Eventnm({ nmbr, luck });
    await newEvent.save();
    res.json({ message: "Event number added successfully" });
  } catch (error) {
    console.error("Error adding event number:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/add-winner", async (req, res) => {
  try {
    //console.log("Request body:", req.body); // Debugging log to check incoming data
    const newWinner = new WinnerHistory(req.body);
    await newWinner.save();
    res.status(201).json({ message: "Winner added successfully!", newWinner });
  } catch (error) {
    console.error("Error adding winner:", error);
    res.status(500).json({ message: "Failed to add winner", error });
  }
});
app.get("/event/:eventID/submissions", async (req, res) => {
  const { eventID } = req.params;
  try {
    const submissions = await Guess.find({ eventNumber: eventID });

    if (!submissions) {
      return res
        .status(404)
        .json({ error: "No submissions found for this event ID" });
    } else {
      res.json(submissions);
    }
    //console.log(submissions);
  } catch (error) {
    console.error("Error fetching submissions for event:", error);
    res.status(500).json({ error: "Failed to fetch submissions for event" });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
