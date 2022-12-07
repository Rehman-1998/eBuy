const Mongoose = require("mongoose");
const { Schema } = Mongoose;

// Bid Schema
const BidSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    default: null,
  },
  merchant: {
    type: Schema.Types.ObjectId,
    ref: "Merchant",
    default: null,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  actualPrice: {
    type: String,
  },
  bidPrice: {
    type: String,
    trim: true,
  },
  bidQuantity: {
    type: String,
  },
  status: {
    type: String,
    default: "Waiting Approval",
    enum: ["Waiting Approval", "Rejected", "Approved"],
  },
});

module.exports = Mongoose.model("Bid", BidSchema);
