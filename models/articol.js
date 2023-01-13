const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const articolSchema = new Schema({
    titlu: String,
    text: String,
    imagini:
    [ 
        {
            path: String,
            filename: String
        }
    ]
})

module.exports = mongoose.model('Articol', articolSchema)