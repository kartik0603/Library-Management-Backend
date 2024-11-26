const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");


dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());


const transactionRoutes = require("./routes/transaction.route.js"); 
const bookRoutes = require("./routes/bookRoutes.js");
const userRoutes = require("./routes/user.route.js");

// Connect to Database
connectDB()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => {
    console.error("Database connection failed:", err.message);
    process.exit(1); 
  });

// Define Routes
app.use("/api/transactions", transactionRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes); 

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

// 404 Error Handling
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Start Server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

