const mongoose = require('mongoose');
const user = require('./user');
const Schema = mongoose.Schema;

const orederSchema = new Schema ({
    user: 
    {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    cart:
    {
        type: Object,
        required: true
    },
    nume:
    {
        type: String, 
        requred: true
    },
    adress: 
    {
        type: String,
        required: false
    },
    timp: Number
 
})

module.exports = mongoose.model('Comanda', orederSchema)




