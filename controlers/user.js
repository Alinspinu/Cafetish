const User = require('../models/user')


module.exports.renderRegister = (req, res) => {
    res.render('user/register')
}

module.exports.registerUser = async(req, res, next) => {
    const {email, username, password, admin = 0} = req.body;
    const user = new User({email, admin, username});
    const registeredUser = await User.register(user, password);
    res.redirect('/meniu')
}

module.exports.renderLogin = (req, res) => {
    res.render('user/login')
}

module.exports.loginUser = (req, res) => {
    const {username} = req.body
    req.flash('success', `Salut ${username}! Bine ai venit la Cafetish!`)
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

module.exports.makeMasterAdmin = async(req, res) => {
    const {email, username, password, admin = 1} = req.body;
    const user = new User({email, admin, username});
    const registeredUser = await User.register(user, password);
    res.redirect('/meniu')
}



