const express = require('express');
const router = express.Router();
const comenzi = require('../controlers/comenzi')

const {isLoggedIn, isAdmin, validateComanda} = require('../middleware')
const  catchAsync  = require('../utilities/catchasync')

router.route('/')
    .get(isAdmin,catchAsync(comenzi.renderComenzi))
    .post(validateComanda, catchAsync(comenzi.comandaNou))

router.route('/cli')
    .get(comenzi.renderComandaForm)

router.route('/:id')
    .delete(isAdmin,catchAsync(comenzi.comandaDelete))


module.exports = router  