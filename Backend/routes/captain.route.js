const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const authMiddleware = require('../middleware/auth.middleware');

const captainController = require('../controllers/captain.controller');

router.route("/register").post([
  body('fullname.firstname').isLength({min:3}).withMessage('firstname must be at least 3 characters long'),
  body('email').isEmail().withMessage('email must be valid'),
  body('password').isLength({min:6}).withMessage('password must be at least 6 characters long'),
  body('phone').isLength({min:10}).withMessage('phone number must be at least 10 characters long'),
  body('vehicle.color').isLength({min:3}).withMessage('color must be at least 3 characters long'),
  body('vehicle.plate').isLength({min:4}).withMessage('plate number must be at least 4 characters long'),
  body('vehicle.capacity').isLength({min:1}).withMessage('capacity must be at least 1 people'),
  body('vehicle.vehicleType').isLength({min:1}).withMessage('vehicle type must be at least 1 people'),
],captainController.registerCaptain);

router.route("/login").post([
  body('email').isEmail().withMessage('email must be valid'),
  body('password').isLength({min:6}).withMessage('password must be at least 6 characters long'),
],captainController.loginCaptain);

router.route("/profile").get(authMiddleware.authCaptain,captainController.getCaptainProfile);
router.route("/logout").get(authMiddleware.authCaptain,captainController.logoutCaptain);

module.exports = router;