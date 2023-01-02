const User = require('../models/user')
const localStorage = require("localStorage")
const Cart = require('../models/cart');
const Order = require('../models/order');


module.exports.renderRegister = (req, res) => {
    res.render('user/register')
}

module.exports.registerUser = async(req, res, next) => {
    try{
    const {email, username, password, admin = 0, telefon} = req.body;
    const user = new User({email, admin, username, telefon});
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
        if(err) return next(err);
        
    if(localStorage.getItem('cart')){
    const cart = JSON.parse(localStorage.getItem('cart'));
    req.session.cart = cart;
    localStorage.removeItem('cart');
    }
    req.flash('success', `Bine ai venit gașcă ${user.username}!`)
    res.redirect('/meniu')
    })
}catch(e){
    req.flash('error', e.message)
    res.redirect('/user/register')
}
    
}

module.exports.renderLogin = (req, res) => {
    res.render('user/login')
}

module.exports.loginUser = (req, res, next) => {
    const {username} = req.body
    if(localStorage.getItem('cart')){
    const cart = JSON.parse(localStorage.getItem('cart'));
    req.session.cart = cart;
    localStorage.removeItem('cart');
    }
    req.session.userId = req.user._id
    req.flash('success', `Salut ${username}! Bine ai revenit!`);
    res.redirect('/meniu')
}

module.exports.logout = (req, res, next) => {
    req.logout(function(err){
        if(err) {
            return next()
        }
    req.flash('success', `Te-ai delogat cu succes! La revedere!`)
    res.redirect('/');
    })

}

module.exports.renderShowPage = async(req, res, next) => {
    const user = await User.findOne({_id: req.params.id}).populate({
        path:'order'
    })
    const orders = user.order
    res.render('user/show', {orders, user})

}

module.exports.apiShowPage = async(req, res, next) => {
    const user = await User.findOne({_id: req.params.id}).populate({
        path:'order giftCard'
        })
    const orders = user.order
    const giftCard = user.giftCard
 
    res.json({orders, giftCard})
}

module.exports.makeMasterAdmin = async(req, res) => {
    const {email, username, password, admin = 1, telefon} = req.body;
    const user = new User({email, admin, username, telefon});
    const registeredUser = await User.register(user, password);
    res.redirect('/meniu')
}

