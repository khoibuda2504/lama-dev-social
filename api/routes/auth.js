const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
//REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //save user and respond
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json('Username/Email already taken')
    }
    res.status(500).json(err)
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json("user not found")
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) {
      return res.status(400).json("wrong password")
    }
    const accessToken = jwt.sign({ user }, process.env.JWT_ACCESS_TOKEN, {
      expiresIn: '5s'
    })
    const refreshToken = jwt.sign({ user }, process.env.JWT_REFRESH_TOKEN, {
      expiresIn: '10s'
    })
    res.status(200).json({
      ...user._doc,
      accessToken,
      refreshToken
    })
  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;
