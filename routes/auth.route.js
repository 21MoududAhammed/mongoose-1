const express = require("express");
const userModel = require("../models/user.model");
const CryptoJS = require("crypto-js");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const result = await userModel.create({
      userName: req.body.userName,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.CRYPTO_SECRET
      ).toString(),
      email: req.body.email,
      isAdmin: req.body.isAdmin,
    });
    const { password, ...others } = result._doc;
    res.status(201).json({ message: "success", data: others });
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  const user = await userModel.findOne({ userName: req.body.userName });
  // if the user is not found by credentials, return not found message
  if (!user) {
    return res.status(401).json({ message: "User not found." });
  }
  // decrypted password to match the credentials
  const decryptedPassword = CryptoJS.AES.decrypt(
    user.password,
    process.env.CRYPTO_SECRET
  );
  const genuinePassword = decryptedPassword.toString(CryptoJS.enc.Utf8);
  const { password, ...others } = user._doc;
  // compare the password between db and what user gave
  if (req.body.password === genuinePassword) {
    const token = jwt.sign(
      {
        userName: user.userName,
        userId: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    // password matches
    return res
      .status(400)
      .json({ message: "Login Successful", user: others, access_token: token });
  } else {
    // password doesn't match
    return res.status(401).json({ message: "Authentication Failed!" });
  }
});

module.exports = router;
