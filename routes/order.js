const express = require('express');
const router = express.Router();
const comenzi = require('../controlers/orders')

const {isLoggedIn, isAdmin, validateComanda} = require('../middleware')
const  catchAsync  = require('../utilities/catchasync')

router.route('/')
    .get(isAdmin,catchAsync(comenzi.renderComenzi))
    
router.route('/checkout')
    .get(comenzi.renderCheckoutForm)
    .post(comenzi.checkout)

router.route('/:id')
    .delete(isAdmin,catchAsync(comenzi.comandaDelete))


module.exports = router  