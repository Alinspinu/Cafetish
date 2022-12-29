const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const order = require('./order')
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
    order:
[
    {
        type: Schema.Types.ObjectId,
        ref: 'Order'
    },
],
    
    admin: Number
});

UserSchema.plugin(passportLocalMongoose)
    

module.exports = mongoose.model('User', UserSchema)

