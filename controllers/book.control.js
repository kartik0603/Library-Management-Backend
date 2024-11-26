const Book = require("../models/book.schema.js");
const mongoose = require("mongoose");

// Add Book (Admin-only)
const addBook = async (req, res) => {
    try {
      console.log("Request Body:", req.body);  
  
      const { title, author, genre, availability, price } = req.body;
  
      // Validate required fields
      if (!title || !author || !genre) {
        return res.status(400).json({ message: "Title, Author, and Genre are required." });
      }
  
      
      const book = new Book({
        title,
        author,
        genre,
        availability: availability ?? true,  
        price
      });
  
      // Save the new book to the database
      await book.save();
  
      
      res.status(201).json({ message: "Book added successfully", book });
    } catch (err) {
      console.error("Error adding book:", err);  // Log any errors
      res.status(500).json({ error: "Internal Server Error" });  // Return a generic error
    }
  };
  
// Update Book (Admin-only)
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const book = await Book.findByIdAndUpdate(id, req.body, { new: true });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book updated successfully", book });
  } catch (err) {
    console.error("Error updating book:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete Book (Admin-only)
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error("Error deleting book:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get All Books with Pagination
const getAllBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const books = await Book.find()
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalBooks = await Book.countDocuments();

    res.json({
      page: Number(page),
      totalPages: Math.ceil(totalBooks / limit),
      totalBooks,
      books,
    });
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Search Books
const searchBooks = async (req, res) => {
  try {
    const { title, author, genre , availability} = req.query;
    const query = {};

    if (title) query.title = new RegExp(title, "i");
    if (author) query.author = new RegExp(author, "i");
    if (genre) query.genre = new RegExp(genre, "i");
    if (availability !== undefined) query.availability = availability === "true";

    const books = await Book.find(query);

    if (books.length === 0) {
      return res.status(404).json({ message: "No books found matching the search criteria" });
    }

    res.json(books);
  } catch (err) {
    console.error("Error searching books:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = { addBook, updateBook, deleteBook, getAllBooks, searchBooks };
