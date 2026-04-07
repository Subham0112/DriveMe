const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const authMiddleware = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');

// ── AUTH ROUTES ───────────────────────────────────────────────────────────────
router.post('/register', [
  body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters'),
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], userController.registerUser);

router.post('/login', [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], userController.loginUser);

router.get('/logout', userController.logoutUser);

// ── PROTECTED ROUTES (require auth cookie) ────────────────────────────────────
router.get('/profile',    authMiddleware.authUser, userController.getUserProfile);
router.put('/profile',    authMiddleware.authUser, userController.updateUserProfile);
router.put('/change-password', authMiddleware.authUser, userController.changePassword);
router.get('/ride-count', authMiddleware.authUser, userController.getUserRideCount);

module.exports = router;