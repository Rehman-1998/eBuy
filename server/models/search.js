const Mongoose = require("mongoose");
const { Schema } = Mongoose;

// Search Schema
const SearchSchema = new Schema({
  keywords: {
    type: String,
  },
  count: {
    type: Number,
    default: 1,
  },
});

module.exports = Mongoose.model("Search", SearchSchema);
