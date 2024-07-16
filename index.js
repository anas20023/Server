const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const WinnerHistory = require("./models/dbscm.js");
const CountdownState = require("./models/countdown.js");
require("dotenv").config();
const axios = require("axios");
const WebSocket = require(`ws`);
const PORT = process.env.PORT || 5000;
const wss = new WebSocket.Server({ port: parseInt(PORT) + 1 });
// Load environment variables
const url = process.env.SITE;

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
async function pingWebsite() {
  try {
    const response = await axios.get(url);
    console.log(`Status Code: ${response.status}`);
    //console.log(`Body: ${response.data}`);
  } catch (error) {
    console.log(`Got error: ${error}`);
  }
}
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
    const numbers = await Guess.find().select("number eventNumber username");
    res.json(numbers);
  } catch (error) {
    console.error("Error fetching submission numbers:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch submission numbers", error });
  }
});
app.get("/winnerlist", async (req, res) => {
  try {
    const numbers = await Guess.find().select("number eventNumber username");
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

// Route to fetch the event number
app.get("/getevntnmr", async (req, res) => {
  try {
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

// Create a post route to add number in Eventnm
app.post("/addnumber", async (req, res) => {
  try {
    const { nmbr, luck } = req.body;
    const newEvent = new Eventnm({
      nmbr,
      luck,
      endTime: new Date(Date.now() + 300000),
    }); // Set endTime to 5 minutes from now
    await newEvent.save();
    res.json({ message: "Event number added successfully" });
  } catch (error) {
    console.error("Error adding event number:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add a winner to the database
app.post("/add-winner", async (req, res) => {
  try {
    const newWinner = new WinnerHistory(req.body);
    await newWinner.save();
    res.status(201).json({ message: "Winner added successfully!", newWinner });
  } catch (error) {
    console.error("Error adding winner:", error);
    res.status(500).json({ message: "Failed to add winner", error });
  }
});

// Route to fetch submissions for a specific event
app.get("/event/:eventID/submissions", async (req, res) => {
  const { eventID } = req.params;
  try {
    const submissions = await Guess.find({ eventNumber: eventID });
    if (!submissions) {
      return res
        .status(404)
        .json({ error: "No submissions found for this event ID" });
    }
    res.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions for event:", error);
    res.status(500).json({ error: "Failed to fetch submissions for event" });
  }
});
// route for finding total winners and prize
app.get("/:eventID/winners", async (req, res) => {
  const { eventID } = req.params;
  //console.log(eventID);
  try {
    const submissions = await WinnerHistory.find({ evnt: eventID });
    if (!submissions) {
      return res
        .status(404)
        .json({ error: "No submissions found for this event ID" });
    }
    res.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions for event:", error);
    res.status(500).json({ error: "Failed to fetch submissions for event" });
  }
});
app.get("/event/:eventID/submissions/:winningNumber", async (req, res) => {
  const { eventID, winningNumber } = req.params;
  try {
    const winningNumberInt = parseInt(winningNumber, 10);
    const lastDigit = winningNumberInt % 10;
    const lastTwoDigits = winningNumberInt % 100;

    const submissions = await WinnerHistory.find({
      evnt: eventID,
      $or: [
        { number: winningNumberInt },
        { number: { $mod: [10, lastDigit] } },
        { number: { $mod: [100, lastTwoDigits] } },
      ],
    });

    if (!submissions || submissions.length === 0) {
      return res.status(404).json({
        error: "No submissions found for this event ID and winning number",
      });
    }

    res.json(submissions);
    //console.log(submissions);
  } catch (error) {
    console.error("Error fetching submissions for event:", error);
    res.status(500).json({ error: "Failed to fetch submissions for event" });
  }
});


// Route to fetch remaining time
app.get("/api/remaining-time", async (req, res) => {
  try {
    const lastEvent = await CountdownState.findOne().sort({ nmbr: -1 });
    if (!lastEvent) {
      return res.status(404).json({ error: "No events found" });
    }
    const remainingTime = Math.max(
      0,
      Math.floor((new Date(lastEvent.endTime) - Date.now()) / 1000)
    );
    res.json({ remainingTime });
    pingWebsite();
  } catch (error) {
    console.error("Error fetching remaining time:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to reset the timer
app.post("/api/reset-timer", async (req, res) => {
  try {
    const lastEvent = await CountdownState.findOne().sort({ nmbr: -1 });
    if (!lastEvent) {
      return res.status(404).json({ error: "No events found" });
    }
    lastEvent.endTime = new Date(Date.now() + 300000); // Reset to 5 minutes from now
    await lastEvent.save();
    res.json({
      success: true,
      //luckyNum: Math.floor(100 + Math.random() * 900),
      luckyNum: 555,
    }); // Return a new lucky number
    pingWebsite();
  } catch (error) {
    console.error("Error resetting timer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/getevntnmr", async (req, res) => {
  try {
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
// get last lucky num
app.get("/lucky", async (req, res) => {
  try {
    const lastEvent = await Eventnm.find();
    if (!lastEvent) {
      return res.status(404).json({ error: "No events found" });
    }
    res.json(lastEvent);
  } catch (error) {
    console.error("Error fetching last event number:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// websocket
function broadcastReload() {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send("reload");
    }
  });
}

function checkAndReload() {
  if (wss.clients.size === 0) {
    // wss.clients is a Set, so we use size to get the number of clients
    console.log("No clients connected. Reloading after 5 minutes...");
    setTimeout(() => {
      console.log("Reloading now...");
      broadcastReload();
    }, 300000 / 2); // 300000 milliseconds = 5 minutes
  }
}
// Route to check if a guess already exists
app.post("/check-existing", async (req, res) => {
  try {
    const { username, brand, eventNumber } = req.body;

    const guess = await Guess.findOne({ username, brand, eventNumber });
    //console.log("Query result:", guess);
    res.json({ exists: !!guess });
  } catch (err) {
    console.error("Error querying database:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
wss.on("connection", (ws) => {
  console.log("Client connected");
});
setInterval(checkAndReload, 40000);
