const express = require('express');
const router = express.Router();

const pos = require('../controlers/pos')

const { isLoggedIn } = require('../middleware')

router.route('/').get(pos.renderPos)

module.exports = router