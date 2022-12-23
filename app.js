require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

const User = require("./model/user");
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Hello from auth system - Divy</h1>");
});

app.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!(firstName && lastName && email && password)) {
      res.status(400).send("All fields are required");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(401).send("User already exists");
    }

    const myEncPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: myEncPassword,
    });

    //token

    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );

    user.token = token;

    //handle password situation
    user.password = undefined;

    //send token or send success message yes and redirect - choice
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
  }
});

module.exports = app;
