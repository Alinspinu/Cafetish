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
    .get(catchAsync(comenzi.addToCart))

router.route('/reduce-by-one/:id')
    .get(comenzi.reduceByOne)

router.route('/add-by-one/:id')
    .get(comenzi.addByOne)

router.route('/cart')
    .get(catchAsync(comenzi.cart))

router.route('/create-payment-intent')
    .post(catchAsync(comenzi.createPaymentIntent))

router.route('/success')
    .get(isLoggedIn,comenzi.renderSuccess)


router.route('/:id')
    .delete(isAdmin,catchAsync(comenzi.comandaDelete))


module.exports = router  