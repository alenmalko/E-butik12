const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const productRoutes = require("./apiRoutes/products");
const helmet = require("helmet");
const userRoutes = require("./apiRoutes/users");
const app = express();
const port = process.env.PORT ; // Set your desired port number

// Middleware
app.use(express.json());
app.use("/api/users", userRoutes);
app.use(helmet());
app.use("/api/products", productRoutes);

// Connect to MongoDB
const mongoURI = "mongodb://localhost:27017/e-butik"; // Replace with your MongoDB connection URI
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    // Start the server
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));