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
    res.status(201).json({ message: "success", data: result });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
