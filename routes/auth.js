const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');


router.post('/login', authController.loginUser);

router.post('/signup', authController.signUpUser);


module.exports = router;