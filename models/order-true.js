const { number } = require('joi');
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Counter = require('./counter')

const orderTrueSchema = new Schema({
    index: {
        type: Number,
        index: true
    },
    masa: {
        type: Number,
        required: true
    },
    productCount: {
        type: Number,
        required: true
    },
    tips: {
        type: Number,
        default: 0
    },
    total: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "open",
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    products:
        [
            {
                name: {
                    type: String,
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                },
                total: {
                    type: String,
                    required: true
                }
            }
        ]


})


orderTrueSchema.pre("save", function (next) {
    const doc = this;
    Counter.findOneAndUpdate(
        { model: "Order" },
        { $inc: { value: 1 } },
        { upsert: true, new: true },
        function (error, counter) {
            if (error) {
                return next(error);
            }
            doc.index = counter.value;
            next();
        }
    );
});

module.exports = mongoose.model('OrderTrue', orderTrueSchema)