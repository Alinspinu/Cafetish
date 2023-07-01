const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const notaSchema = new Schema({
  produse: [
    {
      produs:
      {
        type: Schema.Types.ObjectId,
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
    type: Schema.Types.ObjectId,
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



module.exports = notaSchema;
