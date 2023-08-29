if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const User = require('../models/user')


const fbCredentials = {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.AUTH_CALLBK_URL_BASE}FbLogin`,
    profileFields: ["name", "email", "picture", "displayName"],
}

function connectFb(accessToken, refreshToken, profile, cb) {
    const newUser = User.findOrCreate(
        {
            facebookId: profile.id,
            onlineName: profile.displayName,
            email: profile.emails[0].value,
        },
        function (err, user) {
            if (user.onlinePic) {
                return cb(err, user);
            } else {
                user.onlinePic = profile.photos[0].value;
                user.save();
            }
            return cb(err, user);
        }
    );
}

module.exports = connectFb;
module.exports = fbCredentials;