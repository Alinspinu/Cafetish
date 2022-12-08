const express = require('express');
const router = express.Router();
const comenzi = require('../controlers/orders')

const {isLoggedIn, isAdmin, validateComanda} = require('../middleware')
const  catchAsync  = require('../utilities/catchasync')

router.route('/')
    .get(isAdmin,catchAsync(comenzi.renderComenzi))
    
router.route('/checkout')
    .get(isLoggedIn, comenzi.renderCheckoutForm)
    .post(isLoggedIn, catchAsync(comenzi.checkout))

router.route('/add-to-cart/:id')
    .post(catchAsync(comenzi.addToCart))

router.route('/reduce-by-one/:id')
    .post(comenzi.reduceByOne)

router.route('/add-by-one/:id')
    .post(comenzi.addByOne)

router.route('/cart')
    .get(catchAsync(comenzi.cart))

router.route('/create-payment-intent')
    .post(catchAsync(comenzi.createPaymentIntent))

router.route('/success')
    .get(isLoggedIn,catchAsync(comenzi.renderSuccess))

router.route('/successs')
    .get(isLoggedIn,catchAsync(comenzi.renderSuccesss))


router.route('/:id')
    .delete(isAdmin,catchAsync(comenzi.comandaDelete))


module.exports = router  