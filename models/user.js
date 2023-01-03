const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const order = require('./order')
const findOrCreate = require('mongoose-findorcreate')

const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email:{
        type: String,
        unique: false,
        index: false
    },
    order:
[
    {
        type: Schema.Types.ObjectId,
        ref: 'Order'
    },
],
    giftCard:
[
    {
        type: Schema.Types.ObjectId,
        ref: 'GiftCard'
    }
],
    
    admin: Number,

    facebookId: {
        type: String,
        unique: false,
        index: false
    },
    googleId: {
        type: String,
        unique: false,
        index: false
    }, 
    onlineName:{
        type: String,
        unique: false,
        index: false
    },
    onlinePic:{
        type: String,
        unique: false,
        index: false
    } 
})

UserSchema.plugin(passportLocalMongoose, {usernameUnique: false})
UserSchema.plugin(findOrCreate)
    

module.exports = mongoose.model('User', UserSchema)

