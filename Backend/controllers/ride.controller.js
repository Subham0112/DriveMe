const Ride = require('../models/ride.model');
const Captain = require('../models/captain.model');
const { getIO } = require('../socket/socket');


/*
--------------------------------------------------
1. CREATE RIDE (User Books Ride)
--------------------------------------------------
*/
exports.createRide = async (req, res) => {
  try {
    const io = getIO();

    const {
      userId,
      pickup,
      drop,
      fare,
      distance,
      duration
    } = req.body;

    if (!userId || !pickup || !drop || !fare) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    const ride = await Ride.create({
      user: userId,
      pickup,
      drop,
      fare,
      distance,
      duration
    });

    // find active captains with socket connected
    const captains = await Captain.find({
      status: "active",
      socketId: { $ne: null }
    });

    // send ride request to captains
    captains.forEach(captain => {
      io.to(captain.socketId).emit("new-ride-request", ride);
    });

    res.status(201).json({
      success: true,
      message: "Ride created",
      ride
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Ride creation failed"
    });
  }
};



/*
--------------------------------------------------
2. GET NEARBY CAPTAINS (basic version)
Later you will replace with geo query
--------------------------------------------------
*/
exports.getNearbyCaptains = async (req, res) => {
  try {

    const captains = await Captain.find({
      status: "active"
    }).select('-password');

    res.json({
      success: true,
      captains
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching captains"
    });
  }
};



/*
--------------------------------------------------
3. CAPTAIN ACCEPT RIDE
--------------------------------------------------
*/
exports.acceptRide = async (req, res) => {
  try {
    const io = getIO();

    const { rideId, captainId } = req.body;

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({
        message: "Ride not found"
      });
    }

    if (ride.rideStatus !== "pending") {
      return res.status(400).json({
        message: "Ride already accepted"
      });
    }

    ride.captain = captainId;
    ride.rideStatus = "accepted";
    await ride.save();

    // get captain socket
    const captain = await Captain.findById(captainId);

    // notify user (later you should store user socketId)
    io.emit("ride-accepted", {
      rideId: ride._id,
      captain
    });

    res.json({
      success: true,
      message: "Ride accepted",
      ride
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error accepting ride"
    });
  }
};



/*
--------------------------------------------------
4. CAPTAIN REJECT RIDE
--------------------------------------------------
*/
exports.rejectRide = async (req, res) => {
  try {

    const { rideId } = req.body;

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({
        message: "Ride not found"
      });
    }

    res.json({
      success: true,
      message: "Ride rejected"
    });

  } catch (error) {
    res.status(500).json({
      message: "Reject error"
    });
  }
};



/*
--------------------------------------------------
5. START RIDE
--------------------------------------------------
*/
exports.startRide = async (req, res) => {
  try {
    const io = getIO();

    const { rideId } = req.body;

    const ride = await Ride.findByIdAndUpdate(
      rideId,
      { rideStatus: "ongoing" },
      { new: true }
    );

    if (!ride) {
      return res.status(404).json({
        message: "Ride not found"
      });
    }

    io.emit("ride-started", ride);

    res.json({
      success: true,
      ride
    });

  } catch (error) {
    res.status(500).json({
      message: "Start ride error"
    });
  }
};



/*
--------------------------------------------------
6. COMPLETE RIDE
--------------------------------------------------
*/
exports.completeRide = async (req, res) => {
  try {
    const io = getIO();

    const { rideId } = req.body;

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({
        message: "Ride not found"
      });
    }

    ride.rideStatus = "completed";
    await ride.save();

    if (ride.captain) {
      await Captain.findByIdAndUpdate(
        ride.captain,
        { $inc: { totalRidesCompleted: 1 } }
      );
    }

    io.emit("ride-completed", ride);

    res.json({
      success: true,
      message: "Ride completed"
    });

  } catch (error) {
    res.status(500).json({
      message: "Complete ride error"
    });
  }
};



/*
--------------------------------------------------
7. UPDATE CAPTAIN LIVE LOCATION
--------------------------------------------------
*/
exports.updateCaptainLocation = async (req, res) => {
  try {
    const io = getIO();

    const { captainId, latitude, longitude } = req.body;

    await Captain.findByIdAndUpdate(
      captainId,
      {
        location: {
          latitude,
          longitude
        }
      }
    );

    io.emit("captain-location-update", {
      captainId,
      latitude,
      longitude
    });

    res.json({
      success: true
    });

  } catch (error) {
    res.status(500).json({
      message: "Location update failed"
    });
  }
};