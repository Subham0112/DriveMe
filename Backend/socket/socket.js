const Captain = require('../models/captain.model');
const User = require('../models/user.model'); // adjust path if needed

let io;

function initSocket(serverIo) {
  io = serverIo;

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);


    /*
    ----------------------------------
    CAPTAIN ONLINE
    ----------------------------------
    */
    socket.on("registerCaptain", async (captainId) => {
      await Captain.findByIdAndUpdate(captainId, {
        socketId: socket.id,
        status: "active"
      });
      console.log("Captain online:", captainId);
    });


    /*
    ----------------------------------
    USER ONLINE
    ----------------------------------
    */
    socket.on("registerUser", async (userId) => {
      await User.findByIdAndUpdate(userId, {
        socketId: socket.id
      });
      console.log("User online:", userId);
    });


    /*
    ----------------------------------
    LIVE LOCATION UPDATE
    ----------------------------------
    */
    socket.on("updateLocation", async (data) => {
      const { captainId, latitude, longitude } = data;

      await Captain.findByIdAndUpdate(captainId, {
        location: { latitude, longitude }
      });

      // send to all users (later we will limit per ride)
      socket.broadcast.emit("captain-location-update", data);
    });


    /*
    ----------------------------------
    DISCONNECT
    ----------------------------------
    */
    socket.on("disconnect", async () => {
      console.log("Socket disconnected:", socket.id);

      await Captain.findOneAndUpdate(
        { socketId: socket.id },
        { status: "inactive", socketId: null }
      );
    });

  });
}

function getIO() {
  return io;
}

module.exports = { initSocket, getIO };