const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bookID: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  borrowDate: { type: Date, default: Date.now },
  returnDate: { type: Date },
  status: { type: String, enum: ["Active", "Returned"], default: "Active" },
});

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
