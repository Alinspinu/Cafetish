const express = require('express');
const router = express.Router();
const Articol = require('../models/articol')



router.get('/', (req, res) => {
    res.render('blog/blog')
})

router.get('/articol', (req, res) =>{
    res.render('blog/articolNou')
})

router.post('/articolNou', async(req, res, next) => {
    const articol = new Articol(req.body.articol)
    await articol.save()
    res.redirect('back')
})

router.get('/apiArt', async(req, res, next) => {
    const articole = await Articol.find({});
    res.json(articole)
})

router.get('/mob', (req, res) => {
    res.render('blog/mob')
})

module.exports = router