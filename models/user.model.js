const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    userName:{
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    isAdmin:{
        type: Boolean,
        default: false
    }

})

module.exports = mongoose.model("User", userSchema);