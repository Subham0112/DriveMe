const http = require("http");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const app = require("./app");
const { initSocket } = require("./socket/socket");

// Load env variables
dotenv.config();

// Port
const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // ⚠️ change to frontend URL in production
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Initialize socket logic
initSocket(io);

// MongoDB Connection

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});