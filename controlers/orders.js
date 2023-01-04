if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const localStorage = require('localStorage');
const Order = require('../models/order');
const Cart = require('../models/cart');
const User = require('../models/user')
const Produs = require('../models/produs');
const user = require('../models/user');
const GiftCard = require('../models/GiftCard')
const stripe = require('stripe')(process.env.STRIPE_SECRET)
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'cafetish.office@gmail.com',
      pass: process.env.PAROLA_G_AP
    }
  });





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
if(req.body.voucher){
    try{
        const card = await GiftCard.findOne({_id: req.body.voucher})
        req.session.val = card.valoare
        } catch (e){
        req.flash('error', 'Cod Invalid')
        res.redirect('back')
        }
    }
    

    const user = await User.findById(req.user._id)
    let cart = new Cart(req.session.cart);
    if(req.session.val) {
        cart.totalPrice = cart.totalPrice - req.session.val
        req.session.val = null
        if(cart.totalPrice < 0){
            req.session.difCard = cart.totalPrice * -1
            cart.totalPrice = 0
            const card = await GiftCard.findOne({_id: req.body.voucher})
            card.valoare = req.session.difCard
            await card.save()
            req.flash('success', `Mai ai ${req.session.difCard} Lei pe cardul cadou`)
        } else {
            await GiftCard.findByIdAndDelete(req.body.voucher)
            req.flash('success', 'Cardul cadou a fost golit cu succes')
        }
        req.session.cart = cart
    }
    const order = new Order({
        user: req.user,
        cart: cart,
        nume: req.user.username || req.user.facebookName,
        telefon: req.body.telefon,
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
    if(order.cart.totalPrice === 0) {
        res.redirect('/order/success')
    } else {
        res.redirect('/order/checkout')
    }
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
    } else {
    cart.add(produs, produs.id)
    req.session.cart = cart;
    res.redirect('back')
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
    if(req.session.giftId){
    const giftCard = new GiftCard({
        nume: 'Gift Card',
        pret: 100,
        valoare: 100,
        imagine: 'https://res.cloudinary.com/dhetxk68c/image/upload/v1672427780/ProduseI/Card_Cadou_1_j7gcfe.png'
    })
    const user = await User.findById(req.user._id)
    user.giftCard.push(giftCard)
    giftCard.save();
    user.save();
  }
    order.payd = 'YES'
    const url = 'https://cafetish.com/order'
    const mailOptions = {
        from: 'cafetish.office@gmail.com',
        to: 'alinz.spinu@gmail.com',
        subject: 'Comanda noua',
        text: `Ai primit o comandă de la ${order.nume}, la ora ${order.time}, în data de ${order.date}, în valoare de ${order.cart.totalPrice} LEi ce a fost plătită. Intră să vizualizezi comanda pe ${url}`
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    await order.save()
    req.session.giftId = null
    req.session.cart = null
    res.render('partials/success', {order})
}

module.exports.renderSuccesss = async(req, res, next) => {
    const order = await Order.findById(req.session.orderId)
    order.payd = 'NO'
    const url = 'https://cafetish.com/order'
    const mailOptions = {
        from: 'cafetish.office@gmail.com',
        to: 'alinz.spinu@gmail.com',
        subject: 'Comanda noua',
        text: `Ai primit o comandă de la ${order.nume}, la ora ${order.time}, în data de ${order.date}, în valoare de ${order.cart.totalPrice} LEi ce urmează a fi plătită. Intră să vizualizezi comanda pe ${url}`
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
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
    res.redirect('/order')
}
