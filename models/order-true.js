const { number } = require('joi');
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Counter = require('./counter')

const orderTrueSchema = new Schema({
    index: {
        type: Number,
        index: true
    },
    masaRest: {
        type: Schema.Types.ObjectId,
        ref: 'Table'
    },
    masa: {
        type: Number,
        required: true
    },
    production: Boolean,
    productCount: {
        type: Number,
        required: true
    },
    totalProducts: {
        type: Number,
        required: true
    },
    tips: {
        type: Number,
        default: 0
    },
    cashBack: {
        type: Number,
        default: 0
    },
    total: {
        type: String,
        required: true
    },
    toGo: {
        type: Boolean,
        default: false
    },
    pickUp: {
        type: Boolean,
        default: false
    },
    payOnline: {
        type: Boolean,
        default: false
    },
    payOnSite: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: "open",
    },
    completetime: {
        type: Number,
        default: 0
    },
    preOrder: {
        type: Boolean,
        default: false
    },
    preOrderPickUpDate: {
        type: String,
    },
    endTime: {
        type: String,
    },
    userName: String, 
    userTel: String,
    payment: {
        cash: Number,
        card: Number,
        viva: Number,
        voucher: Number,
    },
    cif: String,
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
                },
                toppings: [
                    {
                        name: String,
                        price: Number,
                        qty: Number,
                        um: String,
                        ingPrice: Number,
                    }
                ],
                ings: [
                    {
                        name: {
                          type: String,
                        },
                        qty: {
                          type: Number,
                        },
                        price: {
                          type: Number,
                        },
                      },
                ]
               
            }
        ]


}, { timestamps: true, })


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