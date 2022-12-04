const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const produs = require('./produs')

const categorieSchema = new Schema ({
    nume: String,
    imagine: 
    {
        path: String,
        filename: String
    },
    produs: 
[
    {
        type: Schema.Types.ObjectId,
        ref: 'Produs'
    },
],
    descriere: String,
})


// categorieSchema.post('findOneAndDelete', async (doc) => {
//     console.log(doc)
    // if(doc){
    //     await produs.deleteMany({
    //         _id:{
    //             $in: doc.produs
    //         }
    //     })
//     // }
// });





module.exports = mongoose.model('Categorie', categorieSchema)