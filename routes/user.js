const express = require('express');
const router = express.Router();
const user = require('../controlers/user')
const passport = require('passport')
const localStorage = require("localStorage")

const catchAsync = require('../utilities/catchasync');
const { isLoggedIn } = require('../middleware');

router.route('/login/facebook')
    .get(passport.authenticate('facebook', {scope: ('email, public_profile')}));

router.route('/FbLogin')
    .get(passport.authenticate('facebook', { failureRedirect: '/user/login', failureMessage: true }),
    function(req, res) {
        req.flash('success', `Salut ${req.user.facebookName}! Bine ai venit!`)
        res.redirect('/meniu');
        
    });

router.route('/:id/show')
    .get(isLoggedIn, user.renderShowPage)

router.route('/:id/api')
    .get(isLoggedIn, user.apiShowPage)

router.route('/register')
    .get(user.renderRegister)
    // .post(user.makeMasterAdmin)
    .post(catchAsync(user.registerUser))

router.route('/login')
    .get(user.renderLogin)
    .post(passport.authenticate('local',{failureFlash: true, failureRedirect: '/user/login', keepSessionInfo: true}), user.loginUser)

router.route('/logout')
    .get(user.logout)

// router.route('/register/admin')
//     .post(user.makeMasterAdmin)

    
module.exports = router
