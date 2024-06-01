const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cantDayAnt: {
    type: Number,
    required: true,
  },
  cantDayEnt: {
    type: Number,
    required: true,
  },
  cantDayFinal: {
    type: Number,
    required: true,
  },
  img: {
    type: String,
    required: false,
  },
  created: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("inventario", productsSchema);
