
const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const subProductSchema = new Schema({
    name: String,
    price: String,
    product: {
        type: Schema.Types.ObjectId,
        ref: 'ProductTrue'
    }
})

module.exports = mongoose.model('SubProduct', subProductSchema)