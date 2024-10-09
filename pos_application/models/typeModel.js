const mongoose = require("mongoose");

const typeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const typeModel = mongoose.model("Type", typeSchema);

module.exports = typeModel;
