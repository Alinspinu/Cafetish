const localStorage = require('localStorage');
const Order = require('../models/order');
const Cart = require('../models/cart');
const Produs = require('../models/produs');
const user = require('../models/user');
const { findByIdAndUpdate } = require('../models/user');
const stripe = require('stripe')("sk_test_51M9k8jFFsy1gu6PUWj7pEdeN91IDJ8yIA3nVufeJmKNclRBDvpvaVD2ZMiAQnJrAm7eRQJsdccUL24ZrcWYHceex00yRRO58ZQ")



module.exports.renderComenzi = async (req, res, next) => {
    const orders = await Order.find({})
    var cart;
    orders.forEach(order => {
        cart = new Cart(order.cart)
        order.items = cart.generateArray();
   })
    res.render('order/comenzi', {orders})
}

module.exports.renderCheckoutForm = (req, res, next) => {
    if(!req.session.cart) {
        return res.redirect('/meniu')
    }
    let cart = new Cart(req.session.cart);
    res.render('cart/checkout', {total: cart.totalPrice})
}

module.exports.checkout = async (req, res, next) =>{
    if(!req.session.cart) {
        return res.redirect('/meniu')
    }
    console.log(req.session)
    let cart = new Cart(req.session.cart);
    const order = new Order({
        user: req.user,
        cart: cart,
        nume: req.user.username,
        telefon: req.user.telefon,
        timp: req.body.timp,
        comentarii: req.body.comentarii
    })
    req.session.orderId = order.id
    await order.save()
    // console.log(order)

  res.redirect('/order/checkout')
}

module.exports.addToCart = async(req, res, next) => {
    const produsId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart: {});
    const produs = await Produs.findById(produsId)
    if(req.body.cafea){
        const cafeaP = parseFloat(req.body.cafea.slice(8))
        const cafeaN = req.body.cafea.slice(0, 8)
        const produsCafea = new Produs({
            nume: produs.nume+' '+cafeaN,
            pret: produs.pret + cafeaP,
            imagine: produs.imagine,
            cafea: req.body.cafea,
        })
        cart.add(produsCafea, produsCafea.id)
        req.session.cart = cart;
        res.redirect('back');
    } else {
    cart.add(produs, produs.id)
    req.session.cart = cart;
    res.redirect('back');
    }
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
    const cart = new Cart(req.session.cart);
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
  
    res.send({
      clientSecret: paymentIntent.client_secret, 
    });
  }

  module.exports.renderSuccess = async (req, res, next) =>{
    const order = await Order.findById(req.session.orderId)
    order.payd = 'YES'
    await order.save()
    req.session.cart = null
    res.render('partials/success', {order})
}

module.exports.renderSuccesss = async(req, res, next) => {
    const order = await Order.findById(req.session.orderId)
    order.payd = 'NO'
    await order.save()
    req.session.cart = null
    res.render('partials/success', {order})
}

module.exports.comandaDelete = async (req, res, next) => {
    const { id } = req.params;
    await Order.findByIdAndDelete(id);
    res.redirect('/order')
}

