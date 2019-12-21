const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  tokenReset: String,
  tokenResetExpiration: Date
  // productId: {
  //   type: Schema.Types.ObjectId,
  //   ref: "Product"
  // }
});

module.exports = mongoose.model("User", userSchema);
