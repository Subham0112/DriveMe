const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const authMiddleware = require('../middleware/auth.middleware');

const captainController = require('../controllers/captain.controller');

router.route("/register").post([
  body('fullname.firstname').isLength({min:3}).withMessage('firstname must be at least 3 characters long'),
  body('email').isEmail().withMessage('email must be valid'),
  body('password').isLength({min:6}).withMessage('password must be at least 6 characters long'),
  // body('phone').isLength({min:10}).withMessage('phone number must be at least 10 characters long'),
  body('vehicle.color').isLength({min:3}).withMessage('color must be at least 3 characters long'),
  body('vehicle.plate').isLength({min:4}).withMessage('plate number must be at least 4 characters long'),
  body('vehicle.capacity').isInt({min:1}).withMessage('capacity must be at least 1 people'),
  body('vehicle.vehicleType').isIn(['car', 'motorcycle', 'scooter', 'auto-rickshaw']).withMessage('vehicle type must be valid'),
],captainController.registerCaptain);

router.route("/login").post([
  body('email').isEmail().withMessage('email must be valid'),
  body('password').isLength({min:6}).withMessage('password must be at least 6 characters long'),
],captainController.loginCaptain);

router.route("/profile").get(authMiddleware.authCaptain,captainController.getCaptainProfile);
router.route("/profile-update").put(authMiddleware.authCaptain,captainController.updateCaptainProfile);
router.route("/vehicle-update").put(authMiddleware.authCaptain,captainController.updateCaptainVehicle);
router.route("/password-update").put(authMiddleware.authCaptain,captainController.changeCaptainPassword);
router.route("/stats").get(authMiddleware.authCaptain,captainController.getCaptainAllStats);
router.route("/logout").get(captainController.logoutCaptain);

module.exports = router;