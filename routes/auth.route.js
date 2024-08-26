const express = require("express");
const userModel = require("../models/user.model");
const CryptoJS = require("crypto-js");
const dotenv = require("dotenv");

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
    const { password, ...others } = result;
    res.status(201).json({ message: "success", data: others });
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  const user = await userModel.findOne({ userName: req.body.userName });
  if (!user) {
    return res.status().json({ message: "User not found." });
  }
  const decryptedPassword = CryptoJS.AES.decrypt(
    user.password,
    process.env.CRYPTO_SECRET
  );
  const genuinePassword = decryptedPassword.toString(CryptoJS.enc.Utf8);
  const { password, ...others } = user._doc;
  if (req.body.password === genuinePassword) {
    // password matches
    return res.status(400).json({ message: "Login Successful", user: others });
  } else {
    // password doesn't match
    return res.status(401).json({ message: "Incorrect Password." });
  }
});

module.exports = router;
