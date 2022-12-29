if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const localStorage = require('localStorage');
const Order = require('../models/order');
const Cart = require('../models/cart');
const User = require('../models/user')
const Produs = require('../models/produs');
const user = require('../models/user');
const stripe = require('stripe')(process.env.STRIPE_SECRET)





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
    const currentDate = new Date().toLocaleDateString(undefined, {
        day:    '2-digit',
        month:  'short',
        year:   'numeric',
    });
    const currentTime = new Date().toLocaleTimeString(undefined,{
        hour:   '2-digit',
        minute: '2-digit',
        second: '2-digit',
    })
    const user = await User.findById(req.user.id)
    let cart = new Cart(req.session.cart);
    console.log(cart)
    const order = new Order({
        user: req.user,
        cart: cart,
        nume: req.user.username,
        telefon: req.user.telefon,
        timp: req.body.timp,
        comentarii: req.body.comentarii,
        date: currentDate,
        time: currentTime,
        livrat: 'Nu'
    })
    req.session.orderId = order.id
    user.order.push(order)
    await order.save()
    await user.save()
  res.redirect('/order/checkout')
}

module.exports.addToCart = async(req, res, next) => {
    const produsId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart: {});
    const produs = await Produs.findById(produsId)
    if(req.body.cafea === 'Danisa  3' || req.body.cafea === 'Tarrazu 4' || req.body.cafea === 'Beshasha2' ){
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
    } else if(req.body.cafea === 'Brazilia0' ){
        const cafeaN = req.body.cafea.slice(0, 8)
        produs.nume = produs.nume+' '+cafeaN,
        cart.add(produs, produs.id)
        req.session.cart = cart;
        res.redirect('back')
    }else {
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

module.exports.conadaLivrat = async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findById(id)
    order.livrat = "Da"
    await order.save()
    console.log(order)
    res.redirect('/order')
}
