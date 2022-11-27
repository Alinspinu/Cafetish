const Comanda = require('../models/order')


module.exports.renderComenzi = async (req, res, next) => {
    const comenzi = await Comanda.find({})
    res.render('comanda/comenzi', {comenzi})
}

module.exports.renderComandaForm = (req, res) => {
    res.render('comanda/comanda')
}

module.exports.comandaNou = async (req, res, next) =>{
    const comanda = new Comanda(req.body.comanda)
    await comanda.save()
    req.flash('success', `Comanda ta a fost preluată și va fi gata în, ${req.body.comanda.timp} Minute! Te așteptăm!`)
    res.redirect('/meniu')
}


module.exports.comandaDelete = async (req, res, next) => {
    const { id } = req.params;
    await Comanda.findByIdAndDelete(id);
    res.redirect('/comanda')
}

