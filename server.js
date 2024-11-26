const express = require("express"); 
require('dotenv').config();
const connectDB = require('./config/db.js');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
    connectDB();
});