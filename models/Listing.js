const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  text: {
    type: String,
    required: true
  },
  image: {
    data: Buffer,
    type: String
  },
  data: {
    type: Date,
    default: Date.now
  }
});

module.exports = Listing = mongoose.model("listing", ListingSchema);