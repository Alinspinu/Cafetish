const express = require('express');
const router = express.Router();
const apiRoutes = require('../controlers/api')
const multer = require('multer')
const { storage } = require('../cloudinary/photo-true.js');
const upload = multer({ storage })

router.route('/get-cats').get(apiRoutes.sendCats)
router.route('/get-cat').get(apiRoutes.sendCat)

router.route('/cat-add')
    .post(upload.single('image'), apiRoutes.addCat)
router.route('/prod-add')
    .post(upload.single('image'), apiRoutes.addProd)
// router.route('/new-user').get(apiRoutes.register)
router.route('/login').post(apiRoutes.login)
router.route('/sub-prod-add').post(apiRoutes.saveSubProd)


module.exports = router