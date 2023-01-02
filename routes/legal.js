const express = require('express');
const router = express.Router();

router.get('/termeni', (req, res) => {
        res.render('legal/termeni')
    })
router.get('/cookie', (req, res) =>{
        res.render('legal/cookie')
    })
router.get('/gdpr', (req, res) =>{
        res.render('legal/gdpr')
    })

module.exports = router