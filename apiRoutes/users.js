const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../databaseModels/user");

const router = express.Router();
router.post("/register", async (req, res) => {
try {
    const {username,password} = req.body; //destrukturering av objektet
    const user=new User ({ username, password });
    await user.save();
    res.status(201).json(user);
  } catch (error) {res.status(500).json({ message: "Failed to create user" });}
});

router.post("/login", async (req, res) => {
    const { username } = req.body;
    const users = await User.find();
    const userExists = users.find((user) => user.username === username);
    if (!userExists) {
      return res
        .status(401)
        .json({ message: "The username and password your provided are invalid" });
    }
    console.log(`${username} is trying to login ..`);
    const options = {
        expiresIn: "1h",
      };
      process.env.JWT_AUTHORIZE_TOKEN = jwt.sign(
        { user: username },
        process.env.JWT_SECRET,
        options
      );
      console.log(`${username} is logged in ..`);
      return res.json({
        token: jwt.sign({ user: username }, process.env.JWT_SECRET, options),
      });
    });

    router.get("/super-secure-resource", (req, res) => {
        try {
          // Verify the token is valid
          const { user } = jwt.verify(
            process.env.JWT_AUTHORIZE_TOKEN,
            process.env.JWT_SECRET
          );
          return res.status(200).json({
            message: `Congrats ${user}! You can now accesss the super secret resource`,
          });
        } catch (error) {
          return res.status(401).json({ error: "Not Authorized" });
        }
      });
module.exports = router;
