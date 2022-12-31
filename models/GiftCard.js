
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const GiftCardSchema = new Schema ({
    nume: String, 
    valoare: Number,
    pret: Number,
    imagine: String,
    user:
    {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('GiftCard', GiftCardSchema)