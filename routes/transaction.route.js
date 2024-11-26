const express = require("express");
const protect = require("../middlewares/autn.middleware.js");
const roleCheck = require("../middlewares/roleCheck.middleware.js");
const {
  borrowBook,
  returnBook,
  getAllBorrowedBooks,
} = require("../controllers/transaction.control.js");
const transactionRouter = express.Router();

transactionRouter.use(protect);

transactionRouter.post("/borrow", roleCheck("Member"), borrowBook);
transactionRouter.post("/return", roleCheck("Member"), returnBook);
transactionRouter.get("/all", roleCheck("Admin"), getAllBorrowedBooks);


module.exports = transactionRouter;
