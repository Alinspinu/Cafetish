const User = require('../models/user')
const Url = require('../models/url')


module.exports.renderRegister = (req, res) => {
    res.render('user/register')
}

module.exports.registerUser = async(req, res, next) => {
    try{
    // const redirectUrl = await Url.find({})
    // const redirectTo = redirectUrl[0].url
    // const id = redirectUrl[0]._id
    // await Url.findByIdAndDelete(id)
    const {email, username, password, admin = 0, telefon} = req.body;
    const user = new User({email, admin, username, telefon});
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
        if(err) return next(err);
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

module.exports.loginUser = (req, res) => {
    const {username} = req.body
    req.flash('success', `Salut ${username}! Bine ai venit la Cafetish!`)
    const redirectUrl = req.session.returnUrl || '/meniu'
    res.redirect(redirectUrl)
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

module.exports.makeMasterAdmin = async(req, res) => {
    const {email, username, password, admin = 1, telefon} = req.body;
    const user = new User({email, admin, username, telefon});
    const registeredUser = await User.register(user, password);
    res.redirect('/meniu')
}



