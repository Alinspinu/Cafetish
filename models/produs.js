const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const User = require('../models/user')



const produsSchema = new Schema({
    nume: String,
    gramaj: String,
    imagine:
    {
        path: String,
        filename: String
    },
    cafea: String,
    pret: Number,
    descriere: String,
    cod: String,
    categorie:
    {
        type: Schema.Types.ObjectId,
        ref: 'Categorie'
    }

})




module.exports = mongoose.model('Produs', produsSchema)
