if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const mongoose = require("mongoose");
const Nota = require('../models/nota')

const dbPosUrl = process.env.POS_DB_URL
const dbUrl = process.env.DB_URL

const notaSchema = new mongoose.Schema({
    produse: [
        {
            produs:
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Produs'
            },
            cantitate: Number
        }
    ],
    user: {
        nume: {
            type: String,
            required: true,
        },
        id: {
            type: String,
            required: true,
        },
    },
    locatie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Locatie",
    },
    index: {
        type: Number,
        index: true,
    },
    data: {
        type: Date,
        default: Date.now(),
    },
    cash: {
        type: Number,
        default: 0,
    },
    card: {
        type: Number,
        default: 0,
    },
    reducere: {
        type: Number,
        default: 0,
    },
    total: {
        type: Number,
        required: true,
    },
});

module.exports.renderPos = async (req, res) => {
    const pos = mongoose.createConnection(dbPosUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    pos.on('connected', () => {
        console.log('Connection established to POS_DB');
    });
    const nota = pos.model('Nota', notaSchema)
    const startDate = new Date()
    startDate.setHours(0, 0, 0, 0)
    const docs = await nota.find({ data: { $gte: startDate } })
    const cash = docs.reduce((total, object) => {
        return total + object.cash
    }, 0)
    const card = docs.reduce((total, object) => {
        return total + object.card
    }, 0)
    res.render('pos', { cash, card })
}