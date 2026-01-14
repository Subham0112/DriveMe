const express = require('express');
const router = express.Router();
const {body} = require('express-validator');

const authMiddleware = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');

router.route("/register").post([
  body('fullname.firstname').isLength({min:3}).withMessage('firstname must be at least 3 characters long'),
  body('email').isEmail().withMessage('email must be valid'),
  body('password').isLength({min:6}).withMessage('password must be at least 6 characters long'),
],userController.registerUser);

router.route("/login").post([
  body('email').isEmail().withMessage('email must be valid'),
  body('password').isLength({min:6}).withMessage('password must be at least 6 characters long'),
],userController.loginUser);

router.route("/profile").get(authMiddleware.authUser,userController.getUserProfile);

router.route("/logout").get(userController.logoutUser);


module.exports = router;