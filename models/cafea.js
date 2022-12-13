const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const cafeaSchema = new Schema({
    nume: String,
    descriere: String,
    imagini:
    [ 
        {
            path: String,
            filename: String
        }
    ],
    produs: 
    {
        type: Schema.Types.ObjectId,
        ref: 'produs'
    }
})

module.exports = mongoose.model('Cafea', cafeaSchema)