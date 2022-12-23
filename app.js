require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require("bcryptjs");

const app = express();

const User = require("./model/user");
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Hello from auth system - Divy</h1>");
});

app.post("/register", async (req, res) => {
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
});

module.exports = app;
