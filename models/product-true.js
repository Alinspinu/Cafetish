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



const subProductSchema = new Schema({
    name: String,
    price: String,
    product: {
        type: Schema.Types.ObjectId,
        ref: 'ProductTrue'
    }
})

module.exports = mongoose.model('SubProduct', subProductSchema)
module.exports = mongoose.model('ProductTrue', productTrueSchema)