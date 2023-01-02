const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const order = require('./order')
const findOrCreate = require('mongoose-findorcreate')

const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email:{
        type: String,
        unique: true
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
    facebookId: String,
    facebookName: String,
    facebookPic: String,
});

UserSchema.plugin(passportLocalMongoose)
UserSchema.plugin(findOrCreate)
    

module.exports = mongoose.model('User', UserSchema)

