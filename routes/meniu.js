const express = require('express');
const router = express.Router();
const multer = require('multer')
const {storage} = require('../cloudinary');
const upload = multer({storage})

const ExpressError = require('../utilities/expressError');
const { produsSchema } = require('../schema.js');

const meniu = require('../controlers/meniu')
const Produs = require('../models/produs');

const { isLoggedIn, isAdmin, validateCat, validateProdus, validateCafea} = require('../middleware')
const catchAsync = require('../utilities/catchasync')


router.route('/')
    .get(catchAsync(meniu.renderMeniu))

router.route('/giftCard')
    .post(isLoggedIn, catchAsync(meniu.giftCard))

router.route('/cafea')
    .get(meniu.renderCafea)


router.route('/cafea-nou')
    .get(isAdmin, meniu.renderCafeaNou)
    .post(isAdmin, upload.array('cafImg'), validateCafea, catchAsync(meniu.cafeaNou))


router.route('/cats')
    .get(meniu.renderCatNou)
    .post( upload.single('catImg'), validateCat, catchAsync(meniu.catNou))
    

router.route('/cat/:id')
    .get(catchAsync(meniu.renderProduse))
    .put(isAdmin, upload.single('catImg'), validateCat, catchAsync(meniu.catEdit))
    .delete(isAdmin,catchAsync(meniu.catDelete))

router.route('/cats/produs/nou')
    .get(catchAsync(meniu.renderProdusNou))
    .post( upload.single('imagine'), validateProdus, catchAsync((meniu.produsNou)))

router.route('/cats/produs/:id')
    .get(catchAsync(meniu.renderProdusView))
    .put(isAdmin, upload.single('imagine'), validateProdus, catchAsync(meniu.produsEdit))
    .delete(isAdmin, catchAsync(meniu.produsDelete))

router.route('/cafea/:id')
    .put(isAdmin, upload.array('cafImg'), validateCafea, catchAsync(meniu.cafeaEdit))
    .delete(isAdmin, catchAsync(meniu.cafeaDelete))


router.route('/cats/produs/:id/edit')
    .get(isAdmin,catchAsync(meniu.renderProdusEdit))

router.route('/cats/:id/edit')
    .get(isAdmin, catchAsync(meniu.renderCatEdit))

router.route('/cafea/:id/edit')
    .get(isAdmin, catchAsync(meniu.renderCafeaEdit))


module.exports = router    