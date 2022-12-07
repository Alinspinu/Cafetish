const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    telefon: 
    {
        type: String,
        required: true      
    },
    
    admin: Number
});

UserSchema.plugin(passportLocalMongoose)
    

module.exports = mongoose.model('User', UserSchema)

