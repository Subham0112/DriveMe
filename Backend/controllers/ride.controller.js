const crypto = require('crypto');
const Ride = require('../models/ride.model');
const Captain = require('../models/captain.model');
const User = require('../models/user.model');
const { getIO } = require('../socket/socket');

exports.createRide = async (req, res) => {
  try {
    const io = getIO();
    const { userId, captainId, pickup, drop, fare, distance, duration } = req.body;
    if (!userId || !captainId || !pickup || !drop || !fare) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const ride = await Ride.create({
      user: userId,
      pickup: { address: pickup.name || pickup.address, latitude: pickup.lat ?? pickup.latitude, longitude: pickup.lng ?? pickup.longitude },
      drop: { address: drop.name || drop.address, latitude: drop.lat ?? drop.latitude, longitude: drop.lng ?? drop.longitude },
      fare, distance, duration,
    });
    const captain = await Captain.findById(captainId);
    if (captain && captain.socketId) {
      const populatedRide = await Ride.findById(ride._id).populate('user', 'fullname email');
      io.to(captain.socketId).emit('new-ride-request', populatedRide);
    }
    res.status(201).json({ success: true, message: 'Ride request sent', ride });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Ride creation failed' });
  }
};

exports.getNearbyCaptains = async (req, res) => {
  try {
    const captains = await Captain.find({ status: 'active' }).select('-password');
    res.json({ success: true, captains });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching captains' });
  }
};

exports.acceptRide = async (req, res) => {
  try {
    const io = getIO();
    const { rideId, captainId } = req.body;
    const ride = await Ride.findById(rideId).populate('user', 'fullname socketId');
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    if (ride.rideStatus !== 'pending') return res.status(400).json({ message: 'Ride already accepted' });
    ride.captain = captainId;
    ride.rideStatus = 'accepted';
    await ride.save();
    const captain = await Captain.findById(captainId).select('-password');
    if (ride.user && ride.user.socketId) {
      io.to(ride.user.socketId).emit('ride-accepted', { rideId: ride._id, captain });
    }
    res.json({ success: true, message: 'Ride accepted', ride, captain });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error accepting ride' });
  }
};

exports.rejectRide = async (req, res) => {
  try {
    const io = getIO();
    const { rideId } = req.body;
    const ride = await Ride.findById(rideId).populate('user', 'socketId');
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    ride.rideStatus = 'cancelled';
    await ride.save();
    if (ride.user && ride.user.socketId) {
      io.to(ride.user.socketId).emit('ride-rejected', { rideId });
    }
    res.json({ success: true, message: 'Ride rejected' });
  } catch (error) {
    res.status(500).json({ message: 'Reject error' });
  }
};

exports.startRide = async (req, res) => {
  try {
    const io = getIO();
    const { rideId } = req.body;
    const ride = await Ride.findByIdAndUpdate(rideId, { rideStatus: 'ongoing' }, { new: true });
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    io.emit('ride-started', ride);
    res.json({ success: true, ride });
  } catch (error) {
    res.status(500).json({ message: 'Start ride error' });
  }
};

exports.completeRide = async (req, res) => {
  try {
    const io = getIO();
    const { rideId } = req.body;
    const ride = await Ride.findById(rideId).populate('user', 'socketId');
    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    ride.rideStatus = 'completed';
    // If user chose cash, mark it paid now (captain confirmed receipt)
    if (ride.paymentStatus === 'cash_pending') {
      ride.paymentStatus = 'paid';
    }
    await ride.save();

    if (ride.captain) {
      await Captain.findByIdAndUpdate(ride.captain, { $inc: { totalRidesCompleted: 1 } });
    }

    // Broadcast to everyone (captain gets it + any other listeners)
    io.emit('ride-completed', { rideId: ride._id });
    res.json({ success: true, message: 'Ride completed' });
  } catch (error) {
    console.error('completeRide error:', error);
    res.status(500).json({ message: 'Complete ride error' });
  }
};

exports.cancelRide = async (req, res) => {
  try {
    const io = getIO();
    const { rideId } = req.body;
    const ride = await Ride.findById(rideId).populate('user', 'socketId');
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    ride.rideStatus = 'cancelled';
    await ride.save();
    if (ride.user && ride.user.socketId) {
      io.to(ride.user.socketId).emit('ride-cancelled', { rideId });
    }
    res.json({ success: true, message: 'Ride cancelled' });
  } catch (error) {
    res.status(500).json({ message: 'Cancel ride error' });
  }
};

exports.updateCaptainLocation = async (req, res) => {
  try {
    const io = getIO();
    const { captainId, latitude, longitude } = req.body;
    await Captain.findByIdAndUpdate(captainId, { location: { latitude, longitude } });
    io.emit('captain-location-update', { captainId, latitude, longitude });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Location update failed' });
  }
};

exports.getRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId)
      .populate('user', 'fullname email')
      .populate('captain', 'fullname vehicle');
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    res.json({ success: true, ride });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ride' });
  }
};

// NEW: Get today's stats for a captain (total earned + rides completed today)
exports.getCaptainTodayStats = async (req, res) => {
  try {
    const { captainId } = req.params;

    // Build start and end of today in UTC
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const completedRides = await Ride.find({
      captain: captainId,
      rideStatus: 'completed',
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const totalEarned = completedRides.reduce((sum, ride) => sum + (ride.fare || 0), 0);
    const ridesCompleted = completedRides.length;

    res.json({ success: true, totalEarned, ridesCompleted });
  } catch (error) {
    console.error('getCaptainTodayStats error:', error);
    res.status(500).json({ message: 'Error fetching today stats' });
  }
};


// ─── PAYMENT: Cash ────────────────────────────────────────────────────────────
// Called when user selects "Cash in Hand". Marks ride completed + payment paid.
exports.completeRideCash = async (req, res) => {
  try {
    const io = getIO();
    const { rideId } = req.body;
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    ride.rideStatus = 'completed';
    ride.paymentStatus = 'paid';
    await ride.save();

    if (ride.captain) {
      await Captain.findByIdAndUpdate(ride.captain, { $inc: { totalRidesCompleted: 1 } });
    }

    io.emit('ride-completed', { rideId: ride._id });
    res.json({ success: true, message: 'Ride completed with cash payment', ride });
  } catch (error) {
    console.error('completeRideCash error:', error);
    res.status(500).json({ message: 'Complete ride error' });
  }
};

// ─── PAYMENT: eSewa — Step 1: Generate signed form fields ─────────────────────
// exports.initEsewaPayment = async (req, res) => {
//   try {
//     const { rideId, amount } = req.body;
//     if (!rideId || !amount) {
//       return res.status(400).json({ message: 'rideId and amount are required' });
//     }

//     // eSewa sandbox credentials — move to .env in production
//     const ESEWA_PRODUCT_CODE = process.env.ESEWA_PRODUCT_CODE || 'EPAYTEST';
//     const ESEWA_SECRET_KEY   = process.env.ESEWA_SECRET_KEY   || '8gBm/:&EnhH.1/q';
//     const FRONTEND_URL       = process.env.FRONTEND_URL        || 'http://localhost:5173';

//     // Encode rideId inside transaction_uuid so we can recover it on the success page
//     const transactionUuid = `RIDE-${rideId}-${Date.now()}`;
//     const totalAmount     = parseFloat(amount);

//     // eSewa requires the message in exactly this format
//     const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${ESEWA_PRODUCT_CODE}`;
//     const signature = crypto
//       .createHmac('sha256', ESEWA_SECRET_KEY)
//       .update(message)
//       .digest('base64');

//     res.json({
//       success: true,
//       formData: {
//         amount:                  totalAmount,
//         tax_amount:              0,
//         total_amount:            totalAmount,
//         transaction_uuid:        transactionUuid,
//         product_code:            ESEWA_PRODUCT_CODE,
//         product_service_charge:  0,
//         product_delivery_charge: 0,
//         success_url:             `${FRONTEND_URL}/payment/success`,
//         failure_url:             `${FRONTEND_URL}/payment/failure`,
//         signed_field_names:      'total_amount,transaction_uuid,product_code',
//         signature,
//       },
//     });
//   } catch (error) {
//     console.error('initEsewaPayment error:', error);
//     res.status(500).json({ message: 'Could not initiate eSewa payment' });
//   }
// };


// ─── PAYMENT: eSewa — Step 2: Verify & complete ride ──────────────────────────

// exports.verifyEsewaPayment = async (req, res) => {
//   try {
//     const io = getIO();
//     const { encodedData, rideId } = req.body;
//     if (!encodedData || !rideId) {
//       return res.status(400).json({ message: 'encodedData and rideId are required' });
//     }

//     // 1. Decode base64 JSON sent by eSewa
//     let decoded;
//     try {
//       decoded = JSON.parse(Buffer.from(encodedData, 'base64').toString('utf-8'));
//     } catch {
//       return res.status(400).json({ message: 'Invalid payment data encoding' });
//     }

//     const { status, signed_field_names, signature } = decoded;

//     // 2. Verify HMAC signature
//     const ESEWA_PRODUCT_CODE = process.env.ESEWA_PRODUCT_CODE || 'EPAYTEST';
//     const ESEWA_SECRET_KEY   = process.env.ESEWA_SECRET_KEY   || '8gBm/:&EnhH.1/q';

//     const message = signed_field_names
//       .split(',')
//       .map((field) => `${field}=${decoded[field]}`)
//       .join(',');

//     const expectedSig = crypto
//       .createHmac('sha256', ESEWA_SECRET_KEY)
//       .update(message)
//       .digest('base64');

//     if (expectedSig !== signature) {
//       return res.status(400).json({ success: false, message: 'Signature mismatch — payment tampered' });
//     }

//     // 3. Check eSewa status
//     if (status !== 'COMPLETE') {
//       return res.status(400).json({ success: false, message: `Payment status is ${status}` });
//     }

//     // 4. Complete the ride
//     const ride = await Ride.findById(rideId);
//     if (!ride) return res.status(404).json({ message: 'Ride not found' });

//     ride.rideStatus   = 'completed';
//     ride.paymentStatus = 'paid';
//     await ride.save();

//     if (ride.captain) {
//       await Captain.findByIdAndUpdate(ride.captain, { $inc: { totalRidesCompleted: 1 } });
//     }

//     // Notify both user and captain
//     io.emit('ride-completed', { rideId: ride._id });
//     res.json({ success: true, message: 'eSewa payment verified. Ride completed.', ride });
//   } catch (error) {
//     console.error('verifyEsewaPayment error:', error);
//     res.status(500).json({ message: 'Payment verification failed' });
//   }
// };

// ─── Active ride restore: find user's current accepted/ongoing ride ─────────────

exports.getUserActiveRide = async (req, res) => {
  try {
    const { userId } = req.params;
    const ride = await Ride.findOne({
      user: userId,
      rideStatus: { $in: ['accepted', 'ongoing'] },
    })
      .populate('captain', 'fullname vehicle socketId')
      .sort({ createdAt: -1 });

    if (!ride) return res.json({ success: false });
    res.json({ success: true, ride });
  } catch (error) {
    console.error('getUserActiveRide error:', error);
    res.status(500).json({ message: 'Error fetching active ride' });
  }
};

// ─── HISTORY: User ride history ────────────────────────────────────────────────
exports.getUserRideHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const rides = await Ride.find({ user: userId })
      .populate('captain', 'fullname vehicle')
      .sort({ createdAt: -1 });
    res.json({ success: true, rides });
  } catch (error) {
    console.error('getUserRideHistory error:', error);
    res.status(500).json({ message: 'Error fetching ride history' });
  }
};

// ─── HISTORY: Captain ride history ─────────────────────────────────────────────
exports.getCaptainRideHistory = async (req, res) => {
  try {
    const { captainId } = req.params;
    // Support optional date filtering via query params: ?from=ISO&to=ISO
    const { from, to } = req.query;
    const dateFilter = {};
    if (from) dateFilter.$gte = new Date(from);
    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      dateFilter.$lte = toDate;
    }

    const query = {
      captain: captainId,
      rideStatus: { $in: ['completed', 'cancelled'] },
      ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }),
    };

    const rides = await Ride.find(query)
      .populate('user', 'fullname email')
      .sort({ createdAt: -1 });

    // Stats only count completed rides
    const completedRides = rides.filter(r => r.rideStatus === 'completed');
    const totalRides   = completedRides.length;
    const totalEarned  = completedRides.reduce((sum, r) => sum + (r.fare || 0), 0);

    res.json({ success: true, rides, totalRides, totalEarned });
  } catch (error) {
    console.error('getCaptainRideHistory error:', error);
    res.status(500).json({ message: 'Error fetching ride history' });
  }
};

// ─── STATS: Captain all-time completed rides + total earned ────────────────────
exports.getCaptainAllStats = async (req, res) => {
  try {
    const { captainId } = req.params;
    const completedRides = await Ride.find({
      captain: captainId,
      rideStatus: 'completed',
    });
    const totalRides   = completedRides.length;
    const totalEarned  = completedRides.reduce((sum, r) => sum + (r.fare || 0), 0);
    res.json({ success: true, totalRides, totalEarned });
  } catch (error) {
    console.error('getCaptainAllStats error:', error);
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

// ─── PAYMENT: Mark Cash Intent ────────────────────────────────────────────────
// Called when user selects "Cash in Hand" in the payment modal.
// Does NOT complete the ride — just records the payment method.
// Captain must still click "Complete Ride" to finish the ride.
exports.markCashPayment = async (req, res) => {
  try {
    const { rideId } = req.body;
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    ride.paymentStatus = 'cash_pending';
    await ride.save();

    res.json({ success: true, message: 'Cash payment method recorded. Waiting for captain to complete.' });
  } catch (error) {
    console.error('markCashPayment error:', error);
    res.status(500).json({ message: 'Could not mark cash payment' });
  }
};