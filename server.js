const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const transactionRoutes = require("./routes/transaction.route.js");
const bookRoutes = require("./routes/bookRoutes.js");
const userRoutes = require("./routes/user.route.js");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());



app.use("/api/transactions", transactionRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Hello From Library API" });
});



app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    try {
      await connectDB();
      console.log("Database connected successfully");
    } catch (err) {
      console.error("Database connection failed:", err.message);
      process.exit(1);
    }
  });
