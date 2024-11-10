// routes/accountRoutes.js

const express = require('express');
const router = express.Router();
const { signup,signupHotel,login,getUserData,editProfile } = require('../Controller/AccountController');


// POST route for signup
router.post('/update',editProfile)
router.get('/getUserData', getUserData);
router.post('/signup', signup);
router.post('/login', login);
router.post('/signupH', signupHotel);
module.exports = router;