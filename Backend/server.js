const http = require("http");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const app = require("./app");
const { initSocket } = require("./socket/socket");

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
    credentials: true,
  },
});

initSocket(io);


server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});