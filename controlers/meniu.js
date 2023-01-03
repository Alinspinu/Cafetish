const Produs = require('../models/produs')
const Categorie = require('../models/categorie')
const Cafea = require('../models/cafea')
const { cloudinary } = require('../cloudinary');
const ExpressError = require('../utilities/expressError');
const cafea = require('../models/cafea');
const GiftCard = require('../models/GiftCard');
const user = require('../models/user');
const User = require('../models/user')
const Cart = require('../models/cart')



module.exports.renderMeniu = async (req, res, next) => {
    const cats = await Categorie.find({})
    res.render('meniu/categorie/meniu', { cats })
}



module.exports.renderCatNou = (req, res) => {
    res.render('meniu/categorie/catNou')
}

module.exports.renderCatEdit = async (req, res, next) => {
    const cat = await Categorie.findById(req.params.id)
    res.render('meniu/categorie/editCat', { cat })
}

module.exports.catNou = async (req, res, next) => {
    const catNou = new Categorie(req.body.categorie)
    if (!req.file) {
        return next(new ExpressError('Categoria de produse trebuie să conțină o imagine', 404))
    } else {
        const { path, filename } = req.file;
        catNou.imagine.path = path;
        catNou.imagine.filename = filename;
        await catNou.save()
        req.flash('success', `Felicitări! Tocmai ai creat categoria: ${catNou.nume}`)
    }
    res.redirect('/meniu')
}

module.exports.catEdit = async (req, res, nest) => {
    const { id } = req.params;
    const catNou = await Categorie.findByIdAndUpdate(id, { ...req.body.categorie })
    if (req.file) {
        catNou.imagine.path = req.file.path
        catNou.imagine.filename = req.file.filename
    }
    await catNou.save()
    req.flash(`Ai modificat cu succes categoria ${catNou.name}`)
    res.redirect('/meniu')

}

module.exports.catDelete = async (req, res, next) => {
    const { id } = req.params
    const cat = await Categorie.findOne({ _id: id })
    const { imagine } = cat
    if (imagine.filename) {
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
    req.session.catId = cat.id
    if (cat) {
        return res.render('meniu/produs/produse', { cat })
    } else {
        throw new ExpressError('Categoria de produse nu a fost gasită!', 404)
    }
}

module.exports.renderProdusNou = async (req, res, next) => {
    const cats = await Categorie.find({})
    res.render('meniu/produs/produsNou', { cats })
}

module.exports.renderProdusView = async (req, res, next) => {
    const produs = await Produs.findById(req.params.id)
    res.render('meniu/produs/produsView', { produs })
}



module.exports.renderProdusEdit = async (req, res, next) => {
    const cats = await Categorie.find({})
    const produs = await Produs.findById(req.params.id)
    res.render('meniu/produs/editProdus', { produs, cats })
}


module.exports.produsNou = async (req, res, next) => {
    const cat = await Categorie.findById(req.body.produs.categorie)
    if (!req.file) {
        return next(new ExpressError('Produsul trebuie să conțină o imagine', 404))
    } else {
        const { path, filename } = req.file
        const produsNou = new Produs(req.body.produs);
        produsNou.imagine.path = path;
        produsNou.imagine.filename = filename;
        // const videoUrlBase ="https://www.youtube.com/embed/"
        // const autoplay ="?autoplay=1"
        // const videoId = req.body.produs.video.slice(17)
        // produsNou.video = videoUrlBase.concat(videoId, autoplay)
        cat.produs.push(produsNou);
        await produsNou.save();
        await cat.save();
        req.flash('success', `Felicitări ai adaugat ${produsNou.nume} în meniu`)
        res.redirect('/meniu')
    }
}


module.exports.produsEdit = async (req, res, next) => {
    const { id } = req.params;
    const produs = await Produs.findByIdAndUpdate(id, { ...req.body.produs });
    // if(req.body.produs.video.length < 30){
    //     const videoUrlBase = "https://www.youtube.com/embed/"
    //     const autoplay ="?autoplay=1"
    //     const videoId = req.body.produs.video.slice(17)
    //     produs.video = videoUrlBase.concat(videoId, autoplay)
    // }
    if (req.file) {
        produs.imagine.path = req.file.path
        produs.imagine.filename = req.file.filename
    }
    await produs.save()
    res.redirect(`/meniu/cats/produs/${produs.id}`)
}

module.exports.produsDelete = async (req, res, next) => {
    const { id } = req.params;
    const produs = await Produs.findOne({ _id: id })
    const { imagine } = produs
    if (imagine.filename) {
        await cloudinary.uploader.destroy(imagine.filename)
    }
    await Produs.findByIdAndDelete(id);
    req.flash('success', `Felicitări! Ai șters cu succes produsul: ${produs.nume}`)
    res.redirect('/meniu');
}


module.exports.renderCafea = async (req, res, next) => {
    const cafele = await Cafea.find({});
    const catId = req.session.catId;
    res.render('meniu/cafea/show', { cafele, catId });
}


module.exports.renderCafeaNou = (req, res) => {
    res.render('meniu/cafea/cafeaNou');
}

module.exports.renderCafeaEdit = async (req, res, next) => {
    const cafea = await Cafea.findById(req.params.id);
    res.render('meniu/cafea/cafeaEdit', { cafea });
}

module.exports.cafeaEdit = async (req, res, next) => {
    const { id } = req.params;
    const cafea = await Cafea.findByIdAndUpdate(id, { ...req.body.cafea })
    if (req.files) {
        const imagini = req.files.map(f => ({ path: f.path, filename: f.filename }))
        cafea.imagini.push(...imagini);
    }
    await cafea.save()
    res.redirect('/meniu/cafea')
}

module.exports.cafeaNou = async (req, res, next) => {
    const cafeaNou = new Cafea(req.body.cafea);
    if (!req.files) {
        return next(new ExpressError('Cafeaua trebuie să conțină o imagine', 404))
    } else {
        cafeaNou.imagini = req.files.map(f => ({ path: f.path, filename: f.filename }))
        await cafeaNou.save()
        req.flash('success', `Felicitări! Tocmai ai adăugat: ${cafeaNou.nume}`)
    }
    res.redirect('/meniu/cafea')
}

module.exports.cafeaDelete = async (req, res, next) => {
    const { id } = req.params;
    const cafea = await Cafea.findOne({ _id: id })
    const { imagini } = cafea;
    const nume = imagini.map(f => ({ filename: f.filename }))
    for (let filename of nume) {
        await cloudinary.uploader.destroy(filename.filename)
    }
    await Cafea.findByIdAndDelete(id)
    res.redirect('back')
}

module.exports.giftCard = async (req, res, next) => {
    const giftCard = new GiftCard({
        nume: 'Gift Card',
        pret: 100,
        valoare: 100,
        imagine: 'https://res.cloudinary.com/dhetxk68c/image/upload/v1672427780/ProduseI/Card_Cadou_1_j7gcfe.png'
    })
    const cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.add(giftCard, giftCard._id);
    req.session.cart = cart;
    req.session.giftId = giftCard._id
    res.redirect('back')
}