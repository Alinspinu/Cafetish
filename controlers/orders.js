const Comanda = require('../models/order')
const Cart = require('../models/cart')
const Produs = require('../models/produs')
const stripe = require('stripe')("sk_test_51M9k8jFFsy1gu6PUWj7pEdeN91IDJ8yIA3nVufeJmKNclRBDvpvaVD2ZMiAQnJrAm7eRQJsdccUL24ZrcWYHceex00yRRO58ZQ")



module.exports.renderComenzi = async (req, res, next) => {
    const comenzi = await Comanda.find({})
    res.render('order/comenzi', {comenzi})
}

module.exports.renderCheckoutForm = (req, res, next) => {
    if(!req.session.cart){
        return res.redirect('/meniu')
    }
    let cart = new Cart(req.session.cart);
    res.render('cart/checkout', {total: cart.totalPrice})
}

module.exports.checkout = async (req, res, next) =>{
    if(!req.session.cart) {
        return res.redirect('/meniu')
    }
    const timp = req.body.comanda.timp
    req.session.timp = timp;
  res.redirect('/order/checkout')
}

module.exports.addToCart = async(req, res, next) => {
    const produsId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart: {});
    const produs = await Produs.findById(produsId)
    cart.add(produs, produs.id)
    req.session.cart = cart;
    res.redirect('back')
}

module.exports.reduceByOne = (req, res, next) =>{
    const produsId = req.params.id;
    const cart = new Cart(req.session.cart);
    cart.reduceByOne(produsId)
    req.session.cart = cart;
    res.redirect('/order/cart') 
}

module.exports.addByOne = (req, res, next)=>{
    const produsId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart: {});
    cart.addByOne(produsId)
    req.session.cart = cart;
    res.redirect('/order/cart')
}

module.exports.cart =  async (req, res, next) => {
    if(!req.session.cart) {
        return res.render('cart/cart', {produse: null})
    }
    // const produse = await Produse.findById({})
    const cart = new Cart(req.session.cart);
    res.render('cart/cart', { produse: cart.generateArray(), cart: cart, totalPrice: cart.totalPrice})
}

module.exports.createPaymentIntent = async (req, res, next) => {
    if(!req.session.cart) {
        return res.render('cart/cart', {produse: null})
    }
    let cart = new Cart(req.session.cart);
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: cart.totalPrice*100,
      currency: "ron",
      automatic_payment_methods: {
        enabled: true,
      }, 
    })
    console.log(req.session)
    res.send({
      clientSecret: paymentIntent.client_secret, 
    });
  }

  module.exports.renderSuccess = (req, res) =>{
    const nume = req.session.cart.nume
    const qty = req.session.cart.qty

    const timp = req.session.timp
    req.session.cart = null
    res.render('partials/success',{timp})
}


module.exports.comandaDelete = async (req, res, next) => {
    const { id } = req.params;
    await Comanda.findByIdAndDelete(id);
    res.redirect('/order')
}

