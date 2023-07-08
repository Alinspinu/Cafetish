const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const categoryTrueSchema = new Schema({
    name: String,
    image:
    {
        path: String,
        filename: String
    },
    mainCat: {
        type: String,
        required: true
    },
    product:
        [
            {
                type: Schema.Types.ObjectId,
                ref: 'ProductTrue'
            },
        ],
})

module.exports = mongoose.model('CategoryTrue', categoryTrueSchema)