const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const authMiddleware = require('../middleware/auth.middleware');
const captainController = require('../controllers/captain.controller');

// ── PUBLIC ROUTES ─────────────────────────────────────────────────
router.post('/register', [
  body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters'),
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('vehicle.color').notEmpty().withMessage('Vehicle color is required'),
  body('vehicle.plate').isLength({ min: 4 }).withMessage('Plate must be at least 4 characters'),
  body('vehicle.capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  body('vehicle.vehicleType').isIn(['car', 'motorcycle', 'scooter', 'auto-rickshaw']).withMessage('Invalid vehicle type'),
], captainController.registerCaptain);

router.post('/login', [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], captainController.loginCaptain);

router.get('/logout', authMiddleware.authCaptain, captainController.logoutCaptain);

// ── PROTECTED ROUTES ──────────────────────────────────────────────
router.get('/profile',          authMiddleware.authCaptain, captainController.getCaptainProfile);
router.put('/profile-update',   authMiddleware.authCaptain, captainController.updateCaptainProfile);
router.put('/vehicle-update',   authMiddleware.authCaptain, captainController.updateCaptainVehicle);
router.put('/password-update',  authMiddleware.authCaptain, captainController.changeCaptainPassword);
router.put('/status',           authMiddleware.authCaptain, captainController.updateCaptainStatus);

module.exports = router;