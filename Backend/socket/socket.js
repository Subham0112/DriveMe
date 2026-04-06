const Captain = require('../models/captain.model');
const User = require('../models/user.model'); // adjust path if needed
const Ride = require('../models/ride.model'); // adjust path if needed

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
   socket.on('captain-location-update', async ({ captainId, lat, lng }) => {
  try {
    // 1. Persist latest location to DB
    await Captain.findByIdAndUpdate(captainId, {
      location: { latitude: lat, longitude: lng },
    });
 
    // 2. Find the ride that is currently active for this captain
    const ride = await Ride.findOne({
      captain: captainId,
      rideStatus: { $in: ['accepted', 'ongoing'] },
    }).populate('user', 'socketId');
 
    // 3. Forward only to that user's socket — nobody else sees this
    if (ride?.user?.socketId) {
      io.to(ride.user.socketId).emit('captain-location-update', {
        captainId,
        lat,
        lng,
      });
    }
  } catch (err) {
    console.error('captain-location-update socket error:', err);
  }
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