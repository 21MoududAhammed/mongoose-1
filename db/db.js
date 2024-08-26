const mongoose = require('mongoose');

const connectDB =async(uri)=>{
  try{
    mongoose.connect(uri)
    console.log('DB connected successfully.')
  }catch(err){
    console.log(`MongoDB connection failed: ${err?.message}`);
  }
}

module.exports = connectDB;