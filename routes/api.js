const express = require('express');
const router = express.Router();
const apiRoutes = require('../controlers/api')
const multer = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({ storage })

router.route('/get-cats').get(apiRoutes.sendCats)
router.route('/get-cat').get(apiRoutes.sendCat)

router.route('/cat-add')
    .post(upload.single('image'), apiRoutes.addCat)
router.route('/prod-add')
    .post(upload.single('image'), apiRoutes.addProd)

module.exports = router