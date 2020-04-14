var express = require("express");
var router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_TOKEN;

/* GET users listing. */
router.get("/", async function (req, res, next) {
  const usuarios = await User.find();
  res.json(usuarios);
});
router.post("/register", async function (req, res) {
  const { name, email, password } = req.body;
  console.log(req.body);
  const user = new User({ name, email, password });
  try {
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ err: "Error registering new user" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: "Incorrect email or password 1" });
    } else {
      user.isCorrectPassword(password, function (error, same) {
        if (!same) {
          res.status(401).json({ error: "Incorrect email or password" });
        } else {
          const token = jwt.sign(email, secret, { expiresIn: "1d" });
          res.json({ user: user, token: token });
        }
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal error,please try again" });
  }
});

module.exports = router;
