const express = require('express');
const router = express.Router();
const Articol = require('../models/articol')
const multer = require('multer')
const {storage} = require('../cloudinary');
const upload = multer({storage})


router.get('/', (req, res) => {
    res.render('blog/blog')
})

router.get('/articol', (req, res) =>{
    res.render('blog/articolNou')
})

router.post('/articolNou', upload.array('artImg'), async(req, res, next) => {
    const articol = new Articol(req.body.articol)
    if(req.files){
        articol.imagini = req.files.map(f => ({ path: f.path, filename: f.filename }))
        }
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

router.get('/articol/:id/edit', async(req, res, next)=>{
    const { id } = req.params 
    const articol = await Articol.findById(id)
    res.render('blog/articolEdit',{id, articol})
})

router.post('/articol/:id', upload.array('artImg'), async(req, res, next) => {
    const { id } = req.params;
    const articol = await Articol.findByIdAndUpdate(id, { ...req.body.articol })
    if (req.files) {
        const imagini = req.files.map(f => ({ path: f.path, filename: f.filename }))
        // articol.imagini.push(...imagini);
        articol.imagini = imagini
    }
    console.log(articol)
    await articol.save()
    res.redirect('/blog')
})

module.exports = router