const { boolean } = require('joi');
const mongoose = require('mongoose');
const user = require('./user');
const Schema = mongoose.Schema;

const orederSchema = new Schema ({
    user: 
    {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    date: String,
    time: String,
    cart:
    {
        type: Object,
        required: true
    },
    telefon: 
    {
        type: String,
        required: true,
    },
    comentarii: 
    {
        type: String,
        required: false
    },
    payd: String,
    nume: String,
    timp: Number,
    livrat: String,
 
})

module.exports = mongoose.model('Order', orederSchema)




