
const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const subProductSchema = new Schema({
    name: String,
    price: Number,
    quantity: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: this.quantity * this.price
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'ProductTrue'
    }
})

module.exports = mongoose.model('SubProduct', subProductSchema)