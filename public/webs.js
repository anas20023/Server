const port = window.location.port;
//console.log("Port:", port);
const wsPort = parseInt(port) + 1;
const wsUrl = `ws://${window.location.hostname}:${wsPort}`;

// Create a new WebSocket connection
const socket = new WebSocket(wsUrl);

// Connection opened
socket.addEventListener("open", (event) => {
  console.log("Connected to WebSocket server");
});

// Listen for messages
socket.addEventListener("message", (event) => {
  if (event.data === "reload") {
    console.log("Reload message received");
    window.location.reload();
  }
});

// Connection closed
socket.addEventListener("close", (event) => {
  console.log("WebSocket connection closed");
});

// Connection error
socket.addEventListener("error", (error) => {
  console.error("WebSocket error:", error);
});
