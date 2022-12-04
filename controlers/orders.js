const Comanda = require('../models/order')
const Cart = require('../models/cart')



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
    let cart = new Cart(req.session.cart);
    stripe.charges.create({
        amount: 400,
        currency: "ron",
        source
    })
}



module.exports.comandaDelete = async (req, res, next) => {
    const { id } = req.params;
    await Comanda.findByIdAndDelete(id);
    res.redirect('/order')
}

