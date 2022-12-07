const Produs = require ('../models/produs')
const Categorie = require('../models/categorie')
const Cafea =require('../models/cafea')
const { cloudinary } = require('../cloudinary');
const ExpressError = require('../utilities/expressError');



module.exports.renderMeniu =  async (req, res, next) => {
    const cats = await Categorie.find({})
    res.render('meniu/categorie/meniu', {cats})
}



module.exports.renderCatNou = (req, res) => {
    res.render('meniu/categorie/catNou')
}

module.exports.renderCatEdit =  async(req, res, next) => {
    const cat = await Categorie.findById(req.params.id)
    res.render('meniu/categorie/editCat',{cat})
}

module.exports.catNou = async(req, res, next) => {
    const catNou = new Categorie(req.body.categorie)
    if(!req.file) {
       return next(new ExpressError('Categoria de produse trebuie să conțină o imagine', 404))
    } else {
        const {path, filename} = req.file;
        catNou.imagine.path = path;
        catNou.imagine.filename = filename;
        await catNou.save()
        req.flash('success', `Felicitări! Tocmai ai creat categoria: ${catNou.nume}`)
    }
res.redirect('/meniu')
}

module.exports.catEdit = async (req, res, nest) => {
    const { id } = req.params;
    const catNou = await Categorie.findByIdAndUpdate(id, {...req.body.categorie})
    if(req.file){
        catNou.imagine.path = req.file.path
        catNou.imagine.filename = req.file.filename
        }
    await catNou.save()
    console.log(catNou)
    req.flash(`Ai modificat cu succes categoria ${catNou.name}`)
    res.redirect('/meniu')

}

module.exports.catDelete = async (req, res, next) => {
    const {id} = req.params
    const cat = await Categorie.findOne({_id: id})
    const {imagine} = cat
    if(imagine.filename){
    await cloudinary.uploader.destroy(imagine.filename)
    }
    await Categorie.findByIdAndDelete(id)
    req.flash('success', `Felicitări! Ai șters cu succes categoria: ${cat.nume}`)
    res.redirect('/meniu');
}



module.exports.renderProduse = async (req, res, next) => {
    const cat = await Categorie.findById(req.params.id).populate({
        path: 'produs'
    })
    if(cat){
        return res.render('meniu/produs/produse', {cat})
    } else {
        throw new ExpressError('Categoria de produse nu a fost gasită!', 404)
    }
}

module.exports.renderProdusNou = async (req, res, next) => {
    const cats = await Categorie.find({})
    res.render('meniu/produs/produsNou', {cats})
}

module.exports.renderProdusView =  async (req, res, next) => {
    const produs = await Produs.findById(req.params.id)
    res.render('meniu/produs/produsView',{produs})
}



module.exports.renderProdusEdit =  async(req, res, next) => {
    const cats = await Categorie.find({})
    const produs = await Produs.findById(req.params.id)
    res.render('meniu/produs/editProdus',{produs, cats})
}


module.exports.produsNou = async(req, res, next) => {
    const cat = await Categorie.findById(req.body.produs.categorie) 
    if(!req.file){
        return next(new ExpressError('Produsul trebuie să conțină o imagine', 404))
    } else {
    const{ path, filename } = req.file
    const produsNou = new Produs(req.body.produs);
    produsNou.imagine.path = path;
    produsNou.imagine.filename = filename;
    const videoUrlBase ="https://www.youtube.com/embed/"
    const autoplay ="?autoplay=1"
    const videoId = req.body.produs.video.slice(17)
    produsNou.video = videoUrlBase.concat(videoId, autoplay)
    cat.produs.push(produsNou);
    await produsNou.save();
    await cat.save();
    req.flash('success', `Felicitări ai adaugat ${produsNou.nume} în meniu`) 
    res.redirect('/meniu')
    }
}


module.exports.produsEdit =async(req, res, next) => {
    const {id} = req.params;
    const produs = await Produs.findByIdAndUpdate(id, {...req.body.produs});
    console.log(req.body)
    if(req.body.produs.video.length < 30){
        const videoUrlBase = "https://www.youtube.com/embed/"
        const autoplay ="?autoplay=1"
        const videoId = req.body.produs.video.slice(17)
        produs.video = videoUrlBase.concat(videoId, autoplay)
    }
    if(req.file){
    produs.imagine.path = req.file.path
    produs.imagine.filename = req.file.filename
    }
    await produs.save()
    console.log(produs)
    res.redirect(`/meniu/cats/produs/${produs.id}`)
}

module.exports.produsDelete = async(req, res, next) => {
    const {id} = req.params;
    const produs = await Produs.findOne({_id: id})
    const {imagine} = produs
    if(imagine.filename){
    await cloudinary.uploader.destroy(imagine.filename)
    }
    await Produs.findByIdAndDelete(id); 
    req.flash('success', `Felicitări! Ai șters cu succes produsul: ${produs.nume}`)
    res.redirect('/meniu');
}

module.exports.renderCafeaNou = (req, res) => {
    res.render('meniu/cafea/cafeaNou')
}

// module.exports.renderCafeaEdit = async(req, res, next) => {

// }

module.exports.cafeaNou = async(req, res, next) => {
    const cafeaNou = new Cafea(req.body.cafea);
    if(req.file) {
        return next(new ExpressError('Cafeaua trebuie să conțină o imagine', 404))
     } else {
    cafeaNou.imagine.path = req.file.path
    cafeaNou.imagine.filename = req.file.filename;
    console.log(cafeaNou)
    await cafeaNou.save()
    req.flash('success', `Felicitări! Tocmai ai adăugat: ${cafeaNou.nume}`)
    }
    res.redirect('/meniu/cafea')
}
