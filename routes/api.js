const express = require('express');
const router = express.Router();
const apiRoutes = require('../controlers/api')
const multer = require('multer')
const { storage, storageCategory } = require('../cloudinary/photo-true.js');
const productTrue = require('../models/product-true');
const upload = multer({ storage })
const uploadCategory = multer({ storageCategory })

router.route('/get-cats').get(apiRoutes.sendCats)
router.route('/get-cat').get(apiRoutes.sendCat)

router.route('/cat-add')
    .post(uploadCategory.single('image'), apiRoutes.addCat)
router.route('/prod-add')
    .post(upload.single('image'), apiRoutes.addProd)
// router.route('/new-user').get(apiRoutes.register)
router.route('/login').post(apiRoutes.login)
router.route('/sub-prod-add').post(apiRoutes.saveSubProd)
router.route('/get-token').get(apiRoutes.getToken)
router.route('/save-order').post(apiRoutes.saveOrder)


module.exports = router