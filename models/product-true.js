const { number } = require('joi');
const mongoose = require('mongoose')
const Schema = mongoose.Schema;




const productTrueSchema = new Schema({
    name: String,
    image:
    {
        path: String,
        filename: String
    },
    price: Number,
    description: String,
    qty: {
        type: String,
    },
    quantity: {
        type: Number,
        default: 0
    },
    available: {
        type: Boolean,
        default: true
    },
    total: {
        type: Number,

    },
    category:
    {
        type: Schema.Types.ObjectId,
        ref: 'CategoryTrue'
    },
    subProducts:
        [
            {
                type: Schema.Types.ObjectId,
                ref: 'SubProduct'
            }
        ]

})


module.exports = mongoose.model('ProductTrue', productTrueSchema)