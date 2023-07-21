const localStorage = require('localStorage')
const Produs = require('./models/produs');
const Categorie = require('./models/categorie');
const Conamda = require('./models/order')
const Cafea = require('./models/cafea')
const { produsSchema, catSchema, comandaSchema, cafeaSchema } = require('./schema.js')
const ExpressError = require('./utilities/expressError')




module.exports.isLoggedIn = async (req, res, next) => {
    if (!req.isAuthenticated()) {
        localStorage.setItem('url', req.originalUrl)
        if (req.session.cart) {
            localStorage.setItem('cart', JSON.stringify(req.session.cart))
        }
        req.flash('error', 'Trebuie sa fii în gașcă')
        return res.redirect('/user/login');
    }
    next();
}


module.exports.validateProdus = (req, res, next) => {
    const { error } = produsSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

module.exports.validateCafea = (req, res, next) => {
    const { error } = cafeaSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


module.exports.validateComanda = (req, res, next) => {
    const { error } = comandaSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

module.exports.validateCat = (req, res, next) => {
    const { error } = catSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

module.exports.isAdmin = (req, res, next) => {
    if (!req.user || req.user.admin === 0) {
        req.flash('error', 'Acțiune neautorizată! Trebuie să fii admin!')
        return res.redirect('/')
    }
    next()
}

















// VECHIUL ADMIN :)
// module.exports.isAdmin = (req, res, next) => {
//     if(!req.session.admin_id) {
//         req.flash('error', 'Not Today')
//         return res.redirect('/meniu')
//     }
//     next()
// } 