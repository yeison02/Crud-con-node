const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  cantDayAnt: {
    type: Number,
    require: true,
  },
  cantDayEnt: {
    type: Number,
    require: true,
  },
  cantDayFinal: {
    type: Number,
    require: true,
  },
  created: {
    type: Date,
    require: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("Users", productsSchema);
