const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
// const userRouter = require("./routes/user.route");
const connectDB = require("./db/db");
const authRouter = require('./routes/auth.route')
dotenv.config();
const app = express();



// MIDDLEWARES
app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);

const start = async () => {
  try {
    await connectDB(process.env.DB_URI);
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on 5000 `);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
