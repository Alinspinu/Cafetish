const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const orederSchema = new Schema ({
    nume: String,
    email: String,
    telefon: String,
    comanda: String,
    timp: Number
})

module.exports = mongoose.model('Comanda', orederSchema)




