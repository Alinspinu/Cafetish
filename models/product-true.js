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
                name: String,
                price: String
            }
        ]

})




module.exports = mongoose.model('ProductTrue', productTrueSchema)