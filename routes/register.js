const express = require("express");
const router = express.Router();
const rap = require('../controlers/register')

router.route('/entry')
    .post(rap.addEntry)
    .get(rap.sendEntry)
    .delete(rap.deleteEntry)
router.route('/register').get(rap.renderRegister)

module.exports = router