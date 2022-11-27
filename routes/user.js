const express = require('express');
const router = express.Router();
const user = require('../controlers/user')
const passport = require('passport')

const catchAsync = require('../utilities/catchasync')

router.route('/register')
    .get(user.renderRegister)
    .post(catchAsync(user.registerUser))

router.route('/login')
    .get(user.renderLogin)
    .post(passport.authenticate('local',{failureFlash: true, failureRedirect: '/user/login'}), user.loginUser)

router.route('/logout')
    .get(user.logout)

router.route('/register/admin')
    .post(user.makeMasterAdmin)

    
module.exports = router
