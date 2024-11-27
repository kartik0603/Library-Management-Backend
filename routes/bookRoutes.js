const express = require("express");
const bookRouter = express.Router();

const {
  addBook,
  updateBook,
  deleteBook,
  getAllBooks,
  searchBooks,
} = require("../controllers/book.control.js");

const protect = require("../middlewares/autn.middleware.js");
const roleCheck = require("../middlewares/roleCheck.middleware.js");

bookRouter.use(protect);

bookRouter.post("/add", roleCheck("Admin"), addBook);
bookRouter.patch("/update/:id", roleCheck("Admin"), updateBook);
bookRouter.delete("/delete/:id", roleCheck("Admin"), deleteBook);
bookRouter.get("/all", getAllBooks);
bookRouter.get("/search", searchBooks);

module.exports = bookRouter;