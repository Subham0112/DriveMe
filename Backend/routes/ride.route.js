const express = require('express');
const router = express.Router();
const rideController = require('../controllers/ride.controller');

router.post('/create', rideController.createRide);
router.get('/nearby-captains', rideController.getNearbyCaptains);

router.post('/accept', rideController.acceptRide);
router.post('/reject', rideController.rejectRide);

router.post('/start', rideController.startRide);
router.post('/complete', rideController.completeRide);
router.post('/cancel', rideController.cancelRide);

router.post('/update-location', rideController.updateCaptainLocation);
router.get('/:rideId', rideController.getRide);
router.get('/user-history/:userId', rideController.getUserRideHistory);
router.get('/captain-history/:captainId', rideController.getCaptainRideHistory);
router.get('/captain-today-stats/:captainId', rideController.getCaptainTodayStats)
router.post('/complete-cash',  rideController.completeRideCash);
router.post('/esewa-init',     rideController.initEsewaPayment);
router.post('/esewa-verify',   rideController.verifyEsewaPayment);

module.exports = router;