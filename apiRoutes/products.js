const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Product = require("../databaseModels/produkt");


const router = express.Router();
//fetch all products
router.get("/", async (req, res) => {
  try {
    // Verify the token is valid
    const { user } = jwt.verify(
      process.env.JWT_AUTHORIZE_TOKEN,
      process.env.JWT_SECRET
    );
    if (!user)
      return res.status(401).json({
        message: "this user is not verified",
      });
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve products" });
  }
});


// Get a specific user by ID
router.get("/:id", async (req, res) => {
    try {
      // Verify the token is valid
      const { user } = jwt.verify(
        process.env.JWT_AUTHORIZE_TOKEN,
        process.env.JWT_SECRET
      );
      if (!user)
        return res.status(401).json({
          message: "The username can not create products since he doesnt exist",
        });
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve product" });
    }
  });


// PATCH a specific user by ID
router.patch("/:id", async (req, res) => {
    try {
      // Verify the token is valid
      const { user } = jwt.verify(
        process.env.JWT_AUTHORIZE_TOKEN,
        process.env.JWT_SECRET
      );
      if (!user)
        return res.status(401).json({
          message: "The username can not update products since they don't exist",
        });
  
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      product.price = req.body.price || product.price;
      // Add more fields as necessary
  
      // Save the updated product
      const updatedProduct = await product.save();
  
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: "Failed to update product" });
    }
  });


  // DELETE a specific user by ID
router.delete("/:id", async (req, res) => {
    try {
      // Verify the token is valid
      const { user } = jwt.verify(
        process.env.JWT_AUTHORIZE_TOKEN,
        process.env.JWT_SECRET
      );
      if (!user)
        return res.status(401).json({
          message: "The username can not delete products since they don't exist",
        });
  
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      // Delete the product
      await product.deleteOne();
  
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });


router.post("/createProduct", async (req, res) => {
    try {
      // Verify the token is valid
      const { user } = jwt.verify(
        process.env.JWT_AUTHORIZE_TOKEN,
        process.env.JWT_SECRET
      );
      if (!user)
        return res.status(401).json({
          message: "The username can not create products since he doesnt exist",
        });
      const date = new Date(Date.now());
      const { title, description, price, stock, image, category } = req.body;
  
      const newProduct = new Product({
        title,
        description,
        price,
        stock,
        image,
        category,
        date,
      });
      await newProduct.save();
      res.status(201).json(newProduct);
    } catch (error) {
      return res.status(401).json({ error: "Not Authorized" });
    }
  });
  

module.exports=router;