const Book = require("../models/book.schema.js");
const Transaction = require("../models/transaction.schema.js");
const mongoose = require("mongoose");

// Member: Borrow a book
const borrowBook = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { bookId } = req.body;

    // Check if the book exists and is available
    const book = await Book.findById(bookId).session(session);
    if (!book) {
      throw new Error("Book not found");
    }

    if (!book.availability) {
      throw new Error("Book not available for borrowing");
    }

    // Ensure that the user hasn't already borrowed this book
    const existingTransaction = await Transaction.findOne({
      userID: req.user.id,
      bookID: bookId,
      status: "Active",
    }).session(session);
    if (existingTransaction) {
      throw new Error("You have already borrowed this book");
    }

    // Update book availability and borrower info
    book.availability = false;
    book.borrowedBy = req.user.id;
    await book.save({ session });

    // Create the transaction record
    const transaction = new Transaction({
      userID: req.user.id,
      bookID: bookId,
      status: "Active",
      borrowDate: new Date(),
    });
    await transaction.save({ session });

    // Commit transaction
    await session.commitTransaction();
    res.json({ message: "Book borrowed successfully", transaction });
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ error: err.message });
  } finally {
    session.endSession();
  }
};

// Member: Return a book
const returnBook = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { transactionId } = req.body;

    // Check if the transaction exists and is still active
    const transaction = await Transaction.findById(transactionId).session(session);
    if (!transaction) {
      throw new Error("Transaction not found");
    }

    if (transaction.status === "Returned") {
      throw new Error("Book already returned");
    }

    // Find the corresponding book
    const book = await Book.findById(transaction.bookID).session(session);
    if (!book) {
      throw new Error("Book not found");
    }

    // Update the book's availability and borrower info
    book.availability = true;
    book.borrowedBy = null;
    await book.save({ session });

    // Update the transaction status
    transaction.status = "Returned";
    transaction.returnDate = new Date();
    await transaction.save({ session });

    // Commit transaction
    await session.commitTransaction();
    res.json({ message: "Book returned successfully", transaction });
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ error: err.message });
  } finally {
    session.endSession();
  }
};

// Admin/Member: Track all borrowed books
const getAllBorrowedBooks = async (req, res) => {
  try {
    const filter = req.user.role === "Admin" ? {} : { userID: req.user.id };

    const transactions = await Transaction.find(filter)
      .populate("bookID", "title author category availability") 
      .populate("userID", "name email role")  
      .sort({ borrowDate: -1 });

    res.json({ transactions });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { borrowBook, returnBook, getAllBorrowedBooks };
